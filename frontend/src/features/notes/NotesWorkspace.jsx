import { useState } from 'react'
import NotesSidebar from './NotesSidebar'
import NoteEditor from './NoteEditor'

const INITIAL_NOTES = [
  { id: 1, title: 'Project Notes', content: '## Project Notes\n\nWrite anything…' },
]

export default function NotesWorkspace({ onLog }) {
  const [notes, setNotes] = useState(INITIAL_NOTES)
  const [activeNoteId, setActiveNoteId] = useState(INITIAL_NOTES[0].id)

  const activeNote = notes.find(n => n.id === activeNoteId) ?? notes[0] ?? null

  function handleNew() {
    const newNote = { id: Date.now(), title: `Note ${notes.length + 1}`, content: '' }
    setNotes(prev => [...prev, newNote])
    setActiveNoteId(newNote.id)
    onLog?.({ message: `Note created: ${newNote.title}`, type: 'info' })
  }

  function handleChange(id, content) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n))
  }

  return (
    <div className="flex gap-3 h-full">
      <NotesSidebar
        notes={notes}
        activeNoteId={activeNote?.id ?? null}
        onSelect={setActiveNoteId}
        onNew={handleNew}
      />
      <NoteEditor note={activeNote} onChange={handleChange} />
    </div>
  )
}
