import Footer from '../../components/shared/Footer'
import WorkspaceHeader from './WorkspaceHeader'

export default function DashboardLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  notesPanel,
  footerProps,
}) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <WorkspaceHeader />

      {/* Main workspace grid */}
      <div className="flex flex-1 gap-3 p-3 overflow-hidden min-h-0">
        {/* Left: Tasks */}
        <aside className="w-72 shrink-0 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col">
          {leftPanel}
        </aside>

        {/* Center + Bottom */}
        <main className="flex-1 flex flex-col gap-3 overflow-hidden min-w-0">
          {/* Center: Focus panel */}
          <div className="flex-1 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col">
            {centerPanel}
          </div>
          {/* Bottom: Notes workspace */}
          <div className="h-52 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col shrink-0">
            {notesPanel}
          </div>
        </main>

        {/* Right: Sidebar */}
        <aside className="w-64 shrink-0 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col">
          {rightPanel}
        </aside>
      </div>

      <Footer {...footerProps} />
    </div>
  )
}
