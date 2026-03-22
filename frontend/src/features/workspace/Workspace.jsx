import DashboardLayout from '../../app/layout/DashboardLayout'
import EmptyState from '../../components/shared/EmptyState'
import TaskSection from './TaskSection'
import NotesSection from './NotesSection'
import FocusPanel from '../tracking/FocusPanel'
import RightSidebar from './RightSidebar'

export default function Workspace({
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
}) {
  const isEmpty = tasks.length === 0

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
      activeTask={activeTask}
      leftPanel={<TaskSection {...taskSectionProps} />}
      centerPanel={
        isEmpty ? (
          <EmptyState
            title="No tasks yet"
            description="Use the task input on the left to add your first task and begin working."
          />
        ) : (
          <FocusPanel
            activeTask={activeTask}
            elapsed={elapsed}
            isRunning={isRunning}
            onStart={onStart}
            onStop={onStop}
            tasksCompleted={tasksCompleted}
            timeToday={timeToday}
          />
        )
      }
      rightPanel={<RightSidebar />}
      notesPanel={<NotesSection />}
      footerProps={{ tasksCompleted, timeToday }}
    />
  )
}
