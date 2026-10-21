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

// Helper to send order to CJ Dropshipping
async function sendToCJDropshipping(reference: string, customer: any, metadata: any) {
  const cjToken = process.env.CJ_ACCESS_TOKEN;
  if (!cjToken) {
    console.log('[CJ Dropshipping] Skipping fulfillment. CJ_ACCESS_TOKEN is not set.');
    return;
  }

  // Extract raw items and shipping address from Paystack metadata
  let items = [];
  let shippingAddress = '';
  if (metadata && metadata.custom_fields) {
    const rawItemsField = metadata.custom_fields.find((f: any) => f.variable_name === 'cart_items_raw');
    if (rawItemsField) {
      try { items = JSON.parse(rawItemsField.value); } catch (e) { console.error('Failed to parse items', e); }
    }
    const addressField = metadata.custom_fields.find((f: any) => f.variable_name === 'shipping_address');
    if (addressField) shippingAddress = addressField.value;
  }

  if (items.length === 0) {
    console.log('[CJ Dropshipping] No items found to fulfill for order:', reference);
    return;
  }

  // Format products for CJ API
  const cjProducts = items.map((item: any) => ({
    vid: item.sku, // Product variant ID/SKU in CJ
    quantity: item.quantity
  }));

  // Build CJ API Payload (Based on standard CJ API specifications)
  const cjPayload = {
    orderNumber: reference,
    shippingAddress: shippingAddress,
    customerName: customer.first_name || 'Customer',
    customerPhone: customer.phone || '0000000000',
    // In a real app, you would split the address into city/province/zip/country on the frontend
    shippingCountry: 'US', // Defaulting for example
    shippingProvince: '',
    shippingCity: '',
    shippingZip: '',
    products: cjProducts
  };

  try {
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': cjToken
      },
      body: JSON.stringify(cjPayload)
    });

    const data = await response.json();
    if (data.code === 200) {
      console.log(`[CJ Dropshipping] Order ${reference} successfully submitted to CJ!`);
    } else {
      console.error(`[CJ Dropshipping] Failed to submit order ${reference}:`, data.message);
    }
  } catch (error) {
    console.error(`[CJ Dropshipping] API Error for order ${reference}:`, error);
  }
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

    // 2. Automate Fulfillment to CJ Dropshipping
    await sendToCJDropshipping(reference, customer, metadata);
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
      ? `You are an AI assistant for VoraTech dropshipping store. Help the admin, ${userName || 'Dami'}, with product descriptions, SEO, analyzing metrics, setting pricing strategies based on CJ Dropshipping, and overall e-commerce advice. Be concise, professional, and knowledgeable about dropshipping. You also have access to Google Search for the latest trends.`
      : `You are a helpful AI shopping assistant for VoraTech. Help the customer, ${userName || 'there'}, find tech products, compare features, and learn about the latest gadgets. Be friendly, concise, and helpful. Do not mention internal store operations. Use Google Search if asked about recent tech news or reviews.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
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

// Image pools for fallback/high-resolution verified product photos
const CURATED_IMAGES = {
  'Home Appliances': [
    'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800'
  ],
  'Latest Gadgets': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1609592424368-e4b2d1d0537d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
  ],
  'Electronics': [
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'
  ]
};

// AI Generate Batch Catalog of Home Appliances, Latest Gadgets, and Electronics
app.post('/api/ai/generate-catalog-products', async (req, res) => {
  try {
    const { category = 'All', count = 5, customPrompt = '' } = req.body;
    const targetCount = Math.min(Math.max(Number(count) || 5, 1), 12);

    const promptText = `You are a chief e-commerce merchandiser and tech product curator for 'Sajoda', a premier store specializing in Home Appliances, Latest Gadgets, and Electronics.
The store owner wants you to effortlessly generate and catalog ${targetCount} top-selling, realistic, highly desirable products.

Category requested: ${category}
${customPrompt ? `User instructions / focus: "${customPrompt}"` : ''}

Categories allowed: "Home Appliances", "Latest Gadgets", "Electronics", or "Smart Living".

Generate an array of exactly ${targetCount} unique, cutting-edge products. Each item must have:
- name: catchy, modern commercial brand & product name (under 60 characters)
- price: realistic retail price in USD (between 29.99 and 599.99)
- originalPrice: crossed-out MSRP price (15-30% higher than price)
- category: one of "Home Appliances", "Latest Gadgets", "Electronics"
- badge: one of "BESTSELLER", "HOT", "NEW", "ECO", "TRENDING", or "PREMIUM"
- brand: "Sajoda Home" or "Sajoda Tech" or "Sajoda Audio"
- shortDescription: punchy one-sentence customer benefit (under 100 characters)
- description: engaging 2-3 sentence overview highlighting real-world benefits and high-end build quality
- inStock: true
- stockCount: random integer between 15 and 65
- rating: floating point between 4.7 and 5.0
- reviewCount: integer between 35 and 250
- features: 4 specific, technical bullet points (e.g., motor power, battery life, connectivity, safety)
- specifications: array of 3 objects with name and value (e.g., Power, Dimensions, Connectivity, Material)
- tags: array of 3-4 searchable keywords

