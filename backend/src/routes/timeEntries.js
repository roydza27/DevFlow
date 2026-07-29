import { Router } from 'express';
import {
  getAllTimeEntries,
  getTimeEntryById,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
} from '../controllers/TimeTrackerController.js';

const router = Router();

router.get('/', getAllTimeEntries);
router.get('/:id', getTimeEntryById);
router.post('/', createTimeEntry);
router.put('/:id', updateTimeEntry);
router.delete('/:id', deleteTimeEntry);

export default router;
