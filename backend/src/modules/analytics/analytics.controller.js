import * as analyticsService from './analytics.service.js';

export function getStats(req, res, next) {
  try {
    const stats = analyticsService.getStorageStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
