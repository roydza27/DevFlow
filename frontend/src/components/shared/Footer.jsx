import { useState, useEffect } from 'react'
import { api } from '../../services/apiClient'

export default function Footer({
  tasksCompleted = 0,
  timeToday = '0h 00m',
  globalTasksCompleted = 0,
  globalTimeToday = '0h 00m'
}) {
  const [dbStats, setDbStats] = useState(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.getStats()
        if (res?.dbSizeFormatted) setDbStats(res.dbSizeFormatted)
      } catch {}
    }
    loadStats()
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="flex items-center justify-between px-6 py-2 border-t border-outline-variant bg-surface-container text-xs text-outline font-label">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-on-surface">DevFlow</span>
        {dbStats && (
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold border border-primary/20">
            DB: {dbStats}
          </span>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Workspace specific stats */}
        <div className="flex gap-4">
          <span>Workspace Time: <span className="text-on-surface-variant font-medium">{timeToday}</span></span>
          <span>Workspace Tasks: <span className="text-on-surface-variant font-medium">{tasksCompleted}</span></span>
        </div>

        <div className="h-3 w-px bg-outline-variant/60" />

        {/* Global cross-workspace stats */}
        <div className="flex gap-4 text-outline/80">
          <span>Global Total: <span className="text-primary font-medium">{globalTimeToday}</span></span>
          <span>Global Tasks: <span className="text-primary font-medium">{globalTasksCompleted}</span></span>
        </div>
      </div>
    </footer>
  )
}
