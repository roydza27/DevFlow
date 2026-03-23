import { useState } from 'react'
import CommandItem from './CommandItem'
import Input from '../../components/ui/Input'

const INITIAL_COMMANDS = [
  { id: 1, label: 'Develop', command: 'npm run dev' },
  { id: 2, label: 'Git Branch', command: 'feature/db-refactor' },
  { id: 3, label: 'Test', command: 'npm run test:unit' },
  { id: 4, label: 'Docker', command: 'compose up -d' },
]

export default function CommandsPanel({ onLog, showAdd, onAddDone }) {
  const [commands, setCommands] = useState(INITIAL_COMMANDS)
  const [labelInput, setLabelInput] = useState('')
  const [cmdInput, setCmdInput] = useState('')

  function handleAdd() {
    const cmd = cmdInput.trim()
    const label = labelInput.trim() || cmd
    if (!cmd) return
    const newCmd = { id: Date.now(), label, command: cmd }
    setCommands(prev => [...prev, newCmd])
    onLog?.({ message: `Command added: ${label}`, type: 'info' })
    setLabelInput('')
    setCmdInput('')
    onAddDone?.()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') {
      setLabelInput(''); setCmdInput(''); onAddDone?.()
    }
  }

  function handleDelete(id) {
    const cmd = commands.find(c => c.id === id)
    setCommands(prev => prev.filter(c => c.id !== id))
    if (cmd) onLog?.({ message: `Command removed: ${cmd.label}`, type: 'warning' })
  }

  function handleCopy(cmd) {
    onLog?.({ message: `Copied: ${cmd.command}`, type: 'info' })
  }

  return (
    <div className="flex flex-col gap-1.5">
      {commands.length === 0 && (
        <p className="text-xs text-outline">No commands yet</p>
      )}
      {commands.map(cmd => (
        <CommandItem key={cmd.id} command={cmd} onDelete={handleDelete} onCopy={handleCopy} />
      ))}
      {showAdd && (
        <div className="flex flex-col gap-1 mt-1">
          <Input
            autoFocus
            value={labelInput}
            onChange={e => setLabelInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Label (optional)"
          />
          <Input
            value={cmdInput}
            onChange={e => setCmdInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Command… (Enter to save)"
          />
        </div>
      )}
    </div>
  )
}
