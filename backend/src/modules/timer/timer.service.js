import * as timerRepo from './timer.repository.js';

export function getTimerByProjectId(projectId) {
  const timer = timerRepo.getTimerByProjectId(projectId);
  return timer || { startedAt: null, accumulated: 0, activeTaskId: null };
}

export function initTimer(projectId) {
  timerRepo.initTimer(projectId);
}

export function updateTimer(projectId, timer) {
  timerRepo.updateTimer(projectId, timer);
}
