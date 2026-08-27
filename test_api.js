const { GoogleGenAI } = require('@google/genai');

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
  } catch (e) {
    console.error('Error:', e);
    console.log('Status:', e.status);
    console.log('Message:', e.message);
  }
}
test();
