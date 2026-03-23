import { useState } from 'react'
import NotesSidebar from './NotesSidebar'
import NoteEditor from './NoteEditor'

export default function NotesWorkspace({ notes = [], onNew, onChange, onRename, onDelete, expanded = false }) {
  // activeNoteId is local UI state — resets when component remounts (keyed by projectId in parent)
  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id ?? null)

  // Resolve active note — fall back to first if current selection no longer exists
  const activeNote = notes.find(n => n.id === activeNoteId) ?? notes[0] ?? null

  function handleNew() {
    const id = onNew?.()
    // optimistically select the new note (id returned from store action)
    if (id) setActiveNoteId(id)
  }

  function handleDelete(id) {
    onDelete?.(id)
    if (activeNote?.id === id) {
      const remaining = notes.filter(n => n.id !== id)
      setActiveNoteId(remaining[0]?.id ?? null)
    }
  }

  return (
    <div className="flex h-full gap-0">
      <NotesSidebar
        notes={notes}
        activeNoteId={activeNote?.id ?? null}
        onSelect={setActiveNoteId}
        onNew={handleNew}
        onRename={onRename}
        onDelete={handleDelete}
        expanded={expanded}
      />
      <NoteEditor
        key={activeNote?.id ?? 'empty'}
        note={activeNote}
        onChange={onChange}
        expanded={expanded}
      />
    </div>
  )
}
