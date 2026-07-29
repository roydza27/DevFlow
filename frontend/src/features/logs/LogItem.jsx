const TYPE_CLASSES = {
  info: 'text-on-surface opacity-90',
  success: 'text-tertiary font-medium',
  warning: 'text-error font-medium',
}

export default function LogItem({ log }) {
  const isSystemLog = log.message?.startsWith('Switched to:') || log.message?.startsWith('Timer') || log.message?.startsWith('Workspace')

  return (
    <div className={`flex items-start gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high/80 hover:bg-surface-container-high transition-colors ${isSystemLog ? 'opacity-70' : 'opacity-100'}`}>
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className={`text-xs font-body ${TYPE_CLASSES[log.type] ?? 'text-on-surface'}`}>{log.message ?? log.text}</span>
        <span className="text-[10px] text-outline/80 font-label font-mono">{log.timestamp}</span>
      </div>
    </div>
  )
}
