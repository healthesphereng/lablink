import { NextRequest, NextResponse } from 'next/server';
import { analyzeLabResultFlow } from '@/ai/flows/analyze-lab-result';
import { z } from 'genkit';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fileUrl } = body;

        if (!fileUrl) {
            return NextResponse.json({ error: 'File URL is required' }, { status: 400 });
        }

        console.log('Invoking Genkit flow for:', fileUrl.substring(0, 50) + '...');

        // Invoke the Genkit flow directly
        const result = await analyzeLabResultFlow({ image: fileUrl });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('Analysis Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze lab result' },
            { status: 500 }
        );
    }
}
