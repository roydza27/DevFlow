import { create } from 'zustand'
import { api } from '../services/apiClient'
import {
  getDirHandle,
  setDirHandle,
  saveHandleToIDB,
  removeHandleFromIDB,
  scanMarkdownFilesFromDir,
  scanMarkdownFromFiles,
} from '../services/fileSystemService'

// ─── helpers ────────────────────────────────────────────────────────────────

function ts() {
  const d = new Date()
  const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return `${dateStr}, ${timeStr}`
}

function mkLog(message, type = 'info') {
  return { id: String(Date.now() + Math.random()), message, type, timestamp: ts() }
}

function mkTimer() {
  return { startedAt: null, accumulated: 0, activeTaskId: null }
}

function normalizeProject(p) {
  const projId = String(p.id);
  const tasks = (p.tasks ?? []).map(t => ({
    ...t,
    id: String(t.id),
    totalTime: t.totalTime ?? t.accumulatedSeconds ?? 0,
    startedAt: t.startedAt ?? null,
    isRunning: Boolean(t.isRunning),
  }));

  return {
    ...p,
    id: projId,
    linkedFolderName: p.linkedFolderName ?? null,
    notes: (p.notes ?? []).map(n => ({ ...n, id: String(n.id) })),
    commands: (p.commands ?? []).map(c => ({ ...c, id: String(c.id) })),
    resources: (p.resources ?? []).map(r => ({ ...r, id: String(r.id) })),
    logs: (p.logs ?? []).map(l => ({ ...l, id: String(l.id) })),
    tasks,
  }
}

// ─── store ───────────────────────────────────────────────────────────────────

