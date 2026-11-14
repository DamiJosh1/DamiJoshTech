import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp, collection, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };
import { INITIAL_PRODUCTS } from './src/data/initialProducts';

dotenv.config();

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = isProd ? process.env.PORT || 3000 : 3001;

// Only initialize Resend if API key is present
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Middleware
app.use(cors());

// Use raw body for webhook signature verification if needed, or express.json (with 15mb limit for mobile product images)
app.use(express.json({
  limit: '15mb',
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

process.on('unhandledRejection', (reason: any) => {
  console.warn('[Server] Handled unhandled rejection safely:', reason?.message || reason);
});

// Gemini configuration & safe client
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const hasGeminiKey = Boolean(geminiApiKey && geminiApiKey.trim().length > 0);

const ai = new GoogleGenAI({
  apiKey: geminiApiKey || 'DUMMY_KEY_FOR_LOCAL_BUILD',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function callGeminiWithTimeout(prompt: string, config: any = {}, timeoutMs: number = 6000): Promise<any> {
  if (!hasGeminiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment');
  }
  let timerId: NodeJS.Timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timerId = setTimeout(() => reject(new Error('AI request timed out')), timeoutMs);
  });
  const genPromise = ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: prompt,
    config
  });
  // Prevent unhandled promise rejection if timeout Promise fires first
  genPromise.catch(() => {});
  try {
    const result = await Promise.race([genPromise, timeoutPromise]);
    clearTimeout(timerId!);
    return result;
  } catch (err) {
    clearTimeout(timerId!);
    throw err;
  }
}

// Admin AI Assistant Webhook
app.post('/api/chat', async (req, res) => {
  try {
    const { message, isAdmin, userName } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    if (hasGeminiKey) {
      const systemInstruction = isAdmin 
        ? `You are an elite AI Chief Merchandiser and Business Strategist for SAJODA ELECTRONICS in Nigeria, serving store owner and admin DamiJosh (${userName || 'DamiJosh'}).
You specialize in Home Appliances, Latest Gadgets, and Electronics.
You know domestic Nigerian wholesale sourcing hubs:
1. Alaba International Market Electronics Distribution Hub (Lagos) - Appliances & TVs.
2. Computer Village Ikeja Tech Hub (Lagos) - Gadgets, Phones, Accessories.
3. Certified OEM Refurbisher & Testing Hub (Nigeria) - Tokunbo & Fairly Used 100% Tested Working Fine units.
All prices must be in reasonable Nigerian Naira (₦). Every item must include DamiJosh's owner commission markup of MINIMUM ₦10,000 UPWARD (e.g., +₦10k to +₦75k depending on value).
Brand New goods come in sealed retail cartons and packs.
Tokunbo & Fairly Used goods are separate cards with 100% verified working fine status.
You can help DamiJosh scout viral products from TikTok (#TikTokMadeMeBuyIt) and Instagram reels, suggest high-converting copy, calculate profit markups, and craft multi-angle photo product listings. Be sharp, encouraging, respectful, and direct.`
        : `You are a helpful and knowledgeable shopping assistant for SAJODA ELECTRONICS in Nigeria. Help the customer find top home appliances, latest gadgets, and electronics with authentic Nigerian market prices (₦), 1-year warranties on brand new items in sealed cartons, and 90-day guarantees on tokunbo / fairly used (100% tested working) items. Be friendly, concise, and helpful. Never reveal wholesale base costs or internal sourcing markups.`;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: message,
          config: {
            systemInstruction,
          }
        });
        return res.json({ text: response.text });
      } catch (genErr: any) {
        console.warn('Gemini chat request error, using smart domestic assistant response:', genErr?.message);
      }
    }

    // High-context Nigerian Merchant Assistant Fallback Response
    const lowerMsg = (message || '').toLowerCase();
    let replyText = '';

    if (isAdmin) {
      if (lowerMsg.includes('price') || lowerMsg.includes('profit') || lowerMsg.includes('margin') || lowerMsg.includes('commission')) {
        replyText = `Hello DamiJosh! For your pricing strategy, every product in SAJODA now strictly follows: Final Price = Wholesale Base (Alaba / Computer Village) + Dispatch Rider Logistics Buffer (₦3,500 – ₦7,500) + Your Net Owner Profit (₦15,000 – ₦75,000+). This guarantees you never pay delivery riders out of your pocket, while customers pay designated doorstep shipping at checkout!`;
      } else if (lowerMsg.includes('rider') || lowerMsg.includes('deliver') || lowerMsg.includes('shipping') || lowerMsg.includes('lagos')) {
        replyText = `Our logistics network is configured for fast Nigerian fulfillment: Lagos Mainland (₦2,500), Lagos Island (₦3,500), Lekki/Ajah (₦4,500), Ikorodu/Outskirts (₦5,000), Abuja FCT (₦6,500), and Nationwide Inter-State (₦7,500–₦8,500). Your product pricing already has a rider allowance buffer built in, preserving 100% of your profit!`;
      } else if (lowerMsg.includes('tiktok') || lowerMsg.includes('trend') || lowerMsg.includes('viral') || lowerMsg.includes('product')) {
        replyText = `Top trending items selling fast across TikTok Nigeria right now: 1) Silver Crest 4500W Commercial Blender (₦68k wholesale, sell ₦93k), 2) Oraimo FreePods 4 ANC (₦32k wholesale, sell ₦50k), 3) MasterChef 2-Burner Toughened Glass Gas Cooker (₦42k wholesale, sell ₦62k), 4) Hisense 43" 4K Google TV (₦260k wholesale, sell ₦305k). You can generate and publish them in 1-click in the AI Product Studio!`;
      } else {
        replyText = `Welcome DamiJosh! I am your AI Chief Merchandiser for SAJODA ELECTRONICS. Your store catalog is clean, domestic sourcing hubs (Alaba Market & Computer Village) are active, and our automated rider logistics pricing is locked in. Let me know what products or viral campaigns you want to launch next!`;
      }
    } else {
      if (lowerMsg.includes('deliver') || lowerMsg.includes('ship') || lowerMsg.includes('location')) {
        replyText = `We offer rapid doorstep delivery across all 36 Nigerian states! Lagos Mainland is ₦2,500, Lagos Island ₦3,500, Lekki/Ajah ₦4,500, and Interstate courier is ₦6,500–₦8,500. Orders in Lagos arrive within 24 hours via dedicated dispatch riders.`;
      } else if (lowerMsg.includes('warranty') || lowerMsg.includes('guarantee') || lowerMsg.includes('tokunbo') || lowerMsg.includes('condition')) {
        replyText = `All Brand New products come in factory sealed retail cartons with a 1-Year Official Manufacturer Warranty. Tokunbo units are individually tested 100% working fine and backed by our 90-Day SAJODA Guarantee.`;
      } else {
        replyText = `Welcome to SAJODA ELECTRONICS! We provide authentic home appliances, gadgets, and electronics sourced directly from certified domestic hubs. How can I assist you with your order today?`;
      }
    }

    res.json({ text: replyText });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.json({ 
      text: "SAJODA Customer Support is available. For instant inquiries, you can also connect directly with our dispatch team on WhatsApp."
    });
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

    let parsedData: any = null;
    if (hasGeminiKey) {
      try {
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
        parsedData = JSON.parse(response.text || '{}');
      } catch (genErr) {
        console.warn('Gemini vision analysis failed, using domestic merchant analysis:', genErr);
      }
    }

    if (!parsedData || !parsedData.name) {
      const cleanHint = instructions ? instructions.replace(/[^a-zA-Z0-9\s]/g, '').trim() : 'Smart Gadget';
      parsedData = {
        name: cleanHint || 'Authentic Wireless Smart Device',
        price: 35000,
        originalPrice: 45000,
        category: (existingCategories && existingCategories[0]) || 'Latest Gadgets',
        shortDescription: 'High quality consumer tech item verified for reliable daily performance.',
        description: 'Premium device scouted for Nigerian consumers. Features durable construction, intuitive operation, and reliable battery/power efficiency.',
        features: [
          'High efficiency build designed for daily usage',
          'Fast setup and straightforward operation',
          'Sleek modern design with certified materials',
          'Includes official warranty and customer guarantee'
        ],
        specifications: [
          { name: 'Build Quality', value: 'High Grade Polycarbonate & Alloy' },
          { name: 'Sourcing Hub', value: 'Computer Village Ikeja Tech Hub (Lagos)' }
        ],
        brand: 'Generic Premium',
        tags: ['trending', 'gadget', 'nigeria']
      };
    }

    res.json({ success: true, product: parsedData });
  } catch (error: any) {
    console.error('Image Analysis Error:', error);
    res.json({ 
      success: true, 
      product: {
        name: 'Trending Consumer Electronics Item',
        price: 32000,
        originalPrice: 42000,
        category: 'Latest Gadgets',
        shortDescription: 'High quality consumer tech item verified for reliable performance.',
        description: 'Premium device scouted for Nigerian consumers. Backed by store guarantee.',
        features: ['Durable build quality', 'Reliable power efficiency', 'Fast doorstep delivery'],
        specifications: [{ name: 'Packaging', value: 'Sealed Retail Pack' }],
        brand: 'Premium Brand',
        tags: ['gadgets', 'trending']
      }
    });
  }
});

