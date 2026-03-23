import { useState, useEffect, useRef, useCallback } from 'react'
import Workspace from '../../features/workspace/Workspace'

const PROJECTS = [
  {
    id: 1,
    name: 'DevFlow',
    tasks: [
      { id: 1, title: 'Refactor database schema', status: 'doing' },
      { id: 2, title: 'Update API documentation', status: 'todo' },
      { id: 3, title: 'Fix auth middleware bug', status: 'todo' },
      { id: 4, title: 'Deploy to staging', status: 'blocked' },
      { id: 5, title: 'Initialize repo', status: 'done' },
    ],
  },
  {
    id: 2,
    name: 'Monolith API',
    tasks: [
      { id: 10, title: 'Set up Express routes', status: 'doing' },
      { id: 11, title: 'Add JWT auth middleware', status: 'todo' },
      { id: 12, title: 'Write unit tests', status: 'todo' },
    ],
  },
  {
    id: 3,
    name: 'Design System',
    tasks: [
      { id: 20, title: 'Create token library', status: 'todo' },
      { id: 21, title: 'Build component storybook', status: 'todo' },
    ],
  },
]

function buildProjectState(project) {
  const tasks = project.tasks
  return {
    tasks,
    activeTask: tasks.find(t => t.status === 'doing') || null,
  }
}

function formatTimestamp() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function DashboardPage() {
  const [currentProjectId, setCurrentProjectId] = useState(PROJECTS[0].id)
  const [projectData, setProjectData] = useState(() => {
    const map = {}
    PROJECTS.forEach(p => {
      map[p.id] = buildProjectState(p)
    })
    return map
  })
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const [logs, setLogs] = useState([
    { id: 1, message: 'Workspace initialized', type: 'success', timestamp: formatTimestamp() },
  ])

  const addLog = useCallback(({ message, type = 'info' }) => {
    setLogs(prev => [{ id: Date.now(), message, type, timestamp: formatTimestamp() }, ...prev])
  }, [])

  const currentProject = PROJECTS.find(p => p.id === currentProjectId)
  const { tasks, activeTask } = projectData[currentProjectId]

  function updateProject(id, updater) {
    setProjectData(prev => ({ ...prev, [id]: updater(prev[id]) }))
  }

  // Reset timer when active task or project changes
  useEffect(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setElapsed(0)
  }, [activeTask?.id, currentProjectId])

  // Cleanup on unmount
  useEffect(() => () => clearInterval(intervalRef.current), [])

  function handleProjectSwitch(projectId) {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setElapsed(0)
    const project = PROJECTS.find(p => p.id === projectId)
    if (project) addLog({ message: `Switched to project: ${project.name}`, type: 'info' })
    setCurrentProjectId(projectId)
  }

  function handleStart() {
    if (isRunning) return
    setIsRunning(true)
    if (activeTask) addLog({ message: `Timer started: ${activeTask.title}`, type: 'success' })
    intervalRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
  }

  function handleStop() {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    if (activeTask) addLog({ message: `Timer stopped: ${activeTask.title}`, type: 'info' })
  }

  function handleTaskSelect(task) {
    if (task.status === 'done' || task.status === 'blocked') return
    updateProject(currentProjectId, prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === task.id) return { ...t, status: 'doing' }
        if (t.status === 'doing') return { ...t, status: 'todo' }
        return t
      }),
      activeTask: { ...task, status: 'doing' },
    }))
    addLog({ message: `Active: ${task.title}`, type: 'info' })
  }

  function handleTaskAdd(title) {
    updateProject(currentProjectId, prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: Date.now(), title, status: 'todo' }],
    }))
    addLog({ message: `Task created: ${title}`, type: 'info' })
  }

  function handleTaskDone(id) {
    const task = projectData[currentProjectId].tasks.find(t => t.id === id)
    updateProject(currentProjectId, prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, status: 'done' } : t),
      activeTask: prev.activeTask?.id === id ? null : prev.activeTask,
    }))
    if (task) addLog({ message: `Done: ${task.title}`, type: 'success' })
  }

  function handleTaskBlock(id) {
    const task = projectData[currentProjectId].tasks.find(t => t.id === id)
    updateProject(currentProjectId, prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, status: 'blocked' } : t),
      activeTask: prev.activeTask?.id === id ? null : prev.activeTask,
    }))
    if (task) addLog({ message: `Blocked: ${task.title}`, type: 'warning' })
  }

  function handleTaskEdit(id, title) {
    updateProject(currentProjectId, prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, title } : t),
      activeTask: prev.activeTask?.id === id ? { ...prev.activeTask, title } : prev.activeTask,
    }))
    addLog({ message: `Task renamed: ${title}`, type: 'info' })
  }

  function handleTaskDelete(id) {
    const task = projectData[currentProjectId].tasks.find(t => t.id === id)
    updateProject(currentProjectId, prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
      activeTask: prev.activeTask?.id === id ? null : prev.activeTask,
    }))
    if (task) addLog({ message: `Task deleted: ${task.title}`, type: 'warning' })
  }

  const tasksCompleted = tasks.filter(t => t.status === 'done').length
  const hh = Math.floor(elapsed / 3600)
  const mm = Math.floor((elapsed % 3600) / 60)
  const timeToday = `${hh}h ${String(mm).padStart(2, '0')}m`

  return (
    <Workspace
      projects={PROJECTS}
      currentProject={currentProject}
      onProjectSwitch={handleProjectSwitch}
      tasks={tasks}
      activeTask={activeTask}
      elapsed={elapsed}
      isRunning={isRunning}
      onStart={handleStart}
      onStop={handleStop}
      onTaskSelect={handleTaskSelect}
      onTaskAdd={handleTaskAdd}
      onTaskDone={handleTaskDone}
      onTaskBlock={handleTaskBlock}
      onTaskEdit={handleTaskEdit}
      onTaskDelete={handleTaskDelete}
      tasksCompleted={tasksCompleted}
      timeToday={timeToday}
      logs={logs}
      onLog={addLog}
    />
  )
}
