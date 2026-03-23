import { useState } from 'react'
import ResourceItem from './ResourceItem'
import Input from '../../components/ui/Input'

const INITIAL_RESOURCES = [
  { id: 1, title: 'Figma Design Docs', url: '#', type: 'Figma' },
  { id: 2, title: 'API Endpoints Spec', url: '#', type: 'API' },
  { id: 3, title: 'DB ER Diagram', url: '#', type: 'Docs' },
]

export default function ResourcesPanel({ onLog, showAdd, onAddDone }) {
  const [resources, setResources] = useState(INITIAL_RESOURCES)
  const [input, setInput] = useState('')

  function handleAdd() {
    const val = input.trim()
    if (!val) return
    const parts = val.split(' ')
    const url = parts.length > 1 ? parts.pop() : '#'
    const title = parts.join(' ') || url
    const newResource = { id: Date.now(), title, url, type: 'Reference' }
    setResources(prev => [...prev, newResource])
    onLog?.({ message: `Resource added: ${title}`, type: 'info' })
    setInput('')
    onAddDone?.()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') { setInput(''); onAddDone?.() }
  }

  function handleDelete(id) {
    const res = resources.find(r => r.id === id)
    setResources(prev => prev.filter(r => r.id !== id))
    if (res) onLog?.({ message: `Resource removed: ${res.title}`, type: 'warning' })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-1 overflow-y-auto hide-scrollbar max-h-36">
        {resources.length === 0 && (
          <p className="text-xs text-outline">No resources yet</p>
        )}
        {resources.map(r => (
          <ResourceItem key={r.id} resource={r} onDelete={handleDelete} />
        ))}
      </div>
      {showAdd && (
        <Input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Title url… (Enter to save)"
        />
      )}
    </div>
  )
}
