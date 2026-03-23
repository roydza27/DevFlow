import { useState } from 'react'
import { FilePlus, FileText, Trash2, Pencil, Check } from 'lucide-react'

export default function NotesSidebar({ notes, activeNoteId, onSelect, onNew, onRename, onDelete }) {
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')

  function startRename(note, e) {
    e.stopPropagation()
    setRenamingId(note.id)
    setRenameValue(note.title)
  }

  function commitRename(id) {
    onRename?.(id, renameValue)
    setRenamingId(null)
  }

  function handleRenameKey(e, id) {
    if (e.key === 'Enter') commitRename(id)
    if (e.key === 'Escape') setRenamingId(null)
  }

  return (
    <div className="flex flex-col w-36 shrink-0 border-r border-outline-variant overflow-hidden">
      <div className="flex items-center justify-between px-2 py-1 shrink-0">
        <span className="text-xs font-label uppercase tracking-wider text-outline">Files</span>
        <button
          onClick={onNew}
          className="p-1 rounded text-outline hover:text-on-surface transition-colors"
          title="New note"
        >
          <FilePlus size={13} />
        </button>
      </div>
      <div className="flex flex-col gap-0.5 overflow-y-auto hide-scrollbar flex-1 px-1 pb-1">
        {notes.map(note => (
          <div
            key={note.id}
    className={`group flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors ${
              note.id === activeNoteId
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-bright'
            }`}
            onClick={() => onSelect(note.id)}
            title={note.title}
          >
            <FileText size={11} className="shrink-0 opacity-60" />
            {renamingId === note.id ? (
              <input
                autoFocus
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => handleRenameKey(e, note.id)}
                onBlur={() => commitRename(note.id)}
                onClick={e => e.stopPropagation()}
                className="flex-1 min-w-0 bg-transparent border-b border-primary text-xs focus:outline-none text-on-surface"
              />
            ) : (
              <span className="flex-1 text-xs truncate font-body">{note.title}</span>
            )}
            {/* Hover actions */}
            {renamingId === note.id ? (
              <button
                onClick={e => { e.stopPropagation(); commitRename(note.id) }}
                className="shrink-0 p-0.5 rounded text-tertiary"
              >
                <Check size={11} />
              </button>
            ) : (
              <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                <button
                  onClick={e => startRename(note, e)}
                  className="p-0.5 rounded text-outline hover:text-on-surface"
                  title="Rename"
                >
                  <Pencil size={11} />
                </button>
                {notes.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); onDelete?.(note.id) }}
                    className="p-0.5 rounded text-outline hover:text-error"
                    title="Delete note"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
