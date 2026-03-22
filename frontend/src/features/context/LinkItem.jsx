import { ExternalLink } from 'lucide-react'

export default function LinkItem({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright transition-colors group"
    >
      <span className="text-sm text-on-surface group-hover:text-primary truncate font-body">{link.title}</span>
      <ExternalLink size={13} className="shrink-0 text-outline group-hover:text-primary transition-colors" />
    </a>
  )
}
