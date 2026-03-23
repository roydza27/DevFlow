import { useState, useRef, useCallback, useEffect } from 'react'
import Footer from '../../components/shared/Footer'
import WorkspaceHeader from './WorkspaceHeader'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'

const LEFT_MIN = 220
const LEFT_MAX = 420
const RIGHT_MIN = 240
const RIGHT_MAX = 440
const COLLAPSED_WIDTH = 36

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
  const [leftWidth, setLeftWidth] = useState(288)
  const [rightWidth, setRightWidth] = useState(260)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)

  const draggingLeft = useRef(false)
  const draggingRight = useRef(false)
  const containerRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (draggingLeft.current) {
      const newWidth = Math.max(LEFT_MIN, Math.min(LEFT_MAX, e.clientX - rect.left))
      setLeftWidth(newWidth)
    }
    if (draggingRight.current) {
      const newWidth = Math.max(RIGHT_MIN, Math.min(RIGHT_MAX, rect.right - e.clientX))
      setRightWidth(newWidth)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    draggingLeft.current = false
    draggingRight.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  function startDragLeft(e) {
    e.preventDefault()
    draggingLeft.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  function startDragRight(e) {
    e.preventDefault()
    draggingRight.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const effectiveLeftWidth = leftCollapsed ? COLLAPSED_WIDTH : leftWidth
  const effectiveRightWidth = rightCollapsed ? COLLAPSED_WIDTH : rightWidth

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <WorkspaceHeader
        projects={projects}
        currentProject={currentProject}
        onProjectSwitch={onProjectSwitch}
        activeTask={activeTask}
      />

      {/* Main workspace */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden min-h-0">

        {/* Left: Tasks panel */}
        <aside
          style={{ width: effectiveLeftWidth }}
          className="shrink-0 flex flex-col border-r border-outline-variant overflow-hidden transition-none relative"
        >
          {/* Collapse toggle */}
          <button
            onClick={() => setLeftCollapsed(v => !v)}
            className="absolute top-2 right-1.5 z-10 p-1 rounded text-outline hover:text-on-surface transition-colors"
            title={leftCollapsed ? 'Expand tasks' : 'Collapse tasks'}
          >
            {leftCollapsed ? <PanelLeftOpen size={13} /> : <PanelLeftClose size={13} />}
          </button>

          {leftCollapsed ? (
            <div className="flex-1 flex flex-col items-center pt-10 gap-3 text-outline">
              <span className="text-xs font-label uppercase tracking-widest panel-label-vertical">Tasks</span>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col p-4">
              {leftPanel}
            </div>
          )}

          {/* Resize handle */}
          {!leftCollapsed && (
            <div
              onMouseDown={startDragLeft}
              className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 transition-colors z-10"
            />
          )}
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
        <aside
          style={{ width: effectiveRightWidth }}
          className="shrink-0 flex flex-col border-l border-outline-variant overflow-hidden transition-none relative"
        >
          {/* Resize handle */}
          {!rightCollapsed && (
            <div
              onMouseDown={startDragRight}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 transition-colors z-10"
            />
          )}

          {/* Collapse toggle */}
          <button
            onClick={() => setRightCollapsed(v => !v)}
            className="absolute top-2 left-1.5 z-10 p-1 rounded text-outline hover:text-on-surface transition-colors"
            title={rightCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {rightCollapsed ? <PanelRightOpen size={13} /> : <PanelRightClose size={13} />}
          </button>

          {rightCollapsed ? (
            <div className="flex-1 flex flex-col items-center pt-10 gap-3 text-outline">
              <span className="text-xs font-label uppercase tracking-widest panel-label-vertical-right">Sidebar</span>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto hide-scrollbar p-4 pt-8">
              {rightPanel}
            </div>
          )}
        </aside>
      </div>

      <Footer {...footerProps} />
    </div>
  )
}
