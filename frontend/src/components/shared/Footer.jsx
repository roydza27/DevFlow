export default function Footer({ tasksCompleted = 0, timeToday = '0h 00m' }) {
  return (
    <footer className="flex items-center justify-between px-6 py-2 border-t border-outline-variant bg-surface-container text-xs text-outline font-label">
      <span>DevFlow</span>
      <div className="flex gap-6">
        <span>Time Today: <span className="text-on-surface-variant font-medium">{timeToday}</span></span>
        <span>Tasks Completed: <span className="text-on-surface-variant font-medium">{tasksCompleted}</span></span>
      </div>
    </footer>
  )
}
