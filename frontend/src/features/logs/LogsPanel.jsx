import { useState } from 'react'
import LogItem from './LogItem'
import Input from '../../components/ui/Input'

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function LogsPanel() {
  const [logs, setLogs] = useState([
    { id: 1, text: 'Started DB schema refactor', timestamp: formatTime(new Date()) },
  ])
  const [input, setInput] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      const newLog = { id: Date.now(), text: input.trim(), timestamp: formatTime(new Date()) }
      setLogs(prev => [newLog, ...prev])
      setInput('')
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Log activity… (Enter)"
      />
      <div className="flex flex-col gap-1 overflow-y-auto hide-scrollbar max-h-40">
        {logs.length === 0 && (
          <p className="text-xs text-outline">No logs yet – start logging your work</p>
        )}
        {logs.map(log => (
          <LogItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  )
}
