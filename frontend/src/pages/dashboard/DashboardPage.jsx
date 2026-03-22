import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../../app/layout/DashboardLayout'
import TaskPanel from '../../features/tasks/TaskPanel'
import ActiveTaskPanel from '../../features/tracking/ActiveTaskPanel'
import ActionsPanel from '../../features/actions/ActionsPanel'
import NotesPanel from '../../features/context/NotesPanel'
import LinksPanel from '../../features/context/LinksPanel'

const INITIAL_TASKS = [
  { id: 1, title: 'Refactor database schema', status: 'doing' },
  { id: 2, title: 'Update API documentation', status: 'todo' },
  { id: 3, title: 'Fix auth middleware bug', status: 'todo' },
  { id: 4, title: 'Deploy to staging', status: 'blocked' },
  { id: 5, title: 'Initialize repo', status: 'done' },
]

export default function DashboardPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [activeTask, setActiveTask] = useState(INITIAL_TASKS.find(t => t.status === 'doing') || null)
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  // Reset timer when active task changes
  useEffect(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setElapsed(0)
  }, [activeTask?.id])

  // Cleanup on unmount
  useEffect(() => () => clearInterval(intervalRef.current), [])

  function handleStart() {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
  }

  function handleStop() {
    clearInterval(intervalRef.current)
    setIsRunning(false)
  }

  function handleTaskSelect(task) {
    if (task.status === 'done' || task.status === 'blocked') return
    setTasks(prev =>
      prev.map(t => {
        if (t.id === task.id) return { ...t, status: 'doing' }
        if (t.status === 'doing') return { ...t, status: 'todo' }
        return t
      })
    )
    setActiveTask({ ...task, status: 'doing' })
  }

  function handleTaskAdd(title) {
    const newTask = { id: Date.now(), title, status: 'todo' }
    setTasks(prev => [...prev, newTask])
  }

  const tasksCompleted = tasks.filter(t => t.status === 'done').length

  const totalSeconds = elapsed
  const hh = Math.floor(totalSeconds / 3600)
  const mm = Math.floor((totalSeconds % 3600) / 60)
  const timeToday = `${hh}h ${String(mm).padStart(2, '0')}m`

  return (
    <DashboardLayout
      leftPanel={
        <TaskPanel
          tasks={tasks}
          onTaskSelect={handleTaskSelect}
          onTaskAdd={handleTaskAdd}
        />
      }
      centerPanel={
        <ActiveTaskPanel
          activeTask={activeTask}
          elapsed={elapsed}
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
        />
      }
      rightPanel={<ActionsPanel />}
      notesPanel={<NotesPanel />}
      linksPanel={<LinksPanel />}
      footerProps={{ tasksCompleted, timeToday }}
    />
  )
}
