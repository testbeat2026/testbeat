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
        { error: 'API Key is missing. Please set GEMINI_API_KEY in your Vercel Environment Variables.' },
        { status: 500 }
      );
    }

    let mimeType = 'image/jpeg';
    if (imageBase64.startsWith('data:image/png')) {
      mimeType = 'image/png';
    } else if (imageBase64.startsWith('data:image/webp')) {
      mimeType = 'image/webp';
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '').trim();

    const promptText = `You are an expert clinical laboratory pathologist. Carefully examine this handwritten doctor prescription.
Extract ALL prescribed diagnostic tests, blood tests, and lab investigations (e.g., CBC, Thyroid/TSH, HbA1c, Fasting Blood Sugar, LFT, KFT, Creatinine, Lipid Profile, Vitamin D, Vitamin B12, Urine Routine, Calcium, Iron, ESR).
Return the result strictly as a raw JSON array of strings containing standard test names, for example: ["Complete Blood Count (CBC) Test", "Thyroid Profile Total (T3, T4, TSH)", "HBA1C Test"].
If no diagnostic tests are written, return []. Do not include markdown formatting or backticks. Return ONLY the raw JSON array.`;

    const endpointsToTry = [
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent'
    ];

    let lastErrorMessage = 'Failed to analyze prescription image.';

    for (const url of endpointsToTry) {
      try {
        const res = await fetch(`${url}?key=${apiKey}`, {
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
        });

        const data = await res.json();

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const rawText: string = data.candidates[0].content.parts[0].text;
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
        } else if (data?.error?.message) {
          lastErrorMessage = data.error.message;
        }
      } catch (err: unknown) {
        lastErrorMessage = err instanceof Error ? err.message : 'API call failed';
      }
    }

    return NextResponse.json({ error: lastErrorMessage }, status: 500);
  } catch {
    return NextResponse.json(
      { error: 'Handwriting could not be read clearly. Please upload a clear photo or select tests manually.' },
      { status: 500 }
    );
  }
}
