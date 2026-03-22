export default function Input({ value, onChange, onKeyDown, placeholder, className = '' }) {
  return (
    <input
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary transition-colors ${className}`}
    />
  )
}
