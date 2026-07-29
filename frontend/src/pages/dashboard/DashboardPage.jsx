import { useState, useEffect, useRef } from 'react'
import { Layers, FolderOpen, Plus, Check } from 'lucide-react'
import Workspace from '../../features/workspace/Workspace'
import { useWorkspaceStore, useActiveProject } from '../../store/useWorkspaceStore'
import { restoreHandles, isFileSystemSupported, pickDirectory } from '../../services/fileSystemService'

const FS_SUPPORTED = isFileSystemSupported()

// ─── Onboarding screen (shown when there are no workspaces) ──────────────────

function OnboardingScreen({ onCreateProject }) {
  const [name, setName] = useState('')
  const [pendingHandle, setPendingHandle] = useState(null)
  const [pickingFolder, setPickingFolder] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function handlePickFolder() {
    setPickingFolder(true)
    try {
      const handle = await pickDirectory()
      setPendingHandle(handle ?? null)
    } catch {
      setPendingHandle(null)
    } finally {
      setPickingFolder(false)
    }
  }

  function handleCreate() {
    const trimmed = name.trim()
    if (!trimmed) return
    onCreateProject(trimmed, pendingHandle)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleCreate()
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6">
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Layers size={28} className="text-primary" />
          </div>
          <div className="text-center">
            <h1 className="font-headline text-2xl font-semibold text-on-surface">DevFlow</h1>
            <p className="text-sm text-outline mt-1">Create your first workspace to get started</p>
          </div>
        </div>

        {/* Creation form */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Workspace name…"
              className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container text-sm text-on-surface placeholder-outline border border-outline-variant focus:border-primary focus:outline-none font-body"
            />
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-label font-semibold disabled:opacity-40 transition-opacity hover:opacity-90 shrink-0"
            >
              <Plus size={15} />
              Create
            </button>
          </div>

          {/* Optional folder link */}
          {FS_SUPPORTED && (
            <button
              onClick={handlePickFolder}
              disabled={pickingFolder}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border ${
                pendingHandle
                  ? 'border-tertiary text-tertiary bg-tertiary/10'
                  : 'border-outline-variant text-outline hover:text-on-surface hover:border-outline'
              }`}
            >
              <FolderOpen size={15} />
              {pickingFolder
                ? 'Selecting…'
                : pendingHandle
                  ? `📁 ${pendingHandle.name}`
                  : 'Link project folder (optional)'}
            </button>
          )}
        </div>

        <p className="text-xs text-outline/60 text-center">
          Your data is stored locally in your browser.
          {FS_SUPPORTED && ' Link a folder to also save files to disk.'}
        </p>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const {
    projects,
    activeProjectId,
    createProject,
    switchProject,
    renameProject,
    deleteProject,
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
    syncObsidianFolder,
    importMarkdownFileList,
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
    if (projectIds.length > 0) restoreHandles(projectIds).catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Timer display ─────────────────────────────────────────────────────────
  const timer = project?.timer
  const isRunning = !!timer?.startedAt
  const [displayElapsed, setDisplayElapsed] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    clearInterval(intervalRef.current)
    if (!timer) { setDisplayElapsed(0); return }

    function updateElapsed() {
      if (timer.startedAt) {
        const extra = Math.floor((Date.now() - timer.startedAt) / 1000)
        setDisplayElapsed(timer.accumulated + extra)
      } else {
        setDisplayElapsed(timer.accumulated)
      }
    }

    updateElapsed()

    if (isRunning && timer.startedAt) {
      intervalRef.current = setInterval(updateElapsed, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [activeProjectId, isRunning, timer?.startedAt, timer?.accumulated]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived values (Calculated across ALL workspaces) ────────────────────────
  const tasks = project?.tasks ?? []
  const activeTask = tasks.find(t => t.status === 'doing') ?? null
  const tasksCompleted = tasks.filter(t => t.status === 'done').length

  // Global totals across all projects
  const totalTasksCompleted = projects.reduce((sum, p) => {
    return sum + (p.tasks ?? []).filter(t => t.status === 'done').length
  }, 0)

  const globalTotalSeconds = projects.reduce((sum, p) => {
    let projectSecs = p.timer?.accumulated ?? 0
    if (p.timer?.startedAt) {
      projectSecs += Math.floor((Date.now() - p.timer.startedAt) / 1000)
    }
    return sum + projectSecs
  }, 0)

  const hh = Math.floor(globalTotalSeconds / 3600)
  const mm = Math.floor((globalTotalSeconds % 3600) / 60)
  const timeToday = `${hh}h ${String(mm).padStart(2, '0')}m`

  // ── Handlers ──────────────────────────────────────────────────────────────
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

  // ── No workspaces — show onboarding ───────────────────────────────────────
  if (!project) {
    return <OnboardingScreen onCreateProject={createProject} />
  }

  return (
    <Workspace
      projects={projects}
      currentProject={project}
      onProjectSwitch={switchProject}
      onCreateProject={createProject}
      onRenameProject={renameProject}
      onDeleteProject={deleteProject}
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
      onNoteSyncObsidian={handle => syncObsidianFolder(activeProjectId, handle)}
      onNoteImportFileList={fileList => importMarkdownFileList(activeProjectId, fileList)}
      commands={project.commands ?? []}
      onCommandAdd={(label, command) => addCommand(activeProjectId, label, command)}
      onCommandDelete={id => deleteCommand(activeProjectId, id)}
      resources={project.resources ?? []}
      onResourceAdd={(title, url, type) => addResource(activeProjectId, title, url, type)}
      onResourceDelete={id => deleteResource(activeProjectId, id)}
      globalTasksCompleted={totalTasksCompleted}
      globalTimeToday={timeToday}
    />
  )
}
