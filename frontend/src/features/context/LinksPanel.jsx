import { useState } from 'react'
import LinkItem from './LinkItem'
import Input from '../../components/ui/Input'

const MOCK_LINKS = [
  { id: 1, title: 'Figma Design Docs', url: '#' },
  { id: 2, title: 'API Endpoints Specification', url: '#' },
  { id: 3, title: 'DBER Diagram', url: '#' },
]

export default function LinksPanel() {
  const [links, setLinks] = useState(MOCK_LINKS)
  const [input, setInput] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && input.trim()) {
      const parts = input.trim().split(' ')
      const url = parts.pop()
      const title = parts.join(' ') || url
      setLinks(prev => [...prev, { id: Date.now(), title, url }])
      setInput('')
    }
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <h2 className="text-xs font-label font-semibold uppercase tracking-widest text-outline">Links</h2>
      <div className="flex flex-col gap-1.5 overflow-y-auto hide-scrollbar flex-1">
        {links.map(link => (
          <LinkItem key={link.id} link={link} />
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