export const useWorkspaceStore = create((set, get) => ({
  projects: [],
  activeProjectId: null,
  isLoading: false,
  error: null,

  // ── fetch initial state from REST API ─────────────────────────────

  async fetchProjects() {
    set({ isLoading: true, error: null })
    try {
      const data = await api.getProjects()
      const projects = (data || []).map(normalizeProject)
      const currentActive = get().activeProjectId
      const activeExists = projects.some(p => p.id === currentActive)
      set({
        projects,
        activeProjectId: activeExists ? currentActive : (projects[0]?.id ?? null),
        isLoading: false,
      })
    } catch (err) {
      console.warn('[WorkspaceStore] API fetch failed, falling back to empty state:', err.message)
      set({ isLoading: false, error: err.message })
    }
  },

  // ── internal helpers ────────────────────────────────────────────────

  _patch(projectId, updater) {
    set(state => ({
      projects: state.projects.map(p => p.id === projectId ? updater(p) : p),
    }))
  },

  _log(projectId, message, type = 'info') {
    const log = mkLog(message, type)
    get()._patch(projectId, p => ({
      ...p,
      logs: [log, ...p.logs].slice(0, 200),
    }))
    api.addLog(projectId, log).catch(() => {})
  },

  // ── project actions ─────────────────────────────────────────────────

  async createProject(name, dirHandle = null) {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = Date.now()
    const folderName = dirHandle?.name ?? null
    const newProjData = {
      id,
      name: trimmed,
      linkedFolderName: folderName,
      folderPath: folderName, // If supported locally
    }

    // Optimistic UI Update
    const project = {
      ...newProjData,
      lastAccessed: Date.now(),
      tasks: [],
      notes: [{ id: `${id}-1`, title: 'Project Notes', content: '' }],
      commands: [],
      resources: [],
      logs: [mkLog(folderName ? `Workspace created — linked to folder: ${folderName}` : 'Workspace created', 'success')],
      timer: mkTimer(),
    }

    set(state => ({
      projects: [...state.projects, project],
      activeProjectId: id,
    }))

    if (dirHandle) {
      setDirHandle(id, dirHandle)
      saveHandleToIDB(id, dirHandle).catch(() => {})
    }

    try {
      await api.createProject(newProjData)
    } catch (err) {
      console.error('Failed to create project via API:', err)
    }
  },

  async linkFolder(projectId, dirHandle) {
    if (!dirHandle) return
    setDirHandle(projectId, dirHandle)
    saveHandleToIDB(projectId, dirHandle).catch(() => {})

    get()._patch(projectId, p => ({
      ...p,
      linkedFolderName: dirHandle.name,
      logs: [mkLog(`Folder linked: ${dirHandle.name}`, 'success'), ...p.logs].slice(0, 200),
    }))

    try {
      await api.linkFolder(projectId, { folderPath: dirHandle.name, name: dirHandle.name })
    } catch (err) {
      console.error('Failed to link folder via API:', err)
    }
  },

  unlinkFolder(projectId) {
    setDirHandle(projectId, null)
    removeHandleFromIDB(projectId).catch(() => {})
    get()._patch(projectId, p => ({
      ...p,
      linkedFolderName: null,
      logs: [mkLog('Folder unlinked', 'info'), ...p.logs].slice(0, 200),
    }))
    api.updateProject(projectId, { linkedFolderName: null }).catch(() => {})
  },

  switchProject(id) {
    const { projects, activeProjectId } = get()
    if (id === activeProjectId) return
    const project = projects.find(p => p.id === id)
    if (!project) return

    const now = Date.now()

    // Pause running tasks in current project before switching
    if (activeProjectId) {
      const currentActive = projects.find(p => p.id === activeProjectId)
      if (currentActive) {
        const updatedTasks = []
        get()._patch(activeProjectId, p => ({
          ...p,
          tasks: p.tasks.map(t => {
            if (t.isRunning) {
              const extra = t.startedAt ? Math.floor((now - t.startedAt) / 1000) : 0
              const updated = {
                ...t,
                totalTime: (t.totalTime || 0) + extra,
                startedAt: null,
                isRunning: false,
              }
              updatedTasks.push(updated)
              return updated
            }
            return t
          })
        }))
        updatedTasks.forEach(t => {
          api.updateTask(t.id, {
            totalTime: t.totalTime,
            startedAt: null,
            isRunning: false,
          }).catch(() => {})
        })
      }
    }

    get()._patch(id, p => ({ ...p, lastAccessed: now }))
    set({ activeProjectId: id })
    get()._log(id, `Switched to: ${project.name}`, 'info')
    api.updateProject(id, { lastAccessed: now }).catch(() => {})
  },

  async renameProject(projectId, name) {
    const trimmed = name.trim()
    if (!trimmed) return
    get()._patch(projectId, p => ({ ...p, name: trimmed }))
    get()._log(projectId, `Workspace renamed to: ${trimmed}`, 'info')
    try {
      await api.updateProject(projectId, { name: trimmed })
    } catch (err) {
      console.error('Failed to rename project via API:', err)
    }
  },

  async deleteProject(projectId) {
    const { projects, activeProjectId } = get()
    const remaining = projects.filter(p => p.id !== projectId)
    const newActive = projectId === activeProjectId
      ? (remaining.sort((a, b) => b.lastAccessed - a.lastAccessed)[0]?.id ?? null)
      : activeProjectId

    setDirHandle(projectId, null)
    removeHandleFromIDB(projectId).catch(() => {})
    set({ projects: remaining, activeProjectId: newActive })

    try {
      await api.deleteProject(projectId)
    } catch (err) {
      console.error('Failed to delete project via API:', err)
    }
  },

  // ── task actions ────────────────────────────────────────────────────

  // ── task actions ────────────────────────────────────────────────────

  async addTask(projectId, title) {
    const task = {
      id: Date.now(),
      title,
      status: 'todo',
      totalTime: 0,
      startedAt: null,
      isRunning: false,
    }
    get()._patch(projectId, p => ({ ...p, tasks: [...p.tasks, task] }))
    get()._log(projectId, `Task created: ${title}`, 'info')
    try {
      await api.addTask(projectId, task)
    } catch (err) {
      console.error('Failed to add task via API:', err)
    }
  },

  selectTask(projectId, taskId) {
    const now = Date.now()
    const updatedTasks = []

    get()._patch(projectId, p => {
      const activeTask = p.tasks.find(t => t.id === taskId)
      if (!activeTask) return p

      const newTasks = p.tasks.map(t => {
        // Switch into active task: set doing, start task timer
        if (t.id === taskId) {
          const updated = {
            ...t,
            status: 'doing',
            startedAt: now,
            isRunning: true,
          }
          updatedTasks.push(updated)
          return updated
        }

        // Pause any previously running task
        if (t.isRunning || t.status === 'doing') {
          let extra = 0
          if (t.isRunning && t.startedAt) {
            extra = Math.floor((now - t.startedAt) / 1000)
          }
          const updated = {
            ...t,
            status: 'todo',
            totalTime: (t.totalTime || 0) + extra,
            startedAt: null,
            isRunning: false,
          }
          updatedTasks.push(updated)
          return updated
        }

        return t
      })

      return { ...p, tasks: newTasks }
    })

    const selected = get().projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId)
    if (selected) get()._log(projectId, `Active & Timer Started: ${selected.title}`, 'info')

    updatedTasks.forEach(t => {
      api.updateTask(t.id, {
        status: t.status,
        totalTime: t.totalTime,
        startedAt: t.startedAt,
        isRunning: t.isRunning,
      }).catch(() => {})
    })
  },

  clearDoneUI(projectId) {
    get()._patch(projectId, p => ({
      ...p,
      tasks: p.tasks.map(t => t.status === 'done' ? { ...t, status: 'archived' } : t)
    }))
    api.clearDoneTasks(projectId).catch(() => {})
  },

  markTaskDone(projectId, taskId) {
    const now = Date.now()
    let targetTask = null

    get()._patch(projectId, p => {
      const task = p.tasks.find(t => t.id === taskId)
      if (!task) return p

      let extra = 0
      if (task.isRunning && task.startedAt) {
        extra = Math.floor((now - task.startedAt) / 1000)
      }

      targetTask = {
        ...task,
        status: 'done',
        totalTime: (task.totalTime || 0) + extra,
        startedAt: null,
        isRunning: false,
      }

      return {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? targetTask : t),
      }
    })

    if (targetTask) {
      get()._log(projectId, `Done: ${targetTask.title}`, 'success')
      api.updateTask(taskId, {
        status: 'done',
        totalTime: targetTask.totalTime,
        startedAt: null,
        isRunning: false,
      }).catch(() => {})
    }
  },

  markTaskBlocked(projectId, taskId) {
    const now = Date.now()
    let targetTask = null

    get()._patch(projectId, p => {
      const task = p.tasks.find(t => t.id === taskId)
      if (!task) return p

      let extra = 0
      if (task.isRunning && task.startedAt) {
        extra = Math.floor((now - task.startedAt) / 1000)
      }

      targetTask = {
        ...task,
        status: 'blocked',
        totalTime: (task.totalTime || 0) + extra,
        startedAt: null,
        isRunning: false,
      }

      return {
        ...p,
        tasks: p.tasks.map(t => t.id === taskId ? targetTask : t),
      }
    })

    if (targetTask) {
      get()._log(projectId, `Blocked: ${targetTask.title}`, 'warning')
      api.updateTask(taskId, {
        status: 'blocked',
        totalTime: targetTask.totalTime,
        startedAt: null,
        isRunning: false,
      }).catch(() => {})
    }
  },

  editTask(projectId, taskId, title) {
    get()._patch(projectId, p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === taskId ? { ...t, title } : t),
    }))
    get()._log(projectId, `Task renamed: ${title}`, 'info')
    api.updateTask(taskId, { title }).catch(() => {})
  },

  deleteTask(projectId, taskId) {
    const task = get().projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId)
    get()._patch(projectId, p => ({
      ...p,
      tasks: p.tasks.filter(t => t.id !== taskId),
    }))
    if (task) get()._log(projectId, `Task deleted: ${task.title}`, 'warning')

    api.deleteTask(taskId).catch(() => {})
  },

  // ── timer actions (operates directly on active doing task) ──────────────────────────

  startTimer(projectId) {
    const project = get().projects.find(p => p.id === projectId)
    if (!project) return
    const activeTask = project.tasks.find(t => t.status === 'doing' || t.isRunning)
    if (!activeTask || activeTask.isRunning) return

    const now = Date.now()
    const updated = { ...activeTask, startedAt: now, isRunning: true }

    get()._patch(projectId, p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === activeTask.id ? updated : t)
    }))
    get()._log(projectId, `Timer started: ${activeTask.title}`, 'success')

    api.updateTask(activeTask.id, {
      startedAt: now,
      isRunning: true,
    }).catch(() => {})
  },

  stopTimer(projectId) {
    const project = get().projects.find(p => p.id === projectId)
    if (!project) return
    const runningTask = project.tasks.find(t => t.isRunning)
    if (!runningTask) return

    const now = Date.now()
    let extra = 0
    if (runningTask.startedAt) {
      extra = Math.floor((now - runningTask.startedAt) / 1000)
    }

    const updated = {
      ...runningTask,
      totalTime: (runningTask.totalTime || 0) + extra,
      startedAt: null,
      isRunning: false,
    }

    get()._patch(projectId, p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === runningTask.id ? updated : t)
    }))
    get()._log(projectId, `Timer stopped: ${runningTask.title}`, 'info')

    api.updateTask(runningTask.id, {
      totalTime: updated.totalTime,
      startedAt: null,
      isRunning: false,
    }).catch(() => {})
  },

  // ── note actions ────────────────────────────────────────────────────

  async addNote(projectId) {
    const id = String(Date.now())
    const project = get().projects.find(p => p.id === projectId)
    const note = { id, title: `Note ${(project?.notes.length ?? 0) + 1}`, content: '' }

    get()._patch(projectId, p => ({ ...p, notes: [...p.notes, note] }))
    get()._log(projectId, `Note created: ${note.title}`, 'info')

    try {
      await api.addNote(projectId, note)
    } catch (err) {
      console.error('Failed to add note via API:', err)
    }
    return id
  },

  updateNote(projectId, noteId, content) {
    get()._patch(projectId, p => ({
      ...p,
      notes: p.notes.map(n => n.id === noteId ? { ...n, content } : n),
    }))
    api.updateNote(noteId, { content }).catch(() => {})
  },

  renameNote(projectId, noteId, title) {
    get()._patch(projectId, p => ({
      ...p,
      notes: p.notes.map(n => n.id === noteId ? { ...n, title } : n),
    }))
    api.updateNote(noteId, { title }).catch(() => {})
  },

  deleteNote(projectId, noteId) {
    get()._patch(projectId, p => ({
      ...p,
      notes: p.notes.filter(n => n.id !== noteId),
    }))
    api.deleteNote(noteId).catch(() => {})
  },

  // ── command actions ─────────────────────────────────────────────────

  async addCommand(projectId, label, command) {
    const cmd = { id: String(Date.now()), label, command }
    get()._patch(projectId, p => ({ ...p, commands: [...p.commands, cmd] }))
    get()._log(projectId, `Command added: ${label}`, 'info')

    try {
      await api.addCommand(projectId, cmd)
    } catch (err) {
      console.error('Failed to add command via API:', err)
    }
  },

  deleteCommand(projectId, cmdId) {
    const cmd = get().projects.find(p => p.id === projectId)?.commands.find(c => c.id === cmdId)
    get()._patch(projectId, p => ({ ...p, commands: p.commands.filter(c => c.id !== cmdId) }))
    if (cmd) get()._log(projectId, `Command removed: ${cmd.label}`, 'warning')

    api.deleteCommand(cmdId).catch(() => {})
  },

  // ── resource actions ────────────────────────────────────────────────

  async addResource(projectId, title, url, type) {
    const res = { id: String(Date.now()), title, url: url || '#', type }
    get()._patch(projectId, p => ({ ...p, resources: [...p.resources, res] }))
    get()._log(projectId, `Resource added: ${title}`, 'info')

    try {
      await api.addResource(projectId, res)
    } catch (err) {
      console.error('Failed to add resource via API:', err)
    }
  },

  deleteResource(projectId, resId) {
    const res = get().projects.find(p => p.id === projectId)?.resources.find(r => r.id === resId)
    get()._patch(projectId, p => ({ ...p, resources: p.resources.filter(r => r.id !== resId) }))
    if (res) get()._log(projectId, `Resource removed: ${res.title}`, 'warning')

    api.deleteResource(resId).catch(() => {})
  },

  // ── manual log ──────────────────────────────────────────────────────

  addLog(projectId, message, type = 'info') {
    get()._log(projectId, message, type)
  },

  clearLogs(projectId) {
    get()._patch(projectId, p => ({ ...p, logs: [] }))
    api.clearLogs(projectId).catch(() => {})
  },
}))

// ─── convenience selector ─────────────────────────────────────────────────────

export function useActiveProject() {
  return useWorkspaceStore(s => s.projects.find(p => p.id === s.activeProjectId) ?? null)
}
