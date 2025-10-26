import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import { mapProductType } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userPhoto = formData.get('userPhoto') as File;
    const productImageUrl = formData.get('productImageUrl') as string;
    const productType = formData.get('productType') as string;
    const productTitle = formData.get('productTitle') as string;

    // Validate inputs
    if (!userPhoto || !productImageUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate file size
    if (userPhoto.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(userPhoto.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Process user photo - resize to 1024x1024 max
    const userPhotoBuffer = await userPhoto.arrayBuffer();
    const processedPhotoBuffer = await sharp(Buffer.from(userPhotoBuffer))
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Download and process product image
    const productImageResponse = await fetch(productImageUrl);
    if (!productImageResponse.ok) {
      throw new Error('Failed to download product image');
    }

    const productImageBuffer = await productImageResponse.arrayBuffer();
    const processedProductBuffer = await sharp(Buffer.from(productImageBuffer))
      .resize(1024, 1024, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Initialize Gemini AI
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Create the prompt for virtual try-on
    const focusArea = mapProductType(productType);
    const prompt = `VIRTUAL TRY-ON REQUEST: Generate a photorealistic image where the person in IMAGE 1 is wearing or holding the product from IMAGE 2.

CORE TASK:
- Overlay/replace the ${focusArea} area with the product from IMAGE 2.
- Preserve the person's identity, face, hairstyle, body proportions, and original background from IMAGE 1.
- Ensure the product maintains its true design, structure, and intended appearance.

QUALITY & REALISM REQUIREMENTS:
- Ultra-photorealistic rendering with seamless blending
- Preserve natural shadows, highlights, and lighting direction from IMAGE 1
- Maintain fabric texture, stitching, logos, patterns, and material shine from IMAGE 2
- Match photo resolution and composition with no visible editing artifacts
- Ensure realistic perspective, scale, and alignment of product with body posture

SIZING & FIT LOGIC:
- Adapt product size proportionally to match the person's body dimensions
- Retain correct garment proportions (length, sleeve size, neckline, hemline, waistband)
- Ensure realistic fabric draping that respects body curves and pose

TECHNICAL INSTRUCTIONS:
- Focus Area: ${focusArea}
- Product: "${productTitle || 'clothing item'}" (${productType})
- Retain original fabric folds, seams, and structural details
- Preserve both the person's natural features and the product's intended design

OUTPUT SPECIFICATIONS:
- Deliver one high-resolution try-on result
- The person from IMAGE 1 must remain fully recognizable
- The product from IMAGE 2 must be faithfully represented in size, shape, and detail
- Result should look indistinguishable from a real photograph`;

    // Generate the try-on image
    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: processedPhotoBuffer.toString('base64'),
        },
      },
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: processedProductBuffer.toString('base64'),
        },
      },
    ]);

    const response = await result.response;

    // Extract image from response
    let generatedImageBase64 = '';

    if (response.candidates && response.candidates[0]) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            generatedImageBase64 = part.inlineData.data;
            break;
          }
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error('No image generated by AI');
    }

    const endTime = Date.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(1);

    // Return as base64 data URL for simplicity
    const resultImageUrl = `data:image/jpeg;base64,${generatedImageBase64}`;

    return NextResponse.json({
      success: true,
      resultImageUrl,
      processingTime: `${processingTime}s`,
      message: 'Virtual try-on completed successfully!',
    });

  } catch (error: any) {
    console.error('Virtual try-on error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred during processing',
      },
      { status: 500 }
    );
  }
}
