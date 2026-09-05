import { Router } from 'express';
import * as resController from './resource.controller.js';

const router = Router();

router.post('/projects/:id/resources', resController.addResource);
router.delete('/resources/:resourceId', resController.deleteResource);

export default router;
