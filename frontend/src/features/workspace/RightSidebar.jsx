import CollapsibleSection from '../../components/shared/CollapsibleSection'
import CommandsPanel from '../commands/CommandsPanel'
import ResourcesPanel from '../resources/ResourcesPanel'
import LogsPanel from '../logs/LogsPanel'

export default function RightSidebar() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
      <CollapsibleSection title="Commands">
        <CommandsPanel />
      </CollapsibleSection>

      <div className="border-t border-outline-variant" />

      <CollapsibleSection title="Resources">
        <ResourcesPanel />
      </CollapsibleSection>

      <div className="border-t border-outline-variant" />

      <CollapsibleSection title="Logs">
        <LogsPanel />
      </CollapsibleSection>
    </div>
  )
}
