import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error('GEMINI_API_KEY missing in server/.env');

const genAI = new GoogleGenerativeAI(key);

const defaultConfig: GenerationConfig = {
  temperature: 0.82,
  topP: 0.95,
  maxOutputTokens: 2048,
};

export async function generate(prompt: string, config?: Partial<GenerationConfig>): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { ...defaultConfig, ...config },
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err: any) {
    console.error('Gemini error:', err.message);
    throw new Error(err.message || 'AI generation failed');
  }
}
