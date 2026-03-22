import { useState } from 'react'

export default function NotesPanel() {
  const [notes, setNotes] = useState('')

  return (
    <div className="flex flex-col gap-2 h-full">
      <h2 className="text-xs font-label font-semibold uppercase tracking-widest text-outline">Notes</h2>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Jot something down…"
        className="flex-1 resize-none bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary transition-colors font-body hide-scrollbar"
      />
    </div>
  )
}
