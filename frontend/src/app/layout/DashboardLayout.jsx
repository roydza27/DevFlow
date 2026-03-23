import React, { useState, useRef, useCallback, useEffect } from 'react'
import Footer from '../../components/shared/Footer'
import WorkspaceHeader from './WorkspaceHeader'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, ChevronDown, ChevronUp, NotebookPen, Timer, Maximize2, Minimize2 } from 'lucide-react'

const LEFT_MIN = 220
const LEFT_MAX = 420
const RIGHT_MIN = 240
const RIGHT_MAX = 440
const COLLAPSED_WIDTH = 36
const NOTES_MIN = 120
const NOTES_MAX = 600
const NOTES_DEFAULT = 240

export default function DashboardLayout({
  projects,
  currentProject,
  onProjectSwitch,
  onCreateProject,
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
  const [notesHeight, setNotesHeight] = useState(NOTES_DEFAULT)
  const [notesCollapsed, setNotesCollapsed] = useState(false)
  const [notesExpanded, setNotesExpanded] = useState(false)
  const [focusCollapsed, setFocusCollapsed] = useState(false)

  const draggingLeft = useRef(false)
  const draggingRight = useRef(false)
  const draggingNotes = useRef(false)
  const containerRef = useRef(null)
  const centerColumnRef = useRef(null)
  const cachedContainerRect = useRef(null)
  const cachedCenterRect = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (draggingLeft.current && cachedContainerRect.current) {
      const newWidth = Math.max(LEFT_MIN, Math.min(LEFT_MAX, e.clientX - cachedContainerRect.current.left))
      setLeftWidth(newWidth)
    }
    if (draggingRight.current && cachedContainerRect.current) {
      const newWidth = Math.max(RIGHT_MIN, Math.min(RIGHT_MAX, cachedContainerRect.current.right - e.clientX))
      setRightWidth(newWidth)
    }
    if (draggingNotes.current && cachedCenterRect.current) {
      const newHeight = Math.max(NOTES_MIN, Math.min(NOTES_MAX, cachedCenterRect.current.bottom - e.clientY))
      setNotesHeight(newHeight)
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    draggingLeft.current = false
    draggingRight.current = false
    draggingNotes.current = false
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
    cachedContainerRect.current = containerRef.current?.getBoundingClientRect() ?? null
    draggingLeft.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  function startDragRight(e) {
    e.preventDefault()
    cachedContainerRect.current = containerRef.current?.getBoundingClientRect() ?? null
    draggingRight.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  function startDragNotes(e) {
    e.preventDefault()
    cachedCenterRect.current = centerColumnRef.current?.getBoundingClientRect() ?? null
    draggingNotes.current = true
    document.body.style.cursor = 'row-resize'
    document.body.style.userSelect = 'none'
  }

  const effectiveLeftWidth = leftCollapsed ? COLLAPSED_WIDTH : leftWidth
  const effectiveRightWidth = rightCollapsed ? COLLAPSED_WIDTH : rightWidth
  const effectiveNotesHeight = notesCollapsed ? 32 : notesHeight

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <WorkspaceHeader
        projects={projects}
        currentProject={currentProject}
        onProjectSwitch={onProjectSwitch}
        onCreateProject={onCreateProject}
        activeTask={activeTask}
      />

      {/* Main workspace */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden min-h-0">

        {/* Left: Tasks panel */}
        <aside
          style={{ width: effectiveLeftWidth }}
          className="shrink-0 flex flex-col border-r border-outline-variant overflow-hidden transition-none relative"
        >
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

          {!leftCollapsed && (
            <div
              onMouseDown={startDragLeft}
              className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 transition-colors z-10"
            />
          )}
        </aside>

        {/* Center column: Focus + Notes stacked */}
        <main ref={centerColumnRef} className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Focus panel: slim bar when collapsed OR when notes are expanded to center */}
          {(focusCollapsed || notesExpanded) ? (
            <div className="flex items-center gap-3 px-4 py-2 border-b border-outline-variant shrink-0">
              <Timer size={13} className="text-outline shrink-0" />
              <span className="text-xs text-outline font-label flex-1 truncate">
                {activeTask ? activeTask.title : 'No task'}
              </span>
              {!notesExpanded && (
                <button
                  onClick={() => setFocusCollapsed(false)}
                  className="flex items-center gap-1 text-xs text-outline hover:text-on-surface transition-colors shrink-0"
                  title="Expand focus panel"
                >
                  <ChevronDown size={13} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col min-h-0 relative">
              <button
                onClick={() => setFocusCollapsed(true)}
                className="absolute top-2 right-2 z-10 p-1 rounded text-outline hover:text-on-surface transition-colors"
                title="Collapse focus panel"
              >
                <ChevronUp size={13} />
              </button>
              <div className="flex-1 overflow-hidden flex flex-col p-4">
                {centerPanel}
              </div>
            </div>
          )}

          {/* Notes panel — expanded (takes full center) OR fixed height at bottom */}
          {notesExpanded ? (
            <div className="flex-1 flex flex-col border-t border-outline-variant overflow-hidden min-h-0">
              {/* Notes header */}
              <div className="flex items-center justify-between px-3 py-1.5 shrink-0 border-b border-outline-variant">
                <div className="flex items-center gap-1.5">
                  <NotebookPen size={12} className="text-outline" />
                  <span className="text-xs font-label uppercase tracking-widest text-outline">Notes</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setNotesExpanded(false); setFocusCollapsed(false) }}
                    className="p-0.5 rounded text-outline hover:text-on-surface transition-colors"
                    title="Restore focus panel"
                  >
                    <Minimize2 size={13} />
                  </button>
                </div>
              </div>
              {/* Notes content — full height */}
              <div className="flex-1 overflow-hidden">
                {React.cloneElement(notesPanel, { expanded: true })}
              </div>
            </div>
          ) : (
            /* Fixed height notes at bottom */
            <div
              style={{ height: effectiveNotesHeight }}
              className="shrink-0 flex flex-col border-t border-outline-variant overflow-hidden"
            >
              {/* Notes drag handle */}
              {!notesCollapsed && (
                <div
                  onMouseDown={startDragNotes}
                  className="h-1 w-full cursor-row-resize hover:bg-primary/30 transition-colors shrink-0"
                />
              )}

              {/* Notes header bar */}
              <div className="flex items-center justify-between px-3 py-1.5 shrink-0 border-b border-outline-variant">
                <div className="flex items-center gap-1.5">
                  <NotebookPen size={12} className="text-outline" />
                  <span className="text-xs font-label uppercase tracking-widest text-outline">Notes</span>
                </div>
                <div className="flex items-center gap-1">
                  {!notesCollapsed && (
                    <button
                      onClick={() => { setNotesExpanded(true); setNotesCollapsed(false) }}
                      className="p-0.5 rounded text-outline hover:text-on-surface transition-colors"
                      title="Expand notes to center"
                    >
                      <Maximize2 size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => setNotesCollapsed(v => !v)}
                    className="p-0.5 rounded text-outline hover:text-on-surface transition-colors"
                    title={notesCollapsed ? 'Show notes' : 'Hide notes'}
                  >
                    {notesCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>
                </div>
              </div>

              {/* Notes content */}
              {!notesCollapsed && (
                <div className="flex-1 overflow-hidden p-2">
                  {React.cloneElement(notesPanel, { expanded: false })}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Right: Sidebar */}
        <aside
          style={{ width: effectiveRightWidth }}
          className="shrink-0 flex flex-col border-l border-outline-variant overflow-hidden transition-none relative"
        >
          {!rightCollapsed && (
            <div
              onMouseDown={startDragRight}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/30 transition-colors z-10"
            />
          )}

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
