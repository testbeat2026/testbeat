import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const imageBase64: string = body?.imageBase64 || '';

    if (!imageBase64) {
      return NextResponse.json({ error: 'Prescription image is required' }, status: 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key missing in Vercel Environment Variables. Please set GEMINI_API_KEY in Vercel settings.' },
        { status: 500 }
      );
    }

    // Dynamic MIME-type detection (PNG, JPEG, WEBP)
    let mimeType = 'image/jpeg';
    if (imageBase64.startsWith('data:image/png')) {
      mimeType = 'image/png';
    } else if (imageBase64.startsWith('data:image/webp')) {
      mimeType = 'image/webp';
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '').trim();

    const promptText = `You are an expert Indian clinical pathologist. Carefully examine this handwritten doctor prescription slip.
Extract ALL prescribed diagnostic pathology tests, blood tests, and lab investigations (e.g., CBC, Thyroid/TSH, HbA1c, Fasting Blood Sugar, LFT, KFT, Creatinine, Lipid Profile, Vitamin D, Vitamin B12, Urine Routine, Calcium, Iron, ESR).
Return the result strictly as a valid JSON array of test names as strings, for example: ["Complete Blood Count (CBC) Test", "Thyroid Profile Total (T3, T4, TSH)", "HBA1C Test"].
If no diagnostic tests are written, return []. Do not include markdown formatting or backticks. Return ONLY the raw JSON array.`;

    // Google Gemini REST API with exact protobuf schema
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: cleanBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1000
          }
        })
      }
    );

    const data = await res.json();

    if (data?.error) {
      return NextResponse.json(
        { error: data.error.message || 'AI Vision API error. Please check API Key in Vercel.' },
        { status: 500 }
      );
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    let extractedTests: string[] = [];
    try {
      extractedTests = JSON.parse(cleanedJson);
    } catch {
      const matches = cleanedJson.match(/"([^"]+)"/g);
      if (matches) {
        extractedTests = matches.map((m: string) => m.replace(/"/g, ''));
      }
    }

    return NextResponse.json({ success: true, tests: extractedTests });
  } catch {
    return NextResponse.json(
      { error: 'Handwriting could not be read clearly. Please upload a clear photo or select tests manually.' },
      { status: 500 }
    );
  }
}
