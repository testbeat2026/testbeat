import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'Prescription image is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API Key configuration missing' }, { status: 500 });
    }

    // Google Gemini 1.5 Flash Vision API call
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'You are an expert Indian medical diagnostic assistant. Carefully read this handwritten doctor prescription. Extract ONLY the pathology/laboratory blood or urine tests prescribed (e.g. CBC, LFT, KFT, Lipid Profile, Thyroid Profile, HbA1c, Vitamin D, Vitamin B12, Urine R/M). Return the output STRICTLY as a raw JSON array of strings containing standard test names, for example: ["Complete Blood Count (CBC)", "Thyroid Profile Total", "Vitamin D"]. If no diagnostic tests are written, return []. Do not add markdown backticks.'
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: imageBase64.replace(/^data:image\/\w+;base64,/, '')
                  }
                }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    // Cleanup markdown backticks if returned
    const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedTests: string[] = JSON.parse(cleanedJson);

    return NextResponse.json({ success: true, tests: extractedTests });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Doctor ki handwriting clear nahi dikh rahi. Kripya saaf photo upload karein.' },
      { status: 500 }
    );
  }
}
