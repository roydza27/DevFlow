import { useState } from 'react'
import NotesSidebar from './NotesSidebar'
import NoteEditor from './NoteEditor'

const INITIAL_NOTES = [
  { id: 1, title: 'Project Notes', content: '## Project Notes\n\nWrite anything here…' },
]

export default function NotesWorkspace({ onLog }) {
  const [notes, setNotes] = useState(INITIAL_NOTES)
  const [activeNoteId, setActiveNoteId] = useState(INITIAL_NOTES[0].id)

  const activeNote = notes.find(n => n.id === activeNoteId) ?? null

  function handleNew() {
    const newNote = { id: Date.now(), title: `Note ${notes.length + 1}`, content: '' }
    setNotes(prev => [...prev, newNote])
    setActiveNoteId(newNote.id)
    onLog?.({ message: `Note created: ${newNote.title}`, type: 'info' })
  }

  function handleChange(id, content) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n))
  }

  function handleRename(id, title) {
    if (!title.trim()) return
    setNotes(prev => prev.map(n => n.id === id ? { ...n, title: title.trim() } : n))
  }

  function handleDelete(id) {
    setNotes(prev => {
      const remaining = prev.filter(n => n.id !== id)
      if (activeNoteId === id && remaining.length > 0) {
        setActiveNoteId(remaining[0].id)
      }
      return remaining
    })
  }

  return (
    <div className="flex h-full gap-0">
      <NotesSidebar
        notes={notes}
        activeNoteId={activeNote?.id ?? null}
        onSelect={setActiveNoteId}
        onNew={handleNew}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <NoteEditor note={activeNote} onChange={handleChange} />
    </div>
  )
}
