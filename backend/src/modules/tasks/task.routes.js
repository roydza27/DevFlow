import { Router } from 'express';
import * as taskController from './task.controller.js';

const router = Router();

router.post('/projects/:id/tasks', taskController.addTask);
router.patch('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);
router.delete('/projects/:id/tasks/completed', taskController.clearDoneTasks);

export default router;
