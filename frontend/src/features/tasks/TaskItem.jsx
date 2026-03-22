import Badge from '../../components/ui/Badge'

export default function TaskItem({ task, onSelect }) {
  const borderColor = {
    doing: 'border-l-tertiary',
    todo: 'border-l-outline-variant',
    blocked: 'border-l-error',
    done: 'border-l-outline',
  }

  return (
    <button
      onClick={() => onSelect(task)}
      className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border-l-2 bg-surface-container-high hover:bg-surface-bright transition-colors ${borderColor[task.status] ?? 'border-l-outline-variant'}`}
    >
      <span className={`text-sm font-body truncate ${task.status === 'done' ? 'line-through text-outline' : 'text-on-surface'}`}>
        {task.title}
      </span>
      <Badge variant={task.status}>{task.status}</Badge>
    </button>
  )
}
