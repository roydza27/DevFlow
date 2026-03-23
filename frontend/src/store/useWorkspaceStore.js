import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getDirHandle,
  setDirHandle,
  saveHandleToIDB,
  removeHandleFromIDB,
  writeProjectToDir,
  writeNoteToDir,
  deleteNoteFromDir,
} from '../services/fileSystemService'

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

// ─── FS sync helper ───────────────────────────────────────────────────────────
// Fire-and-forget: write the latest project snapshot to its linked folder (if any).

function syncProject(projectId) {
  const handle = getDirHandle(projectId)
  if (!handle) return
  // Read the latest state directly from the store after current tick
  setTimeout(() => {
    const project = useWorkspaceStore.getState().projects.find(p => p.id === projectId)
    if (project) writeProjectToDir(handle, project).catch(() => {})
  }, 0)
}

// ─── sample seed data ────────────────────────────────────────────────────────

const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: 'DevFlow',
    lastAccessed: Date.now(),
    linkedFolderName: null,
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
    linkedFolderName: null,
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
    linkedFolderName: null,
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
    linkedFolderName: p.linkedFolderName ?? null,
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

      /**
       * Creates a new project. Optionally links a directory handle.
       * @param {string} name
       * @param {FileSystemDirectoryHandle|null} dirHandle
       */
      createProject(name, dirHandle = null) {
        const trimmed = name.trim()
        if (!trimmed) return
        const id = Date.now()
        const folderName = dirHandle?.name ?? null
        const project = {
          id,
          name: trimmed,
          lastAccessed: Date.now(),
          linkedFolderName: folderName,
          tasks: [],
          notes: [{ id: id + 1, title: 'Project Notes', content: '' }],
          commands: [],
          resources: [],
          logs: [mkLog(
            folderName
              ? `Workspace created — linked to folder: ${folderName}`
              : 'Workspace created',
            'success',
          )],
          timer: mkTimer(),
        }
        set(state => ({
          projects: [...state.projects, project],
          activeProjectId: id,
        }))
        if (dirHandle) {
          setDirHandle(id, dirHandle)
          saveHandleToIDB(id, dirHandle).catch(() => {})
          syncProject(id)
        }
      },

      /**
       * Link (or re-link) a directory handle to an existing project.
       * @param {number} projectId
       * @param {FileSystemDirectoryHandle} dirHandle
       */
      linkFolder(projectId, dirHandle) {
        if (!dirHandle) return
        setDirHandle(projectId, dirHandle)
        saveHandleToIDB(projectId, dirHandle).catch(() => {})
        get()._patch(projectId, p => ({
          ...p,
          linkedFolderName: dirHandle.name,
          logs: [mkLog(`Folder linked: ${dirHandle.name}`, 'success'), ...p.logs].slice(0, 200),
        }))
        syncProject(projectId)
      },

      /**
       * Unlink the directory from a project (keeps localStorage data).
       * @param {number} projectId
       */
      unlinkFolder(projectId) {
        setDirHandle(projectId, null)
        removeHandleFromIDB(projectId).catch(() => {})
        get()._patch(projectId, p => ({
          ...p,
          linkedFolderName: null,
          logs: [mkLog('Folder unlinked', 'info'), ...p.logs].slice(0, 200),
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
        syncProject(projectId)
      },

      selectTask(projectId, taskId) {
        get()._patch(projectId, p => {
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
            timer: { startedAt: null, accumulated: 0, activeTaskId: taskId },
          }
        })
        const task = get().projects.find(p => p.id === projectId)?.tasks.find(t => t.id === taskId)
        if (task) get()._log(projectId, `Active: ${task.title}`, 'info')
        syncProject(projectId)
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
        syncProject(projectId)
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
        syncProject(projectId)
      },

      editTask(projectId, taskId, title) {
        get()._patch(projectId, p => ({
          ...p,
          tasks: p.tasks.map(t => t.id === taskId ? { ...t, title } : t),
        }))
        get()._log(projectId, `Task renamed: ${title}`, 'info')
        syncProject(projectId)
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
        syncProject(projectId)
      },

      // ── timer actions ───────────────────────────────────────────────────

      startTimer(projectId) {
        const project = get().projects.find(p => p.id === projectId)
        if (!project || project.timer.startedAt) return
        const doingTask = project.tasks.find(t => t.status === 'doing')
        const activeTaskId = project.timer.activeTaskId ?? doingTask?.id ?? null
        get()._patch(projectId, p => ({
          ...p,
          timer: { ...p.timer, startedAt: Date.now(), activeTaskId },
        }))
        const task = project.tasks.find(t => t.id === activeTaskId)
        if (task) get()._log(projectId, `Timer started: ${task.title}`, 'success')
        syncProject(projectId)
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
        syncProject(projectId)
      },

      // ── note actions ────────────────────────────────────────────────────

      addNote(projectId) {
        const id = Date.now()
        const project = get().projects.find(p => p.id === projectId)
        const note = { id, title: `Note ${(project?.notes.length ?? 0) + 1}`, content: '' }
        get()._patch(projectId, p => ({ ...p, notes: [...p.notes, note] }))
        get()._log(projectId, `Note created: ${note.title}`, 'info')
        // Write new empty note file
        const handle = getDirHandle(projectId)
        if (handle) writeNoteToDir(handle, note).catch(() => {})
        return id
      },

      updateNote(projectId, noteId, content) {
        get()._patch(projectId, p => ({
          ...p,
          notes: p.notes.map(n => n.id === noteId ? { ...n, content } : n),
        }))
        // Write only the changed note (debounced by NoteEditor already)
        const handle = getDirHandle(projectId)
        if (handle) {
          const note = get().projects.find(p => p.id === projectId)?.notes.find(n => n.id === noteId)
          if (note) writeNoteToDir(handle, note).catch(() => {})
        }
      },

      renameNote(projectId, noteId, title) {
        get()._patch(projectId, p => ({
          ...p,
          notes: p.notes.map(n => n.id === noteId ? { ...n, title } : n),
        }))
        // Title rename updates the notes-index; content unchanged
        const handle = getDirHandle(projectId)
        if (handle) {
          const note = get().projects.find(p => p.id === projectId)?.notes.find(n => n.id === noteId)
          if (note) writeNoteToDir(handle, note).catch(() => {})
        }
      },

      deleteNote(projectId, noteId) {
        get()._patch(projectId, p => ({
          ...p,
          notes: p.notes.filter(n => n.id !== noteId),
        }))
        const handle = getDirHandle(projectId)
        if (handle) deleteNoteFromDir(handle, noteId).catch(() => {})
      },

      // ── command actions ─────────────────────────────────────────────────

      addCommand(projectId, label, command) {
        const cmd = { id: Date.now(), label, command }
        get()._patch(projectId, p => ({ ...p, commands: [...p.commands, cmd] }))
        get()._log(projectId, `Command added: ${label}`, 'info')
        syncProject(projectId)
      },

      deleteCommand(projectId, cmdId) {
        const cmd = get().projects.find(p => p.id === projectId)?.commands.find(c => c.id === cmdId)
        get()._patch(projectId, p => ({ ...p, commands: p.commands.filter(c => c.id !== cmdId) }))
        if (cmd) get()._log(projectId, `Command removed: ${cmd.label}`, 'warning')
        syncProject(projectId)
      },

      // ── resource actions ────────────────────────────────────────────────

      addResource(projectId, title, url, type) {
        const res = { id: Date.now(), title, url: url || '#', type }
        get()._patch(projectId, p => ({ ...p, resources: [...p.resources, res] }))
        get()._log(projectId, `Resource added: ${title}`, 'info')
        syncProject(projectId)
      },

      deleteResource(projectId, resId) {
        const res = get().projects.find(p => p.id === projectId)?.resources.find(r => r.id === resId)
        get()._patch(projectId, p => ({ ...p, resources: p.resources.filter(r => r.id !== resId) }))
        if (res) get()._log(projectId, `Resource removed: ${res.title}`, 'warning')
        syncProject(projectId)
      },

      // ── manual log ──────────────────────────────────────────────────────

      addLog(projectId, message, type = 'info') {
        get()._log(projectId, message, type)
        syncProject(projectId)
      },
    }),

    {
      name: 'devflow_projects',
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
