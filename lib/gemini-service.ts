import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateImage(prompt: string, apiKey: string, baseImage?: string) {
  const genAI = new GoogleGenerativeAI(apiKey);
  // Model ID as requested
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp-image-generation" });

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

  const result = await model.generateContent(parts);
  const response = await result.response;
  
  // Gemini 2.0 returns images as blobs or specific formats in experimental models
  // This helper assumes standard text/multimodal response structure for the SDK
  return response.text();
}
