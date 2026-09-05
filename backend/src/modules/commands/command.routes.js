import { Router } from 'express';
import * as cmdController from './command.controller.js';

const router = Router();

router.post('/projects/:id/commands', cmdController.addCommand);
router.delete('/commands/:commandId', cmdController.deleteCommand);

export default router;
