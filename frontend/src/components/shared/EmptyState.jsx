import { Layers } from 'lucide-react'

export default function EmptyState({
  title = 'No workspace active',
  description = 'Add your first task above to begin working',
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
      <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center">
        <Layers size={24} className="text-outline" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-headline text-xl font-semibold text-on-surface">{title}</h2>
        <p className="text-sm text-outline">{description}</p>
      </div>
    </div>
  )
}
