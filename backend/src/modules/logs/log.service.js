import * as logRepo from './log.repository.js';

export function getLogsByProjectId(projectId, limit) {
  return logRepo.getLogsByProjectId(projectId, limit);
}

export function addLog(projectId, log) {
  logRepo.addLog(projectId, log);
}

export function clearLogs(projectId) {
  logRepo.clearLogs(projectId);
}
