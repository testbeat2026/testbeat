import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageBase64 = body?.imageBase64;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Prescription image is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API Key is not configured on server' }, { status: 500 });
    }

    const cleanBase64 = typeof imageBase64 === 'string' 
      ? imageBase64.replace(/^data:image\/\w+;base64,/, '') 
      : '';

    const systemPrompt = 'You are an expert clinical laboratory pathologist. Carefully read this handwritten doctor prescription. Extract ONLY medical diagnostic tests prescribed (e.g. CBC, Thyroid/TSH, HbA1c, Blood Sugar, LFT, KFT, Lipid Profile, Vitamin D, Vitamin B12, Urine Routine, Calcium, Iron, ESR). Return strictly a raw JSON array of strings, for example: ["Complete Blood Count (CBC)", "Thyroid Profile Total", "HbA1c"]. If no diagnostic tests are written, return []. Do not add markdown backticks.';

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
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
      return NextResponse.json({ error: data.error.message || 'AI Vision processing error' }, status: 500);
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

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
