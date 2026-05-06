import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';
import Papa from 'papaparse';

export const uploadRoute = Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../../uploads'),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`),
});

const ALLOWED = ['.pdf', '.docx', '.doc', '.csv', '.txt'];

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    ALLOWED.includes(ext) ? cb(null, true) : cb(new Error(`Unsupported type: ${ext}`));
  },
});

async function extractText(filePath: string, originalname: string): Promise<string> {
  const ext = path.extname(originalname).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (ext === '.pdf') {
    const data = await pdf(buffer);
    return data.text;
  }
  if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  if (ext === '.csv') {
    const text = buffer.toString('utf-8');
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const rows = parsed.data.slice(0, 200);
    return `CSV — ${parsed.data.length} total rows | Columns: ${parsed.meta.fields?.join(', ')}\n\nSample data:\n${JSON.stringify(rows, null, 2)}`;
  }
  if (ext === '.txt') return buffer.toString('utf-8');
  throw new Error(`Unsupported: ${ext}`);
}

uploadRoute.post('/', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const content = await extractText(req.file.path, req.file.originalname);
    fs.unlink(req.file.path, () => {});

    const ext = path.extname(req.file.originalname).toLowerCase();
    const typeMap: Record<string, string> = {
      '.pdf': 'pdf', '.docx': 'docx', '.doc': 'docx', '.csv': 'csv', '.txt': 'txt'
    };

    return res.json({
      success: true,
      file: {
        filename:  req.file.originalname,
        fileType:  typeMap[ext] || 'txt',
        content,
        size:      req.file.size,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        charCount: content.length,
      }
    });
  } catch (err: any) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    return res.status(500).json({ error: err.message || 'File processing failed' });
  }
});
