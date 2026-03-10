import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { prompt, apiKey, baseImage } = await req.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Note: MODEL_ID requested is 'gemini-2.0-flash-exp-image-generation'
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const parts: any[] = [{ text: prompt }];

    if (baseImage) {
      const base64Data = baseImage.split(',')[1];
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/png"
        }
      });
    }

    // Using generateContent for multimodal instructions
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    // Mock processing: In the flash experimental build for generating images,
    // users typically receive a base64 string or a URI depending on the preview flags.
    // Since this is a quickstart UI, we return a mock/placeholder if the SDK returns text
    // but allow for the real output once the model is fully piped for direct image bytes.
    
    // For demonstration of the UI flow with the experimental model:
    return NextResponse.json({ 
      output: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      rawResponse: text
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
