import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function ActionItem({ action }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(action.command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright transition-colors group">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-xs text-outline font-label">{action.label}</span>
        <code className="text-sm text-tertiary font-mono truncate">{action.command}</code>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 p-1.5 rounded text-outline hover:text-on-surface transition-colors"
        aria-label="Copy command"
      >
        {copied ? <Check size={14} className="text-tertiary" /> : <Copy size={14} />}
      </button>
    </div>
  )
}
