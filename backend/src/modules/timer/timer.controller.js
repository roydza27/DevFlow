import * as timerService from './timer.service.js';

export function updateTimer(req, res, next) {
  try {
    timerService.updateTimer(req.params.id, req.body);
    res.json({ message: 'Timer updated' });
  } catch (err) {
    next(err);
  }
}
