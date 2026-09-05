import * as taskService from './task.service.js';

export function addTask(req, res, next) {
  try {
    taskService.addTask(req.params.id, req.body);
    res.status(201).json({ message: 'Task added' });
  } catch (err) {
    next(err);
  }
}

export function updateTask(req, res, next) {
  try {
    taskService.updateTask(req.params.taskId, req.body);
    res.json({ message: 'Task updated' });
  } catch (err) {
    next(err);
  }
}

export function deleteTask(req, res, next) {
  try {
    taskService.deleteTask(req.params.taskId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export function clearDoneTasks(req, res, next) {
  try {
    taskService.clearDoneTasks(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
