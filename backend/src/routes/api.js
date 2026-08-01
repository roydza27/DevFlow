import { Router } from 'express';
import sqliteRoutes from './sqliteApi.js';

const router = Router();

// DevFlow Service API routes
router.use('/', sqliteRoutes);

export default router;
