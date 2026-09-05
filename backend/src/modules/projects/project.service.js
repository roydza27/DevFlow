import * as projectRepo from './project.repository.js';
import { taskRepository } from '../tasks/index.js';
import { noteRepository } from '../notes/index.js';
import { commandRepository } from '../commands/index.js';
import { resourceRepository } from '../resources/index.js';
import { logRepository } from '../logs/index.js';
import { timerRepository } from '../timer/index.js';
import { validateFolderPath, initWorkspaceFolder, watchWorkspaceFolder } from '../../infrastructure/filesystem/watcher.service.js';

export function getAllProjects() {
  const projects = projectRepo.getAllProjectRows();

  return projects.map(p => {
    const tasks = taskRepository.getTasksByProjectId(p.id);
    const notes = noteRepository.getNotesByProjectId(p.id);
    const commands = commandRepository.getCommandsByProjectId(p.id);
    const resources = resourceRepository.getResourcesByProjectId(p.id);
    const logs = logRepository.getLogsByProjectId(p.id, 200);
    const timerRow = timerRepository.getTimerByProjectId(p.id);

    return {
      ...p,
      tasks,
      notes,
      commands,
      resources,
      logs,
      timer: timerRow || { startedAt: null, accumulated: 0, activeTaskId: null }
    };
  });
}

export function createProject(data) {
  const id = String(data.id || Date.now());
  const now = Date.now();

  projectRepo.createProject(id, data.name, data.linkedFolderName, now);
  timerRepository.initTimer(id);

  // Default initial note
  noteRepository.addNote(id, {
    id: `${id}-1`,
    title: 'Project Notes',
    content: ''
  });

  const validPath = validateFolderPath(data.folderPath);
  if (validPath) {
    initWorkspaceFolder(validPath, { id, name: data.name });
    watchWorkspaceFolder(id, validPath);
  }

  return id;
}

export function updateProject(id, data) {
  projectRepo.updateProject(id, data);
}

export function deleteProject(id) {
  projectRepo.deleteProject(id);
}

export function linkFolder(id, folderPath, name) {
  const validPath = validateFolderPath(folderPath);
  if (!validPath) {
    throw new Error('Invalid or inaccessible directory path');
  }

  projectRepo.updateProject(id, { linkedFolderName: validPath });
  initWorkspaceFolder(validPath, { id, name: name || 'Workspace' });
  watchWorkspaceFolder(id, validPath);

  return validPath;
}
