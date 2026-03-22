import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export default function CollapsibleSection({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-label font-semibold uppercase tracking-widest text-outline hover:text-on-surface-variant transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title}
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}
