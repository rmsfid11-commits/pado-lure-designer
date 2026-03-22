import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// 텍스트로 루어 디자인 이미지 생성
export async function generateLureFromText(prompt) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-preview-image-generation',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const fullPrompt = `You are a professional fishing lure designer. Create a high-quality, photorealistic product image of a fishing lure based on this description.
The lure should look like a real commercial product photo with clean white background, professional lighting, and sharp details.

Description: ${prompt}

Important: Generate only the lure image, no text overlays.`;

  const result = await model.generateContent(fullPrompt);
  return extractImageFromResponse(result.response);
}

// 스케치/사진 기반으로 루어 디자인 생성
export async function generateLureFromImage(imageBase64, mimeType, prompt) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-preview-image-generation',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const fullPrompt = `You are a professional fishing lure designer. Based on this sketch/reference image, create a high-quality, photorealistic product rendering of a fishing lure.
Transform this rough sketch or photo into a polished, professional product image with clean white background, professional lighting, and sharp details.

${prompt ? `Additional instructions: ${prompt}` : ''}

Important: Generate only the lure image, no text overlays. Make it look like a real commercial product photo.`;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType,
    },
  };

  const result = await model.generateContent([fullPrompt, imagePart]);
  return extractImageFromResponse(result.response);
}

// 응답에서 이미지 추출
function extractImageFromResponse(response) {
  const parts = response.candidates?.[0]?.content?.parts || [];
  const result = { text: '', imageData: null };

  for (const part of parts) {
    if (part.text) {
      result.text = part.text;
    }
    if (part.inlineData) {
      result.imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  return result;
}