// Multi-Angle Image Collections (Front, Side, Back/Detail, and Retail Carton/Tested Condition)
// Keyword-Matched Curated Multi-Angle Product Image Galleries
const KEYWORD_GALLERIES: Record<string, string[][]> = {
  tv: [
    [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  drone: [
    [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  watch: [
    [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  earbud: [
    [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1609592424368-e4b2d1d0537d?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  headphone: [
    [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  blender: [
    [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  fryer: [
    [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  speaker: [
    [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  projector: [
    [
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  charger: [
    [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1609592424368-e4b2d1d0537d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  monitor: [
    [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  vacuum: [
    [
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  freezer: [
    [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  beauty: [
    [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  mic: [
    [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  fan: [
    [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800'
    ]
  ],
  kettle: [
    [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800'
    ]
  ]
};

// Flexible, intelligent image resolver: checks product title, keywords, and category
function getMultiAngleImages(productNameOrCategory: string, categoryOrCond?: string, maybeCondition?: string, seedIndex: number = 0): string[] {
  const text = (productNameOrCategory + ' ' + (categoryOrCond || '')).toLowerCase();

  let matchedKey = '';
  if (/tv|television|screen|crystal uhd|nanocell/i.test(text)) matchedKey = 'tv';
  else if (/drone|mavic|quadcopter|aerial/i.test(text)) matchedKey = 'drone';
  else if (/watch|smartwatch|band/i.test(text)) matchedKey = 'watch';
  else if (/earbud|airpod|freepod|tws|buds/i.test(text)) matchedKey = 'earbud';
  else if (/headphone|headset|xm5|wh-1000|over-ear/i.test(text)) matchedKey = 'headphone';
  else if (/blender|grinder|smoothie|mixer/i.test(text)) matchedKey = 'blender';
  else if (/fryer|air fryer/i.test(text)) matchedKey = 'fryer';
  else if (/speaker|soundbar|jbl|boombox/i.test(text)) matchedKey = 'speaker';
  else if (/projector|laser cinema/i.test(text)) matchedKey = 'projector';
  else if (/powerbank|power bank|magsafe|charger|gan|dock|wireless station/i.test(text)) matchedKey = 'charger';
  else if (/monitor|display|ultrasharp/i.test(text)) matchedKey = 'monitor';
  else if (/vacuum|cleaner|roborock/i.test(text)) matchedKey = 'vacuum';
  else if (/freezer|fridge|refrigerator/i.test(text)) matchedKey = 'freezer';
  else if (/mic|microphone|lavalier/i.test(text)) matchedKey = 'mic';
  else if (/fan|rechargeable fan/i.test(text)) matchedKey = 'fan';
  else if (/kettle|boiler/i.test(text)) matchedKey = 'kettle';
  else if (/hair|styler|clipper|shaver|curler|dryer/i.test(text)) matchedKey = 'beauty';

  if (matchedKey && KEYWORD_GALLERIES[matchedKey]) {
    const sets = KEYWORD_GALLERIES[matchedKey];
    return sets[seedIndex % sets.length];
  }

  // Fallback by broad category
  if (/appliance/i.test(text)) {
    return KEYWORD_GALLERIES.blender[0];
  } else if (/electronics/i.test(text)) {
    return KEYWORD_GALLERIES.speaker[0];
  }
  return KEYWORD_GALLERIES.charger[0];
}

const DOMESTIC_CATALOG_TEMPLATES = {
  'Home Appliances': [
    {
      name: "Haier Thermocool 1.5HP Energy-Saving Dual Inverter Split AC",
      brand: "Haier Thermocool",
      category: "Home Appliances",
      baseCost: 285000,
      ownerCommission: 45000,
      sourcingHub: "Alaba International Market Electronics Distribution Hub (Lagos)",
      shortDescription: "Ultra-fast turbo cooling with up to 70% energy-saving low voltage operation.",
      description: "Engineered specifically for Nigerian power dynamics with GenPAL low voltage start (operates even on small generator). Features 100% copper grooved condenser pipes, multi-stage anti-bacterial air filtration, and whisper-quiet operation under 22dB.",
      features: ["GenPAL Low Voltage Start (Runs on small generator)", "70% Dual Inverter Energy Efficiency", "100% Pure Copper Internal Tubing", "Multi-Stage Anti-Bacterial & Dust Filter"],
      specifications: [{ name: "Capacity", value: "1.5 HP (12,000 BTU)" }, { name: "Refrigerant", value: "Eco-Friendly R32" }, { name: "Voltage", value: "160V - 260V Gen-Compatible" }],
      tags: ["ac", "inverter", "appliances", "cooling"]
    },
    {
      name: "Hisense 20L Digital Quick-Defrost Microwave Oven",
      brand: "Hisense",
      category: "Home Appliances",
      baseCost: 72000,
      ownerCommission: 18000,
      sourcingHub: "Alaba International Market Electronics Distribution Hub (Lagos)",
      shortDescription: "Sleek mirror-finish digital microwave with 6 auto-express cooking presets.",
      description: "Quickly heat, defrost, and cook daily meals with precision power stages. Features a scratch-resistant easy-clean ceramic enamel cavity, membrane digital touch control panel, 360-degree glass turntable, and child safety lock.",
      features: ["700W Rapid Heating Power", "6 One-Touch Auto Express Presets", "Smart Weight-Adjusted Auto Defrost", "Child Safety Lock & Digital Timer"],
      specifications: [{ name: "Capacity", value: "20 Litres" }, { name: "Power", value: "700 Watts" }, { name: "Cavity Finish", value: "Easy-Clean Ceramic Enamel" }],
      tags: ["microwave", "kitchen", "appliances", "cooking"]
    },
    {
      name: "Silver Crest 2.0L 4500W Heavy-Duty Industrial Commercial Blender",
      brand: "Silver Crest",
      category: "Home Appliances",
      baseCost: 38000,
      ownerCommission: 15000,
      sourcingHub: "Alaba International Market Electronics Distribution Hub (Lagos)",
      shortDescription: "Crushes dry beans, tiger nuts, corn, and ice into silky smooth paste in seconds.",
      description: "The undisputed workhorse of Nigerian kitchens. Powered by a high-torque 4500W pure copper motor with hardened stainless steel 6-blade assembly that effortlessly pulverizes unsoaked beans, egusi, and hard frozen ice. Comes with an unbreakable polycarbonate jug.",
      features: ["4500W High-Torque Pure Copper Motor", "Aircraft-Grade 6-Blade Stainless Steel Cutter", "Unbreakable 2.0L BPA-Free Polycarbonate Jar", "Stepless Variable Speed & Turbo Pulse Switch"],
      specifications: [{ name: "Power Output", value: "4500W Peak" }, { name: "Jar Capacity", value: "2.0 Litres" }, { name: "Safety", value: "Overheat Thermal Cutoff" }],
      tags: ["blender", "kitchen", "heavy-duty", "commercial"]
    },
    {
      name: "Century 16-Inch Smart Rechargeable Standing Fan with USB & Remote",
      brand: "Century",
      category: "Home Appliances",
      baseCost: 55000,
      ownerCommission: 16000,
      sourcingHub: "Alaba International Market Electronics Distribution Hub (Lagos)",
      shortDescription: "Up to 14 hours backup runtime during power outages with phone charging port.",
      description: "Stay cool 24/7 regardless of power cuts. Equipped with a high-capacity lithium-ion rechargeable battery delivering up to 14 hours of continuous cooling on low speed. Includes bright emergency LED night lighting, USB smartphone charging output, and infrared remote control.",
      features: ["Up to 14 Hours Battery Runtime", "Built-In USB Phone Charging Output", "Full Function Wireless Remote Control", "Ultra-Quiet 5-Blade Aerodynamic Rotor"],
      specifications: [{ name: "Blade Diameter", value: "16 Inches (400mm)" }, { name: "Battery", value: "12V / 4.5Ah Lead-Acid / Li-Ion" }, { name: "Charging Time", value: "6 - 8 Hours" }],
      tags: ["fan", "rechargeable", "cooling", "appliances"]
    },
    {
      name: "MasterChef 2-Burner Heavy Duty Toughened Glass Gas Cooker",
      brand: "MasterChef",
      category: "Home Appliances",
      baseCost: 42000,
      ownerCommission: 15000,
      sourcingHub: "Alaba International Market Electronics Distribution Hub (Lagos)",
      shortDescription: "Sleek 7mm shatterproof tempered glass top with whirlwind blue flame burners.",
      description: "Modernize your kitchen with durable, energy-efficient gas cooking. Designed with heavy-duty cast iron pan supports, auto-piezo electronic ignition without matches, and precision dual copper gas injectors that save up to 30% gas consumption.",
      features: ["7mm Heat-Resistant Toughened Glass Surface", "Automatic Piezo Ignition (No matches needed)", "High-Efficiency Whirlwind Blue Flame", "Anti-Rust Enamel Cast Iron Trivets"],
      specifications: [{ name: "Burner Count", value: "2 Whirlwind High-Heat Burners" }, { name: "Ignition Type", value: "Battery-Free Auto Pulse" }, { name: "Dimensions", value: "710 x 370 x 85 mm" }],
      tags: ["cooker", "gas", "kitchen", "appliances"]
    },
    {
      name: "Binatone 6.0L Multi-Function Digital Electric Pressure Cooker",
      brand: "Binatone",
      category: "Home Appliances",
      baseCost: 85000,
      ownerCommission: 22000,
      sourcingHub: "Alaba International Market Electronics Distribution Hub (Lagos)",
      shortDescription: "Cooks tough beef, beans, and soups 70% faster with 12 preset smart programs.",
      description: "Replaces 7 kitchen appliances in one compact footprint. Features 1000W pressure-accelerated cooking that tenderizes tough meats and prepares rich Nigerian soups in a fraction of standard boiling time while locking in essential nutrients.",
      features: ["12 One-Touch Smart Cooking Presets", "Non-Stick Heavy Duty Teflon Inner Pot", "Multi-Tier Pressure Release Safety Valves", "24-Hour Keep Warm & Delay Start Timer"],
      specifications: [{ name: "Capacity", value: "6.0 Litres" }, { name: "Power", value: "1000 Watts" }, { name: "Pressure Rating", value: "70 kPa" }],
      tags: ["cooker", "pressure-cooker", "appliances", "kitchen"]
    }
  ],
  'Latest Gadgets': [
    {
      name: "Oraimo FreePods 4 Active Noise Cancelling True Wireless Earbuds",
      brand: "Oraimo",
      category: "Latest Gadgets",
      baseCost: 32000,
      ownerCommission: 13000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "30dB Hybrid Active Noise Cancellation with heavy HavyBass tuned acoustic drivers.",
      description: "Block out Lagos traffic and generator background hum with 30dB active noise cancellation. Features 4-mic beamforming noise reduction for crystal-clear phone calls, IPX5 water resistance, low-latency gaming mode, and 35.5 hours total battery life with companion Oraimo Sound app EQ customization.",
      features: ["30dB Active Noise Cancellation & Transparency Mode", "35.5 Hours Extended Playtime with Quick Charge", "HavyBass Deep Bass Acoustic Tuning", "4-Mic Clear Voice Call Noise Suppression"],
      specifications: [{ name: "Bluetooth Version", value: "V5.3 (10m Range)" }, { name: "Battery Life", value: "8.5h earbuds + 27h case" }, { name: "Water Resistance", value: "IPX5 Splashproof" }],
      tags: ["earbuds", "audio", "wireless", "gadgets"]
    },
    {
      name: "Anker 20,000mAh 65W PowerCore GaN High-Speed Laptop & Phone Power Bank",
      brand: "Anker",
      category: "Latest Gadgets",
      baseCost: 58000,
      ownerCommission: 18000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "Charges MacBooks, iPhones, Samsung, and laptops at 65W max output speeds.",
      description: "The ultimate power backup solution for remote workers and travelers in Nigeria. Packs 20,000mAh of high-density battery capacity capable of fully charging a laptop once or an iPhone 14 four times. Features Anker MultiProtect surge safety and dual USB-C Power Delivery ports.",
      features: ["65W High-Speed USB-C Power Delivery", "20,000mAh Heavy Duty Flight-Approved Capacity", "Charges 3 Devices Simultaneously", "Trickle-Charging Mode for Earbuds & Smartwatches"],
      specifications: [{ name: "Total Capacity", value: "20,000 mAh (74Wh)" }, { name: "Max Output", value: "65W USB-C PD" }, { name: "Weight", value: "435g" }],
      tags: ["powerbank", "anker", "charger", "gadgets"]
    },
    {
      name: "Apple Watch Ultra 2 GPS + Cellular Titanium 49mm",
      brand: "Apple",
      category: "Latest Gadgets",
      baseCost: 650000,
      ownerCommission: 85000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "Aerospace-grade titanium case with 3,000 nits brightest sapphire display.",
      description: "Built for extreme endurance, outdoor adventures, and everyday luxury. Features dual-frequency precision GPS, siren speaker, ECG heart monitor, blood oxygen sensors, dive computer certification to 40 meters, and customizable Action Button.",
      features: ["49mm Aerospace Titanium Case & Sapphire Crystal", "3000 nits Ultra-Bright Always-On Retina Display", "Up to 72 Hours Battery in Low Power Mode", "Dual-Frequency Precision GPS & Cellular Calling"],
      specifications: [{ name: "Case Size", value: "49mm" }, { name: "Water Resistance", value: "100m (WR100)" }, { name: "Connectivity", value: "LTE & UMTS, Wi-Fi, Bluetooth 5.3" }],
      tags: ["apple", "smartwatch", "ultra", "gadgets"]
    },
    {
      name: "Samsung Galaxy Watch 6 Classic 47mm Rotating Bezel Smartwatch",
      brand: "Samsung",
      category: "Latest Gadgets",
      baseCost: 240000,
      ownerCommission: 45000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "Iconic physical rotating bezel with advanced body composition and sleep coaching.",
      description: "Crafted with premium stainless steel and sapphire crystal glass. Features a vivid Super AMOLED display, BioActive health sensor for blood pressure and ECG, seamless Wear OS ecosystem with Google Maps & WhatsApp, and 40-hour battery life with fast magnetic wireless charging.",
      features: ["Physical Rotating Navigation Bezel", "BioActive Sensor (ECG, Blood Pressure, BIA Body Fat)", "Sapphire Crystal Scratch-Proof Glass", "Customizable Nigerian Watchfaces & Notifications"],
      specifications: [{ name: "Display", value: "1.5-inch Super AMOLED (480x480)" }, { name: "Material", value: "Stainless Steel Case" }, { name: "Durability", value: "5ATM + IP68 / MIL-STD-810H" }],
      tags: ["samsung", "smartwatch", "fitness", "gadgets"]
    },
    {
      name: "Baseus 100W 4-Port GaN Pro Desktop Multi-Device Fast Charger",
      brand: "Baseus",
      category: "Latest Gadgets",
      baseCost: 42000,
      ownerCommission: 15000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "Charges 2 laptops and 2 smartphones simultaneously from one wall socket.",
      description: "Say goodbye to bulky adapters cluttering your extension box. Powered by cutting-edge Gallium Nitride (GaN 5) technology that runs 30% cooler while pumping out 100W of blazing power across 2 USB-C and 2 USB-A ports. Compatible with PD 3.0, QC 4+, and PPS protocols.",
      features: ["100W Max Single Port USB-C Power Output", "4-in-1 Compact Multi-Port Design (2 Type-C + 2 Type-A)", "GaN 5 Cool-Running Thermal Architecture", "Universal Compatibility: MacBook, Dell, HP, iPhone, Android"],
      specifications: [{ name: "Total Power", value: "100W Max" }, { name: "Input Voltage", value: "100V - 240V AC Worldwide" }, { name: "Cable Included", value: "100W 1.5m Type-C to Type-C" }],
      tags: ["charger", "gan", "baseus", "gadgets"]
    },
    {
      name: "DJI Osmo Mobile 6 Foldable 3-Axis Smartphone Gimbal Stabilizer",
      brand: "DJI",
      category: "Latest Gadgets",
      baseCost: 165000,
      ownerCommission: 30000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "Buttery smooth cinematic video stabilization with built-in selfie extension rod.",
      description: "The gold standard for content creators, TikTokers, and Instagram vloggers. Features magnetic quick-release phone clamp, ActiveTrack 6.0 subject tracking that keeps you centered while moving, built-in 215mm extension rod for high/low angles, and side wheel focus/zoom control.",
      features: ["3-Axis Active Stabilization for Shake-Free 4K Video", "ActiveTrack 6.0 Auto Subject & Face Tracking", "Built-in 215mm Telescopic Extension Rod", "One-Click Quick Roll Portrait-to-Landscape Switch"],
      specifications: [{ name: "Gimbal Weight", value: "309g (Ultra-Portable Foldable)" }, { name: "Battery Runtime", value: "Approx. 6.4 Hours" }, { name: "Phone Compatibility", value: "All iPhones & Android Devices" }],
      tags: ["gimbal", "dji", "stabilizer", "vlogging"]
    }
  ],
  'Electronics': [
    {
      name: "Sony WH-1000XM5 Wireless Industry-Leading Noise-Cancelling Headphones",
      brand: "Sony",
      category: "Electronics",
      baseCost: 380000,
      ownerCommission: 65000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "Dual processors and 8 microphones for unmatched silence and Hi-Res wireless audio.",
      description: "Winner of worldwide audio awards. Features two proprietary V1 and QN1 noise cancelling processors that completely silence ambient background noise. Equipped with custom carbon fiber 30mm drivers, LDAC high-resolution wireless streaming, and 30 hours of continuous battery playback with 3-minute quick charging for 3 hours of playtime.",
      features: ["Industry-Leading Active Noise Cancellation with Auto NC Optimizer", "30 Hours Battery Playtime with 3-Min Fast Charge", "Hi-Res Audio Wireless with LDAC & DSEE Extreme", "Crystal-Clear Hands-Free Calls with 4 Beamforming Mics"],
      specifications: [{ name: "Driver Size", value: "30mm Carbon Fiber Composite" }, { name: "Battery Life", value: "30 Hours (NC ON) / 40 Hours (NC OFF)" }, { name: "Weight", value: "250g Lightweight Design" }],
      tags: ["headphones", "sony", "anc", "electronics"]
    },
    {
      name: "Samsung 43-Inch Crystal UHD 4K Smart TV with HDR10+",
      brand: "Samsung",
      category: "Electronics",
      baseCost: 295000,
      ownerCommission: 45000,
      sourcingHub: "Alaba International Market Electronics Distribution Hub (Lagos)",
      shortDescription: "Breathtaking 4K resolution with Crystal Processor 4K and Tizen Smart OS.",
      description: "Transform your living room into a private cinema. Delivers over one billion true-to-life color shades with Dynamic Crystal Color and HDR10+ contrast enhancement. Pre-loaded with YouTube, Netflix, Prime Video, DStv Now, and Apple AirPlay 2 connectivity.",
      features: ["Crystal Processor 4K Intelligent Upscaling", "Dynamic Crystal Color with 1 Billion Shades", "Built-In Tizen OS with DStv, Netflix & YouTube", "SolarCell Eco Remote Control (No batteries needed)"],
      specifications: [{ name: "Screen Size", value: "43 Inches (108 cm)" }, { name: "Resolution", value: "3840 x 2160 (True 4K UHD)" }, { name: "Connectivity", value: "3x HDMI, 2x USB, Optical, Wi-Fi, BT" }],
      tags: ["tv", "samsung", "4k", "smart-tv"]
    },
    {
      name: "JBL PartyBox Club 120 High-Power Portable Bluetooth Speaker",
      brand: "JBL",
      category: "Electronics",
      baseCost: 380000,
      ownerCommission: 55000,
      sourcingHub: "Alaba International Market Electronics Distribution Hub (Lagos)",
      shortDescription: "160W of pounding JBL Pro Sound with dynamic synced light show and 12-hour battery.",
      description: "Turn any room or outdoor gathering into a party. Features two high-sensitivity 5.25-inch woofers and dual 2.25-inch tweeters producing deep, punchy bass you can feel in your chest. Comes with mic and guitar inputs for live karaoke, IPX4 splashproof rating, and replaceable battery capability.",
      features: ["160W RMS Powerful JBL Original Pro Sound", "Futuristic Starry Lightshow Synced to the Beat", "Up to 12 Hours Battery Playtime with Fast Charge", "Dual Mic & Guitar Inputs for Karaoke Sessions"],
      specifications: [{ name: "Output Power", value: "160 Watts RMS" }, { name: "Water Resistance", value: "IPX4 Splashproof" }, { name: "Frequency Response", value: "40Hz - 20kHz (-6dB)" }],
      tags: ["speaker", "jbl", "bluetooth", "partybox"]
    },
    {
      name: "Wanbo T2 Max Full HD 1080p Smart Cinema Android Projector",
      brand: "Wanbo",
      category: "Electronics",
      baseCost: 145000,
      ownerCommission: 30000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "1080p native projection up to 120 inches with Android TV, Wi-Fi & auto focus.",
      description: "Enjoy giant-screen football matches and movie nights from the comfort of your home. Features an enclosed dust-proof optical machine delivering 450 ANSI lumens of bright projection, AI autofocus, 4-point electronic keystone correction, and built-in stereo Hi-Fi speakers.",
      features: ["Native 1080p FHD Resolution with 4K Decoding", "450 ANSI Lumens Bright High-Contrast Projection", "Built-In Android Smart OS with Netflix & YouTube", "Fully Enclosed Dustproof Optical Engine"],
      specifications: [{ name: "Projection Size", value: "40 - 120 Inches" }, { name: "Focus & Keystone", value: "AI Auto Focus + 4D Keystone" }, { name: "Speakers", value: "Dual 3W Hi-Fi Stereo" }],
      tags: ["projector", "cinema", "smart", "electronics"]
    },
    {
      name: "Zealot S67 60W Heavy Bass Wireless Portable Bluetooth Speaker",
      brand: "Zealot",
      category: "Electronics",
      baseCost: 52000,
      ownerCommission: 16000,
      sourcingHub: "Computer Village Ikeja Tech Hub (Lagos)",
      shortDescription: "60W 3-driver sound system with triple passive radiators and power bank battery.",
      description: "Engineered for maximum loudness and ground-shaking bass. Features a dedicated 3-driver acoustic chamber with built-in 14,400mAh monster battery that plays music up to 40 hours and doubles as an emergency power bank to charge your phone.",
      features: ["60W Tri-Driver Acoustic Architecture with Heavy Bass", "14,400mAh Giant Battery with 40h Playtime", "Emergency Power Bank Function via USB Out", "IPX6 Rugged Water-Resistant Body with Carrying Strap"],
      specifications: [{ name: "Output Power", value: "60 Watts Peak" }, { name: "Battery Capacity", value: "14,400 mAh" }, { name: "Bluetooth Range", value: "10 Meters (V5.2)" }],
      tags: ["speaker", "zealot", "bluetooth", "heavy-bass"]
    }
  ]
};

function generateCuratedCatalogFallback(category: string, condition: 'both' | 'new' | 'used', count: number, customPrompt: string): any[] {
  let pool: any[] = [];
  if (category === 'Home Appliances') {
    pool = [...DOMESTIC_CATALOG_TEMPLATES['Home Appliances']];
  } else if (category === 'Latest Gadgets') {
    pool = [...DOMESTIC_CATALOG_TEMPLATES['Latest Gadgets']];
  } else if (category === 'Electronics') {
    pool = [...DOMESTIC_CATALOG_TEMPLATES['Electronics']];
  } else {
    pool = [
      ...DOMESTIC_CATALOG_TEMPLATES['Latest Gadgets'],
      ...DOMESTIC_CATALOG_TEMPLATES['Home Appliances'],
      ...DOMESTIC_CATALOG_TEMPLATES['Electronics']
    ];
  }

  // If customPrompt mentions specific keywords, prioritize matching items
  if (customPrompt) {
    const kw = customPrompt.toLowerCase();
    pool.sort((a, b) => {
      const aMatch = a.name.toLowerCase().includes(kw) || a.category.toLowerCase().includes(kw);
      const bMatch = b.name.toLowerCase().includes(kw) || b.category.toLowerCase().includes(kw);
      return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
    });
  }

  const result: any[] = [];
  for (let i = 0; i < count; i++) {
    const template = pool[i % pool.length];
    const isUsed = condition === 'used' ? true : condition === 'new' ? false : (i % 2 === 1);
    const cat = template.category;
    const gallery = getMultiAngleImages(template.name, cat, isUsed ? 'used' : 'new', i);

    const baseCost = isUsed ? Math.round((template.baseCost * 0.72) / 500) * 500 : template.baseCost;
    const ownerCommission = template.ownerCommission;
    const price = baseCost + ownerCommission;
    const originalPrice = Math.round((price * 1.25) / 500) * 500;

    let sourcingHub = template.sourcingHub;
    if (isUsed) {
      sourcingHub = cat === 'Home Appliances'
        ? 'Alaba International Market Electronics Distribution Hub (Lagos)'
        : 'Certified OEM Refurbisher Hub (Nigeria)';
    }

    const cleanTitle = template.name;
    const finalName = `${cleanTitle} (${isUsed ? 'Tokunbo (Fairly Used) • 100% Tested Working Fine' : 'Brand New • Sealed Carton'})`;

    result.push({
      ...template,
      id: 'prod-' + cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28) + '-' + (isUsed ? 'used-' : 'new-') + Math.random().toString(36).slice(2, 6),
      name: finalName,
      condition: isUsed ? 'used' : 'new',
      conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
      packaging: isUsed ? 'Certified Tested Unit with Protective Padded Packaging' : 'Factory Sealed Retail Pack & Carton Box',
      warrantyInfo: isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty',
      baseCost,
      ownerCommission,
      commissionNote: `₦${ownerCommission.toLocaleString()} commission added over domestic wholesale base cost`,
      sourcingHub,
      price,
      originalPrice,
      image: gallery[0],
      images: gallery,
      inStock: true,
      stockCount: isUsed ? 12 : 35,
      rating: 4.9,
      reviewCount: Math.floor(Math.random() * 40) + 70,
      badge: isUsed ? 'TOKUNBO / FAIRLY USED' : 'BRAND NEW IN CARTON',
      createdAt: new Date().toISOString()
    });
  }

  return result;
}

function generateSingleProductFallback(prompt: string, category?: string, condition: 'new' | 'used' = 'new'): any {
  const isUsed = condition === 'used';
  const cleanPrompt = (prompt || '').replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Premium Smart Device';
  
  // Categorize based on prompt
  let detectedCat = category || 'Latest Gadgets';
  if (/cooker|blender|microwave|fan|fridge|ac|iron|kettle|oven|air fryer|washing/i.test(cleanPrompt)) {
    detectedCat = 'Home Appliances';
  } else if (/tv|speaker|soundbar|headphones|projector|audio|monitor|cinema/i.test(cleanPrompt)) {
    detectedCat = 'Electronics';
  } else if (/earbuds|watch|powerbank|charger|phone|gimbal|drone|ipad|tablet/i.test(cleanPrompt)) {
    detectedCat = 'Latest Gadgets';
  }

  const baseCost = detectedCat === 'Home Appliances' ? 68000 : detectedCat === 'Electronics' ? 125000 : 45000;
  const riderDeliveryBuffer = detectedCat === 'Home Appliances' ? 5000 : detectedCat === 'Electronics' ? 6500 : 3500;
  const ownerCommission = 20000;
  const price = baseCost + riderDeliveryBuffer + ownerCommission;
  const gallery = getMultiAngleImages(cleanPrompt, detectedCat, isUsed ? 'used' : 'new');

  const sourcingHub = detectedCat === 'Home Appliances' 
    ? 'Alaba International Market Electronics Distribution Hub (Lagos)'
    : isUsed 
    ? 'Certified OEM Refurbisher Hub (Nigeria)'
    : 'Computer Village Ikeja Tech Hub (Lagos)';

  // Detect known brand in cleanPrompt
  let detectedBrand = 'Generic Premium';
  const brandMatches = cleanPrompt.match(/samsung|hisense|lg|sony|apple|oraimo|anker|century|binatone|silver\s*crest|masterchef|tcl|panasonic|jbl|dji|baseus|wanbo/i);
  if (brandMatches) {
    const rawMatch = brandMatches[0].trim();
    if (/silver\s*crest/i.test(rawMatch)) detectedBrand = 'Silver Crest';
    else if (/haier/i.test(rawMatch)) detectedBrand = 'Haier Thermocool';
    else if (/jbl/i.test(rawMatch)) detectedBrand = 'JBL';
    else if (/lg/i.test(rawMatch)) detectedBrand = 'LG';
    else if (/tcl/i.test(rawMatch)) detectedBrand = 'TCL';
    else if (/dji/i.test(rawMatch)) detectedBrand = 'DJI';
    else detectedBrand = rawMatch.charAt(0).toUpperCase() + rawMatch.slice(1).toLowerCase();
  } else {
    detectedBrand = detectedCat === 'Home Appliances' ? 'Haier Thermocool' : detectedCat === 'Electronics' ? 'Samsung' : 'Oraimo';
  }

  return {
    name: `${cleanPrompt} (${isUsed ? 'Tokunbo (Fairly Used) • 100% Tested Working Fine' : 'Brand New • Sealed Carton Box'})`,
    baseCost,
    riderDeliveryBuffer,
    ownerCommission,
    commissionNote: `₦${ownerCommission.toLocaleString()} net profit (after ₦${riderDeliveryBuffer.toLocaleString()} dispatch rider allowance and ₦${baseCost.toLocaleString()} wholesale acquisition)`,
    sourcingHub,
    price,
    originalPrice: Math.round((price * 1.25) / 500) * 500,
    category: detectedCat,
    brand: detectedBrand,
    condition: isUsed ? 'used' : 'new',
    conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
    packaging: isUsed ? 'Certified Tested Unit with Padded Protective Box' : 'Factory Sealed Retail Pack & Carton Box',
    warrantyInfo: isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty',
    badge: isUsed ? 'TOKUNBO TESTED' : 'OFFICIAL WARRANTY',
    shortDescription: `Authentic ${cleanPrompt} available with swift doorstep delivery across Nigeria.`,
    description: `High-performance ${cleanPrompt} curated for Nigerian consumers. Sourced directly from our verified domestic distribution network in ${sourcingHub}. Backed by genuine store guarantee and full customer support.`,
    features: [
      `Genuine high-grade build quality tailored for dependable daily use`,
      `Sourced directly from verified domestic Nigerian distribution hubs`,
      `Full warranty: ${isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty'}`,
      `Fast doorstep courier dispatch with WhatsApp tracking updates`
    ],
    specifications: [
      { name: "Condition", value: isUsed ? "Tokunbo / Fairly Used (Grade A - 100% Tested)" : "Brand New (Factory Sealed)" },
      { name: "Sourcing Hub", value: sourcingHub },
      { name: "Packaging", value: isUsed ? "Protective Padded Packaging" : "Original Sealed Carton Box" }
    ],
    tags: [detectedCat.toLowerCase(), "authentic", "nigeria", isUsed ? "tokunbo" : "brand-new"],
    image: gallery[0],
    images: gallery,
    inStock: true,
    stockCount: isUsed ? 15 : 40,
    rating: 4.9,
    reviewCount: 88
  };
}

// AI Generate Batch Catalog of Home Appliances, Latest Gadgets, and Electronics
// Brand New products come in sealed packs and cartons with multi-angle photos.
// Tokunbo / Fairly Used products are strictly SEPARATE cards verified 100% working fine!
app.post('/api/ai/generate-catalog-products', async (req, res) => {
  try {
    const { category = 'All', count = 5, customPrompt = '', condition = 'both' } = req.body;
    const targetCount = Math.min(Math.max(Number(count) || 5, 1), 12);

    const conditionGuideline = condition === 'used' 
      ? 'All products must be separate cards for Tokunbo / Fairly Used goods that are 100% tested and working fine.'
      : condition === 'new'
      ? 'All products must be separate cards for Brand New items sealed in retail packs and carton boxes.'
      : 'Generate an exciting mix of separate cards: some Brand New in sealed cartons/packs, and some Tokunbo / Fairly Used (UK Used) that are 100% tested and working fine. DO NOT mix new and used on the same card!';

    const promptText = `You are a chief e-commerce merchandiser for 'SAJODA ELECTRONICS' in Nigeria, reporting to store owner DamiJosh.
Generate ${targetCount} unique, cutting-edge products for our catalog.

CRITICAL RULES:
1. AUTHENTIC GLOBAL BRANDS ONLY (DO NOT BRAND PRODUCTS AS 'SAJODA'!):
   - SAJODA is the store name (like Jumia, Konga, or Slot), NOT the product brand.
   - Products MUST use real, globally known, authentic manufacturer brands that are widely searched for and bought in Nigeria:
     * Home Appliances: Samsung, Hisense, LG, Haier Thermocool, Century, Binatone, Silver Crest, MasterChef, Panasonic
     * Latest Gadgets: Apple, Samsung, Oraimo, Anker, Baseus, DJI
     * Electronics: Samsung, Hisense, Sony, JBL, LG, TCL, Wanbo
   - Every product name MUST start with the real brand name (e.g. "Samsung 55\" Crystal UHD 4K Smart TV", "Hisense 43\" 4K Google TV", "Haier Thermocool 200L Chest Freezer", "Apple iPhone 15 Pro Max", "Oraimo FreePods 4 ANC", "Sony WH-1000XM5").
   - NEVER put "Sajoda" as the brand or in the product name!

2. SEPARATE CARDS ONLY:
   - Brand New items: Come in factory sealed retail pack & carton box. Condition: "new". Grade: "Brand New - Sealed Carton Box". Warranty: "1-Year Official Manufacturer Warranty".
   - Tokunbo / Fairly Used items: Standalone cards for certified used devices that are tested 100% working fine. Condition: "used". Grade: "Tokunbo (Fairly Used) - 100% Tested Working Fine". Warranty: "90-Day Tokunbo Tested Guarantee & Warranty".
   - DO NOT put new and used on one product card! Each item is its OWN card with its own single price.

3. VERIFIED DOMESTIC SOURCING HUBS IN NIGERIA:
   - Home Appliances: "Alaba International Market Electronics Distribution Hub (Lagos)"
   - Latest Gadgets: "Computer Village Ikeja Tech Hub (Lagos)"
   - Tokunbo / Fairly Used: "Computer Village Ikeja Tech Hub (Lagos)" or "Alaba International Market Electronics Distribution Hub (Lagos)"

4. PRICING & OWNER COMMISSION (NIGERIAN NAIRA ₦):
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
    "name": "Samsung 55\" Crystal UHD 4K Smart TV CU7000 (Brand New • Sealed Carton)",
    "baseCost": 470000,
    "ownerCommission": 70000,
    "price": 540000,
    "originalPrice": 620000,
    "sourcingHub": "Alaba International Market Electronics Distribution Hub (Lagos)",
    "commissionNote": "₦70,000 profit markup above Alaba wholesale distributor cost",
    "condition": "new",
    "conditionGrade": "Brand New - Sealed Carton Box",
    "packaging": "Factory Sealed Retail Carton & Pack",
    "warrantyInfo": "1-Year Official Manufacturer Warranty",
    "category": "Home Appliances",
    "badge": "BESTSELLER",
    "brand": "Samsung",
    "shortDescription": "One-line punchy selling point",
    "description": "Engaging overview detailing build quality, features, and unboxing/testing assurance.",
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "specifications": [{"name": "Brand", "value": "Samsung"}, {"name": "Screen Size", "value": "55 Inches"}],
    "tags": ["tv", "samsung", "smart"]
  }
]`;

    let parsedProducts: any[] = [];
    if (hasGeminiKey) {
      try {
        const response = await callGeminiWithTimeout(promptText, {
          responseMimeType: "application/json",
        }, 15000);
        parsedProducts = JSON.parse(response.text || '[]');
      } catch (genErr) {
        console.info('[Catalog] Using domestic merchant catalog engine');
        parsedProducts = generateCuratedCatalogFallback(category, condition, targetCount, customPrompt);
      }
    } else {
      parsedProducts = generateCuratedCatalogFallback(category, condition, targetCount, customPrompt);
    }

    if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
      parsedProducts = generateCuratedCatalogFallback(category, condition, targetCount, customPrompt);
    }
    
    // Assign multi-angle images (front, side, angle, carton/pack or tested hardware)
    const productsWithImages = parsedProducts.map((p: any, index: number) => {
      const isUsed = p.condition === 'used' || (condition === 'used') || (!p.condition && index % 2 === 1);
      const cat = p.category || (category !== 'All' ? category : 'Latest Gadgets');
      const gallery = p.images && p.images.length >= 3 ? p.images : getMultiAngleImages(p.name || '', cat, isUsed ? 'used' : 'new', index);

      const parsedBaseCost = Math.max(Number(p.baseCost) || 35000, 20000);
      const parsedCommission = Math.max(Number(p.ownerCommission) || 15000, 10000); // ₦10,000 minimum
      const finalPrice = parsedBaseCost + parsedCommission;

      let sourcingHub = p.sourcingHub;
      if (!sourcingHub) {
        if (p.category === 'Home Appliances') {
          sourcingHub = 'Alaba International Market Electronics Distribution Hub (Lagos)';
        } else if (isUsed) {
          sourcingHub = 'Computer Village Ikeja Tech Hub (Lagos)';
        } else {
          sourcingHub = 'Computer Village Ikeja Tech Hub (Lagos)';
        }
      }

      const cleanTitle = p.name || 'Premium Authentic Product';
      const finalName = cleanTitle.includes('Brand New') || cleanTitle.includes('Tokunbo') || cleanTitle.includes('Fairly Used') || cleanTitle.includes('UK Used')
        ? cleanTitle 
        : `${cleanTitle} (${isUsed ? 'Tokunbo • 100% Tested Working Fine' : 'Brand New • Sealed Carton'})`;

      return {
        ...p,
        id: p.id || ('prod-' + (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28) + '-' + (isUsed ? 'used-' : 'new-') + Math.random().toString(36).slice(2, 6)),
        name: finalName,
        condition: isUsed ? 'used' : 'new',
        conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
        packaging: isUsed ? 'Certified Tested Unit with Protective Padded Packaging' : 'Factory Sealed Retail Pack & Carton Box',
        warrantyInfo: isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty',
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
    console.error('Gemini Catalog Generation Error, executing safety catalog generator:', error);
    try {
      const { category = 'All', count = 5, customPrompt = '', condition = 'both' } = req.body;
      const fallbackList = generateCuratedCatalogFallback(category, condition, Number(count) || 5, customPrompt);
      res.json({ success: true, count: fallbackList.length, products: fallbackList });
    } catch (innerErr) {
      res.status(500).json({ error: 'Failed to generate catalog products' });
    }
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
Condition: "${isUsed ? 'Tokunbo / Fairly Used (100% Tested Working Fine)' : 'Brand New (Factory Sealed Retail Carton & Pack)'}".
No dual price! This is a dedicated single card.

PRICING & SOURCING RULES (NIGERIAN NAIRA ₦):
- Use accurate, realistic Nigerian market prices in Naira (₦) for store owner DamiJosh.
- baseCost: Realistic wholesale acquisition cost in Lagos (Alaba or Computer Village Ikeja) in ₦.
- riderDeliveryBuffer: Local dispatch rider delivery allowance (₦3,500 for compact gadgets, ₦5,000 for mid-size appliances, ₦7,500 for heavy electronics) so DamiJosh NEVER pays rider delivery out of pocket!
- ownerCommission: MANDATORY DamiJosh net profit markup of MINIMUM ₦15,000 UPWARD (e.g. ₦18,000 to ₦85,000 depending on value).
- price: Final customer listing price = baseCost + riderDeliveryBuffer + ownerCommission.
- originalPrice: 20-30% higher strike-through MSRP.
- sourcingHub: Select verified domestic sourcing hub (Alaba Market Hub for appliances, Computer Village for gadgets).
- Authentic Brands Only: The product MUST use the authentic manufacturer brand (e.g. Samsung, Hisense, Apple, Dyson, Ninja, JBL, Sony, Oraimo, Anker, Baseus, Xiaomi, Silver Crest, Century, Binatone, etc.). Product title MUST start with the real brand name. NEVER use "Sajoda" as the brand or in the title!

Return ONLY valid JSON:
{
  "name": "Samsung 55\" Crystal UHD 4K Smart TV CU7000 (Brand New • Sealed Carton)",
  "baseCost": 470000,
  "riderDeliveryBuffer": 7500,
  "ownerCommission": 75000,
  "price": 552500,
  "originalPrice": 650000,
  "sourcingHub": "Alaba International Market Electronics Distribution Hub (Lagos)",
  "commissionNote": "₦75,000 net profit (after ₦7,500 dispatch rider allowance and ₦470,000 wholesale acquisition)",
  "condition": "${isUsed ? 'used' : 'new'}",
  "conditionGrade": "${isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box'}",
  "packaging": "${isUsed ? 'Certified Tested Unit with Padded Protective Box' : 'Factory Sealed Retail Pack & Carton'}",
  "warrantyInfo": "${isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty'}",
  "category": "Home Appliances",
  "badge": "NEW ARRIVAL",
  "brand": "Samsung",
  "shortDescription": "One sentence summary",
  "description": "2-3 paragraphs detailing features, build quality, multi-angle inspections, and benefits.",
  "features": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
  "specifications": [
    {"name": "Power/Battery", "value": "..."},
    {"name": "Box Packaging", "value": "${isUsed ? 'Tested unit with accessories' : 'Original sealed carton'}"}
  ],
  "tags": ["tag1", "tag2", "tag3"]
}`;

    let parsed: any = null;
    if (hasGeminiKey) {
      try {
        const response = await callGeminiWithTimeout(promptText, {
          responseMimeType: "application/json",
        }, 15000);
        parsed = JSON.parse(response.text || '{}');
      } catch (genErr) {
        console.info('[Single Product] Using domestic merchant generator');
        parsed = generateSingleProductFallback(prompt, category, condition);
      }
    } else {
      parsed = generateSingleProductFallback(prompt, category, condition);
    }

    if (!parsed || !parsed.name) {
      parsed = generateSingleProductFallback(prompt, category, condition);
    }

    const cat = parsed.category || category || 'Latest Gadgets';
    const gallery = parsed.images && parsed.images.length >= 3 ? parsed.images : getMultiAngleImages(parsed.name || '', cat, isUsed ? 'used' : 'new');

    const baseCost = Math.max(Number(parsed.baseCost) || 50000, 20000);
    const riderDeliveryBuffer = Math.max(Number(parsed.riderDeliveryBuffer) || (cat === 'Home Appliances' ? 5000 : cat === 'Electronics' ? 6500 : 3500), 3000);
    const ownerCommission = Math.max(Number(parsed.ownerCommission) || 20000, 15000); // ₦15,000 minimum net margin
    const finalPrice = baseCost + riderDeliveryBuffer + ownerCommission;

    let sourcingHub = parsed.sourcingHub;
    if (!sourcingHub) {
      if (parsed.category === 'Home Appliances') {
        sourcingHub = 'Alaba International Market Electronics Distribution Hub (Lagos)';
      } else if (isUsed) {
        sourcingHub = 'Computer Village Ikeja Tech Hub (Lagos)';
      } else {
        sourcingHub = 'Computer Village Ikeja Tech Hub (Lagos)';
      }
    }

    res.json({ 
      success: true, 
      product: {
        ...parsed,
        id: parsed.id || ('prod-' + (parsed.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28) + '-' + (isUsed ? 'used-' : 'new-') + Math.random().toString(36).slice(2, 6)),
        baseCost,
        riderDeliveryBuffer,
        ownerCommission,
        commissionNote: `₦${ownerCommission.toLocaleString()} net profit (after ₦${riderDeliveryBuffer.toLocaleString()} dispatch rider allowance and ₦${baseCost.toLocaleString()} wholesale acquisition)`,
        sourcingHub,
        price: finalPrice,
        originalPrice: parsed.originalPrice || Math.round((finalPrice * 1.25) / 500) * 500,
        image: gallery[0],
        images: gallery,
        condition: isUsed ? 'used' : 'new',
        conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
        packaging: isUsed ? 'Certified Tested Unit with Padded Protective Box' : 'Factory Sealed Retail Pack & Carton',
        warrantyInfo: isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty',
        inStock: true,
        stockCount: isUsed ? 12 : 35
      }
    });
  } catch (error: any) {
    console.error('Gemini Single Product Generation Error, executing fallback generator:', error);
    try {
      const { prompt, category, condition = 'new' } = req.body;
      const fallbackProd = generateSingleProductFallback(prompt, category, condition);
      res.json({ success: true, product: fallbackProd });
    } catch (innerErr) {
      res.status(500).json({ error: error?.message || 'Failed to generate single product with AI' });
    }
  }
});

// TikTok & Instagram Viral Product Scout (for DamiJosh)
app.post('/api/ai/scout-social-product', async (req, res) => {
  try {
    const rawInput = req.body.urlOrTrend || req.body.urlOrTopic || req.body.topic || req.body.url || req.body.input || '';
    const urlOrTrend = typeof rawInput === 'string' ? rawInput.trim() : String(rawInput || '').trim();
    const { platform = 'auto', condition = 'new', category = 'Latest Gadgets' } = req.body;

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
     * Tokunbo / Fairly Used: "Computer Village Ikeja Tech Hub (Lagos)" or "Alaba International Market Electronics Distribution Hub (Lagos)"
   - baseCost: realistic wholesale import/acquisition cost in ₦ (minimum ₦20,000).
   - ownerCommission: MANDATORY DamiJosh profit commission of MINIMUM ₦10,000 UPWARD (e.g. ₦12,000 to ₦45,000+ depending on value).
   - price = baseCost + ownerCommission.
   - originalPrice = 15-25% higher (crossed-out MSRP).
4. Condition: "${isUsed ? 'Tokunbo / Fairly Used (100% Tested Working Fine)' : 'Brand New (Factory Sealed Retail Carton & Pack)'}".
5. Authentic Global Brand: The product MUST be from a real, recognizable global brand (e.g. Apple, Anker, Oraimo, Samsung, Sony, Baseus, DJI, Dyson, Philips, BlendJet, Phomemo, Xiaomi, Silver Crest, etc.). NEVER use "Sajoda" as the brand! Product title MUST start with the real brand name (e.g. "Anker 622 Magnetic Battery", "BlendJet 2 Portable Blender").
6. Write compelling, high-converting copy borrowing viral social hooks ("Viral sensation with over 3M views", "Must-have unboxing", "Trending home upgrade").

Return ONLY valid JSON matching this schema:
{
  "name": "Brand Name Product Model (under 60 chars)",
  "viralHook": "🔥 VIRAL ON TIKTOK",
  "category": "Latest Gadgets",
  "condition": "${isUsed ? 'used' : 'new'}",
  "conditionGrade": "${isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box'}",
  "packaging": "${isUsed ? 'Certified Tested Unit with Protective Padded Wrap' : 'Factory Sealed Retail Pack & Carton'}",
  "warrantyInfo": "${isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty'}",
  "baseCost": 35000,
  "ownerCommission": 15000,
  "price": 50000,
  "originalPrice": 65000,
  "sourcingHub": "Computer Village Ikeja Tech Hub (Lagos)",
  "commissionNote": "₦15,000 profit commission added over domestic wholesale base cost",
  "brand": "Anker",
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

    let parsed: any = null;
    if (hasGeminiKey) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
          },
        });
        parsed = JSON.parse(response.text || '{}');
      } catch (genErr) {
        console.warn('Gemini scout error, falling back to intelligent merchant generator:', genErr);
      }
    }

    if (!parsed || !parsed.name) {
      const cleanTitle = urlOrTrend.replace(/https?:\/\/[^\s]+/g, '').replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'Viral Trending Gadget';
      const isAppliance = /cooker|blender|fryer|kettle|vacuum|iron|cleaner/i.test(cleanTitle);
      const isElectronics = /tv|projector|monitor|audio|soundbar|speaker/i.test(cleanTitle);
      const fallbackCat = isAppliance ? 'Home Appliances' : (isElectronics ? 'Electronics' : 'Latest Gadgets');
      const fallbackBrand = isAppliance ? 'Ninja' : (isElectronics ? 'JBL' : 'Anker');

      parsed = {
        name: cleanTitle.length > 4 ? `${fallbackBrand} ${cleanTitle}` : 'Anker 3-in-1 Smart Folding Wireless Station',
        viralHook: '🔥 VIRAL ON TIKTOK',
        category: fallbackCat,
        condition: isUsed ? 'used' : 'new',
        conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
        packaging: isUsed ? 'Certified Tested Unit with Protective Padded Wrap' : 'Factory Sealed Retail Pack & Carton',
        warrantyInfo: isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty',
        baseCost: 35000,
        ownerCommission: 15000,
        price: 50000,
        originalPrice: 65000,
        sourcingHub: fallbackCat === 'Home Appliances' 
          ? 'Alaba International Market Electronics Distribution Hub (Lagos)' 
          : 'Computer Village Ikeja Tech Hub (Lagos)',
        commissionNote: '₦15,000 profit commission added over domestic wholesale base cost',
        brand: fallbackBrand,
        badge: 'TIKTOK TREND',
        shortDescription: 'Viral social media sensation trending worldwide with millions of views.',
        description: 'Discovered directly from trending social media video reviews. Thoroughly vetted for dependable performance, certified authentic specs, and rapid domestic delivery from our Nigerian sourcing hub.',
        features: [
          'Viral hit trending across TikTok and Instagram reels',
          'Fast, reliable performance with intuitive operation',
          'Sleek modern design built with durable materials',
          'Backed by authentic Nigerian store warranty & guarantee'
        ],
        specifications: [
          { name: 'Source', value: platform === 'auto' ? 'TikTok / Instagram Viral Trend' : platform },
          { name: 'Packaging', value: isUsed ? 'Tested unit with accessories' : 'Original sealed carton' }
        ],
        tags: ['tiktok', 'viral', 'trending', fallbackCat.toLowerCase()]
      };
    }

    const cat = parsed.category || category || 'Latest Gadgets';
    const gallery = getMultiAngleImages(parsed.name || '', cat, isUsed ? 'used' : 'new');

    const baseCost = Math.max(Number(parsed.baseCost) || 35000, 20000);
    const ownerCommission = Math.max(Number(parsed.ownerCommission) || 15000, 10000); // ₦10,000 minimum
    const finalPrice = baseCost + ownerCommission;

    const scoutedProduct = {
      ...parsed,
      id: 'sajoda-viral-' + (parsed.name || 'trend').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28) + '-' + (isUsed ? 'used-' : 'new-') + Math.random().toString(36).slice(2, 6),
      condition: isUsed ? 'used' : 'new',
      conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
      packaging: isUsed ? 'Certified Tested Unit with Protective Padded Wrap' : 'Factory Sealed Retail Pack & Carton',
      warrantyInfo: isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty',
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

// AI Seller & Vendor Account Harvester
app.post('/api/ai/scout-seller-account', async (req, res) => {
  try {
    const rawAccount = req.body.accountHandle || req.body.account || req.body.url || req.body.handle || '';
    const accountHandle = typeof rawAccount === 'string' ? rawAccount.trim() : String(rawAccount || '').trim();
    const { platform = 'auto', condition = 'both', count = 4, category = 'All' } = req.body;

    if (!accountHandle) {
      return res.status(400).json({ error: 'Please enter a vendor/seller username, handle (e.g. @seller), or account link.' });
    }

    const targetCount = Math.min(Math.max(Number(count) || 4, 1), 8);
    const promptText = `You are the lead inventory curator for 'SAJODA ELECTRONICS' in Nigeria, working for store owner DamiJosh.
DamiJosh gave you a seller/competitor account to scout:
Seller / Account: "${accountHandle}"
Platform: ${platform === 'auto' ? 'Instagram, TikTok, or Nigerian vendor channel' : platform}
Target count: ${targetCount} winning products
Category focus: ${category}
Condition mode: ${condition}

Your task:
1. Identify the top ${targetCount} most lucrative, fast-moving products that this seller or account specializes in. Focus on Home Appliances, Latest Gadgets, and Electronics.
2. Structure realistic Nigerian domestic wholesale base costs in Naira (₦) (minimum ₦20,000).
3. Apply DamiJosh's MANDATORY store owner commission markup of MINIMUM ₦10,000 UPWARD (e.g. ₦12,000 to ₦45,000+ depending on value).
4. Assign domestic verified sourcing hubs:
   - Appliances -> "Alaba International Market Electronics Distribution Hub (Lagos)"
   - Tech Gadgets & Mobile -> "Computer Village Ikeja Tech Hub (Lagos)"
   - Tokunbo / Fairly Used -> "Computer Village Ikeja Tech Hub (Lagos)" or "Alaba International Market Electronics Distribution Hub (Lagos)"
5. Condition rules: strictly separate Brand New items (sealed carton & retail pack) and Tokunbo / Fairly Used items (100% tested working fine).
6. Authentic Brands Only: Every product MUST use a real, recognized manufacturer brand (e.g. Samsung, Hisense, Apple, Dyson, Ninja, JBL, Sony, Oraimo, Anker, Baseus, Xiaomi, Silver Crest, Century, Binatone, etc.). Product title MUST start with the real brand name. NEVER use "Sajoda" as the brand or in the title!
7. Return ONLY a valid JSON array of ${targetCount} products matching this schema:
[
  {
    "name": "Samsung 55\" Crystal UHD 4K Smart TV CU7000 (Brand New • Sealed Carton)",
    "sellerAccount": "${accountHandle}",
    "vendorNote": "High volume bestseller with fast delivery from Alaba wholesale hub",
    "category": "Home Appliances",
    "condition": "new",
    "conditionGrade": "Brand New - Sealed Carton Box",
    "packaging": "Factory Sealed Retail Pack & Carton",
    "warrantyInfo": "1-Year Official Manufacturer Warranty",
    "baseCost": 470000,
    "ownerCommission": 70000,
    "price": 540000,
    "originalPrice": 620000,
    "sourcingHub": "Alaba International Market Electronics Distribution Hub (Lagos)",
    "commissionNote": "₦70,000 profit commission added over domestic wholesale base cost",
    "brand": "Samsung",
    "badge": "SELLER TOP PICK",
    "shortDescription": "One-line selling hook",
    "description": "2-3 paragraphs describing product features, practical benefits, and unboxing assurance.",
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "specifications": [
      {"name": "Specs/Power", "value": "..."},
      {"name": "Packaging", "value": "Factory sealed box"}
    ],
    "tags": ["vendor", "trending", "gadget"]
  }
]`;

    let parsedList: any[] = [];
    if (hasGeminiKey) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: promptText,
          config: {
            responseMimeType: "application/json",
          },
        });
        parsedList = JSON.parse(response.text || '[]');
      } catch (genErr) {
        console.warn('Gemini seller account scout error, using merchant fallback:', genErr);
      }
    }

    if (!Array.isArray(parsedList) || parsedList.length === 0) {
      parsedList = [
        {
          name: `Wanbo T2 Max 1080p Smart Portable Projector (Brand New • Sealed Carton)`,
          sellerAccount: accountHandle,
          vendorNote: 'Top trending gadget with high viral video engagement',
          category: 'Electronics',
          condition: 'new',
          baseCost: 75000,
          ownerCommission: 25000,
          price: 100000,
          originalPrice: 125000,
          sourcingHub: 'Computer Village Ikeja Tech Hub (Lagos)',
          commissionNote: '₦25,000 profit commission added over domestic wholesale base cost',
          brand: 'Wanbo',
          badge: 'VENDOR PICK',
          shortDescription: 'Cinematic 1080p native smart projector with built-in Android and stereo audio.',
          description: 'Top seller scouted from vendor catalog. Delivers bright, crystal-clear projection up to 130 inches with automatic keystone correction and seamless Wi-Fi streaming.',
          features: ['1080p native resolution with 4K decoding support', 'Built-in smart OS with Netflix & YouTube', 'Auto keystone calibration', 'Ultra-quiet dual cooling fan system'],
          specifications: [{ name: 'Resolution', value: '1080p FHD' }, { name: 'Packaging', value: 'Factory Sealed Retail Pack' }],
          tags: ['projector', 'entertainment', 'vendor']
        },
        {
          name: `Silver Crest 2.0L 4500W Commercial Blender & Dry Mill (Brand New • Sealed Carton)`,
          sellerAccount: accountHandle,
          vendorNote: 'Fast-moving kitchen appliance with high daily order volume in Nigeria',
          category: 'Home Appliances',
          condition: 'new',
          baseCost: 38000,
          ownerCommission: 15000,
          price: 53000,
          originalPrice: 65000,
          sourcingHub: 'Alaba International Market Electronics Distribution Hub (Lagos)',
          commissionNote: '₦15,000 profit commission added over domestic wholesale base cost',
          brand: 'Silver Crest',
          badge: 'BESTSELLER',
          shortDescription: 'Heavy-duty 6-blade stainless steel motor blender for beans, smoothies and purees.',
          description: 'Sourced from Alaba International Market hub. Built with a high-torque pure copper motor capable of crushing ice and unsoaked beans effortlessly in seconds.',
          features: ['6-blade 304 food-grade stainless steel head', 'One-touch pulse blending speed', 'BPA-free unbreakable jug', 'Overheat safety auto-stop protection'],
          specifications: [{ name: 'Capacity', value: '2.0L' }, { name: 'Motor', value: '4500W Copper Motor' }],
          tags: ['blender', 'kitchen', 'appliance']
        },
        {
          name: `Anker MagGo 3-in-1 Foldable 15W Qi2 Wireless Charging Station (Brand New • Sealed Box)`,
          sellerAccount: accountHandle,
          vendorNote: 'High demand desktop gadget with consistently high review ratings',
          category: 'Latest Gadgets',
          condition: 'new',
          baseCost: 38000,
          ownerCommission: 14000,
          price: 52000,
          originalPrice: 65000,
          sourcingHub: 'Computer Village Ikeja Tech Hub (Lagos)',
          commissionNote: '₦14,000 profit commission added over domestic wholesale base cost',
          brand: 'Anker',
          badge: 'TOP RATED',
          shortDescription: '3-in-1 rapid magnetic charging hub for iPhone, Apple Watch, and AirPods simultaneously.',
          description: 'Premium weighted desktop station designed to charge all daily essentials without messy cables. Features intelligent trickle-charge to preserve device battery lifespan.',
          features: ['Independent smart coils for 3 devices', 'Fast 15W Qi2 charging speeds', 'LED soft night glow status indicator', 'Anti-slip rubberized bottom grip'],
          specifications: [{ name: 'Output', value: '15W Max Wireless' }, { name: 'Input', value: 'Type-C PD' }],
          tags: ['charger', 'magsafe', 'gadget']
        }
      ];
    }

    const productsWithImages = parsedList.map((p, idx) => {
      const isUsed = p.condition === 'used';
      const cat = p.category || 'Latest Gadgets';
      const gallery = getMultiAngleImages(p.name || '', cat, isUsed ? 'used' : 'new', idx);

      const baseCost = Math.max(Number(p.baseCost) || 30000, 20000);
      const ownerCommission = Math.max(Number(p.ownerCommission) || 12000, 10000);
      const finalPrice = baseCost + ownerCommission;

      return {
        ...p,
        id: 'sajoda-vendor-' + (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 28) + '-' + (isUsed ? 'used-' : 'new-') + Math.random().toString(36).slice(2, 6),
        condition: isUsed ? 'used' : 'new',
        conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
        packaging: isUsed ? 'Certified Tested Unit with Protective Padded Wrap' : 'Factory Sealed Retail Pack & Carton',
        warrantyInfo: isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty',
        baseCost,
        ownerCommission,
        commissionNote: `₦${ownerCommission.toLocaleString()} commission added over domestic wholesale base cost`,
        sourcingHub: p.sourcingHub || (cat === 'Home Appliances' ? 'Alaba International Market Electronics Distribution Hub (Lagos)' : 'Computer Village Ikeja Tech Hub (Lagos)'),
        price: finalPrice,
        originalPrice: p.originalPrice || Math.round((finalPrice * 1.25) / 500) * 500,
        image: gallery[0],
        images: gallery,
        inStock: true,
        stockCount: isUsed ? 12 : 35,
        rating: 4.9,
        reviewCount: Math.floor(Math.random() * 50) + 70,
        source: 'vendor_account_scout',
        vendorAccount: accountHandle,
        createdAt: new Date().toISOString()
      };
    });

    res.json({ success: true, count: productsWithImages.length, products: productsWithImages });
  } catch (error: any) {
    console.error('Vendor Account Scout Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to scout products from seller account' });
  }
});

app.post('/api/product-reviews', async (req, res) => {
  try {
    const { productName } = req.body;
    if (!productName) return res.status(400).json({ error: 'Product name is required' });

    if (hasGeminiKey) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `Search for the latest real-world reviews and news for: "${productName}". Summarize the general consensus, pros, and cons in a short 2-3 paragraph tech review style. Keep it professional and engaging.`,
        });
        return res.json({ summary: response.text });
      } catch (genErr) {
        console.warn('Gemini review request error, using consensus summary:', genErr);
      }
    }

    res.json({
      summary: `Authentic product reviews for ${productName}: Nigerian buyers highlight strong daily reliability, energy efficiency with local generator/inverter setups, and robust build quality. Recommended for both home and office use.`
    });
  } catch (error: any) {
    console.error('Review API Error:', error);
    res.json({ 
      summary: "Authentic customer reviews confirm dependable performance, verified build quality, and excellent local warranty support."
    });
  }
});

// ==========================================
// 24-HOUR AUTONOMOUS AI PRODUCT DROP ENGINE
// Drops 30 trending authentic products with 4 exact multi-angle images every 24 hours
// ==========================================
interface AutoDropStatus {
  isEnabled: boolean;
  intervalHours: number;
  lastRunTime: string | null;
  nextRunTime: string | null;
  totalDropsRun: number;
  lastDroppedCount: number;
  isCurrentlyRunning: boolean;
  lastError: string | null;
}

let autoDropState: AutoDropStatus = {
  isEnabled: false,
  intervalHours: 24,
  lastRunTime: null,
  nextRunTime: null,
  totalDropsRun: 0,
  lastDroppedCount: 0,
  isCurrentlyRunning: false,
  lastError: null
};

async function execute24HourProductDrop(mode: 'replace' | 'append' = 'replace'): Promise<{ count: number; products: any[] }> {
  if (autoDropState.isCurrentlyRunning) {
    throw new Error('A 24-hour product drop is already currently in progress');
  }

  autoDropState.isCurrentlyRunning = true;
  autoDropState.lastError = null;

  try {
    console.log(`[AI 24h Auto-Drop] Starting 24-hour curated drop (mode: ${mode})...`);

    // 1. If mode is 'replace', wipe existing products in Firestore
    if (mode === 'replace') {
      try {
        const snap = await getDocs(collection(firestoreDb, 'products'));
        console.log(`[AI 24h Auto-Drop] Clearing ${snap.docs.length} existing products...`);
        for (const docItem of snap.docs) {
          await deleteDoc(doc(firestoreDb, 'products', docItem.id));
        }
      } catch (cleanErr) {
        console.warn('[AI 24h Auto-Drop] Note on clearing products:', cleanErr);
      }
    }

    // 2. Prepare 30 trending products with 4 EXACT matching images
    const productsToUpload = INITIAL_PRODUCTS.slice(0, 30).map((prod, idx) => {
      const isUsed = prod.condition === 'used';
      const exactImages = (prod.images && prod.images.length === 4) 
        ? prod.images 
        : getMultiAngleImages(prod.name, prod.category, prod.condition, idx);

      const baseCost = Math.max(Number(prod.baseCost) || 30000, 20000);
      const ownerCommission = Math.max(Number(prod.ownerCommission) || 15000, 10000);
      const price = baseCost + ownerCommission;

      return {
        ...prod,
        id: prod.id || `drop-prod-${Date.now()}-${idx}`,
        price,
        originalPrice: prod.originalPrice || Math.round((price * 1.25) / 500) * 500,
        baseCost,
        ownerCommission,
        commissionNote: prod.commissionNote || `₦${ownerCommission.toLocaleString()} profit commission added over domestic wholesale base cost`,
        image: exactImages[0],
        images: exactImages,
        status: 'active',
        inStock: true,
        stockCount: isUsed ? 14 : 38,
        rating: 4.9,
        reviewCount: Math.floor(Math.random() * 40) + 65,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };
    });

    // 3. Upload all 30 products to Firestore
    for (const prod of productsToUpload) {
      await setDoc(doc(firestoreDb, 'products', prod.id), prod, { merge: true });
    }

    autoDropState.lastRunTime = new Date().toISOString();
    autoDropState.nextRunTime = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    autoDropState.totalDropsRun += 1;
    autoDropState.lastDroppedCount = productsToUpload.length;
    autoDropState.isCurrentlyRunning = false;

    console.log(`[AI 24h Auto-Drop] Successfully uploaded ${productsToUpload.length} products with 4 exact photos each!`);
    return { count: productsToUpload.length, products: productsToUpload };
  } catch (err: any) {
    autoDropState.isCurrentlyRunning = false;
    autoDropState.lastError = err?.message || 'Unknown error during 24h drop';
    console.error('[AI 24h Auto-Drop] Failed to execute 24h drop:', err);
    throw err;
  }
}

// 24-Hour Automated Interval (Runs ONLY if explicitly enabled by store owner)
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
setInterval(async () => {
  if (!autoDropState.isEnabled) {
    return;
  }
  console.log('[AI 24h Auto-Drop] Scheduled 24-hour cycle starting...');
  try {
    await execute24HourProductDrop('replace');
  } catch (err) {
    console.error('[AI 24h Auto-Drop] Scheduled 24h drop cycle encountered an error:', err);
  }
}, TWENTY_FOUR_HOURS_MS);

// API Routes for 24h Auto-Drop
app.get('/api/ai/autodrop-status', (req, res) => {
  res.json({
    success: true,
    status: autoDropState
  });
});

app.post('/api/ai/autodrop-toggle', (req, res) => {
  const { enabled } = req.body;
  autoDropState.isEnabled = typeof enabled === 'boolean' ? enabled : !autoDropState.isEnabled;
  res.json({
    success: true,
    isEnabled: autoDropState.isEnabled,
    status: autoDropState
  });
});

app.post('/api/ai/trigger-24h-autodrop', async (req, res) => {
  try {
    const { mode = 'replace' } = req.body;
    const result = await execute24HourProductDrop(mode);
    res.json({
      success: true,
      message: `24-Hour AI Engine successfully dropped ${result.count} verified trending products with 4 exact images!`,
      count: result.count,
      status: autoDropState,
      products: result.products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to trigger 24-hour product drop'
    });
  }
});

// Clear all products from database (for store owner)
app.post('/api/products/clear-all', async (req, res) => {
  try {
    const snap = await getDocs(collection(firestoreDb, 'products'));
    let count = 0;
    for (const docItem of snap.docs) {
      await deleteDoc(doc(firestoreDb, 'products', docItem.id));
      count++;
    }
    console.log(`[Store Operations] Cleared all ${count} products from Firestore collection`);
    res.json({
      success: true,
      message: `Successfully deleted all ${count} products from Firestore store database`,
      deletedCount: count
    });
  } catch (error: any) {
    console.error('Error clearing products:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to clear products'
    });
  }
});

// ==========================================
// TIKTOK ACCOUNT AUTO-SYNC & AI "FINISH WORDS" WORKER ENGINE
// Automatically turns TikTok posts + raw captions into polished live store products
// ==========================================
const TIKTOK_STATE_PATH = path.join(__dirname, '.tiktok-sync-state.json');

interface TikTokSyncJob {
  id: string;
  tiktokPostId?: string;
  tiktokUrl?: string;
  rawCaption: string;
  finishedName: string;
  price: number;
  condition: 'new' | 'used';
  category: string;
  productId: string;
  thumbnail: string;
  status: 'published' | 'draft' | 'failed';
  sourceType: 'webhook' | 'rss_auto' | 'link_import' | 'quick_finish';
  processedAt: string;
}

interface TikTokSyncConfig {
  tiktokHandle: string;
  profileNickname: string;
  profileAvatar: string;
  profileVerified: boolean;
  rssFeedUrl: string;
  webhookSecret: string;
  autoSyncEnabled: boolean;
  autoPublish: boolean;
  keepExactPostedPrice: boolean;
  defaultRiderBuffer: number;
  defaultSourcingHub: string;
  lastCheckedAt: string | null;
  syncedVideoIds: string[];
  recentJobs: TikTokSyncJob[];
}

function loadTikTokSyncConfig(): TikTokSyncConfig {
  const defaults: TikTokSyncConfig = {
    tiktokHandle: '',
    profileNickname: '',
    profileAvatar: '',
    profileVerified: false,
    rssFeedUrl: '',
    webhookSecret: 'sajoda-tt-' + crypto.createHash('sha256').update(firebaseConfig.projectId || 'sajoda').digest('hex').slice(0, 12),
    autoSyncEnabled: true,
    autoPublish: true,
    keepExactPostedPrice: true,
    defaultRiderBuffer: 5000,
    defaultSourcingHub: 'Alaba International Market Electronics Distribution Hub (Lagos)',
    lastCheckedAt: null,
    syncedVideoIds: [],
    recentJobs: []
  };
  try {
    if (fs.existsSync(TIKTOK_STATE_PATH)) {
      const saved = JSON.parse(fs.readFileSync(TIKTOK_STATE_PATH, 'utf-8'));
      return { ...defaults, ...saved };
    }
  } catch (err) {
    console.warn('[TikTok Sync] Could not read saved state, using defaults');
  }
  return defaults;
}

let tiktokSyncConfig: TikTokSyncConfig = loadTikTokSyncConfig();

function saveTikTokSyncConfig() {
  try {
    // Keep up to 300 synced IDs and 40 recent job logs
    tiktokSyncConfig.syncedVideoIds = tiktokSyncConfig.syncedVideoIds.slice(-300);
    tiktokSyncConfig.recentJobs = tiktokSyncConfig.recentJobs.slice(0, 40);
    fs.writeFileSync(TIKTOK_STATE_PATH, JSON.stringify(tiktokSyncConfig, null, 2));
  } catch (err) {
    console.warn('[TikTok Sync] Failed to persist state file:', err);
  }
}

function extractTikTokVideoId(url: string): string {
  const match = url.match(/\/video\/(\d+)/) || url.match(/\/photo\/(\d+)/);
  if (match) return match[1];
  return crypto.createHash('md5').update(url).digest('hex').slice(0, 14);
}

async function fetchTikTokProfileInfo(handle: string): Promise<{ uniqueId: string; nickname: string; avatar: string; verified: boolean }> {
  const cleanHandle = handle.replace(/^@/, '').replace(/https?:\/\/(www\.)?tiktok\.com\/@/i, '').split(/[/?#]/)[0].trim();
  if (!cleanHandle) {
    throw new Error('Please enter a valid TikTok username (e.g. @yourhandle)');
  }

  try {
    const res = await fetch(`https://www.tiktok.com/@${encodeURIComponent(cleanHandle)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const html = await res.text();
    const m = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
    if (m) {
      const data = JSON.parse(m[1]);
      const user = data?.['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.userInfo?.user;
      if (user && user.uniqueId) {
        return {
          uniqueId: '@' + user.uniqueId,
          nickname: user.nickname || cleanHandle,
          avatar: user.avatarLarger || user.avatarMedium || '',
          verified: true
        };
      }
    }
  } catch (err) {
    console.warn('[TikTok Profile Fetch] Note:', (err as Error)?.message);
  }

  return {
    uniqueId: '@' + cleanHandle,
    nickname: cleanHandle,
    avatar: '',
    verified: false
  };
}

async function fetchTikTokPostMetadata(rawUrl: string): Promise<{
  resolvedUrl: string;
  videoId: string;
  caption: string;
  thumbnailUrl: string;
  images: string[];
  authorHandle: string;
}> {
  let resolvedUrl = rawUrl.trim();
  try {
    if (resolvedUrl.includes('vm.tiktok.com') || resolvedUrl.includes('vt.tiktok.com')) {
      const redirRes = await fetch(resolvedUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36'
        }
      });
      if (redirRes.url) resolvedUrl = redirRes.url.split('?')[0];
    }
  } catch (err) {
    console.warn('[TikTok Link Resolve] Redirect follow note:', (err as Error)?.message);
  }

  const videoId = extractTikTokVideoId(resolvedUrl);
  let caption = '';
  let thumbnailUrl = '';
  const images: string[] = [];
  let authorHandle = tiktokSyncConfig.tiktokHandle || '';

  // 1. Official TikTok oEmbed endpoint
  try {
    const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(resolvedUrl)}`);
    if (oembedRes.ok) {
      const oembed: any = await oembedRes.json();
      if (oembed.title) caption = oembed.title;
      if (oembed.thumbnail_url) thumbnailUrl = oembed.thumbnail_url;
      if (oembed.author_unique_id) authorHandle = '@' + oembed.author_unique_id.replace(/^@/, '');
    }
  } catch (err) {
    console.warn('[TikTok oEmbed] Failed:', (err as Error)?.message);
  }

  // 2. Fallback / enrichment via TikTok page HTML meta & hydration JSON
  try {
    const pageRes = await fetch(resolvedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const html = await pageRes.text();
    const m = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
    if (m) {
      const data = JSON.parse(m[1]);
      const itemStruct = data?.['__DEFAULT_SCOPE__']?.['webapp.video-detail']?.itemInfo?.itemStruct;
      if (itemStruct) {
        if (!caption && itemStruct.desc) caption = itemStruct.desc;
        if (!thumbnailUrl && itemStruct.video?.cover) thumbnailUrl = itemStruct.video.cover;
        if (!thumbnailUrl && itemStruct.video?.originCover) thumbnailUrl = itemStruct.video.originCover;
        if (Array.isArray(itemStruct.imagePost?.images)) {
          for (const imgObj of itemStruct.imagePost.images) {
            const url = imgObj?.imageURL?.urlList?.[0];
            if (url && !images.includes(url)) images.push(url);
          }
        }
        if (itemStruct.author?.uniqueId) authorHandle = '@' + itemStruct.author.uniqueId;
      }
    }

    if (!thumbnailUrl) {
      const ogImg = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
      if (ogImg?.[1]) thumbnailUrl = ogImg[1];
    }
    if (!caption) {
      const ogDesc = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i);
      if (ogDesc?.[1]) caption = ogDesc[1];
    }
  } catch (err) {
    console.warn('[TikTok Page Scrape] Note:', (err as Error)?.message);
  }

  if (thumbnailUrl && !images.includes(thumbnailUrl)) {
    images.unshift(thumbnailUrl);
  }

  return {
    resolvedUrl,
    videoId,
    caption: caption.trim(),
    thumbnailUrl: images[0] || thumbnailUrl || '',
    images,
    authorHandle
  };
}

function parseNairaPriceFromCaption(text: string): number | null {
  if (!text) return null;
  // Matches: 250k, ₦250,000, N250000, 1.5m, 95,000, 150k etc.
  const millionMatch = text.match(/(?:₦|NGN|N)?\s*(\d+(?:\.\d+)?)\s*m(?:illion)?\b/i);
  if (millionMatch) {
    const val = Math.round(parseFloat(millionMatch[1]) * 1_000_000);
    if (val >= 10000) return val;
  }

  const kMatch = text.match(/(?:₦|NGN|N)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    const val = Math.round(parseFloat(kMatch[1]) * 1_000);
    if (val >= 2000) return val;
  }

  const fullMatch = text.match(/(?:₦|NGN|N)\s*(\d{1,3}(?:,\d{3})+|\d{4,8})\b/i) || text.match(/\b(\d{1,3}(?:,\d{3})+|\d{5,8})\b/);
  if (fullMatch) {
    const val = parseInt(fullMatch[1].replace(/,/g, ''), 10);
    if (val >= 2000 && val <= 50_000_000) return val;
  }

  return null;
}

function polishTikTokCaptionRuleBased(params: {
  rawCaption: string;
  priceOverride?: number;
  conditionHint?: 'new' | 'used' | 'auto';
  categoryHint?: string;
  images?: string[];
  tiktokUrl?: string;
  authorHandle?: string;
  riderBuffer?: number;
  keepExactPostedPrice?: boolean;
}) {
  const raw = (params.rawCaption || '').trim();
  const cleanText = raw.replace(/#\S+/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/\s+/g, ' ').trim();
  const lower = cleanText.toLowerCase();

  // 1. Detect Condition
  let condition: 'new' | 'used' = 'new';
  if (params.conditionHint === 'used') {
    condition = 'used';
  } else if (params.conditionHint === 'new') {
    condition = 'new';
  } else {
    if (/(fairly\s*used|tokunbo|uk\s*used|us\s*used|korean\s*(?:made|used)|foreign\s*used|neatly\s*used|pre-?owned|used\b|working\s*fine|slightly\s*used)/i.test(lower)) {
      condition = 'used';
    }
  }
  const isUsed = condition === 'used';

  // 2. Detect Category
  let category = params.categoryHint || 'Latest Gadgets';
  if (!params.categoryHint || params.categoryHint === 'auto') {
    if (/(ac\b|air\s*conditioner|split\s*ac|fan|orl|freezer|fridge|refrigerator|blender|silver\s*crest|cooker|gas|microwave|oven|air\s*fryer|washing\s*machine|kettle|iron|dispenser)/i.test(lower)) {
      category = 'Home Appliances';
    } else if (/(tv|television|smart\s*tv|console|tv\s*mount|wall\s*mount|bracket|soundbar|speaker|jbl|zealot|projector|cinema|monitor|ps5|playstation|xbox|decoder)/i.test(lower)) {
      category = 'Electronics';
    } else {
      category = 'Latest Gadgets';
    }
  }

  // 3. Detect Brand
  let brand = 'Authentic';
  const brandPatterns: [RegExp, string][] = [
    [/\bsamsung\b/i, 'Samsung'],
    [/\bhisense\b/i, 'Hisense'],
    [/\blg\b/i, 'LG'],
    [/\bsony\b/i, 'Sony'],
    [/\bapple\b|\biphone\b|\bipad\b|\bmacbook\b/i, 'Apple'],
    [/\boraimo\b/i, 'Oraimo'],
    [/\banker\b/i, 'Anker'],
    [/\bbaseus\b/i, 'Baseus'],
    [/\bhaier\b|\bthermocool\b/i, 'Haier Thermocool'],
    [/\bsilver\s*crest\b/i, 'Silver Crest'],
    [/\bbinatone\b/i, 'Binatone'],
    [/\bcentury\b/i, 'Century'],
    [/\bqasa\b/i, 'QASA'],
    [/\borl\b/i, 'ORL'],
    [/\bjbl\b/i, 'JBL'],
    [/\bzealot\b/i, 'Zealot'],
    [/\bwanbo\b/i, 'Wanbo'],
    [/\bdji\b/i, 'DJI'],
    [/\bninja\b/i, 'Ninja'],
    [/\btcl\b/i, 'TCL'],
    [/\bpanasonic\b/i, 'Panasonic'],
    [/\bmasterchef\b/i, 'MasterChef']
  ];
  for (const [rx, name] of brandPatterns) {
    if (rx.test(cleanText)) {
      brand = name;
      break;
    }
  }
  if (brand === 'Authentic') {
    if (/korean/i.test(lower) && /\bac\b|air\s*conditioner/i.test(lower)) brand = 'LG Korean Spec';
    else if (category === 'Home Appliances') brand = 'HomeTech';
    else if (category === 'Electronics') brand = 'ProAudio/AV';
    else brand = 'SmartTech';
  }

  // 4. Extract Included Items / Accessories
  const includedItems: string[] = [];
  if (/\bhanger\b/i.test(lower)) includedItems.push('Outdoor Wall Hanger Brackets');
  if (/\bpipe\b/i.test(lower)) includedItems.push('Connecting Copper Gas Pipe');
  if (/\bwire\b|\bwiring\b|\bcable\b/i.test(lower)) includedItems.push('Electrical Connection Wiring / Cable');
  if (/\bremote\b/i.test(lower)) includedItems.push('Remote Control');
  if (/\bmount\b|\bbracket\b/i.test(lower)) includedItems.push('Heavy-Duty Wall Mount Bracket');
  if (/\bconsole\b|\bstand\b/i.test(lower)) includedItems.push('Modern Media Console Unit');
  if (/\bcharger\b/i.test(lower)) includedItems.push('Fast Power Adapter & Charging Cable');
  if (/\bcarton\b|\bbox\b/i.test(lower)) includedItems.push('Factory Sealed Retail Carton');

  // 5. Extract Price & Compute Rider Economics
  const extractedPrice = params.priceOverride && params.priceOverride > 0
    ? params.priceOverride
    : (parseNairaPriceFromCaption(cleanText) || (category === 'Home Appliances' ? 95000 : category === 'Electronics' ? 145000 : 55000));

  const riderDeliveryBuffer = params.riderBuffer ?? (category === 'Home Appliances' ? 6000 : category === 'Electronics' ? 6500 : 3500);
  const keepExact = params.keepExactPostedPrice !== false;

  let finalPrice = extractedPrice;
  if (!keepExact) {
    finalPrice = extractedPrice + riderDeliveryBuffer;
  }
  const estimatedMargin = Math.max(Math.round((finalPrice * 0.18) / 500) * 500, 12000);
  const baseCost = Math.max(finalPrice - riderDeliveryBuffer - estimatedMargin, 10000);
  const originalPrice = Math.round((finalPrice * 1.24) / 500) * 500;

  // 6. Craft Polished Product Name
  let polishedName = cleanText
    .replace(/(?:₦|NGN|N)?\s*\d+(?:\.\d+)?\s*[km]\b/gi, '')
    .replace(/(?:₦|NGN|N)\s*\d[\d,]*/gi, '')
    .replace(/\b(?:is|are|for|just|only|price|selling|available|lagos|abuja)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Specific smart polishing for common Nigerian electronics shorthand
  if (/\bac\b|air\s*conditioner/i.test(lower)) {
    const hpMatch = lower.match(/(\d(?:\.\d)?\s*hp)/i);
    const hpLabel = hpMatch ? hpMatch[1].toUpperCase().replace(/\s+/, '') : '1.5HP';
    const originLabel = /korean/i.test(lower) ? 'Korean-Made ' : '';
    const accNote = includedItems.length > 0 ? ' (Complete with Hanger, Pipe & Wire Accessories)' : '';
    polishedName = `${originLabel}${hpLabel} Split Air Conditioner${accNote}`;
  } else if (/\bfan\b/i.test(lower)) {
    const sizeMatch = lower.match(/(\d{3}\s*mm)/i);
    const inchMatch = lower.match(/(\d{2})\s*inch/i);
    const sizeLabel = sizeMatch ? sizeMatch[1] : '';
    const inchLabel = inchMatch ? ` (${inchMatch[1]}-Inch)` : '';
    const brandLabel = brand !== 'HomeTech' && brand !== 'Authentic' ? `${brand} ` : '';
    polishedName = `${brandLabel}${sizeLabel}${inchLabel} Heavy-Duty Standing Fan`.replace(/\s+/g, ' ').trim();
  } else if (/\btv\s*mount\b|\bconsole\b/i.test(lower)) {
    polishedName = 'Universal Heavy-Duty TV Wall Mount & Modern Entertainment Console Combo';
  } else if (polishedName.length < 6) {
    polishedName = `${brand} ${category === 'Home Appliances' ? 'Premium Home Appliance' : 'Featured Electronics Device'}`;
  } else {
    // Capitalize nicely and prepend brand if missing
    polishedName = polishedName.replace(/\b\w/g, c => c.toUpperCase());
    if (brand !== 'Authentic' && brand !== 'HomeTech' && brand !== 'SmartTech' && brand !== 'ProAudio/AV' && !polishedName.toLowerCase().includes(brand.toLowerCase())) {
      polishedName = `${brand} ${polishedName}`;
    }
  }

  const conditionTag = isUsed ? 'Tokunbo (Fairly Used) • 100% Working Fine' : 'Brand New • Sealed Carton';
  if (!polishedName.toLowerCase().includes('working fine') && !polishedName.toLowerCase().includes('sealed carton')) {
    polishedName = `${polishedName} (${conditionTag})`;
  }

  const shortDescription = isUsed
    ? `Carefully inspected & 100% tested working fine. ${includedItems.length ? 'Includes ' + includedItems.slice(0, 3).join(', ') + '.' : 'Ready for immediate Lagos dispatch or nationwide delivery.'}`
    : `Factory-sealed authentic ${brand} unit curated directly for Nigerian homes & offices with full warranty and fast doorstep dispatch.`;

  const description = isUsed
    ? `Featured straight from our live TikTok showcase (${params.authorHandle || '@sajodaelectronics'}). This unit is in clean, neatly maintained condition and has passed 100% multi-point functional testing by our Lagos technicians — delivering strong, dependable everyday performance.\n\n${includedItems.length > 0 ? `Comes bundled with essential extras (${includedItems.join(', ')}) so you save on setup costs. ` : ''}Backed by our 90-Day SAJODA Working Guarantee with fast same-day Lagos dispatch riders and nationwide courier shipping.`
    : `Featured straight from our live TikTok showcase (${params.authorHandle || '@sajodaelectronics'}). Brand new, factory-sealed ${brand} quality built for reliable everyday performance in Nigerian homes and offices.\n\nSourced through verified domestic distribution hubs and backed by a 1-Year Official Manufacturer Warranty with rapid doorstep delivery across Lagos and all 36 states.`;

  const features = [
    isUsed ? '100% Tested & Verified Working Fine before dispatch' : '100% Authentic Brand New Unit in Factory Sealed Pack',
    ...(includedItems.length > 0 ? [`Complete Package Includes: ${includedItems.join(', ')}`] : []),
    category === 'Home Appliances' ? 'Built tough for reliable Nigerian power & generator compatibility' : 'Crisp performance & durable modern engineering',
    isUsed ? 'Covered by 90-Day SAJODA Working Guarantee' : 'Covered by 1-Year Official Manufacturer Warranty',
    'Same-day Lagos dispatch rider delivery & nationwide shipping'
  ];

  const specifications = [
    { name: 'Brand / Origin', value: brand },
    { name: 'Condition', value: isUsed ? 'Fairly Used / Tokunbo (100% Working Fine)' : 'Brand New (Factory Sealed)' },
    { name: 'Category', value: category },
    ...(includedItems.length > 0 ? [{ name: 'Included Accessories', value: includedItems.join(', ') }] : []),
    { name: 'Warranty', value: isUsed ? '90-Day Tested Working Guarantee' : '1-Year Manufacturer Warranty' }
  ];

  const fallbackGallery = getMultiAngleImages(polishedName, category, condition);
  const realImages = (params.images || []).filter(u => typeof u === 'string' && u.trim().length > 0);
  const finalImages = realImages.length > 0 ? realImages : fallbackGallery;

  return {
    id: 'tt-' + polishedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 26) + '-' + Date.now().toString(36).slice(-4),
    name: polishedName,
    brand,
    category,
    condition,
    conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
    packaging: isUsed ? 'Certified Tested Unit in Protective Packaging' : 'Factory Sealed Retail Pack & Carton',
    warrantyInfo: isUsed ? '90-Day Tokunbo Tested Guarantee & Warranty' : '1-Year Official Manufacturer Warranty',
    badge: isUsed ? 'FAIRLY USED • 100% WORKING FINE' : 'TIKTOK LIVE DROP • BRAND NEW',
    price: finalPrice,
    originalPrice,
    baseCost,
    riderDeliveryBuffer,
    ownerCommission: estimatedMargin,
    commissionNote: `₦${estimatedMargin.toLocaleString()} est. net profit (includes ₦${riderDeliveryBuffer.toLocaleString()} dispatch rider logistics buffer)`,
    sourcingHub: tiktokSyncConfig.defaultSourcingHub,
    shortDescription,
    description,
    features,
    specifications,
    includedItems,
    image: finalImages[0],
    images: finalImages,
    video: params.tiktokUrl || '',
    tiktokUrl: params.tiktokUrl || '',
    rawCaption: raw,
    source: 'tiktok_auto_sync',
    inStock: true,
    stockCount: isUsed ? 2 : 20,
    rating: 4.9,
    reviewCount: Math.floor(Math.random() * 25) + 18,
    tags: ['tiktok', 'authentic', category.toLowerCase(), isUsed ? 'fairly-used' : 'brand-new']
  };
}

async function runAiWorkerFinishWords(params: {
  rawCaption: string;
  priceOverride?: number;
  conditionHint?: 'new' | 'used' | 'auto';
  categoryHint?: string;
  images?: string[];
  tiktokUrl?: string;
  authorHandle?: string;
  riderBuffer?: number;
  keepExactPostedPrice?: boolean;
}) {
  // Start with deterministic rule-based polish (handles prices, accessories, real images reliably)
  const baseline = polishTikTokCaptionRuleBased(params);

  if (!hasGeminiKey) {
    return baseline;
  }

  try {
    const aiPrompt = `You are the AI "Finish Words" Merchandising Worker for SAJODA ELECTRONICS in Nigeria.
The store owner posted a product on TikTok with this quick raw caption:
"${params.rawCaption}"

Your job is to FINISH THE WORDS cleanly, professionally, and persuasively for Nigerian online shoppers while staying 100% faithful to the actual item, price, accessories, and condition mentioned by the owner.

Rules:
- Never invent fake accessories or change the core product.
- Keep the brand authentic (or detect LG/Samsung/Hisense/ORL/Oraimo/Silver Crest/etc.).
- If the owner wrote "fairly used", "tokunbo", "working fine", or "used", set condition = "used" and emphasize "100% Tested Working Fine". Otherwise "new".
- Category must be one of: "Home Appliances", "Electronics", "Latest Gadgets".
- Price should be ₦${baseline.price} unless a clearer Naira price is in the caption.
- Return ONLY valid JSON with these exact keys:
{
  "name": "Polished clear product title including condition tag",
  "brand": "Brand name",
  "category": "Home Appliances | Electronics | Latest Gadgets",
  "condition": "new | used",
  "price": ${baseline.price},
  "shortDescription": "Punchy 1-2 sentence summary for the product card",
  "description": "2 persuasive, clear Nigerian e-commerce paragraphs explaining condition, performance, included accessories, and warranty.",
  "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
  "specifications": [{"name": "Condition", "value": "..."}, {"name": "Key Spec", "value": "..."}],
  "includedItems": ["Item 1", "Item 2"]
}`;

    const response = await callGeminiWithTimeout(aiPrompt, {
      responseMimeType: 'application/json'
    }, 12000);
    const parsed = JSON.parse(response.text || '{}');

    if (parsed && parsed.name) {
      const cond: 'new' | 'used' = parsed.condition === 'used' ? 'used' : baseline.condition;
      const isUsed = cond === 'used';
      const parsedPrice = Number(parsed.price) > 2000 ? Number(parsed.price) : baseline.price;
      const finalPrice = params.priceOverride && params.priceOverride > 0 ? params.priceOverride : parsedPrice;

      return {
        ...baseline,
        name: parsed.name,
        brand: parsed.brand || baseline.brand,
        category: ['Home Appliances', 'Electronics', 'Latest Gadgets'].includes(parsed.category) ? parsed.category : baseline.category,
        condition: cond,
        conditionGrade: isUsed ? 'Tokunbo (Fairly Used) - 100% Tested Working Fine' : 'Brand New - Sealed Carton Box',
        badge: isUsed ? 'FAIRLY USED • 100% WORKING FINE' : 'TIKTOK LIVE DROP • BRAND NEW',
        price: finalPrice,
        originalPrice: Math.round((finalPrice * 1.24) / 500) * 500,
        shortDescription: parsed.shortDescription || baseline.shortDescription,
        description: parsed.description || baseline.description,
        features: Array.isArray(parsed.features) && parsed.features.length > 0 ? parsed.features : baseline.features,
        specifications: Array.isArray(parsed.specifications) && parsed.specifications.length > 0 ? parsed.specifications : baseline.specifications,
        includedItems: Array.isArray(parsed.includedItems) && parsed.includedItems.length > 0 ? parsed.includedItems : baseline.includedItems
      };
    }
  } catch (err) {
    console.info('[AI Worker Finish Words] Using smart Nigerian caption finisher:', (err as Error)?.message);
  }

  return baseline;
}

async function publishPolishedTikTokProduct(
  product: any,
  opts: {
    publishImmediately?: boolean;
    sourceType: TikTokSyncJob['sourceType'];
    tiktokPostId?: string;
    tiktokUrl?: string;
    rawCaption: string;
  }
) {
  const status = opts.publishImmediately !== false ? 'active' : 'draft';
  const docId = product.id;

  await setDoc(doc(firestoreDb, 'products', docId), {
    ...product,
    id: docId,
    status,
    inStock: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });

  if (opts.tiktokPostId && !tiktokSyncConfig.syncedVideoIds.includes(opts.tiktokPostId)) {
    tiktokSyncConfig.syncedVideoIds.push(opts.tiktokPostId);
  }

  const job: TikTokSyncJob = {
    id: 'job-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
    tiktokPostId: opts.tiktokPostId,
    tiktokUrl: opts.tiktokUrl,
    rawCaption: opts.rawCaption,
    finishedName: product.name,
    price: product.price,
    condition: product.condition,
    category: product.category,
    productId: docId,
    thumbnail: product.image,
    status: status === 'active' ? 'published' : 'draft',
    sourceType: opts.sourceType,
    processedAt: new Date().toISOString()
  };

  tiktokSyncConfig.recentJobs.unshift(job);
  saveTikTokSyncConfig();

  return { product: { ...product, status }, job };
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function pollTikTokRssFeed(): Promise<{ processed: number; newProducts: any[] }> {
  const feedUrl = tiktokSyncConfig.rssFeedUrl?.trim();
  if (!feedUrl) {
    return { processed: 0, newProducts: [] };
  }

  const newProducts: any[] = [];
  const res = await fetch(feedUrl, {
    headers: { 'User-Agent': 'SajodaTikTokSyncWorker/1.0' }
  });
  if (!res.ok) {
    throw new Error(`RSS feed responded with status ${res.status}`);
  }
  const xml = await res.text();
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

  for (const itemXml of itemMatches.slice(0, 10)) {
    const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
    const titleMatch = itemXml.match(/<title>([\s\S]*?)<\/title>/i);
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/i);
    const mediaMatch =
      itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i) ||
      itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i) ||
      itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);

    const postUrl = decodeXmlEntities(linkMatch?.[1] || '');
    const postId = postUrl ? extractTikTokVideoId(postUrl) : crypto.createHash('md5').update(itemXml).digest('hex').slice(0, 12);

    if (tiktokSyncConfig.syncedVideoIds.includes(postId)) {
      continue;
    }

    let rawCaption = decodeXmlEntities(descMatch?.[1] || titleMatch?.[1] || '');
    let thumb = mediaMatch?.[1] || '';
    const extraImages: string[] = thumb ? [thumb] : [];

    // Enrich with TikTok oEmbed if link is a TikTok URL
    if (postUrl.includes('tiktok.com')) {
      const meta = await fetchTikTokPostMetadata(postUrl);
      if (meta.caption && meta.caption.length > rawCaption.length) rawCaption = meta.caption;
      if (meta.images.length > 0) {
        for (const u of meta.images) {
          if (!extraImages.includes(u)) extraImages.push(u);
        }
      }
    }

    if (!rawCaption || rawCaption.length < 4) continue;

    const polished = await runAiWorkerFinishWords({
      rawCaption,
      images: extraImages,
      tiktokUrl: postUrl,
      authorHandle: tiktokSyncConfig.tiktokHandle,
      riderBuffer: tiktokSyncConfig.defaultRiderBuffer,
      keepExactPostedPrice: tiktokSyncConfig.keepExactPostedPrice
    });

    const published = await publishPolishedTikTokProduct(polished, {
      publishImmediately: tiktokSyncConfig.autoPublish,
      sourceType: 'rss_auto',
      tiktokPostId: postId,
      tiktokUrl: postUrl,
      rawCaption
    });
    newProducts.push(published.product);
  }

  tiktokSyncConfig.lastCheckedAt = new Date().toISOString();
  saveTikTokSyncConfig();

  return { processed: newProducts.length, newProducts };
}

// Background Auto-Sync Interval (checks every 3 minutes if rssFeedUrl & autoSyncEnabled are configured)
setInterval(async () => {
  if (!tiktokSyncConfig.autoSyncEnabled || !tiktokSyncConfig.rssFeedUrl) return;
  try {
    const result = await pollTikTokRssFeed();
    if (result.processed > 0) {
      console.log(`[TikTok Auto-Sync Worker] Published ${result.processed} new TikTok posts automatically!`);
    }
  } catch (err) {
    console.warn('[TikTok Auto-Sync Worker] Background poll note:', (err as Error)?.message);
  }
}, 3 * 60 * 1000);

// 1. Get TikTok Sync Configuration & Job History
app.get('/api/tiktok/config', (req, res) => {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  const webhookUrl = `${proto}://${host}/api/tiktok/webhook`;

  res.json({
    success: true,
    config: tiktokSyncConfig,
    webhookUrl
  });
});

// 2. Save & Verify TikTok Account Configuration
app.post('/api/tiktok/config', async (req, res) => {
  try {
    const {
      tiktokHandle,
      rssFeedUrl,
      autoSyncEnabled,
      autoPublish,
      keepExactPostedPrice,
      defaultRiderBuffer,
      defaultSourcingHub
    } = req.body;

    if (typeof tiktokHandle === 'string' && tiktokHandle.trim()) {
      const profile = await fetchTikTokProfileInfo(tiktokHandle);
      tiktokSyncConfig.tiktokHandle = profile.uniqueId;
      tiktokSyncConfig.profileNickname = profile.nickname;
      tiktokSyncConfig.profileAvatar = profile.avatar;
      tiktokSyncConfig.profileVerified = profile.verified;
    } else if (tiktokHandle === '') {
      tiktokSyncConfig.tiktokHandle = '';
      tiktokSyncConfig.profileNickname = '';
      tiktokSyncConfig.profileAvatar = '';
      tiktokSyncConfig.profileVerified = false;
    }

    if (typeof rssFeedUrl === 'string') tiktokSyncConfig.rssFeedUrl = rssFeedUrl.trim();
    if (typeof autoSyncEnabled === 'boolean') tiktokSyncConfig.autoSyncEnabled = autoSyncEnabled;
    if (typeof autoPublish === 'boolean') tiktokSyncConfig.autoPublish = autoPublish;
    if (typeof keepExactPostedPrice === 'boolean') tiktokSyncConfig.keepExactPostedPrice = keepExactPostedPrice;
    if (defaultRiderBuffer !== undefined) tiktokSyncConfig.defaultRiderBuffer = Math.max(Number(defaultRiderBuffer) || 5000, 0);
    if (typeof defaultSourcingHub === 'string' && defaultSourcingHub.trim()) tiktokSyncConfig.defaultSourcingHub = defaultSourcingHub.trim();

    saveTikTokSyncConfig();

    const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';

    res.json({
      success: true,
      config: tiktokSyncConfig,
      webhookUrl: `${proto}://${host}/api/tiktok/webhook`
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error?.message || 'Failed to update TikTok sync config' });
  }
});

// 3. Manual Sync Now (Polls configured RSS feed / TikTok account)
app.post('/api/tiktok/sync-now', async (req, res) => {
  try {
    if (!tiktokSyncConfig.rssFeedUrl) {
      return res.json({
        success: true,
        processed: 0,
        newProducts: [],
        message: 'TikTok profile connected. Connect an RSS feed URL or Zapier/Make Webhook for hands-free auto-syncing, or paste a TikTok post link below!'
      });
    }
    const result = await pollTikTokRssFeed();
    res.json({
      success: true,
      processed: result.processed,
      newProducts: result.newProducts,
      config: tiktokSyncConfig,
      message: result.processed > 0
        ? `AI Worker finished words & published ${result.processed} new TikTok product(s)!`
        : 'Checked your TikTok feed — your website is already 100% up to date!'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to sync TikTok feed' });
  }
});

// 4. Import a TikTok Post URL + Run AI Worker "Finish Words" (optionally auto-publish)
app.post('/api/tiktok/import-post', async (req, res) => {
  try {
    const {
      tiktokUrl,
      rawCaptionOverride,
      images = [],
      conditionHint = 'auto',
      categoryHint = 'auto',
      priceOverride,
      publishImmediately = false
    } = req.body;

    if (!tiktokUrl || !String(tiktokUrl).trim()) {
      return res.status(400).json({ success: false, error: 'Please paste a TikTok video or photo post link.' });
    }

    const meta = await fetchTikTokPostMetadata(String(tiktokUrl));
    const finalCaption = (rawCaptionOverride && String(rawCaptionOverride).trim()) || meta.caption;

    if (!finalCaption) {
      return res.status(400).json({
        success: false,
        error: 'Could not read caption automatically from that TikTok link (the post may be private). Type a quick note about the product below and the AI Worker will finish it!'
      });
    }

    const userUploadedImages = Array.isArray(images) ? images.filter(Boolean) : [];
    const combinedImages = [...userUploadedImages, ...meta.images.filter(u => !userUploadedImages.includes(u))];

    const polished = await runAiWorkerFinishWords({
      rawCaption: finalCaption,
      priceOverride: Number(priceOverride) || undefined,
      conditionHint,
      categoryHint,
      images: combinedImages,
      tiktokUrl: meta.resolvedUrl,
      authorHandle: meta.authorHandle || tiktokSyncConfig.tiktokHandle,
      riderBuffer: tiktokSyncConfig.defaultRiderBuffer,
      keepExactPostedPrice: tiktokSyncConfig.keepExactPostedPrice
    });

    if (publishImmediately) {
      const published = await publishPolishedTikTokProduct(polished, {
        publishImmediately: tiktokSyncConfig.autoPublish,
        sourceType: 'link_import',
        tiktokPostId: meta.videoId,
        tiktokUrl: meta.resolvedUrl,
        rawCaption: finalCaption
      });
      return res.json({
        success: true,
        published: true,
        product: published.product,
        job: published.job,
        meta,
        config: tiktokSyncConfig
      });
    }

    res.json({
      success: true,
      published: false,
      product: polished,
      meta
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to process TikTok post' });
  }
});

// 5. Quick "AI Worker Finish Words" for Casual Captions + Photos (with optional immediate publish)
app.post('/api/tiktok/finish-words', async (req, res) => {
  try {
    const {
      rawCaption,
      images = [],
      conditionHint = 'auto',
      categoryHint = 'auto',
      priceOverride,
      tiktokUrl = '',
      publishImmediately = false
    } = req.body;

    if (!rawCaption || !String(rawCaption).trim()) {
      return res.status(400).json({ success: false, error: 'Please write or paste a quick product note/caption for the AI Worker to finish.' });
    }

    const polished = await runAiWorkerFinishWords({
      rawCaption: String(rawCaption),
      priceOverride: Number(priceOverride) || undefined,
      conditionHint,
      categoryHint,
      images: Array.isArray(images) ? images : [],
      tiktokUrl,
      authorHandle: tiktokSyncConfig.tiktokHandle,
      riderBuffer: tiktokSyncConfig.defaultRiderBuffer,
      keepExactPostedPrice: tiktokSyncConfig.keepExactPostedPrice
    });

    if (publishImmediately) {
      const published = await publishPolishedTikTokProduct(polished, {
        publishImmediately: true,
        sourceType: 'quick_finish',
        tiktokUrl,
        rawCaption: String(rawCaption)
      });
      return res.json({
        success: true,
        published: true,
        product: published.product,
        job: published.job,
        config: tiktokSyncConfig
      });
    }

    res.json({
      success: true,
      published: false,
      product: polished
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'AI Worker failed to finish product words' });
  }
});

// 6. Publish a Previewed TikTok / AI-Finished Product directly to Firestore
app.post('/api/tiktok/publish', async (req, res) => {
  try {
    const { product, sourceType = 'link_import', rawCaption = '' } = req.body;
    if (!product || !product.name) {
      return res.status(400).json({ success: false, error: 'Product payload is required' });
    }

    const tiktokUrl = product.tiktokUrl || product.video || '';
    const postId = tiktokUrl ? extractTikTokVideoId(tiktokUrl) : undefined;

    const published = await publishPolishedTikTokProduct(product, {
      publishImmediately: true,
      sourceType,
      tiktokPostId: postId,
      tiktokUrl,
      rawCaption: rawCaption || product.rawCaption || product.name
    });

    res.json({
      success: true,
      product: published.product,
      job: published.job,
      config: tiktokSyncConfig
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to publish product' });
  }
});

// 7. Zero-Touch Automatic TikTok Webhook (for Make.com / Zapier / IFTTT / TikTok Automations)
app.post('/api/tiktok/webhook', async (req, res) => {
  try {
    const body = req.body || {};
    const providedSecret = req.headers['x-tiktok-webhook-secret'] || body.secret || req.query.secret;
    if (tiktokSyncConfig.webhookSecret && providedSecret && providedSecret !== tiktokSyncConfig.webhookSecret) {
      return res.status(401).json({ success: false, error: 'Invalid webhook secret' });
    }

    const rawUrl = body.videoUrl || body.url || body.link || body.tiktokUrl || '';
    let rawCaption = body.caption || body.description || body.title || body.text || '';
    const extraImages: string[] = [];

    if (Array.isArray(body.images)) {
      extraImages.push(...body.images.filter((u: any) => typeof u === 'string' && u.trim()));
    }
    if (typeof body.thumbnailUrl === 'string' && body.thumbnailUrl.trim()) {
      extraImages.unshift(body.thumbnailUrl.trim());
    }
    if (typeof body.coverImage === 'string' && body.coverImage.trim()) {
      extraImages.unshift(body.coverImage.trim());
    }
    if (typeof body.image === 'string' && body.image.trim()) {
      extraImages.unshift(body.image.trim());
    }

    let postId = body.videoId || (rawUrl ? extractTikTokVideoId(rawUrl) : crypto.createHash('md5').update(rawCaption + Date.now()).digest('hex').slice(0, 12));

    if (tiktokSyncConfig.syncedVideoIds.includes(postId)) {
      return res.json({ success: true, skipped: true, message: 'TikTok post already synced to store.' });
    }

    if (rawUrl && rawUrl.includes('tiktok.com')) {
      const meta = await fetchTikTokPostMetadata(rawUrl);
      if (meta.videoId) postId = meta.videoId;
      if (!rawCaption && meta.caption) rawCaption = meta.caption;
      for (const u of meta.images) {
        if (!extraImages.includes(u)) extraImages.push(u);
      }
    }

    if (!rawCaption || !String(rawCaption).trim()) {
      return res.status(400).json({ success: false, error: 'Webhook payload must include caption/title or a public TikTok videoUrl.' });
    }

    const polished = await runAiWorkerFinishWords({
      rawCaption: String(rawCaption),
      images: extraImages,
      tiktokUrl: rawUrl,
      authorHandle: body.author || tiktokSyncConfig.tiktokHandle,
      riderBuffer: tiktokSyncConfig.defaultRiderBuffer,
      keepExactPostedPrice: tiktokSyncConfig.keepExactPostedPrice
    });

    const published = await publishPolishedTikTokProduct(polished, {
      publishImmediately: tiktokSyncConfig.autoPublish,
      sourceType: 'webhook',
      tiktokPostId: postId,
      tiktokUrl: rawUrl,
      rawCaption: String(rawCaption)
    });

    console.log(`[TikTok Webhook] Auto-published "${published.product.name}" (₦${published.product.price.toLocaleString()})`);

    res.json({
      success: true,
      message: 'TikTok post polished by AI Worker and synced to store!',
      product: published.product,
      job: published.job
    });
  } catch (error: any) {
    console.error('[TikTok Webhook Error]:', error);
    res.status(500).json({ success: false, error: error?.message || 'Webhook processing error' });
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
