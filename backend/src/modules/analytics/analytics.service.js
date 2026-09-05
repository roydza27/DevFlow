import * as analyticsRepo from './analytics.repository.js';

export function getStorageStats() {
  return analyticsRepo.getStorageStats();
}
