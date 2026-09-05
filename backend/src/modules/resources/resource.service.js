import * as resRepo from './resource.repository.js';

export function getResourcesByProjectId(projectId) {
  return resRepo.getResourcesByProjectId(projectId);
}

export function addResource(projectId, res) {
  resRepo.addResource(projectId, res);
}

export function deleteResource(resourceId) {
  resRepo.deleteResource(resourceId);
}
