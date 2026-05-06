import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

import { wizardRoute }  from './routes/wizard';
import { tweakRoute }   from './routes/tweak';
import { toolsRoute }   from './routes/tools';
import { uploadRoute }  from './routes/upload';
import { analyzeRoute } from './routes/analyze';
import { exportRoute }  from './routes/export';

const app = express();
const PORT = process.env.PORT || 4000;

// Create uploads dir
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Routes
app.use('/api/wizard',  wizardRoute);
app.use('/api/tweak',   tweakRoute);
app.use('/api/tools',   toolsRoute);
app.use('/api/upload',  uploadRoute);
app.use('/api/analyze', analyzeRoute);
app.use('/api/export',  exportRoute);

app.get('/api/health', (_, res) => {
  res.json({
    status: 'ok',
    gemini: process.env.GEMINI_API_KEY ? 'connected' : 'MISSING KEY',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n✅ Intuita backend running on http://localhost:${PORT}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Key loaded' : '❌ MISSING — add key to server/.env'}\n`);
});
