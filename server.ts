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

// Product Review Summarization Webhook

// CJ Dropshipping API Proxy
// CJ Dropshipping Categories API Proxy

// CJ Dropshipping Connection Status
app.get('/api/dropshipping/status', async (req, res) => {
  try {
    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.json({ status: 'DISCONNECTED', message: 'CJ_ACCESS_TOKEN not configured in environment.' });
    }
    // Ping categories as a health check
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/getCategory', {
      method: 'GET',
      headers: {
        'CJ-Access-Token': cjToken,
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.code === 200) {
        return res.json({ status: 'CONNECTED', lastCheck: new Date().toISOString() });
      } else {
        return res.json({ status: 'CONNECTION ERROR', message: data.message || 'API responded with error code' });
      }
    } else {
      return res.json({ status: 'CONNECTION ERROR', message: `HTTP ${response.status}` });
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
      return res.status(500).json({ error: 'CJ Dropshipping access token not configured.' });
    }

    const { page = 1, size = 20, keyWord = '', categoryId = '' } = req.query;
    const queryParams = new URLSearchParams({
      pageNum: String(page),
      pageSize: String(size),
    });
    if (keyWord) {
      queryParams.append('keyWord', String(keyWord));
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
    res.json(data);
  } catch (error) {
    console.error('[CJ Dropshipping] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch dropshipping products' });
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
