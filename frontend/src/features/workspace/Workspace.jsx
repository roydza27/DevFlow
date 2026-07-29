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
  onRenameProject,
  onDeleteProject,
  onLinkFolder,
  onUnlinkFolder,
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
  onNoteSyncObsidian,
  onNoteImportFileList,
  commands,
  onCommandAdd,
  onCommandDelete,
  resources,
  onResourceAdd,
  onResourceDelete,
  globalTasksCompleted,
  globalTimeToday,
}) {
  return (
    <DashboardLayout
      projects={projects}
      currentProject={currentProject}
      onProjectSwitch={onProjectSwitch}
      onCreateProject={onCreateProject}
      onRenameProject={onRenameProject}
      onDeleteProject={onDeleteProject}
      onLinkFolder={onLinkFolder}
      onUnlinkFolder={onUnlinkFolder}
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
          tasksCompleted={globalTasksCompleted ?? tasksCompleted}
          timeToday={globalTimeToday ?? timeToday}
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
          onSyncObsidian={onNoteSyncObsidian}
          onImportFileList={onNoteImportFileList}
        />
      }
      footerProps={{ tasksCompleted: globalTasksCompleted ?? tasksCompleted, timeToday: globalTimeToday ?? timeToday }}
    />
  )
}
