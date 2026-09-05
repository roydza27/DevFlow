import * as logService from './log.service.js';

export function addLog(req, res, next) {
  try {
    logService.addLog(req.params.id, req.body);
    res.status(201).json({ message: 'Log added' });
  } catch (err) {
    next(err);
  }
}

export function clearLogs(req, res, next) {
  try {
    logService.clearLogs(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
