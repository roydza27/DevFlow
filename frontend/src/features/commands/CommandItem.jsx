import { useState } from 'react'
import { Copy, Check, Trash2 } from 'lucide-react'

export default function CommandItem({ command, onDelete, onCopy }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(command.command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      onCopy?.(command)
    })
  }

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright transition-colors group">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-outline font-label">{command.label}</span>
        <code className="text-sm text-tertiary font-mono truncate">{command.command}</code>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded text-outline hover:text-on-surface transition-colors"
          aria-label="Copy command"
        >
          {copied ? <Check size={14} className="text-tertiary" /> : <Copy size={14} />}
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(command.id)}
            className="p-1.5 rounded text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Delete command"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
