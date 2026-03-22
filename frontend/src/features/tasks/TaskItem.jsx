import { useState } from 'react'
import { Check, Ban, Pencil, Trash2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'

export default function TaskItem({ task, onSelect, onDone, onBlock, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.title)

  const borderColor = {
    doing: 'border-l-tertiary',
    todo: 'border-l-outline-variant',
    blocked: 'border-l-error',
    done: 'border-l-outline',
  }

  function handleEditSubmit(e) {
    if (e.key === 'Enter' && editValue.trim()) {
      onEdit(task.id, editValue.trim())
      setEditing(false)
    }
    if (e.key === 'Escape') {
      setEditValue(task.title)
      setEditing(false)
    }
  }

  return (
    <div
      className={`group w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border-l-2 bg-surface-container-high hover:bg-surface-bright transition-colors ${borderColor[task.status] ?? 'border-l-outline-variant'} ${task.status === 'doing' ? 'ring-1 ring-tertiary/30' : ''}`}
    >
      {editing ? (
        <input
          autoFocus
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={handleEditSubmit}
          onBlur={() => { setEditValue(task.title); setEditing(false) }}
          className="flex-1 text-sm bg-transparent border-b border-primary text-on-surface focus:outline-none"
        />
      ) : (
        <button
          onClick={() => onSelect(task)}
          className="flex-1 text-left min-w-0"
        >
          <span className={`text-sm font-body truncate block ${task.status === 'done' ? 'line-through text-outline' : 'text-on-surface'}`}>
            {task.title}
          </span>
        </button>
      )}

      <div className="flex items-center gap-1 shrink-0">
        <Badge variant={task.status}>{task.status}</Badge>

        {/* Inline actions – visible on hover */}
        <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
          {task.status !== 'done' && (
            <button onClick={() => onDone(task.id)} title="Mark done" className="p-1 rounded text-outline hover:text-tertiary transition-colors">
              <Check size={13} />
            </button>
          )}
          {task.status !== 'blocked' && task.status !== 'done' && (
            <button onClick={() => onBlock(task.id)} title="Block" className="p-1 rounded text-outline hover:text-error transition-colors">
              <Ban size={13} />
            </button>
          )}
          <button onClick={() => setEditing(true)} title="Edit" className="p-1 rounded text-outline hover:text-primary transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(task.id)} title="Delete" className="p-1 rounded text-outline hover:text-error transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
