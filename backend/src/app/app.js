import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import { errorHandler } from '../shared/middleware/errorHandler.js';

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());           // CORS first — must precede body parsing
app.use(express.json());   // Parse JSON request bodies

// ── REST API Routes ───────────────────────────────────────────────────────────
// Express backend acts purely as a JSON REST API service (handled via Caddy)
app.use('/api', routes);

// ── 404 Fallback for Non-API Routes ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// ── Central Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

export default app;
