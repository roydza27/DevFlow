import { Router } from 'express';
import * as noteController from './note.controller.js';

const router = Router();

router.post('/projects/:id/notes', noteController.addNote);
router.patch('/notes/:noteId', noteController.updateNote);
router.delete('/notes/:noteId', noteController.deleteNote);

export default router;
