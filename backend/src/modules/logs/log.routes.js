import { Router } from 'express';
import * as logController from './log.controller.js';

const router = Router();

router.post('/projects/:id/logs', logController.addLog);
router.delete('/projects/:id/logs', logController.clearLogs);

export default router;
