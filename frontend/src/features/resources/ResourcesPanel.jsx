import { useState } from 'react'
import ResourceItem from './ResourceItem'
import Input from '../../components/ui/Input'

const MOCK_RESOURCES = [
  { id: 1, title: 'Figma Design Docs', url: '#', type: 'Figma' },
  { id: 2, title: 'API Endpoints Spec', url: '#', type: 'API' },
  { id: 3, title: 'DB ER Diagram', url: '#', type: 'Docs' },
]

export default function ResourcesPanel() {
  const [resources, setResources] = useState(MOCK_RESOURCES)
  const [input, setInput] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      const parts = input.trim().split(' ')
      const url = parts.pop()
      const title = parts.join(' ') || url
      setResources(prev => [...prev, { id: Date.now(), title, url, type: 'Reference' }])
      setInput('')
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-col gap-1 overflow-y-auto hide-scrollbar max-h-36">
        {resources.length === 0 && (
          <p className="text-xs text-outline">No resources yet</p>
        )}
        {resources.map(r => (
          <ResourceItem key={r.id} resource={r} />
        ))}
      </div>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Title url… (Enter)"
      />
    </div>
  )
}
