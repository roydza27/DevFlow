import ActionItem from './ActionItem'

const MOCK_ACTIONS = [
  { id: 1, label: 'Develop', command: 'npm run dev' },
  { id: 2, label: 'Git Branch', command: 'feature/db-refactor' },
  { id: 3, label: 'Test', command: 'npm run test:unit' },
  { id: 4, label: 'Docker', command: 'compose up -d' },
]

export default function ActionsPanel() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <h2 className="text-xs font-label font-semibold uppercase tracking-widest text-outline">Quick Actions</h2>
      <div className="flex flex-col gap-1.5 overflow-y-auto hide-scrollbar flex-1">
        {MOCK_ACTIONS.map(action => (
          <ActionItem key={action.id} action={action} />
        ))}
      </div>
    </div>
  )
}
