import { Router } from 'express';
import * as analyticsController from './analytics.controller.js';

const router = Router();

router.get('/stats', analyticsController.getStats);

export default router;
