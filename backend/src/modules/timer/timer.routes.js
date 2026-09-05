import { Router } from 'express';
import * as timerController from './timer.controller.js';

const router = Router();

router.put('/projects/:id/timer', timerController.updateTimer);

export default router;
