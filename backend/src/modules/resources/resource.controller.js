import * as resService from './resource.service.js';

export function addResource(req, res, next) {
  try {
    resService.addResource(req.params.id, req.body);
    res.status(201).json({ message: 'Resource added' });
  } catch (err) {
    next(err);
  }
}

export function deleteResource(req, res, next) {
  try {
    resService.deleteResource(req.params.resourceId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
