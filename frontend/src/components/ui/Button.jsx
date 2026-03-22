export default function Button({ children, variant = 'primary', onClick, className = '' }) {
  const base = 'px-4 py-2 rounded-lg text-sm font-label font-medium transition-colors focus:outline-none'
  const variants = {
    primary: 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary',
    secondary: 'bg-secondary-container text-on-secondary-container hover:bg-surface-bright',
    ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-variant',
  }
  return (
    <button onClick={onClick} className={`${base} ${variants[variant] ?? variants.primary} ${className}`}>
      {children}
    </button>
  )
}
