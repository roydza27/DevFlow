import { ExternalLink, Trash2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'

const TYPE_COLORS = {
  Docs: 'done',
  Figma: 'doing',
  API: 'todo',
  Reference: 'blocked',
}

export default function ResourceItem({ resource, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright transition-colors group">
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 min-w-0 flex-1"
      >
        <Badge variant={TYPE_COLORS[resource.type] ?? 'todo'}>{resource.type}</Badge>
        <span className="text-sm text-on-surface group-hover:text-primary truncate font-body">{resource.title}</span>
        <ExternalLink size={13} className="shrink-0 text-outline group-hover:text-primary transition-colors" />
      </a>
      {onDelete && (
        <button
          onClick={() => onDelete(resource.id)}
          className="p-1 rounded text-outline hover:text-error transition-colors opacity-0 group-hover:opacity-100 shrink-0"
          aria-label="Delete resource"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  )
}
