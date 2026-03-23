import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── helpers ────────────────────────────────────────────────────────────────

function ts() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function mkLog(message, type = 'info') {
  return { id: Date.now() + Math.random(), message, type, timestamp: ts() }
}

function mkTimer() {
  return { startedAt: null, accumulated: 0, activeTaskId: null }
}

// ─── sample seed data ────────────────────────────────────────────────────────

const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: 'DevFlow',
    lastAccessed: Date.now(),
    tasks: [
      { id: 1, title: 'Refactor database schema', status: 'doing' },
      { id: 2, title: 'Update API documentation', status: 'todo' },
      { id: 3, title: 'Fix auth middleware bug', status: 'todo' },
      { id: 4, title: 'Deploy to staging', status: 'blocked' },
      { id: 5, title: 'Initialize repo', status: 'done' },
    ],
    notes: [
      { id: 1, title: 'Project Notes', content: '## Project Notes\n\nWrite anything here…' },
    ],
    commands: [
      { id: 1, label: 'Develop', command: 'npm run dev' },
      { id: 2, label: 'Git Branch', command: 'feature/db-refactor' },
      { id: 3, label: 'Test', command: 'npm run test:unit' },
      { id: 4, label: 'Docker', command: 'compose up -d' },
    ],
    resources: [
      { id: 1, title: 'Figma Design Docs', url: '#', type: 'Figma' },
      { id: 2, title: 'API Endpoints Spec', url: '#', type: 'API' },
      { id: 3, title: 'DB ER Diagram', url: '#', type: 'Docs' },
    ],
    logs: [
      { id: 1, message: 'Workspace initialized', type: 'success', timestamp: ts() },
    ],
    timer: mkTimer(),
  },
  {
    id: 2,
    name: 'Monolith API',
    lastAccessed: Date.now() - 3600000,
    tasks: [
      { id: 10, title: 'Set up Express routes', status: 'doing' },
      { id: 11, title: 'Add JWT auth middleware', status: 'todo' },
      { id: 12, title: 'Write unit tests', status: 'todo' },
    ],
    notes: [{ id: 10, title: 'API Notes', content: '' }],
    commands: [],
    resources: [],
    logs: [{ id: 1, message: 'Workspace initialized', type: 'success', timestamp: ts() }],
    timer: mkTimer(),
  },
  {
    id: 3,
    name: 'Design System',
    lastAccessed: Date.now() - 7200000,
    tasks: [
      { id: 20, title: 'Create token library', status: 'todo' },
      { id: 21, title: 'Build component storybook', status: 'todo' },
    ],
    notes: [{ id: 20, title: 'Design Notes', content: '' }],
    commands: [],
    resources: [],
    logs: [{ id: 1, message: 'Workspace initialized', type: 'success', timestamp: ts() }],
    timer: mkTimer(),
  },
]

// ─── normaliser (schema migration guard) ────────────────────────────────────

function normalizeProject(p) {
  return {
    ...p,
    notes: p.notes ?? [],
    commands: p.commands ?? [],
    resources: p.resources ?? [],
    logs: p.logs ?? [],
    tasks: p.tasks ?? [],
    timer: p.timer ? { ...mkTimer(), ...p.timer } : mkTimer(),
  }
}

// ─── store ───────────────────────────────────────────────────────────────────

