import * as cmdRepo from './command.repository.js';

export function getCommandsByProjectId(projectId) {
  return cmdRepo.getCommandsByProjectId(projectId);
}

export function addCommand(projectId, cmd) {
  cmdRepo.addCommand(projectId, cmd);
}

export function deleteCommand(commandId) {
  cmdRepo.deleteCommand(commandId);
}
