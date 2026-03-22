export default function LogItem({ log }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-surface-container-high">
      <span className="text-sm text-on-surface font-body">{log.text}</span>
      <span className="text-xs text-outline font-label">{log.timestamp}</span>
    </div>
  )
}
