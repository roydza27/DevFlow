import TimerDisplay from './TimerDisplay'
import Button from '../../components/ui/Button'

export default function FocusPanel({
  activeTask,
  elapsed,
  isRunning,
  onStart,
  onStop,
  taskTotalFormatted = '0h 00m',
  workspaceTimeToday = '0h 00m',
  tasksCompleted = 0,
  globalTimeToday = '0h 00m',
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 h-full">
      {/* Active task title */}
      <div className="text-center max-w-md">
        {activeTask ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] uppercase tracking-widest text-tertiary font-label font-semibold">Working On</span>
            <h1 className="font-headline text-2xl font-semibold text-on-surface leading-snug">
              {activeTask.title}
            </h1>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <h1 className="font-headline text-xl font-medium text-outline">No task selected</h1>
            <p className="text-sm text-outline/70">Select a task from the task list to begin focusing</p>
          </div>
        )}
      </div>

      {/* Timer — central dominant element */}
      <div className="flex flex-col items-center gap-1">
        <TimerDisplay seconds={elapsed} />
        {isRunning && (
          <span className="text-xs font-label text-tertiary uppercase tracking-widest animate-pulse font-medium">
            running
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isRunning ? (
          <Button variant="primary" onClick={onStart} className="px-10" disabled={!activeTask}>
            Start
          </Button>
        ) : (
          <Button variant="secondary" onClick={onStop} className="px-10">
            Stop
          </Button>
        )}
      </div>

      {/* Synchronized Session Insights Grid */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-outline-variant/60 w-full max-w-md text-center">
        <div>
          <p className="text-[10px] text-outline font-label uppercase tracking-wider mb-0.5">Task Total</p>
          <p className="text-xs font-bold text-on-surface tabular-nums font-mono">{taskTotalFormatted}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline font-label uppercase tracking-wider mb-0.5">Workspace</p>
          <p className="text-xs font-bold text-on-surface tabular-nums font-mono">{workspaceTimeToday}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline font-label uppercase tracking-wider mb-0.5">Global Total</p>
          <p className="text-xs font-bold text-primary tabular-nums font-mono">{globalTimeToday}</p>
        </div>
        <div>
          <p className="text-[10px] text-outline font-label uppercase tracking-wider mb-0.5">Done</p>
          <p className="text-xs font-bold text-on-surface-variant tabular-nums font-mono">{tasksCompleted}</p>
        </div>
      </div>
    </div>
  )
}
