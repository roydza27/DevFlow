import { useState, useEffect, useRef } from 'react'
import Workspace from '../../features/workspace/Workspace'
import { useWorkspaceStore, useActiveProject } from '../../store/useWorkspaceStore'
import { restoreHandles } from '../../services/fileSystemService'

export default function DashboardPage() {
  const {
    projects,
    activeProjectId,
    createProject,
    switchProject,
    linkFolder,
    unlinkFolder,
    addTask,
    selectTask,
    markTaskDone,
    markTaskBlocked,
    editTask,
    deleteTask,
    startTimer,
    stopTimer,
    addNote,
    updateNote,
    renameNote,
    deleteNote,
    addCommand,
    deleteCommand,
    addResource,
    deleteResource,
    addLog,
  } = useWorkspaceStore()

  const project = useActiveProject()

  // ── Restore folder handles from IndexedDB on startup ─────────────────────
  useEffect(() => {
    const projectIds = useWorkspaceStore.getState().projects.map(p => p.id)
    restoreHandles(projectIds).catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── timer display ─────────────────────────────────────────────────────────
  const timer = project?.timer
  const isRunning = !!timer?.startedAt
  const [displayElapsed, setDisplayElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!timer) { setDisplayElapsed(0); return }

    if (isRunning && timer.startedAt) {
      const acc = timer.accumulated
      const startedAt = timer.startedAt
      setDisplayElapsed(acc + Math.floor((Date.now() - startedAt) / 1000))
      intervalRef.current = setInterval(() => {
        setDisplayElapsed(acc + Math.floor((Date.now() - startedAt) / 1000))
      }, 1000)
    } else {
      setDisplayElapsed(timer.accumulated)
    }
    return () => clearInterval(intervalRef.current)
  }, [activeProjectId, isRunning]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── derived ───────────────────────────────────────────────────────────────
  const tasks = project?.tasks ?? []
  const activeTask = tasks.find(t => t.status === 'doing') ?? null
  const tasksCompleted = tasks.filter(t => t.status === 'done').length

  const hh = Math.floor(displayElapsed / 3600)
  const mm = Math.floor((displayElapsed % 3600) / 60)
  const timeToday = `${hh}h ${String(mm).padStart(2, '0')}m`

  // ── handlers ──────────────────────────────────────────────────────────────
  function handleStart() {
    if (!activeTask || isRunning) return
    startTimer(activeProjectId)
  }

  function handleStop() {
    stopTimer(activeProjectId)
  }

  function handleLog({ message, type = 'info' }) {
    addLog(activeProjectId, message, type)
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface">
        <div className="text-center">
          <p className="text-outline mb-3">No workspace found.</p>
          <button
            onClick={() => createProject('My Workspace')}
            className="px-4 py-2 bg-primary text-on-primary rounded text-sm"
          >
            Create your first workspace
          </button>
        </div>
      </div>
    )
  }

  return (
    <Workspace
      projects={projects}
      currentProject={project}
      onProjectSwitch={switchProject}
      onCreateProject={createProject}
      onLinkFolder={linkFolder}
      onUnlinkFolder={unlinkFolder}
      tasks={tasks}
      activeTask={activeTask}
      elapsed={displayElapsed}
      isRunning={isRunning}
      onStart={handleStart}
      onStop={handleStop}
      onTaskSelect={t => selectTask(activeProjectId, t.id)}
      onTaskAdd={title => addTask(activeProjectId, title)}
      onTaskDone={id => markTaskDone(activeProjectId, id)}
      onTaskBlock={id => markTaskBlocked(activeProjectId, id)}
      onTaskEdit={(id, title) => editTask(activeProjectId, id, title)}
      onTaskDelete={id => deleteTask(activeProjectId, id)}
      tasksCompleted={tasksCompleted}
      timeToday={timeToday}
      logs={project.logs ?? []}
      onLog={handleLog}
      notes={project.notes ?? []}
      onNoteNew={() => addNote(activeProjectId)}
      onNoteChange={(noteId, content) => updateNote(activeProjectId, noteId, content)}
      onNoteRename={(noteId, title) => renameNote(activeProjectId, noteId, title)}
      onNoteDelete={noteId => deleteNote(activeProjectId, noteId)}
      commands={project.commands ?? []}
      onCommandAdd={(label, command) => addCommand(activeProjectId, label, command)}
      onCommandDelete={id => deleteCommand(activeProjectId, id)}
      resources={project.resources ?? []}
      onResourceAdd={(title, url, type) => addResource(activeProjectId, title, url, type)}
      onResourceDelete={id => deleteResource(activeProjectId, id)}
    />
  )
}