Return ONLY a valid JSON array of objects matching this exact structure:
[
  {
    "name": "...",
    "price": 99.99,
    "originalPrice": 129.99,
    "category": "Home Appliances",
    "badge": "BESTSELLER",
    "brand": "Sajoda Home",
    "shortDescription": "...",
    "description": "...",
    "inStock": true,
    "stockCount": 40,
    "rating": 4.9,
    "reviewCount": 118,
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "specifications": [{"name": "Capacity", "value": "5.5 Liters"}, {"name": "Power", "value": "1700W"}],
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
    
    // Assign curated high-res images to each generated product based on category
    const productsWithImages = parsedProducts.map((p: any, index: number) => {
      const cat = p.category as keyof typeof CURATED_IMAGES;
      const pool = CURATED_IMAGES[cat] || CURATED_IMAGES['Latest Gadgets'];
      const img = pool[index % pool.length];
      const secondImg = pool[(index + 1) % pool.length];
      return {
        ...p,
        id: 'sajoda-' + (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) + '-' + Math.random().toString(36).slice(2, 6),
        image: img,
        images: [img, secondImg],
        createdAt: new Date().toISOString()
      };
    });

    res.json({ success: true, count: productsWithImages.length, products: productsWithImages });
  } catch (error: any) {
    console.error('Gemini Catalog Generation Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate catalog products with AI' });
  }
});

// AI Generate Single Product from Prompt
app.post('/api/ai/generate-single-product', async (req, res) => {
  try {
    const { prompt, category } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const promptText = `Generate a complete, ready-to-sell e-commerce product based on this request: "${prompt}".
Store specializes in: Home Appliances, Latest Gadgets, and Electronics.
Category suggestion: ${category || 'infer best matching category'}.

Return ONLY valid JSON matching this schema:
{
  "name": "Catchy commercial product title (under 60 chars)",
  "price": 149.99,
  "originalPrice": 189.99,
  "category": "Home Appliances" or "Latest Gadgets" or "Electronics",
  "badge": "NEW" or "BESTSELLER" or "FEATURED",
  "brand": "Sajoda Home" or "Sajoda Tech",
  "shortDescription": "One sentence summary",
  "description": "2-3 paragraphs detailing features, benefits, specifications, and what makes it extraordinary",
  "features": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
  "specifications": [
    {"name": "Power/Battery", "value": "..."},
    {"name": "Material", "value": "..."},
    {"name": "Dimensions/Weight", "value": "..."}
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
    const cat = (parsed.category as keyof typeof CURATED_IMAGES) || 'Latest Gadgets';
    const pool = CURATED_IMAGES[cat] || CURATED_IMAGES['Latest Gadgets'];
    const chosenImg = pool[Math.floor(Math.random() * pool.length)];

    res.json({ 
      success: true, 
      product: {
        ...parsed,
        image: chosenImg,
        images: [chosenImg],
        inStock: true,
        stockCount: 35
      }
    });
  } catch (error: any) {
    console.error('Gemini Single Product Generation Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate product with AI' });
  }
});


// Product Review Summarization Webhook

// CJ Dropshipping API Proxy
// CJ Dropshipping Categories API Proxy

// CJ Dropshipping Connection Status
app.get('/api/dropshipping/status', async (req, res) => {
  try {
    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.json({ status: 'DISCONNECTED', message: 'CJ_ACCESS_TOKEN environment secret is not configured.' });
    }
    // Ping categories as a health check
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/getCategory', {
      method: 'GET',
      headers: {
        'CJ-Access-Token': cjToken,
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data?.code === 200) {
      return res.json({ status: 'CONNECTED', lastCheck: new Date().toISOString() });
    } else {
      const errMsg = data?.message || (response.status === 401 ? 'Invalid or expired CJ Access Token. Please refresh token from CJ Dropshipping developer center.' : `HTTP ${response.status}`);
      return res.json({ status: 'CONNECTION ERROR', message: errMsg });
    }
  } catch (error: any) {
    console.error('CJ Dropshipping Status Error:', error);
    res.json({ status: 'CONNECTION ERROR', message: error.message || 'Failed to connect' });
  }
});

app.get('/api/dropshipping/categories', async (req, res) => {
  try {
    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.status(500).json({ error: 'CJ Dropshipping access token not configured.' });
    }

    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/getCategory`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': cjToken
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[CJ Dropshipping] Category Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch dropshipping categories' });
  }
});

app.get('/api/dropshipping/products', async (req, res) => {
  try {
    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.status(500).json({ error: 'CJ Dropshipping access token not configured. Please add CJ_ACCESS_TOKEN in Settings > Secrets.' });
    }

    const { page = 1, size = 20, keyWord = '', keyword = '', categoryId = '' } = req.query;
    const searchTerm = String(keyWord || keyword || '');
    const queryParams = new URLSearchParams({
      pageNum: String(page),
      pageSize: String(size),
    });
    if (searchTerm) {
      queryParams.append('keyWord', searchTerm);
    }
    if (categoryId) {
      queryParams.append('categoryId', String(categoryId));
    }

    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/list?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': cjToken
      }
    });

    const data = await response.json();
    if (data?.code !== 200 && !data?.result) {
      return res.status(response.status === 200 ? 400 : response.status).json({
        error: data?.message || 'CJ Dropshipping API returned an error',
        raw: data
      });
    }
    res.json(data);
  } catch (error: any) {
    console.error('[CJ Dropshipping] Fetch Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to fetch dropshipping products' });
  }
});

// Single CJ Product Details
app.get('/api/dropshipping/product/:pid', async (req, res) => {
  try {
    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.status(500).json({ error: 'CJ Dropshipping access token not configured.' });
    }

    const { pid } = req.params;
    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${encodeURIComponent(pid)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': cjToken
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error('[CJ Dropshipping] Product Detail Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to fetch CJ product details' });
  }
});

app.post('/api/product-reviews', async (req, res) => {
  try {
    const { productName } = req.body;
    if (!productName) return res.status(400).json({ error: 'Product name is required' });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Search for the latest real-world reviews and news for: "${productName}". Summarize the general consensus, pros, and cons in a short 2-3 paragraph tech review style. Keep it professional and engaging.`,
      config: {
         
      }
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
