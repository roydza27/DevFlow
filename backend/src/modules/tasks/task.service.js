import * as taskRepo from './task.repository.js';

export function getTasksByProjectId(projectId) {
  return taskRepo.getTasksByProjectId(projectId);
}

export function addTask(projectId, task) {
  taskRepo.addTask(projectId, task);
}

export function updateTask(taskId, data) {
  taskRepo.updateTask(taskId, data);
}

export function deleteTask(taskId) {
  taskRepo.deleteTask(taskId);
}

export function clearDoneTasks(projectId) {
  taskRepo.clearDoneTasks(projectId);
}
