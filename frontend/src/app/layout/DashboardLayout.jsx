import Footer from '../../components/shared/Footer'
import WorkspaceHeader from './WorkspaceHeader'

export default function DashboardLayout({
  projects,
  currentProject,
  onProjectSwitch,
  activeTask,
  leftPanel,
  centerPanel,
  rightPanel,
  notesPanel,
  footerProps,
}) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <WorkspaceHeader
        projects={projects}
        currentProject={currentProject}
        onProjectSwitch={onProjectSwitch}
        activeTask={activeTask}
      />

      {/* Main workspace — tight panel grid, no gaps */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left: Tasks panel */}
        <aside className="w-72 shrink-0 flex flex-col border-r border-outline-variant overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            {leftPanel}
          </div>
        </aside>

        {/* Center + Notes column */}
        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Center: Focus panel */}
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            {centerPanel}
          </div>
          {/* Bottom: Notes workspace */}
          <div className="h-52 shrink-0 border-t border-outline-variant flex flex-col p-3">
            {notesPanel}
          </div>
        </main>

        {/* Right: Sidebar */}
        <aside className="w-64 shrink-0 flex flex-col border-l border-outline-variant overflow-hidden">
          <div className="flex-1 overflow-y-auto hide-scrollbar p-4">
            {rightPanel}
          </div>
        </aside>
      </div>

      <Footer {...footerProps} />
    </div>
  )
}
