export default function Badge({ children, variant = 'todo', className = '' }) {
  const variants = {
    doing: 'bg-tertiary-container text-on-tertiary-container',
    todo: 'bg-secondary-container text-on-secondary-container',
    blocked: 'bg-error/20 text-error',
    done: 'bg-surface-bright text-outline',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-label font-medium ${variants[variant] ?? variants.todo} ${className}`}>
      {children}
    </span>
  )
}
