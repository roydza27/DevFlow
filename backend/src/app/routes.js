import { Router } from 'express';
import { analyticsRoutes } from '../modules/analytics/index.js';
import { projectRoutes } from '../modules/projects/index.js';
import { taskRoutes } from '../modules/tasks/index.js';
import { noteRoutes } from '../modules/notes/index.js';
import { commandRoutes } from '../modules/commands/index.js';
import { resourceRoutes } from '../modules/resources/index.js';
import { logRoutes } from '../modules/logs/index.js';
import { timerRoutes } from '../modules/timer/index.js';

const router = Router();

// Mount all modular-monolith routes
router.use('/', analyticsRoutes);
router.use('/', projectRoutes);
router.use('/', taskRoutes);
router.use('/', noteRoutes);
router.use('/', commandRoutes);
router.use('/', resourceRoutes);
router.use('/', logRoutes);
router.use('/', timerRoutes);

export default router;
