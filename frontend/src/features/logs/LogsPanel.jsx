import { useState } from 'react'
import LogItem from './LogItem'
import Input from '../../components/ui/Input'
import { Trash2 } from 'lucide-react'

export default function LogsPanel({ logs = [], onLog, onClearLogs, showAdd, onAddDone }) {
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'user' | 'system'

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      onLog?.({ message: input.trim(), type: 'info' })
      setInput('')
      onAddDone?.()
    }
    if (e.key === 'Escape') { setInput(''); onAddDone?.() }
  }

  const isSystemLog = log =>
    log.message?.startsWith('Switched to:') ||
    log.message?.startsWith('Timer') ||
    log.message?.startsWith('Workspace') ||
    log.message?.startsWith('Task') ||
    log.message?.startsWith('Active:') ||
    log.message?.startsWith('Done:') ||
    log.message?.startsWith('Blocked:') ||
    log.message?.startsWith('Folder') ||
    log.message?.startsWith('Command') ||
    log.message?.startsWith('Resource') ||
    log.message?.startsWith('Synced') ||
    log.message?.startsWith('Imported')

  const filteredLogs = logs.filter(log => {
    if (filter === 'user') return !isSystemLog(log)
    if (filter === 'system') return isSystemLog(log)
    return true
  })

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      {/* Filter Tabs & Clear Action */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex gap-1">
          {['all', 'user', 'system'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 rounded text-[10px] font-label uppercase tracking-wider transition-colors ${
                filter === f
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'bg-surface-container-high text-outline hover:text-on-surface'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-outline font-mono">{filteredLogs.length} logs</span>
          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="p-0.5 rounded text-outline hover:text-error transition-colors"
              title="Clear all logs"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>

      {showAdd && (
        <Input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Log activity… (Enter)"
        />
      )}

      {/* Flexible scroll container without artificial max-h cap */}
      <div className="flex flex-col gap-1 overflow-y-auto hide-scrollbar flex-1 min-h-[140px] max-h-[320px] pr-0.5">
        {filteredLogs.length === 0 && (
          <p className="text-xs text-outline py-2 text-center">No logs found</p>
        )}
        {filteredLogs.map(log => (
          <LogItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  )
}