export const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      projects: SAMPLE_PROJECTS,
      activeProjectId: SAMPLE_PROJECTS[0].id,

      // ── internal helpers ────────────────────────────────────────────────

      _patch(projectId, updater) {
        set(state => ({
          projects: state.projects.map(p => p.id === projectId ? updater(p) : p),
        }))
      },

      _log(projectId, message, type = 'info') {
        get()._patch(projectId, p => ({
          ...p,
          logs: [mkLog(message, type), ...p.logs].slice(0, 200),
        }))
      },

      // ── project actions ─────────────────────────────────────────────────

      createProject(name) {
        const trimmed = name.trim()
        if (!trimmed) return
        const id = Date.now()
        const project = {
          id,
          name: trimmed,
          lastAccessed: Date.now(),
          tasks: [],
          notes: [{ id: id + 1, title: 'Project Notes', content: '' }],
          commands: [],
          resources: [],
          logs: [mkLog('Workspace created', 'success')],
          timer: mkTimer(),
        }
        set(state => ({
          projects: [...state.projects, project],
          activeProjectId: id,
        }))
      },

      switchProject(id) {
        const { projects, activeProjectId } = get()
        if (id === activeProjectId) return
        const project = projects.find(p => p.id === id)
        if (!project) return
        get()._patch(id, p => ({ ...p, lastAccessed: Date.now() }))
        set({ activeProjectId: id })
        get()._log(id, `Switched to: ${project.name}`, 'info')
      },

      // ── task actions ────────────────────────────────────────────────────

      addTask(projectId, title) {
        const task = { id: Date.now(), title, status: 'todo' }
        get()._patch(projectId, p => ({ ...p, tasks: [...p.tasks, task] }))
        get()._log(projectId, `Task created: ${title}`, 'info')
      },

      selectTask(projectId, taskId) {
        get()._patch(projectId, p => {
          // If already the active task, no change needed
          if (p.timer.activeTaskId === taskId && p.tasks.find(t => t.id === taskId)?.status === 'doing') {
            return p
          }
          return {
            ...p,
            tasks: p.tasks.map(t => {
              if (t.id === taskId) return { ...t, status: 'doing' }
              if (t.status === 'doing') return { ...t, status: 'todo' }
              return t
            }),
            // Reset timer when switching to a different task
            timer: { startedAt: null, accumulated: 0, activeTaskId: taskId },
          }
        })
        const task = get().projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId)
        if (task) get()._log(projectId, `Active: ${task.title}`, 'info')
      },

      markTaskDone(projectId, taskId) {
        const task = get().projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId)
        get()._patch(projectId, p => ({
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: 'done' } : t),
          timer: p.timer.activeTaskId === taskId
            ? { startedAt: null, accumulated: 0, activeTaskId: null }
            : p.timer,
        }))
        if (task) get()._log(projectId, `Done: ${task.title}`, 'success')
      },

      markTaskBlocked(projectId, taskId) {
        const task = get().projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId)
        get()._patch(projectId, p => ({
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: 'blocked' } : t),
          timer: p.timer.activeTaskId === taskId
            ? { startedAt: null, accumulated: 0, activeTaskId: null }
            : p.timer,
        }))
        if (task) get()._log(projectId, `Blocked: ${task.title}`, 'warning')
      },

      editTask(projectId, taskId, title) {
        get()._patch(projectId, p => ({
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, title } : t),
        }))
        get()._log(projectId, `Task renamed: ${title}`, 'info')
      },

      deleteTask(projectId, taskId) {
        const task = get().projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId)
        get()._patch(projectId, p => ({
          ...p,
          tasks: p.tasks.filter(t => t.id !== taskId),
          timer: p.timer.activeTaskId === taskId
            ? { startedAt: null, accumulated: 0, activeTaskId: null }
            : p.timer,
        }))
        if (task) get()._log(projectId, `Task deleted: ${task.title}`, 'warning')
      },

      // ── timer actions ───────────────────────────────────────────────────

      startTimer(projectId) {
        const project = get().projects.find(p => p.id === projectId)
        if (!project || project.timer.startedAt) return
        // Sync activeTaskId from the 'doing' task if not already set
        const doingTask = project.tasks.find(t => t.status === 'doing')
        const activeTaskId = project.timer.activeTaskId ?? doingTask?.id ?? null
        get()._patch(projectId, p => ({
          ...p,
          timer: { ...p.timer, startedAt: Date.now(), activeTaskId },
        }))
        const task = project.tasks.find(t => t.id === activeTaskId)
        if (task) get()._log(projectId, `Timer started: ${task.title}`, 'success')
      },

      stopTimer(projectId) {
        const project = get().projects.find(p => p.id === projectId)
        if (!project?.timer.startedAt) return
        const extra = Math.floor((Date.now() - project.timer.startedAt) / 1000)
        get()._patch(projectId, p => ({
          ...p,
          timer: { ...p.timer, startedAt: null, accumulated: p.timer.accumulated + extra },
        }))
        const task = project.tasks.find(t => t.id === project.timer.activeTaskId)
        if (task) get()._log(projectId, `Timer stopped: ${task.title}`, 'info')
      },

      // ── note actions ────────────────────────────────────────────────────

      addNote(projectId) {
        const id = Date.now()
        const project = get().projects.find(p => p.id === projectId)
        const note = { id, title: `Note ${(project?.notes.length ?? 0) + 1}`, content: '' }
        get()._patch(projectId, p => ({ ...p, notes: [...p.notes, note] }))
        get()._log(projectId, `Note created: ${note.title}`, 'info')
        return id
      },

      updateNote(projectId, noteId, content) {
        get()._patch(projectId, p => ({
          ...p,
          notes: p.notes.map(n => n.id === noteId ? { ...n, content } : n),
        }))
      },

      renameNote(projectId, noteId, title) {
        get()._patch(projectId, p => ({
          ...p,
          notes: p.notes.map(n => n.id === noteId ? { ...n, title } : n),
        }))
      },

      deleteNote(projectId, noteId) {
        get()._patch(projectId, p => ({
          ...p,
          notes: p.notes.filter(n => n.id !== noteId),
        }))
      },

      // ── command actions ─────────────────────────────────────────────────

      addCommand(projectId, label, command) {
        const cmd = { id: Date.now(), label, command }
        get()._patch(projectId, p => ({ ...p, commands: [...p.commands, cmd] }))
        get()._log(projectId, `Command added: ${label}`, 'info')
      },

      deleteCommand(projectId, cmdId) {
        const cmd = get().projects.find(p => p.id === projectId)?.commands.find(c => c.id === cmdId)
        get()._patch(projectId, p => ({ ...p, commands: p.commands.filter(c => c.id !== cmdId) }))
        if (cmd) get()._log(projectId, `Command removed: ${cmd.label}`, 'warning')
      },

      // ── resource actions ────────────────────────────────────────────────

      addResource(projectId, title, url, type) {
        const res = { id: Date.now(), title, url: url || '#', type }
        get()._patch(projectId, p => ({ ...p, resources: [...p.resources, res] }))
        get()._log(projectId, `Resource added: ${title}`, 'info')
      },

      deleteResource(projectId, resId) {
        const res = get().projects.find(p => p.id === projectId)?.resources.find(r => r.id === resId)
        get()._patch(projectId, p => ({ ...p, resources: p.resources.filter(r => r.id !== resId) }))
        if (res) get()._log(projectId, `Resource removed: ${res.title}`, 'warning')
      },

      // ── manual log ──────────────────────────────────────────────────────

      addLog(projectId, message, type = 'info') {
        get()._log(projectId, message, type)
      },
    }),

    {
      name: 'devflow_projects',
      // Normalize stored projects on rehydration to guard against schema drift
      merge: (stored, initial) => {
        try {
          if (!stored || !Array.isArray(stored.projects) || stored.projects.length === 0) {
            return initial
          }
          return {
            ...initial,
            ...stored,
            projects: stored.projects.map(normalizeProject),
          }
        } catch {
          return initial
        }
      },
    },
  ),
)

// ─── convenience selector ─────────────────────────────────────────────────────

export function useActiveProject() {
  return useWorkspaceStore(s => s.projects.find(p => p.id === s.activeProjectId) ?? null)
}
