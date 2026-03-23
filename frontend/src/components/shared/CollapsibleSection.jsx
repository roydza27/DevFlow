import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react'

export default function CollapsibleSection({ title, defaultOpen = true, onAdd, isAdding = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 text-xs font-label font-semibold uppercase tracking-widest text-outline hover:text-on-surface-variant transition-colors"
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {title}
        </button>
        {onAdd && (
          <button
            onClick={onAdd}
            className={`p-0.5 rounded transition-colors ${isAdding ? 'text-primary hover:text-on-surface' : 'text-outline hover:text-on-surface'}`}
            title={isAdding ? `Cancel` : `Add ${title.toLowerCase()}`}
          >
            {isAdding ? <Minus size={13} /> : <Plus size={13} />}
          </button>
        )}
      </div>
      {open && <div>{children}</div>}
    </div>
  )
}
