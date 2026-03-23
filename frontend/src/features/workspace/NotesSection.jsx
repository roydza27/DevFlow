import NotesWorkspace from '../notes/NotesWorkspace'

export default function NotesSection({ onLog, expanded = false }) {
  return <NotesWorkspace onLog={onLog} expanded={expanded} />
}
