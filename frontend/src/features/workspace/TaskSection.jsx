import TaskQuickAdd from '../tasks/TaskQuickAdd'
import TaskItem from '../tasks/TaskItem'

export default function TaskSection({
  tasks,
  onTaskSelect,
  onTaskAdd,
  onTaskDone,
  onTaskBlock,
  onTaskEdit,
  onTaskDelete,
}) {
  const doingTask = tasks.find(t => t.status === 'doing')
  const pendingTasks = tasks.filter(t => t.status === 'todo')
  const blockedTasks = tasks.filter(t => t.status === 'blocked')
  const doneTasks = tasks.filter(t => t.status === 'done')

  const taskItemProps = { onSelect: onTaskSelect, onDone: onTaskDone, onBlock: onTaskBlock, onEdit: onTaskEdit, onDelete: onTaskDelete }

  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-xs font-label font-semibold uppercase tracking-widest text-outline">Tasks</h2>

      <TaskQuickAdd onAdd={onTaskAdd} />

      <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar flex-1">
        {tasks.length === 0 && (
          <p className="text-sm text-outline text-center mt-4">Add your first task ↑</p>
        )}

        {/* Active task – visually prominent */}
        {doingTask && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-outline font-label uppercase tracking-wider px-1">Active</span>
            <div className="ring-2 ring-tertiary/40 rounded-lg">
              <TaskItem key={doingTask.id} task={doingTask} {...taskItemProps} />
            </div>
          </div>
        )}

        {/* Pending tasks */}
        {pendingTasks.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-outline font-label uppercase tracking-wider px-1">Pending</span>
            {pendingTasks.map(task => (
              <TaskItem key={task.id} task={task} {...taskItemProps} />
            ))}
          </div>
        )}

        {/* Blocked tasks */}
        {blockedTasks.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-outline font-label uppercase tracking-wider px-1">Blocked</span>
            {blockedTasks.map(task => (
              <TaskItem key={task.id} task={task} {...taskItemProps} />
            ))}
          </div>
        )}

        {/* Done tasks */}
        {doneTasks.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-outline font-label uppercase tracking-wider px-1">Done</span>
            {doneTasks.map(task => (
              <TaskItem key={task.id} task={task} {...taskItemProps} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
