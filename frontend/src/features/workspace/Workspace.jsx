import DashboardLayout from '../../app/layout/DashboardLayout'
import TaskSection from './TaskSection'
import NotesSection from './NotesSection'
import FocusPanel from '../tracking/FocusPanel'
import RightSidebar from './RightSidebar'

export default function Workspace({
  projects,
  currentProject,
  onProjectSwitch,
  tasks,
  activeTask,
  elapsed,
  isRunning,
  onStart,
  onStop,
  onTaskSelect,
  onTaskAdd,
  onTaskDone,
  onTaskBlock,
  onTaskEdit,
  onTaskDelete,
  tasksCompleted,
  timeToday,
  logs,
  onLog,
}) {
  const taskSectionProps = {
    tasks,
    onTaskSelect,
    onTaskAdd,
    onTaskDone,
    onTaskBlock,
    onTaskEdit,
    onTaskDelete,
  }

  return (
    <DashboardLayout
      projects={projects}
      currentProject={currentProject}
      onProjectSwitch={onProjectSwitch}
      activeTask={activeTask}
      leftPanel={<TaskSection {...taskSectionProps} />}
      centerPanel={
        <FocusPanel
          activeTask={activeTask}
          elapsed={elapsed}
          isRunning={isRunning}
          onStart={onStart}
          onStop={onStop}
          tasksCompleted={tasksCompleted}
          timeToday={timeToday}
        />
      }
      rightPanel={<RightSidebar logs={logs} onLog={onLog} />}
      notesPanel={<NotesSection onLog={onLog} />}
      footerProps={{ tasksCompleted, timeToday }}
    />
  )
}
