
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Try the other bucket domain format if .appspot.com failed
        const bucketName = "lablink-df67e.firebasestorage.app";
        const fileName = `uploads/${Date.now()}_${file.name}`;
        const encodedName = encodeURIComponent(fileName);
        const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?name=${encodedName}`;

        // Convert File to Buffer/ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Firebase Storage via REST API (Server-to-Server)
        // Cast body to any to avoid TypeScript error with BodyInit
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Content-Type': file.type || 'application/pdf',
            },
            body: buffer as any
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Firebase Storage Upload Error:', response.status, response.statusText, errorData);
            return NextResponse.json({
                error: `Storage upload failed: ${response.statusText}`,
                details: errorData
            }, { status: 500 });
        }

        const data = await response.json();
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedName}?alt=media&token=${data.downloadTokens}`;

        return NextResponse.json({ downloadURL });

    } catch (error: any) {
        console.error('Proxy Upload Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
