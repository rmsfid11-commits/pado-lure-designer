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

CRITICAL DESIGN REQUIREMENTS (YOU MUST FOLLOW EVERY DETAIL BELOW):
${desc}

Important: Generate ONLY the lure image. No text, no labels, no watermarks. You MUST incorporate ALL design details mentioned above.`,

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

CRITICAL DESIGN REQUIREMENTS (YOU MUST FOLLOW EVERY DETAIL BELOW):
${desc}

Important: This must look like a real engineering blueprint. You MUST incorporate ALL design details mentioned above.`,

  product: (desc) => `You are a professional fishing lure product photographer.
Create a clean, commercial product photo of a fishing lure on a pure white background.
- Pure white (#FFFFFF) seamless background
- Professional product photography lighting (key light + fill + rim light)
- Lure positioned horizontally, slightly angled
- Crystal clear sharpness showing every detail
- No shadows except a very subtle contact shadow
- Ready for e-commerce or Instagram product post
- High-end commercial quality

CRITICAL DESIGN REQUIREMENTS (YOU MUST FOLLOW EVERY DETAIL BELOW):
${desc}

Important: Generate ONLY the lure on white background. No text, no props. You MUST incorporate ALL design details mentioned above.`,

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

CRITICAL DESIGN REQUIREMENTS (YOU MUST FOLLOW EVERY DETAIL BELOW):
${desc}

Important: Must show exactly 2 views of the same lure. You MUST incorporate ALL design details mentioned above.`,

  underwater: (desc) => `You are an underwater fishing photography specialist.
Create a stunning underwater action shot of a fishing lure swimming through crystal clear water.
- The lure is mid-retrieve, showing realistic swimming action and movement
- Crystal clear blue/turquoise water with visible light rays penetrating from the surface above
- Tiny air bubbles trailing behind the lure
- The lure's lip is digging into the water creating a realistic diving action
- Motion blur on the water, but the lure is sharp
- You can see the fishing line extending upward toward the surface
- Dramatic underwater lighting
- Photorealistic quality, like a GoPro underwater shot

CRITICAL DESIGN REQUIREMENTS (YOU MUST FOLLOW EVERY DETAIL BELOW):
${desc}

Important: Generate an exciting underwater action scene. You MUST incorporate ALL lure design details mentioned above into the lure shown.`,

  package: (desc) => `You are a fishing lure packaging designer.
Create a photorealistic image of a fishing lure in retail blister packaging.
- Clear plastic blister pack showing the lure inside
- Printed cardboard backing with:
  - Brand name "PADO" at the top in bold
  - Lure specifications (size, weight, diving depth)
  - A small underwater action photo in the corner
  - Barcode at the bottom
- Professional retail packaging design
- The lure is clearly visible through the clear plastic
- Hanging hole at the top of the card
- Premium quality packaging design

CRITICAL DESIGN REQUIREMENTS (YOU MUST FOLLOW EVERY DETAIL BELOW):
${desc}

Important: Must look like a real commercial package. You MUST incorporate ALL lure design details mentioned above.`,

  colorVariants: (desc) => `You are a fishing lure color designer creating a color variation chart.
Create a single image showing the SAME fishing lure in exactly 4 different color variations arranged in a 2x2 grid.
- TOP LEFT: Original/natural colors
- TOP RIGHT: Bright/flashy variation (chartreuse, hot pink, etc.)
- BOTTOM LEFT: Dark/subtle variation (black, dark green, etc.)
- BOTTOM RIGHT: Metallic/holographic variation (chrome, gold, etc.)

Requirements:
- All 4 lures have the EXACT same shape and design, only colors differ
- Clean white background for each cell
- Subtle grid lines or gaps separating the 4 variants
- Small color name label under each lure
- Professional product catalog layout

CRITICAL DESIGN REQUIREMENTS (YOU MUST FOLLOW EVERY DETAIL BELOW):
${desc}

Important: Show exactly 4 color variations. You MUST incorporate ALL lure design details mentioned above.`,

  logo: (desc) => `You are a macro product photographer specializing in fishing lure branding.
Create an extreme close-up macro photo of a fishing lure body showing engraved/printed brand details.
- Ultra close-up shot of the lure body surface
- "PADO" brand name laser-engraved or printed on the lure body
- Show the texture of the paint finish in extreme detail
- Visible holographic patterns, scales texture, or paint layers
- Shallow depth of field (bokeh background)
- Professional macro photography lighting
- You can see individual paint layers, clear coat reflection
- Premium quality feel

CRITICAL DESIGN REQUIREMENTS (YOU MUST FOLLOW EVERY DETAIL BELOW):
${desc}

Important: Focus on brand engraving and surface detail. You MUST incorporate ALL lure design details mentioned above.`,

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

// GIF용 프레임 여러 장 생성
export async function generateGifFrames(prompt, frameCount = 5) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  const frames = [];
  for (let i = 0; i < frameCount; i++) {
    const phase = i / (frameCount - 1); // 0 ~ 1
    const angle = Math.round(phase * 360);
    const framePrompt = `You are creating frame ${i + 1} of ${frameCount} for an underwater animation sequence of a fishing lure.

The fishing lure is swimming underwater, moving from left to right in a wobbling motion.
- Crystal clear blue/turquoise water with light rays from above
- Tiny bubbles trailing behind the lure
- The lure's body is rotated approximately ${angle} degrees in its wobble cycle
- Frame ${i + 1}/${frameCount}: The lure is at position ${Math.round(phase * 100)}% of its swimming path
- ${i % 2 === 0 ? 'The lure tilts slightly upward' : 'The lure tilts slightly downward'} in this frame
- Consistent underwater environment across all frames
- Photorealistic quality

Lure description: ${prompt}

CRITICAL: This is frame ${i + 1} of a ${frameCount}-frame animation. Keep the lure design, water color, and lighting EXACTLY consistent. Only the lure's position and wobble angle should change slightly.`;

    const result = await model.generateContent(framePrompt);
    const extracted = extractImageFromResponse(result.response);
    if (extracted.imageData) {
      frames.push(extracted.imageData);
    }
  }

  return frames;
}

// base64 이미지들을 GIF로 합치기
export function createGifFromFrames(frames, delay = 200) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // GIF 인코딩을 위해 프레임들을 순서대로 처리
    const images = [];
    let loaded = 0;

    frames.forEach((src, idx) => {
      const img = new Image();
      img.onload = () => {
        images[idx] = img;
        loaded++;
        if (loaded === frames.length) {
          // 첫 번째 프레임 크기 기준
          canvas.width = images[0].width;
          canvas.height = images[0].height;

          // GIF 대신 앞뒤로 반복하는 애니메이션 이미지 시퀀스 반환
          resolve({
            frames: frames,
            width: canvas.width,
            height: canvas.height,
          });
        }
      };
      img.src = src;
    });
  });
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
