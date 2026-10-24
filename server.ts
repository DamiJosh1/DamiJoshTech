import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = isProd ? process.env.PORT || 3000 : 3001;

// Only initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Middleware
app.use(cors());

// Use raw body for webhook signature verification if needed, or express.json
app.use(express.json({
  verify: (req, res, buf) => {
    (req as any).rawBody = buf;
  }
}));

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Helper to send email receipt
async function sendReceipt(email: string, name: string, amount: number, items: string, reference: string, gateway: string) {
  if (!resend) {
    console.log('Skipping email. RESEND_API_KEY is not set.');
    console.log(`[Email Mock] Sent to ${email} for order ${reference} via ${gateway}`);
    return;
  }

  try {
    await resend.emails.send({
      from: 'VoraTech <orders@resend.dev>', // Update this with your verified domain later
      to: email,
      subject: `Order Confirmation - VoraTech (#${reference})`,
      html: `
        <div style="font-family: sans-serif; max-w-xl mx-auto p-6 bg-zinc-50 text-zinc-900">
          <h1 style="color: #18181b; margin-bottom: 24px;">Thank you for your order, ${name}!</h1>
          <p>We've received your payment of <strong>$${amount}</strong> via ${gateway}.</p>
          <div style="background-color: white; padding: 16px; border: 1px solid #e4e4e7; border-radius: 8px; margin: 24px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Reference:</strong> ${reference}</p>
            <p><strong>Items:</strong></p>
            <p style="background: #f4f4f5; padding: 12px; border-radius: 4px;">${items}</p>
          </div>
          <p>We are currently processing your order and will send another update when it ships.</p>
          <p>Best regards,<br>The VoraTech Team</p>
        </div>
      `,
    });
    console.log(`Receipt sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Domestic fulfillment logging
function logDomesticFulfillment(reference: string, customer: any, metadata: any) {
  console.log(`[SAJODA Domestic Fulfillment] Order ${reference} recorded for domestic dispatch from Alaba/Computer Village Hub.`);
}

// Paystack Webhook
app.post('/api/webhooks/paystack', async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(400).send('Paystack secret not configured');

  const hash = crypto.createHmac('sha512', secret).update((req as any).rawBody).digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).send('Invalid signature');
  }

  const event = req.body;
  if (event.event === 'charge.success') {
    const { reference, amount, customer, metadata } = event.data;
    
    // Convert Kobo to USD/local currency formatting if needed
    const actualAmount = amount / 100;
    
    let itemsStr = 'Items from cart';
    if (metadata && metadata.custom_fields) {
      const cartField = metadata.custom_fields.find((f: any) => f.variable_name === 'cart_items');
      if (cartField) itemsStr = cartField.value;
    }

    console.log(`Paystack payment verified for ${customer.email} (${actualAmount})`);
    
    // 1. Send Email Receipt
    await sendReceipt(
      customer.email, 
      customer.first_name || 'Customer', 
      actualAmount, 
      itemsStr, 
      reference,
      'Paystack'
    );

    // 2. Dispatch to SAJODA Domestic Hub Fulfillment
    logDomesticFulfillment(reference, customer, metadata);
  }

  res.sendStatus(200);
});

// Flutterwave Webhook
app.post('/api/webhooks/flutterwave', async (req, res) => {
  const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
  const signature = req.headers['verif-hash'];

  if (!signature || signature !== secretHash) {
    // Note: in production, check if you have set a secret hash in flutterwave dashboard
    console.warn('Flutterwave signature mismatch or not configured.');
    // return res.status(401).send('Invalid signature'); 
  }

  const payload = req.body;
  // Flutterwave sends different event types based on the webhook configuration
  if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
    const { tx_ref, amount, customer, meta } = payload.data;
    
    let itemsStr = meta?.items || 'Items from cart';

    console.log(`Flutterwave payment verified for ${customer.email} (${amount})`);
    await sendReceipt(
      customer.email, 
      customer.name || 'Customer', 
      amount, 
      itemsStr, 
      tx_ref,
      'Flutterwave'
    );
  }

  res.sendStatus(200);
});

import { GoogleGenAI } from '@google/genai';

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Admin AI Assistant Webhook
app.post('/api/chat', async (req, res) => {
  try {
    const { message, isAdmin, userName } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const systemInstruction = isAdmin 
      ? `You are an elite AI Chief Merchandiser and Business Strategist for SAJODA ELECTRONICS in Nigeria, serving store owner and admin DamiJosh (${userName || 'DamiJosh'}).
You specialize in Home Appliances, Latest Gadgets, and Electronics.
You know domestic Nigerian wholesale sourcing hubs:
1. Alaba International Market Electronics Distribution Hub (Lagos) - Appliances & TVs.
2. Computer Village Ikeja Tech Hub (Lagos) - Gadgets, Phones, Accessories.
3. Certified OEM Refurbisher Hub (Nigeria) - Pre-Owned 100% Tested Working Fine units.
All prices must be in reasonable Nigerian Naira (₦). Every item must include DamiJosh's owner commission markup of MINIMUM ₦10,000 UPWARD (e.g., +₦10k to +₦75k depending on value).
Brand New goods come in sealed retail cartons and packs.
Pre-Owned goods are separate cards with 100% verified working fine status.
You can help DamiJosh scout viral products from TikTok (#TikTokMadeMeBuyIt) and Instagram reels, suggest high-converting copy, calculate profit markups, and craft multi-angle photo product listings. Be sharp, encouraging, respectful, and direct.`
      : `You are a helpful and knowledgeable shopping assistant for SAJODA ELECTRONICS in Nigeria. Help the customer find top home appliances, latest gadgets, and electronics with authentic Nigerian market prices (₦), 1-year warranties on brand new items in sealed cartons, and 90-day guarantees on certified pre-owned items. Be friendly, concise, and helpful. Never reveal wholesale base costs or internal sourcing markups.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
        return res.json({ text: "I'm currently receiving too many requests. Please try again in a few minutes, or contact support if this continues." });
    }
    res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// AI Analyze Single or Batch Image for Product Generation
app.post('/api/ai/analyze-drive-image', async (req, res) => {
  try {
    const { imageBase64, mimeType, instructions, currency, existingCategories } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'Image base64 data is required' });
    }

    const categoriesPrompt = existingCategories && existingCategories.length > 0 
      ? `Available categories include: ${existingCategories.join(', ')}. Pick the best match or suggest a clear new one if none fits.` 
      : 'Select a clean, standard e-commerce category (e.g., Electronics, Smart Home, Audio, Mobile Accessories, Kitchen, Wearables, etc.).';

    const promptText = `You are an expert e-commerce catalog specialist and merchandiser.
Analyze the provided product image and generate a complete, high-converting product listing.

User Context / Custom Instructions:
"${instructions || 'Generate an appealing product name, engaging description, competitive price, and fitting category.'}"

Store currency preference: ${currency || 'NGN'}

Category guideline:
${categoriesPrompt}

Return ONLY valid JSON matching this exact structure:
{
  "name": "Concise, appealing product title (under 70 chars)",
  "price": 25000,
  "originalPrice": 32000,
  "category": "Matching category name",
  "shortDescription": "One or two sentences summarizing the key selling point",
  "description": "Full engaging product description detailing what the product does, benefits, and build quality.",
  "features": [
    "Key feature 1",
    "Key feature 2",
    "Key feature 3",
    "Key feature 4"
  ],
  "specifications": [
    { "name": "Material/Type", "value": "Extracted or inferred value" },
    { "name": "Compatibility/Usage", "value": "Extracted or inferred value" }
  ],
  "brand": "Inferred brand or 'Sajoda'",
  "tags": ["tag1", "tag2", "tag3"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json({ success: true, product: parsedData });
  } catch (error: any) {
    console.error('Gemini Image Analysis Error:', error);
    res.status(500).json({ 
      error: error?.message || 'Failed to analyze product image with AI',
      details: error?.toString()
    });
  }
});

// Multi-Angle Image Collections (Front, Side, Back/Detail, and Retail Carton/Tested Condition)
const MULTI_ANGLE_PRODUCT_IMAGES: Record<string, { new: string[][]; used: string[][] }> = {
  'Home Appliances': {
    new: [
      [
        'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800', // Front view
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', // Side angle
        'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800', // Detail/basket
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Sealed retail carton & box
      ],
      [
        'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800', // Front
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800', // Side profile
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800', // Charging dock & sensors
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Sealed carton packaging
      ],
      [
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
      ]
    ],
    used: [
      [
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800', // Front hardware
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800', // Side profile
        'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800', // Tested component
        'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800'  // Tested & verified working
      ],
      [
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800'
      ]
    ]
  },
  'Latest Gadgets': {
    new: [
      [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', // Front watch/gadget
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800', // Side angle & crown
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800', // Back sensors / strap
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Sealed retail carton & box
      ],
      [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800', // Earbuds front
        'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800', // Case open / side profile
        'https://images.unsplash.com/photo-1609592424368-e4b2d1d0537d?auto=format&fit=crop&q=80&w=800', // Charging ports / acoustic vents
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Factory retail pack
      ],
      [
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
      ]
    ],
    used: [
      [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800', // Tested unit front
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', // Side bezel inspection
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800', // Battery & screen diagnostic pass
        'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800'  // Clean accessories
      ],
      [
        'https://images.unsplash.com/photo-1609592424368-e4b2d1d0537d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
      ]
    ]
  },
  'Electronics': {
    new: [
      [
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800', // Front display/projector
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', // Side profile / slim edge
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800', // Back ports / HDMI / audio
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Sealed factory carton
      ],
      [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', // Studio headphones front
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800', // Side earcups
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800', // Headband & hinges
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Retail box & accessories pack
      ]
    ],
    used: [
      [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
      ],
      [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'
      ]
    ]
  }
};

function getMultiAngleImages(category: string, condition: 'new' | 'used', seedIndex: number = 0): string[] {
  const cat = (MULTI_ANGLE_PRODUCT_IMAGES[category] ? category : 'Latest Gadgets') as keyof typeof MULTI_ANGLE_PRODUCT_IMAGES;
  const cond = condition === 'used' ? 'used' : 'new';
  const sets = MULTI_ANGLE_PRODUCT_IMAGES[cat][cond];
  const chosenSet = sets[seedIndex % sets.length];
  return chosenSet || sets[0];
}

// AI Generate Batch Catalog of Home Appliances, Latest Gadgets, and Electronics
// Brand New products come in sealed packs and cartons with multi-angle photos.
// Pre-Owned products are strictly SEPARATE cards verified 100% working fine!
app.post('/api/ai/generate-catalog-products', async (req, res) => {
  try {
    const { category = 'All', count = 5, customPrompt = '', condition = 'both' } = req.body;
    const targetCount = Math.min(Math.max(Number(count) || 5, 1), 12);

    const conditionGuideline = condition === 'used' 
      ? 'All products must be separate cards for Certified Pre-Owned goods that are 100% tested and working fine.'
      : condition === 'new'
      ? 'All products must be separate cards for Brand New items sealed in retail packs and carton boxes.'
      : 'Generate an exciting mix of separate cards: some Brand New in sealed cartons/packs, and some Certified Pre-Owned that are 100% tested and working fine. DO NOT mix new and used on the same card!';

    const promptText = `You are a chief e-commerce merchandiser for 'SAJODA ELECTRONICS' in Nigeria, reporting to store owner DamiJosh.
Generate ${targetCount} unique, cutting-edge products for our catalog.

CRITICAL RULES:
1. SEPARATE CARDS ONLY:
   - Brand New items: Come in factory sealed retail pack & carton box. Condition: "new". Grade: "Brand New - Sealed Carton Box". Warranty: "1-Year Official Manufacturer Warranty".
   - Pre-Owned items: Standalone cards for certified used devices that are tested 100% working fine. Condition: "used". Grade: "Certified Pre-Owned - 100% Tested Working Fine". Warranty: "90-Day Sajoda Certified Guarantee".
   - DO NOT put new and used on one product card! Each item is its OWN card with its own single price.

2. VERIFIED DOMESTIC SOURCING HUBS IN NIGERIA:
   - Home Appliances: "Alaba International Market Electronics Distribution Hub (Lagos)"
   - Latest Gadgets: "Computer Village Ikeja Tech Hub (Lagos)"
   - Certified Pre-Owned / Used: "Certified OEM Refurbisher Hub (Nigeria)" or "Computer Village Ikeja Tech Hub (Lagos)"

3. PRICING & OWNER COMMISSION (NIGERIAN NAIRA ₦):
   - Realistic domestic wholesale base cost in ₦ (minimum ₦25,000).
   - MANDATORY DamiJosh store owner commission of MINIMUM ₦10,000 UPWARD (e.g., ₦12,000 to ₦75,000 based on value).
   - price = baseCost + ownerCommission (e.g., ₦120,000 + ₦25,000 = ₦145,000).
   - originalPrice = 15-25% higher (crossed-out MSRP).

Category requested: ${category}
Condition preference: ${conditionGuideline}
${customPrompt ? `User instructions / focus: "${customPrompt}"` : ''}

Allowed categories: "Home Appliances", "Latest Gadgets", "Electronics".

Return ONLY a valid JSON array of ${targetCount} products matching this schema:
[
  {
    "name": "Punchy commercial product name in Nigeria",
    "baseCost": 120000,
    "ownerCommission": 25000,
    "price": 145000,
    "originalPrice": 175000,
    "sourcingHub": "Alaba International Market Electronics Distribution Hub (Lagos)",
    "commissionNote": "₦25,000 commission added over wholesale cost",
    "condition": "new", // or "used"
    "conditionGrade": "Brand New - Sealed Carton Box", // or "Certified Pre-Owned - 100% Tested Working Fine"
    "packaging": "Factory Sealed Retail Carton & Pack", // or "Tested Unit with Padded Protective Box"
    "warrantyInfo": "1-Year Official Manufacturer Warranty",
    "category": "Home Appliances",
    "badge": "BESTSELLER",
    "brand": "Sajoda Home",
    "shortDescription": "One-line punchy selling point",
    "description": "Engaging overview detailing build quality, features, and unboxing/testing assurance.",
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "specifications": [{"name": "Power", "value": "1800W"}, {"name": "Capacity", "value": "6L"}],
    "tags": ["appliances", "kitchen", "smart"]
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedProducts = JSON.parse(response.text || '[]');
    
    // Assign multi-angle images (front, side, angle, carton/pack or tested hardware)
    const productsWithImages = parsedProducts.map((p: any, index: number) => {
      const isUsed = p.condition === 'used' || (condition === 'used') || (!p.condition && index % 2 === 1);
      const cat = p.category || (category !== 'All' ? category : 'Latest Gadgets');
      const gallery = getMultiAngleImages(cat, isUsed ? 'used' : 'new', index);

      const parsedBaseCost = Math.max(Number(p.baseCost) || 35000, 20000);
      const parsedCommission = Math.max(Number(p.ownerCommission) || 15000, 10000); // ₦10,000 minimum
      const finalPrice = parsedBaseCost + parsedCommission;

      let sourcingHub = p.sourcingHub;
      if (!sourcingHub) {
        if (p.category === 'Home Appliances') {
          sourcingHub = 'Alaba International Market Electronics Distribution Hub (Lagos)';
        } else if (isUsed) {
          sourcingHub = 'Certified OEM Refurbisher Hub (Nigeria)';
        } else {
          sourcingHub = 'Computer Village Ikeja Tech Hub (Lagos)';
        }
      }

      const cleanTitle = p.name || 'Sajoda Premium Product';
      const prefix = isUsed ? '[Pre-Owned - 100% Tested Working] ' : '[Brand New - Sealed Box] ';
      const finalName = cleanTitle.includes('Brand New') || cleanTitle.includes('Pre-Owned') || cleanTitle.includes('Refurbished')
        ? cleanTitle 
        : `${cleanTitle} (${isUsed ? 'Pre-Owned • Tested Working Fine' : 'Brand New • Sealed Carton'})`;

      return {
        ...p,
        id: 'sajoda-' + (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28) + '-' + (isUsed ? 'used-' : 'new-') + Math.random().toString(36).slice(2, 6),
        name: finalName,
        condition: isUsed ? 'used' : 'new',
        conditionGrade: isUsed ? 'Certified Pre-Owned - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
        packaging: isUsed ? 'Tested Unit with Protective Padded Packaging' : 'Factory Sealed Retail Pack & Carton Box',
        warrantyInfo: isUsed ? '90-Day Sajoda Certified Guarantee' : '1-Year Official Manufacturer Warranty',
        baseCost: parsedBaseCost,
        ownerCommission: parsedCommission,
        commissionNote: `₦${parsedCommission.toLocaleString()} commission added over domestic wholesale base cost`,
        sourcingHub: sourcingHub,
        price: finalPrice,
        originalPrice: p.originalPrice || Math.round((finalPrice * 1.22) / 500) * 500,
        image: gallery[0],
        images: gallery,
        inStock: true,
        stockCount: isUsed ? 14 : 35,
        rating: 4.9,
        reviewCount: Math.floor(Math.random() * 50) + 75,
        createdAt: new Date().toISOString()
      };
    });

    res.json({ success: true, count: productsWithImages.length, products: productsWithImages });
  } catch (error: any) {
    console.error('Gemini Catalog Generation Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate catalog products with AI' });
  }
});

// AI Generate Single Product from Prompt (Dedicated Single Condition Card with Multi-Angle Photos)
app.post('/api/ai/generate-single-product', async (req, res) => {
  try {
    const { prompt, category, condition = 'new' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const isUsed = condition === 'used';
    const promptText = `Generate a complete, ready-to-sell standalone product for 'SAJODA ELECTRONICS' in Nigeria based on: "${prompt}".
Store owner: DamiJosh.
Specialties: Home Appliances, Latest Gadgets, and Electronics.
Condition: "${isUsed ? 'Certified Pre-Owned (100% Tested Working Fine)' : 'Brand New (Factory Sealed Retail Carton & Pack)'}".
No dual price! This is a dedicated single card.

PRICING & SOURCING RULES (NIGERIAN NAIRA ₦):
- Use reasonable, realistic Nigerian market prices in Naira (₦).
- baseCost: Realistic wholesale acquisition cost in ₦ (minimum ₦25,000).
- ownerCommission: MANDATORY DamiJosh profit markup of MINIMUM ₦10,000 UPWARD (e.g. ₦10,000 to ₦75,000 depending on value).
- price: Final customer listing price = baseCost + ownerCommission.
- sourcingHub: Select verified domestic sourcing hub (Alaba Market Hub for appliances, Computer Village for gadgets, OEM Refurbisher for used).

Return ONLY valid JSON:
{
  "name": "Commercial product title in Nigeria (under 60 chars)",
  "baseCost": 120000,
  "ownerCommission": 25000,
  "price": 145000,
  "originalPrice": 175000,
  "sourcingHub": "Alaba International Market Electronics Distribution Hub (Lagos)",
  "commissionNote": "₦25,000 commission added over wholesale base cost",
  "condition": "${isUsed ? 'used' : 'new'}",
  "conditionGrade": "${isUsed ? 'Certified Pre-Owned - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box'}",
  "packaging": "${isUsed ? 'Tested Unit with Padded Protective Box' : 'Factory Sealed Retail Pack & Carton'}",
  "warrantyInfo": "${isUsed ? '90-Day Sajoda Certified Guarantee' : '1-Year Official Manufacturer Warranty'}",
  "category": "Home Appliances",
  "badge": "NEW ARRIVAL",
  "brand": "Sajoda",
  "shortDescription": "One sentence summary",
  "description": "2-3 paragraphs detailing features, build quality, multi-angle inspections, and benefits.",
  "features": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
  "specifications": [
    {"name": "Power/Battery", "value": "..."},
    {"name": "Box Packaging", "value": "${isUsed ? 'Tested unit with accessories' : 'Original sealed carton'}"}
  ],
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const cat = parsed.category || category || 'Latest Gadgets';
    const gallery = getMultiAngleImages(cat, isUsed ? 'used' : 'new');

    const baseCost = Math.max(Number(parsed.baseCost) || 50000, 20000);
    const ownerCommission = Math.max(Number(parsed.ownerCommission) || 15000, 10000); // ₦10,000 minimum
    const finalPrice = baseCost + ownerCommission;

    let sourcingHub = parsed.sourcingHub;
    if (!sourcingHub) {
      if (parsed.category === 'Home Appliances') {
        sourcingHub = 'Alaba International Market Electronics Distribution Hub (Lagos)';
      } else if (isUsed) {
        sourcingHub = 'Certified OEM Refurbisher Hub (Nigeria)';
      } else {
        sourcingHub = 'Computer Village Ikeja Tech Hub (Lagos)';
      }
    }

    res.json({ 
      success: true, 
      product: {
        ...parsed,
        id: 'sajoda-' + (parsed.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28) + '-' + (isUsed ? 'used-' : 'new-') + Math.random().toString(36).slice(2, 6),
        baseCost,
        ownerCommission,
        commissionNote: parsed.commissionNote || `₦${ownerCommission.toLocaleString()} commission added over wholesale base cost`,
        sourcingHub,
        price: finalPrice,
        originalPrice: parsed.originalPrice || Math.round((finalPrice * 1.25) / 500) * 500,
        image: gallery[0],
        images: gallery,
        condition: isUsed ? 'used' : 'new',
        conditionGrade: isUsed ? 'Certified Pre-Owned - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
        packaging: isUsed ? 'Tested Unit with Padded Protective Box' : 'Factory Sealed Retail Pack & Carton',
        warrantyInfo: isUsed ? '90-Day Sajoda Certified Guarantee' : '1-Year Official Manufacturer Warranty',
        inStock: true,
        stockCount: isUsed ? 12 : 35
      }
    });
  } catch (error: any) {
    console.error('Gemini Single Product Generation Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate single product with AI' });
  }
});

// TikTok & Instagram Viral Product Scout (for DamiJosh)
app.post('/api/ai/scout-social-product', async (req, res) => {
  try {
    const { urlOrTrend, platform = 'auto', condition = 'new', category = 'Latest Gadgets' } = req.body;
    if (!urlOrTrend) {
      return res.status(400).json({ error: 'Please provide a TikTok or Instagram link, topic, or viral product name' });
    }

    const isUsed = condition === 'used';
    const promptText = `You are an elite viral product scout and merchandiser for SAJODA ELECTRONICS in Nigeria, serving store owner DamiJosh.
DamiJosh spotted a viral product trend on ${platform === 'auto' ? 'TikTok (#TikTokMadeMeBuyIt) or Instagram' : platform}: "${urlOrTrend}".

Task:
1. Identify the exact viral product concept (e.g. viral portable blender, star galaxy projector, mini thermal pocket printer, LED sunset projection lamp, 3-in-1 foldable magnetic wireless charger, portable turbo jet fan, smart electric cooker, etc.).
2. Categorize it into: "Home Appliances", "Latest Gadgets", or "Electronics".
3. Formulate realistic domestic Nigerian wholesale acquisition and pricing in Naira (₦):
   - Verified wholesale hub:
     * Appliances: "Alaba International Market Electronics Distribution Hub (Lagos)"
     * Gadgets & Tech: "Computer Village Ikeja Tech Hub (Lagos)"
     * Pre-Owned: "Certified OEM Refurbisher Hub (Nigeria)"
   - baseCost: realistic wholesale import/acquisition cost in ₦ (minimum ₦20,000).
   - ownerCommission: MANDATORY DamiJosh profit commission of MINIMUM ₦10,000 UPWARD (e.g. ₦12,000 to ₦45,000+ depending on value).
   - price = baseCost + ownerCommission.
   - originalPrice = 15-25% higher (crossed-out MSRP).
4. Condition: "${isUsed ? 'Pre-Owned (100% Tested Working Fine)' : 'Brand New (Factory Sealed Retail Carton & Pack)'}".
5. Write compelling, high-converting copy borrowing viral social hooks ("Viral sensation with over 3M views", "Must-have unboxing", "Trending home upgrade").

Return ONLY valid JSON matching this schema:
{
  "name": "Punchy commercial product title (under 60 chars)",
  "viralHook": "🔥 VIRAL ON TIKTOK",
  "category": "Latest Gadgets",
  "condition": "${isUsed ? 'used' : 'new'}",
  "conditionGrade": "${isUsed ? 'Certified Pre-Owned - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box'}",
  "packaging": "${isUsed ? 'Tested Unit with Protective Padded Wrap' : 'Factory Sealed Retail Pack & Carton'}",
  "warrantyInfo": "${isUsed ? '90-Day Sajoda Certified Guarantee' : '1-Year Official Manufacturer Warranty'}",
  "baseCost": 35000,
  "ownerCommission": 15000,
  "price": 50000,
  "originalPrice": 65000,
  "sourcingHub": "Computer Village Ikeja Tech Hub (Lagos)",
  "commissionNote": "₦15,000 profit commission added over domestic wholesale base cost",
  "brand": "Sajoda Viral",
  "badge": "TIKTOK TREND",
  "shortDescription": "One-line viral hook highlighting why everyone wants it",
  "description": "Engaging 2-3 paragraph overview detailing social media excitement, practical benefits, and unboxing assurance.",
  "features": ["Viral Feature 1", "Viral Feature 2", "Viral Feature 3", "Viral Feature 4"],
  "specifications": [
    {"name": "Power / Battery", "value": "..."},
    {"name": "Packaging", "value": "${isUsed ? 'Tested & verified working fine' : 'Sealed retail carton'}"}
  ],
  "tags": ["tiktok", "viral", "trending", "gadget"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const cat = parsed.category || category || 'Latest Gadgets';
    const gallery = getMultiAngleImages(cat, isUsed ? 'used' : 'new');

    const baseCost = Math.max(Number(parsed.baseCost) || 35000, 20000);
    const ownerCommission = Math.max(Number(parsed.ownerCommission) || 15000, 10000); // ₦10,000 minimum
    const finalPrice = baseCost + ownerCommission;

    const scoutedProduct = {
      ...parsed,
      id: 'sajoda-viral-' + (parsed.name || 'trend').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28) + '-' + (isUsed ? 'used-' : 'new-') + Math.random().toString(36).slice(2, 6),
      condition: isUsed ? 'used' : 'new',
      conditionGrade: isUsed ? 'Certified Pre-Owned - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
      packaging: isUsed ? 'Tested Unit with Protective Padded Wrap' : 'Factory Sealed Retail Pack & Carton',
      warrantyInfo: isUsed ? '90-Day Sajoda Certified Guarantee' : '1-Year Official Manufacturer Warranty',
      baseCost,
      ownerCommission,
      commissionNote: `₦${ownerCommission.toLocaleString()} commission added over domestic wholesale base cost`,
      sourcingHub: parsed.sourcingHub || (cat === 'Home Appliances' ? 'Alaba International Market Electronics Distribution Hub (Lagos)' : 'Computer Village Ikeja Tech Hub (Lagos)'),
      price: finalPrice,
      originalPrice: parsed.originalPrice || Math.round((finalPrice * 1.25) / 500) * 500,
      image: gallery[0],
      images: gallery,
      inStock: true,
      stockCount: isUsed ? 15 : 40,
      rating: 4.9,
      reviewCount: Math.floor(Math.random() * 80) + 120,
      source: 'social_viral',
      viralSourceUrl: urlOrTrend,
      createdAt: new Date().toISOString()
    };

    res.json({ success: true, product: scoutedProduct });
  } catch (error: any) {
    console.error('Viral Social Scout Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to scout viral social product' });
  }
});

app.post('/api/product-reviews', async (req, res) => {
  try {
    const { productName } = req.body;
    if (!productName) return res.status(400).json({ error: 'Product name is required' });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Search for the latest real-world reviews and news for: "${productName}". Summarize the general consensus, pros, and cons in a short 2-3 paragraph tech review style. Keep it professional and engaging.`,
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error('Gemini Review API Error:', error);
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota')) {
        return res.json({ summary: "Review summary is temporarily unavailable due to high demand. Please try again later." });
    }
    res.status(500).json({ error: 'Failed to generate review summary due to rate limits or API error.' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
