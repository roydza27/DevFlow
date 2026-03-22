import TaskItem from './TaskItem'
import TaskQuickAdd from './TaskQuickAdd'

const STATUS_ORDER = ['doing', 'todo', 'blocked', 'done']

export default function TaskPanel({ tasks, onTaskSelect, onTaskAdd, onTaskDone, onTaskBlock, onTaskEdit, onTaskDelete }) {
  const grouped = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = tasks.filter(t => t.status === status)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-xs font-label font-semibold uppercase tracking-widest text-outline">Tasks</h2>
      <TaskQuickAdd onAdd={onTaskAdd} />
      <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar flex-1">
        {tasks.length === 0 && (
          <p className="text-sm text-outline text-center mt-4">Add your first task ↑</p>
        )}
        {STATUS_ORDER.map(status => (
          grouped[status].length > 0 && (
            <div key={status} className="flex flex-col gap-1.5">
              <span className="text-xs text-outline font-label uppercase tracking-wider px-1">{status}</span>
              {grouped[status].map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onSelect={onTaskSelect}
                  onDone={onTaskDone}
                  onBlock={onTaskBlock}
                  onEdit={onTaskEdit}
                  onDelete={onTaskDelete}
                />
              ))}
            </div>
          )
        ))}
      </div>
    </div>
  )
}
