import * as projectService from './project.service.js';

export function getAllProjects(req, res, next) {
  try {
    const projects = projectService.getAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export function createProject(req, res, next) {
  try {
    const id = projectService.createProject(req.body);
    res.status(201).json({ id, message: 'Project created' });
  } catch (err) {
    next(err);
  }
}

export function updateProject(req, res, next) {
  try {
    projectService.updateProject(req.params.id, req.body);
    res.json({ message: 'Project updated' });
  } catch (err) {
    next(err);
  }
}

export function deleteProject(req, res, next) {
  try {
    projectService.deleteProject(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export function linkFolder(req, res, next) {
  try {
    projectService.linkFolder(req.params.id, req.body.folderPath, req.body.name);
    res.json({ message: 'Folder linked' });
  } catch (err) {
    if (err.message === 'Invalid or inaccessible directory path') {
      res.status(400).json({ error: err.message });
      return;
    }
    next(err);
  }
}
