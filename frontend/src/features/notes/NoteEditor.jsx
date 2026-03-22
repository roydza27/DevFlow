export default function NoteEditor({ note, onChange }) {
  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-outline">Select or create a note</p>
      </div>
    )
  }

  return (
    <textarea
      value={note.content}
      onChange={e => onChange(note.id, e.target.value)}
      placeholder="Start writing…"
      className="flex-1 resize-none bg-transparent border-none text-sm text-on-surface placeholder-outline focus:outline-none font-body hide-scrollbar"
    />
  )
}
