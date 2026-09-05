import * as cmdService from './command.service.js';

export function addCommand(req, res, next) {
  try {
    cmdService.addCommand(req.params.id, req.body);
    res.status(201).json({ message: 'Command added' });
  } catch (err) {
    next(err);
  }
}

export function deleteCommand(req, res, next) {
  try {
    cmdService.deleteCommand(req.params.commandId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
