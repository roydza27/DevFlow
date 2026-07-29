import TimerDisplay from './TimerDisplay'
import Button from '../../components/ui/Button'

export default function FocusPanel({ activeTask, elapsed, isRunning, onStart, onStop, tasksCompleted, timeToday }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full">
      {/* Active task title */}
      <div className="text-center max-w-sm">
        {activeTask ? (
          <h1 className="font-headline text-2xl font-semibold text-on-surface leading-snug">
            {activeTask.title}
          </h1>
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
          <span className="text-xs font-label text-tertiary uppercase tracking-widest animate-pulse">
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

      {/* Session insights */}
      <div className="flex gap-8 pt-4 border-t border-outline-variant w-full max-w-xs justify-center">
        <div className="text-center">
          <p className="text-xs text-outline font-label uppercase tracking-wider mb-0.5">Time Today</p>
          <p className="text-sm font-semibold text-on-surface-variant tabular-nums">{timeToday}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-outline font-label uppercase tracking-wider mb-0.5">Completed</p>
          <p className="text-sm font-semibold text-on-surface-variant tabular-nums">{tasksCompleted}</p>
        </div>
      </div>
    </div>
  )
}
