import { Router } from 'express';
import taskRoutes from './tasks.js';
import noteRoutes from './notes.js';
import timeEntryRoutes from './timeEntries.js';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/notes', noteRoutes);
router.use('/time-entries', timeEntryRoutes);

export default router;
