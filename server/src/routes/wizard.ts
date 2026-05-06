import { Router, Request, Response } from 'express';
import { generate } from '../lib/gemini';
import { buildWizardPrompt, toneShortLabel, WizardInput } from '../lib/prompts';

export const wizardRoute = Router();

wizardRoute.post('/', async (req: Request, res: Response) => {
  try {
    const data: WizardInput = req.body;

    if (!data.goalType) return res.status(400).json({ error: 'goalType is required' });
    if (!data.purpose)  return res.status(400).json({ error: 'purpose is required' });
    if (typeof data.tone !== 'number') data.tone = 50;

    const prompt = buildWizardPrompt(data);
    const result = await generate(prompt);

    return res.json({
      success: true,
      result,
      metadata: {
        goalType:   data.goalType,
        purpose:    data.purpose,
        tone:       data.tone,
        toneLabel:  toneShortLabel(data.tone),
        audience:   data.audience || null,
        hasCTA:     data.includeCTA || false,
        wordCount:  result.split(/\s+/).filter(Boolean).length,
        charCount:  result.length,
        generatedAt: new Date().toISOString(),
      }
    });
  } catch (err: any) {
    console.error('Wizard error:', err.message);
    return res.status(500).json({ error: err.message || 'Generation failed' });
  }
});
