export default function TimerDisplay({ seconds }) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')

  return (
    <span className="font-headline text-8xl font-light tracking-tight text-on-surface tabular-nums">
      {h}:{m}:{s}
    </span>
  )
}
