import { FilePlus, FileText } from 'lucide-react'

export default function NotesSidebar({ notes, activeNoteId, onSelect, onNew }) {
  return (
    <div className="flex flex-col gap-2 w-44 shrink-0 border-r border-outline-variant pr-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-label uppercase tracking-widest text-outline">Files</span>
        <button
          onClick={onNew}
          className="p-1 rounded text-outline hover:text-on-surface transition-colors"
          title="New note"
        >
          <FilePlus size={13} />
        </button>
      </div>
      <div className="flex flex-col gap-1 overflow-y-auto hide-scrollbar flex-1">
        {notes.map(note => (
          <button
            key={note.id}
            onClick={() => onSelect(note.id)}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-left text-sm font-body truncate transition-colors ${
              note.id === activeNoteId
                ? 'bg-primary-container text-on-primary-container'
                : 'text-on-surface-variant hover:bg-surface-bright'
            }`}
          >
            <FileText size={12} className="shrink-0" />
            {note.title}
          </button>
        ))}
      </div>
    </div>
  )
}
