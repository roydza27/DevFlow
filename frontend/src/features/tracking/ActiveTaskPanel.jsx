import TimerDisplay from './TimerDisplay'
import Button from '../../components/ui/Button'

export default function FocusPanel({ activeTask, elapsed, isRunning, onStart, onStop, tasksCompleted, timeToday }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full">
      <div className="text-center">
        <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">Active Task</p>
        {activeTask ? (
          <h1 className="font-headline text-2xl font-semibold text-on-surface max-w-xs">
            {activeTask.title}
          </h1>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-headline text-xl font-medium text-outline">No task selected</h1>
            <p className="text-sm text-outline">Click a task on the left to begin</p>
          </div>
        )}
      </div>

      <TimerDisplay seconds={elapsed} />

      <div className="flex gap-3">
        {!isRunning ? (
          <Button variant="primary" onClick={onStart} className="px-8" disabled={!activeTask}>
            Start
          </Button>
        ) : (
          <Button variant="secondary" onClick={onStop} className="px-8">
            Stop
          </Button>
        )}
      </div>

      {/* Mini Insights */}
      <div className="flex gap-6 pt-4 border-t border-outline-variant w-full max-w-xs justify-center">
        <div className="text-center">
          <p className="text-xs text-outline font-label">Time Today</p>
          <p className="text-sm font-semibold text-on-surface-variant">{timeToday}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-outline font-label">Completed</p>
          <p className="text-sm font-semibold text-on-surface-variant">{tasksCompleted}</p>
        </div>
      </div>
    </div>
  )
}
