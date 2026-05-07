import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

let genAI: GoogleGenerativeAI | null = null;

const defaultConfig: GenerationConfig = {
  temperature: 0.82,
  topP: 0.95,
  maxOutputTokens: 2048,
};

export async function generate(prompt: string, config?: Partial<GenerationConfig>): Promise<string> {
  try {
    if (!genAI) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) throw new Error('GEMINI_API_KEY is missing in Vercel Environment Variables');
      genAI = new GoogleGenerativeAI(key);
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-lite-preview',
      generationConfig: { ...defaultConfig, ...config },
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    console.error('Gemini error:', err.message);
    throw new Error(err.message || 'AI generation failed');
  }
}
