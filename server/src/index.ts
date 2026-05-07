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

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Routes
const apiRouter = express.Router();
apiRouter.use('/wizard',  wizardRoute);
apiRouter.use('/tweak',   tweakRoute);
apiRouter.use('/tools',   toolsRoute);
apiRouter.use('/upload',  uploadRoute);
apiRouter.use('/analyze', analyzeRoute);
apiRouter.use('/export',  exportRoute);

app.use('/api', apiRouter);
app.use('/', apiRouter); // Handle Vercel potentially stripping the /api prefix

apiRouter.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    gemini: process.env.GEMINI_API_KEY ? 'connected' : 'MISSING KEY',
    timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n✅ Intuita backend running on http://localhost:${PORT}`);
    console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Key loaded' : '❌ MISSING — add key to server/.env'}\n`);
  });
}

export default app;
