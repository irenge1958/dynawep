import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [{ text: 'Say hello from Gemini!' }],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config: { thinkingConfig: { thinkingBudget: -1 } },
      contents,
    });

    for await (const chunk of response) {
      console.log(chunk.text);
    }
  } catch (error) {
    console.error('❌ Erreur Gemini :', error.message);
  }
}

main();
