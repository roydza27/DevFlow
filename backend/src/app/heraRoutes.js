import { Router } from 'express';
import { heraClient } from '../infrastructure/hera/index.js';

const router = Router();

router.get('/state/:projectName', (req, res, next) => {
  try {
    const state = heraClient.getProjectState(req.params.projectName);

    if (!state) {
      res.status(404).json({
        error: 'Hera state not available',
      });
      return;
    }

    res.json(state);
  } catch (error) {
    next(error);
  }
});

export default router;