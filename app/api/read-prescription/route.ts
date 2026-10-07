import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Prescription image is required' }, status: 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API Key is not configured on server' }, status: 500);
    }

    // Clean base64 data string
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    // Robust prompt for handwritten medical prescriptions
    const systemPrompt = `You are an expert clinical laboratory pathologist. Carefully analyze this handwritten doctor prescription slip. 
Identify and extract ALL medical diagnostic tests, blood tests, pathology tests, or lab investigations prescribed (e.g. CBC, Hemogram, Thyroid/TSH, HbA1c, Blood Sugar, LFT, KFT/Creatinine, Lipid Profile, Vitamin D, Vitamin B12, Urine Routine, Calcium, Iron, ESR).
Return the result strictly as a valid JSON array of test names as strings, for example: ["Complete Blood Count (CBC)", "Thyroid Profile Total", "HbA1c"].
If no lab investigations or diagnostic blood tests are found, return []. Do not include markdown code block syntax, backticks, or explanatory text. Return ONLY the raw JSON array.`;

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
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message || 'AI Vision processing error' }, status: 500);
    }

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    let extractedTests: string[] = [];
    try {
      extractedTests = JSON.parse(cleanedJson);
    } catch {
      // Fallback regex match if array formatting has slight irregularities
      const matches = cleanedJson.match(/"([^"]+)"/g);
      if (matches) {
        extractedTests = matches.map((m: string) => m.replace(/"/g, ''));
      }
    }

    return NextResponse.json({ success: true, tests: extractedTests });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Handwriting could not be read clearly. Please upload a clear photo or select tests manually.' },
      { status: 500 }
    );
  }
}
