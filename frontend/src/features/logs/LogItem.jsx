const TYPE_CLASSES = {
  info: 'text-on-surface',
  success: 'text-tertiary',
  warning: 'text-error',
}

export default function LogItem({ log }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-surface-container-high">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className={`text-sm font-body ${TYPE_CLASSES[log.type] ?? 'text-on-surface'}`}>{log.message ?? log.text}</span>
        <span className="text-xs text-outline font-label">{log.timestamp}</span>
      </div>
    </div>
  )
}
