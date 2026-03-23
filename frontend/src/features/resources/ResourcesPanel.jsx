import { useState } from 'react'
import ResourceItem from './ResourceItem'

const INITIAL_RESOURCES = [
  { id: 1, title: 'Figma Design Docs', url: '#', type: 'Figma' },
  { id: 2, title: 'API Endpoints Spec', url: '#', type: 'API' },
  { id: 3, title: 'DB ER Diagram', url: '#', type: 'Docs' },
]

const TYPES = ['Docs', 'API', 'Figma', 'Reference']

export default function ResourcesPanel({ onLog, showAdd, onAddDone }) {
  const [resources, setResources] = useState(INITIAL_RESOURCES)
  const [titleInput, setTitleInput] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [typeInput, setTypeInput] = useState('Docs')

  function handleAdd() {
    const title = titleInput.trim()
    if (!title) return
    const url = urlInput.trim() || '#'
    const newResource = { id: Date.now(), title, url, type: typeInput }
    setResources(prev => [...prev, newResource])
    onLog?.({ message: `Resource added: ${title}`, type: 'info' })
    setTitleInput('')
    setUrlInput('')
    setTypeInput('Docs')
    onAddDone?.()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') { setTitleInput(''); setUrlInput(''); setTypeInput('Docs'); onAddDone?.() }
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
        <div className="flex flex-col gap-1 mt-1">
          {/* Type selector */}
          <div className="flex gap-1 flex-wrap">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeInput(t)}
                className={`px-2 py-0.5 rounded text-xs font-label transition-colors ${
                  typeInput === t
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container-high text-outline hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            autoFocus
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Title…"
            className="w-full px-3 py-1.5 rounded bg-surface-container-high text-sm text-on-surface placeholder-outline border border-outline-variant focus:border-primary focus:outline-none font-body"
          />
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="URL (optional) — Enter to save"
            className="w-full px-3 py-1.5 rounded bg-surface-container-high text-sm text-on-surface placeholder-outline border border-outline-variant focus:border-primary focus:outline-none font-body"
          />
        </div>
      )}
    </div>
  )
}
