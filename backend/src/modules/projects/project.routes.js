import { Router } from 'express';
import * as projectController from './project.controller.js';

const router = Router();

router.get('/projects', projectController.getAllProjects);
router.post('/projects', projectController.createProject);
router.patch('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);
router.post('/projects/:id/link-folder', projectController.linkFolder);

export default router;
