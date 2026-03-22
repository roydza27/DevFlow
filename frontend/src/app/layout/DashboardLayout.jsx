import Footer from '../../components/shared/Footer'

export default function DashboardLayout({
  leftPanel,
  centerPanel,
  rightPanel,
  notesPanel,
  linksPanel,
  footerProps,
}) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Main content */}
      <div className="flex flex-1 gap-3 p-3 overflow-hidden min-h-0">
        {/* Left: Tasks */}
        <aside className="w-72 shrink-0 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col">
          {leftPanel}
        </aside>

        {/* Center: Active task + center content */}
        <main className="flex-1 flex flex-col gap-3 overflow-hidden min-w-0">
          <div className="flex-1 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col">
            {centerPanel}
          </div>
          {/* Bottom: Notes + Links */}
          <div className="h-52 flex gap-3 shrink-0">
            <div className="flex-1 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col">
              {notesPanel}
            </div>
            <div className="w-72 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col">
              {linksPanel}
            </div>
          </div>
        </main>

        {/* Right: Actions */}
        <aside className="w-64 shrink-0 bg-surface-container rounded-xl p-4 overflow-hidden flex flex-col">
          {rightPanel}
        </aside>
      </div>

      {/* Footer */}
      <Footer {...footerProps} />
    </div>
  )
}
