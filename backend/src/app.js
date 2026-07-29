import express from 'express';
import cors from 'cors';
import router from './routes/api.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());           // CORS first — must precede body parsing
app.use(express.json());   // Parse JSON request bodies

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', router);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Central error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
