import { Router, Request, Response } from 'express';
import { generate } from '../lib/gemini';
import { buildFilePrompt, FileAnalysisInput } from '../lib/prompts';

export const analyzeRoute = Router();

analyzeRoute.post('/', async (req: Request, res: Response) => {
  try {
    const { file, analysisType }: { file: FileAnalysisInput; analysisType: string } = req.body;

    if (!file?.content)  return res.status(400).json({ error: 'file.content is required' });
    if (!analysisType)   return res.status(400).json({ error: 'analysisType is required' });

    const prompt = buildFilePrompt({ ...file, analysisType });
    const result = await generate(prompt, { maxOutputTokens: 3000 });

    return res.json({
      success: true,
      result,
      metadata: {
        filename:     file.filename,
        fileType:     file.fileType,
        analysisType,
        wordCount:    result.split(/\s+/).filter(Boolean).length,
        generatedAt:  new Date().toISOString(),
      }
    });
  } catch (err: any) {
    console.error('Analyze error:', err.message);
    return res.status(500).json({ error: err.message || 'Analysis failed' });
  }
});
