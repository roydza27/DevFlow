import NotesWorkspace from '../notes/NotesWorkspace'

export default function NotesSection({ notes = [], onNew, onChange, onRename, onDelete, expanded = false }) {
  return (
    <NotesWorkspace
      notes={notes}
      onNew={onNew}
      onChange={onChange}
      onRename={onRename}
      onDelete={onDelete}
      expanded={expanded}
    />
  )
}
