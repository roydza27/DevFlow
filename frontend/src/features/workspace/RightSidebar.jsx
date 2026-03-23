import { useState } from 'react'
import CollapsibleSection from '../../components/shared/CollapsibleSection'
import CommandsPanel from '../commands/CommandsPanel'
import ResourcesPanel from '../resources/ResourcesPanel'
import LogsPanel from '../logs/LogsPanel'

export default function RightSidebar({
  logs = [],
  onLog,
  commands = [],
  onCommandAdd,
  onCommandDelete,
  resources = [],
  onResourceAdd,
  onResourceDelete,
}) {
  const [showAddCmd, setShowAddCmd] = useState(false)
  const [showAddRes, setShowAddRes] = useState(false)
  const [showAddLog, setShowAddLog] = useState(false)

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
      <CollapsibleSection
        title="Commands"
        onAdd={() => setShowAddCmd(v => !v)}
        isAdding={showAddCmd}
      >
        <CommandsPanel
          commands={commands}
          onAdd={onCommandAdd}
          onDelete={onCommandDelete}
          onLog={onLog}
          showAdd={showAddCmd}
          onAddDone={() => setShowAddCmd(false)}
        />
      </CollapsibleSection>

      <div className="border-t border-outline-variant" />

      <CollapsibleSection
        title="Resources"
        onAdd={() => setShowAddRes(v => !v)}
        isAdding={showAddRes}
      >
        <ResourcesPanel
          resources={resources}
          onAdd={onResourceAdd}
          onDelete={onResourceDelete}
          onLog={onLog}
          showAdd={showAddRes}
          onAddDone={() => setShowAddRes(false)}
        />
      </CollapsibleSection>

      <div className="border-t border-outline-variant" />

      <CollapsibleSection
        title="Logs"
        onAdd={() => setShowAddLog(v => !v)}
        isAdding={showAddLog}
      >
        <LogsPanel
          logs={logs}
          onLog={onLog}
          showAdd={showAddLog}
          onAddDone={() => setShowAddLog(false)}
        />
      </CollapsibleSection>
    </div>
  )
}
