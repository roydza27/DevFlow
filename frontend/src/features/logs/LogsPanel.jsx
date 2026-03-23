import { useState } from 'react'
import LogItem from './LogItem'
import Input from '../../components/ui/Input'

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function LogsPanel({ logs = [], onLog, showAdd, onAddDone }) {
  const [input, setInput] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      onLog?.({ message: input.trim(), type: 'info' })
      setInput('')
      onAddDone?.()
    }
    if (e.key === 'Escape') { setInput(''); onAddDone?.() }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {showAdd && (
        <Input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Log activity… (Enter)"
        />
      )}
      <div className="flex flex-col gap-1 overflow-y-auto hide-scrollbar max-h-40">
        {logs.length === 0 && (
          <p className="text-xs text-outline">No activity yet</p>
        )}
        {logs.map(log => (
          <LogItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  )
}
