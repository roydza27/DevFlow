export default function WorkspaceHeader({ projectName = 'DevFlow', activeTask = null }) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-outline-variant bg-surface-container shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs font-label uppercase tracking-widest text-outline">Project</span>
        <span className="text-sm font-headline font-semibold text-on-surface">{projectName}</span>
      </div>

      {activeTask && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-label uppercase tracking-widest text-outline">Focus</span>
          <span className="text-sm font-body font-medium text-tertiary truncate max-w-xs">
            {activeTask.title}
          </span>
        </div>
      )}
    </header>
  )
}
