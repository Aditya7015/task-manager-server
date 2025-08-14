import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { router as v1 } from '../v1/index.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet());
app.use(cors({
  origin: (process.env.CLIENT_ORIGIN || '').split(',').filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Serve uploads from server/uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

app.get('/health', (_req, res) => res.json({ ok: true }));

// ✅ Root route for Render (API-style JSON response)
app.get('/', (_req, res) => {
  res.json({
    status: 'success',
    message: '🚀 Task Manager API is running successfully!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', v1);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

export default app;
