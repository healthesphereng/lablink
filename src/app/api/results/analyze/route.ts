import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        console.log('--- Analyze Request Started (pdf2json) ---');

        // ---------------------------------------------------------
        // 1. Get File URL
        // ---------------------------------------------------------
        let fileUrl;
        try {
            const body = await req.json();
            fileUrl = body.fileUrl;
        } catch (e) {
            return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
        }

        if (!fileUrl) {
            console.error('No fileUrl provided');
            return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
        }

        // ---------------------------------------------------------
        // 2. Fetch File
        // ---------------------------------------------------------
        console.log('Fetching PDF from URL:', fileUrl);
        const response = await fetch(fileUrl);
        if (!response.ok) {
            console.error('Fetch failed:', response.status, response.statusText);
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        console.log('PDF received. Buffer size:', buffer.length);

        // ---------------------------------------------------------
        // 3. Parse PDF (pdf2json)
        // ---------------------------------------------------------
        let pdfText = '';
        try {
            console.log('Parsing PDF with pdf2json...');

            // Dynamic import
            const PDFParserModule = await import('pdf2json');
            const PDFParser = PDFParserModule.default || PDFParserModule;

            const parser = new PDFParser(null, 1); // 1 = text content only

            pdfText = await new Promise((resolve, reject) => {
                parser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));

                parser.on("pdfParser_dataReady", (pdfData: any) => {
                    // Extract text from pdf2json format
                    // formImage.Pages[].Texts[].R[].T
                    try {
                        const pages = pdfData.formImage?.Pages || [];
                        const text = pages.map((page: any) =>
                            page.Texts.map((t: any) =>
                                t.R.map((r: any) => decodeURIComponent(r.T)).join(' ')
                            ).join(' ')
                        ).join('\n');
                        resolve(text);
                    } catch (e) {
                        // Fallback
                        resolve(JSON.stringify(pdfData).substring(0, 1000));
                    }
                });

                parser.parseBuffer(buffer);
            });

            console.log('PDF Parsed. Text length:', pdfText.length);
        } catch (e: any) {
            console.error('PDF Parse Error:', e);
            return NextResponse.json({ error: `PDF Parse Failed: ${e.message}` }, { status: 500 });
        }

        // ---------------------------------------------------------
        // 4. Send to Gemini
        // ---------------------------------------------------------
        const truncatedText = pdfText.substring(0, 30000);
        console.log('Sending to Gemini...');

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error('GOOGLE_API_KEY missing');
            return NextResponse.json({ error: 'Server Config Error: Missing API Key' }, { status: 500 });
        }

        const prompt = `You are an expert medical assistant analyzing a lab report for a patient.
Your goal is to explain the results clearly, accurately, and reassuringly.

Please analyze the following text from a lab report and provide a structured summary in Markdown.

**Structure your response exactly like this:**

## 📋 One-Line Summary
[A single, clear sentence summarizing the overall health picture based on these results.]

## 🔍 Key Findings
| Test Name | Result | Status | Interpretation |
| :--- | :--- | :--- | :--- |
| [Name] | [Value] | [Normal/High/Low] | [Simple 1-sentence explanation] |
*(List only the most important or abnormal results. If everything is normal, list the main panels checked)*

## 💡 Recommendations
*   [Actionable tip 1 mainly based on results]
*   [Actionable tip 2]
*(Include a disclaimer: "These are general suggestions. Please consult your doctor for medical advice.")*

**Rules:**
1.  Use simple, non-medical language where possible.
2.  In the table, if a result is Normal, say "Normal". If High/Low, say "High" or "Low".
3.  Be empathetic and professional.

**Lab Report Text:**
${truncatedText}`;

        const aiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        console.log('Gemini Status:', aiResponse.status);

        if (!aiResponse.ok) {
            const errText = await aiResponse.text();
            console.error('Gemini API Error Body:', errText);
            return NextResponse.json({ error: `Gemini API Error: ${aiResponse.status} - ${errText}` }, { status: 500 });
        }

        const result = await aiResponse.json();

        if (!result.candidates || !result.candidates[0]) {
            console.error('Invalid Gemini Response:', JSON.stringify(result));
            return NextResponse.json({ error: 'Gemini returned no candidates' }, { status: 500 });
        }

        const summary = result.candidates[0].content?.parts?.[0]?.text || "No analysis text found.";
        console.log('Analysis success. Summary length:', summary.length);

        return NextResponse.json({ summary });

    } catch (error: any) {
        console.error('Unhandled Analysis Error:', error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
