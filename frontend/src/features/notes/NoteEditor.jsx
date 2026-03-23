export default function NoteEditor({ note, onChange }) {
  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-outline">Select or create a note</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden pl-3">
      <textarea
        key={note.id}
        value={note.content}
        onChange={e => onChange(note.id, e.target.value)}
        placeholder="Start writing…"
        spellCheck={false}
        className="flex-1 w-full resize-none bg-transparent border-none text-sm text-on-surface placeholder-outline/50 focus:outline-none font-mono leading-relaxed hide-scrollbar"
      />
    </div>
  )
}
