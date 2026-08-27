import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();
async function test() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });
  try {
    const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'hello'
    });
    console.log(res.text);
  } catch (e: any) {
    console.error('Error:', e);
    console.log('Status:', e.status);
    console.log('Message:', e.message);
  }
}
test();
