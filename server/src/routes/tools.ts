import { Router, Request, Response } from 'express';
import { generate } from '../lib/gemini';
import { buildToolPrompt, ToolInput } from '../lib/prompts';

export const toolsRoute = Router();

const VALID_TOOLS = [
  'email', 'summary', 'social',
  'proposal', 'analysis', 'planning'
];

toolsRoute.post('/:toolId', async (req: Request, res: Response) => {
  try {
    const toolId = req.params.toolId as string;

    if (!VALID_TOOLS.includes(toolId)) {
      return res.status(400).json({ error: `Unknown tool: ${toolId}. Valid: ${VALID_TOOLS.join(', ')}` });
    }

    const input: ToolInput = { toolId, fields: req.body };
    const prompt = buildToolPrompt(input);
    const result = await generate(prompt, { maxOutputTokens: 3000 });

    return res.json({
      success: true,
      result,
      toolId,
      wordCount: result.split(/\s+/).filter(Boolean).length,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error(`Tool [${req.params.toolId}] error:`, err.message);
    return res.status(500).json({ error: err.message || 'Tool generation failed' });
  }
});
