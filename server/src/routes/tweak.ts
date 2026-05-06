import { Router, Request, Response } from 'express';
import { generate } from '../lib/gemini';
import { buildTweakPrompt, TweakType } from '../lib/prompts';

export const tweakRoute = Router();

tweakRoute.post('/', async (req: Request, res: Response) => {
  try {
    const { original, tweak, newTone }: {
      original: string;
      tweak: TweakType;
      newTone?: number;
    } = req.body;

    if (!original) return res.status(400).json({ error: 'original content is required' });
    if (!tweak)    return res.status(400).json({ error: 'tweak type is required' });

    const validTweaks: TweakType[] = ['shorter','longer','more_formal','more_casual','add_urgency','simpler','change_tone'];
    if (!validTweaks.includes(tweak)) {
      return res.status(400).json({ error: `Invalid tweak. Must be one of: ${validTweaks.join(', ')}` });
    }

    const prompt = buildTweakPrompt(original, tweak, newTone);
    const result = await generate(prompt);

    return res.json({
      success: true,
      result,
      tweak,
      wordCount: result.split(/\s+/).filter(Boolean).length,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Tweak error:', err.message);
    return res.status(500).json({ error: err.message || 'Tweak failed' });
  }
});
