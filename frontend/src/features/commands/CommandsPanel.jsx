import { useState } from 'react'
import CommandItem from './CommandItem'
import Input from '../../components/ui/Input'

export default function CommandsPanel({ commands = [], onAdd, onDelete, onLog, showAdd, onAddDone }) {
  const [labelInput, setLabelInput] = useState('')
  const [cmdInput, setCmdInput] = useState('')

  function handleAdd() {
    const cmd = cmdInput.trim()
    const label = labelInput.trim() || cmd
    if (!cmd) return
    onAdd?.(label, cmd)
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

  function handleCopy(cmd) {
    onLog?.({ message: `Copied: ${cmd.command}`, type: 'info' })
  }

  return (
    <div className="flex flex-col gap-1.5">
      {commands.length === 0 && (
        <p className="text-xs text-outline">No commands yet</p>
      )}
      {commands.map(cmd => (
        <CommandItem key={cmd.id} command={cmd} onDelete={() => onDelete?.(cmd.id)} onCopy={handleCopy} />
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
