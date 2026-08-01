import { useState, useEffect } from 'react'
import TaskQuickAdd from '../tasks/TaskQuickAdd'
import TaskItem from '../tasks/TaskItem'
import { Archive, Database } from 'lucide-react'
import { api } from '../../services/apiClient'

export default function TaskSection({
  tasks,
  onTaskSelect,
  onTaskAdd,
  onTaskDone,
  onTaskBlock,
  onTaskEdit,
  onTaskDelete,
  onClearDoneUI,
}) {
  const [stats, setStats] = useState(null)
  const doingTask = tasks.find(t => t.status === 'doing')
  const pendingTasks = tasks.filter(t => t.status === 'todo')
  const blockedTasks = tasks.filter(t => t.status === 'blocked')
  const doneTasks = tasks.filter(t => t.status === 'done')

  const taskItemProps = { onSelect: onTaskSelect, onDone: onTaskDone, onBlock: onTaskBlock, onEdit: onTaskEdit, onDelete: onTaskDelete }

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getStats()
        if (res) setStats(res)
      } catch {}
    }
    loadStats()
    const interval = setInterval(loadStats, 15000)
    return () => clearInterval(interval)
  }, [])

  function handleClearDone() {
    if (onClearDoneUI) {
      onClearDoneUI()
    } else {
      doneTasks.forEach(task => onTaskDelete(task.id))
    }
  }

  const activeWorkspaceTasks = tasks.filter(t => t.status !== 'archived')
  const archivedTasks = tasks.filter(t => t.status === 'archived')

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-label font-semibold uppercase tracking-widest text-outline">Tasks</h2>
        {doneTasks.length > 0 && (
          <button
            onClick={handleClearDone}
            className="flex items-center gap-1.5 text-[11px] font-label text-outline hover:text-primary transition-colors bg-surface-container-high/60 px-2 py-0.5 rounded border border-outline-variant/40"
            title="Archive completed tasks into SQLite history"
          >
            <Archive size={11} />
            <span>Archive completed ({doneTasks.length})</span>
          </button>
        )}
      </div>

      <TaskQuickAdd onAdd={onTaskAdd} />

      <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar flex-1">
        {activeWorkspaceTasks.length === 0 && (
          <p className="text-sm text-outline text-center mt-4">Add your first task ↑</p>
        )}

        {/* Active task */}
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

      {/* Workspace Task Stats Card at Left Sidebar Bottom */}
      <div className="p-3 rounded-xl bg-surface-container-high/80 border border-outline-variant/60 flex flex-col gap-2.5 shrink-0 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-primary/10 text-primary">
              <Database size={14} />
            </div>
            <span className="text-xs font-semibold text-on-surface font-headline">Workspace Tasks</span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-mono font-semibold border border-primary/20">
            {activeWorkspaceTasks.length} active
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-outline-variant/30 text-center bg-surface-container-lowest/40 p-1.5 rounded-lg">
          <div>
            <p className="text-[9px] text-outline font-label uppercase">Active</p>
            <p className="text-xs font-bold text-on-surface font-mono">{activeWorkspaceTasks.length}</p>
          </div>
          <div className="border-x border-outline-variant/30 px-1">
            <p className="text-[9px] text-outline font-label uppercase">Done</p>
            <p className="text-xs font-bold text-tertiary font-mono">{doneTasks.length}</p>
          </div>
          <div>
            <p className="text-[9px] text-outline font-label uppercase">Archived</p>
            <p className="text-xs font-bold text-on-surface-variant font-mono">{archivedTasks.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
