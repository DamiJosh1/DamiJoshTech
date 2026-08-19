import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Hello',
      config: { tools: [{ googleSearch: {} }] }
    });
    console.log('SUCCESS:', res.text);
  } catch (err) {
    console.error('ERROR:', err);
  }
}
test();
