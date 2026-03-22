import TimerDisplay from './TimerDisplay'
import Button from '../../components/ui/Button'

export default function ActiveTaskPanel({ activeTask, elapsed, isRunning, onStart, onStop }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full">
      <div className="text-center">
        <p className="text-xs font-label uppercase tracking-widest text-outline mb-2">Active Task</p>
        <h1 className="font-headline text-2xl font-semibold text-on-surface">
          {activeTask ? activeTask.title : 'No task selected'}
        </h1>
      </div>
      <TimerDisplay seconds={elapsed} />
      <div className="flex gap-3">
        {!isRunning ? (
          <Button variant="primary" onClick={onStart} className="px-8">
            Start
          </Button>
        ) : (
          <Button variant="secondary" onClick={onStop} className="px-8">
            Stop
          </Button>
        )}
      </div>
    </div>
  )
}
