export default function WorkspaceHeader({ projectName = 'DevFlow' }) {
  return (
    <header className="flex items-center px-4 py-2 border-b border-outline-variant bg-surface-container shrink-0">
      <span className="text-xs font-label uppercase tracking-widest text-outline mr-2">Project</span>
      <span className="text-sm font-headline font-semibold text-on-surface">{projectName}</span>
    </header>
  )
}
