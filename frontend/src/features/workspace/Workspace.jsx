import DashboardLayout from '../../app/layout/DashboardLayout'
import TaskSection from './TaskSection'
import NotesSection from './NotesSection'
import FocusPanel from '../tracking/FocusPanel'
import RightSidebar from './RightSidebar'

export default function Workspace({
  projects,
  currentProject,
  onProjectSwitch,
  onCreateProject,
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
  notes,
  onNoteNew,
  onNoteChange,
  onNoteRename,
  onNoteDelete,
  commands,
  onCommandAdd,
  onCommandDelete,
  resources,
  onResourceAdd,
  onResourceDelete,
}) {
  return (
    <DashboardLayout
      projects={projects}
      currentProject={currentProject}
      onProjectSwitch={onProjectSwitch}
      onCreateProject={onCreateProject}
      activeTask={activeTask}
      leftPanel={
        <TaskSection
          tasks={tasks}
          onTaskSelect={onTaskSelect}
          onTaskAdd={onTaskAdd}
          onTaskDone={onTaskDone}
          onTaskBlock={onTaskBlock}
          onTaskEdit={onTaskEdit}
          onTaskDelete={onTaskDelete}
        />
      }
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
      rightPanel={
        <RightSidebar
          logs={logs}
          onLog={onLog}
          commands={commands}
          onCommandAdd={onCommandAdd}
          onCommandDelete={onCommandDelete}
          resources={resources}
          onResourceAdd={onResourceAdd}
          onResourceDelete={onResourceDelete}
        />
      }
      notesPanel={
        <NotesSection
          key={currentProject?.id}
          notes={notes}
          onNew={onNoteNew}
          onChange={onNoteChange}
          onRename={onNoteRename}
          onDelete={onNoteDelete}
        />
      }
      footerProps={{ tasksCompleted, timeToday }}
    />
  )
}
