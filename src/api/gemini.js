import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// 모드별 프롬프트
const MODE_PROMPTS = {
  rendering: (desc) => `You are a world-class fishing lure product photographer and designer.
Create a stunning, photorealistic 3D-rendered product image of a fishing lure.
- Studio lighting with soft shadows
- Slightly angled perspective (3/4 view) to show depth and detail
- Subtle gradient background (light gray to white)
- Ultra-sharp details: hooks, split rings, realistic eyes, paint finish, holographic patterns
- The lure should look like it belongs in a premium product catalog

Lure description: ${desc}

Important: Generate ONLY the lure image. No text, no labels, no watermarks.`,

  blueprint: (desc) => `You are a professional fishing lure engineer creating a technical blueprint/specification sheet.
Create a technical drawing on graph paper (light blue grid lines) showing a fishing lure in exactly 4 orthographic views arranged in a standard engineering layout:
- TOP LEFT: Side view (profile) with length dimension lines
- TOP RIGHT: Rear view (back) with width dimension lines
- BOTTOM LEFT: Front view with height dimension lines
- BOTTOM RIGHT: Top-down/aerial view

Additional requirements:
- Light blue/cyan graph paper grid background
- Clean black line art style for the lure drawings
- Dimension lines with arrows showing measurements in millimeters
- In the bottom-left corner area, include a small specification box with: total length, body width, weight (estimated), hook size, diving depth
- Label each view clearly: "SIDE", "REAR", "FRONT", "TOP"
- Technical drawing style, precise and clean
- Title block in bottom right: "PADO LURE DESIGN"

Lure description: ${desc}

Important: This must look like a real engineering blueprint/technical specification sheet.`,

  product: (desc) => `You are a professional fishing lure product photographer.
Create a clean, commercial product photo of a fishing lure on a pure white background.
- Pure white (#FFFFFF) seamless background
- Professional product photography lighting (key light + fill + rim light)
- Lure positioned horizontally, slightly angled
- Crystal clear sharpness showing every detail
- No shadows except a very subtle contact shadow
- Ready for e-commerce or Instagram product post
- High-end commercial quality

Lure description: ${desc}

Important: Generate ONLY the lure on white background. No text, no props, no other objects.`,

  threeD: (desc) => `You are a 3D fishing lure modeler creating a presentation sheet.
Create a single image showing the SAME fishing lure from exactly 2 different angles side by side:
- LEFT SIDE: 3/4 diagonal view (front-left perspective, slightly above) showing the full 3D form
- RIGHT SIDE: Perfect side profile view (exactly 90 degrees, eye level)

Requirements:
- Both views show the EXACT same lure design, same colors, same details
- Dark gradient background (charcoal to black) for dramatic presentation
- Subtle studio lighting highlighting the lure's contours
- A thin vertical dividing line or subtle gap between the two views
- Ultra-realistic 3D rendering quality
- Show hook details, eye detail, lip/bill, split rings

Lure description: ${desc}

Important: Must show exactly 2 views of the same lure in one image. No text overlays.`,

  free: (desc) => `${desc}

Important: Generate a high-quality image based on the description above.`,
};

// 텍스트로 이미지 생성
export async function generateFromText(prompt, mode = 'rendering') {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const fullPrompt = MODE_PROMPTS[mode](prompt);
  const result = await model.generateContent(fullPrompt);
  return extractImageFromResponse(result.response);
}

// 스케치/사진 기반으로 이미지 생성
export async function generateFromImage(imageBase64, mimeType, prompt, mode = 'rendering') {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const modeInstruction = mode === 'free'
    ? (prompt || 'Transform this image into a polished version.')
    : MODE_PROMPTS[mode](prompt || 'Based on the reference image provided');

  const extraContext = mode !== 'free'
    ? `\n\nUse the attached image as the PRIMARY reference for the lure's shape, color pattern, and design. Follow it closely.`
    : '';

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: mimeType,
    },
  };

  const result = await model.generateContent([modeInstruction + extraContext, imagePart]);
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
