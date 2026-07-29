import NotesWorkspace from '../notes/NotesWorkspace'

export default function NotesSection({ notes = [], onNew, onChange, onRename, onDelete, onSyncObsidian, onImportFileList, expanded = false }) {
  return (
    <NotesWorkspace
      notes={notes}
      onNew={onNew}
      onChange={onChange}
      onRename={onRename}
      onDelete={onDelete}
      onSyncObsidian={onSyncObsidian}
      onImportFileList={onImportFileList}
      expanded={expanded}
    />
  )
}
