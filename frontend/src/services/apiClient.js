const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const config = { ...options, headers };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP Error ${res.status}`);
    }
    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    console.error(`[API Error] ${options.method || 'GET'} ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  // Stats
  getStats: () => request('/stats'),

  // Workspaces / Projects
  getProjects: () => request('/projects'),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  linkFolder: (id, data) => request(`/projects/${id}/link-folder`, { method: 'POST', body: JSON.stringify(data) }),

  // Tasks
  addTask: (projectId, task) => request(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (taskId, data) => request(`/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (taskId) => request(`/tasks/${taskId}`, { method: 'DELETE' }),
  clearDoneTasks: (projectId) => request(`/projects/${projectId}/tasks/completed`, { method: 'DELETE' }),

  // Notes
  addNote: (projectId, note) => request(`/projects/${projectId}/notes`, { method: 'POST', body: JSON.stringify(note) }),
  updateNote: (noteId, data) => request(`/notes/${noteId}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteNote: (noteId) => request(`/notes/${noteId}`, { method: 'DELETE' }),

  // Commands & Resources
  addCommand: (projectId, cmd) => request(`/projects/${projectId}/commands`, { method: 'POST', body: JSON.stringify(cmd) }),
  deleteCommand: (commandId) => request(`/commands/${commandId}`, { method: 'DELETE' }),
  addResource: (projectId, resource) => request(`/projects/${projectId}/resources`, { method: 'POST', body: JSON.stringify(resource) }),
  deleteResource: (resourceId) => request(`/resources/${resourceId}`, { method: 'DELETE' }),

  // Logs & Timers
  addLog: (projectId, log) => request(`/projects/${projectId}/logs`, { method: 'POST', body: JSON.stringify(log) }),
  clearLogs: (projectId) => request(`/projects/${projectId}/logs`, { method: 'DELETE' }),
  updateTimer: (projectId, timer) => request(`/projects/${projectId}/timer`, { method: 'PUT', body: JSON.stringify(timer) }),
};

