import CommandItem from './CommandItem'

const MOCK_COMMANDS = [
  { id: 1, label: 'Develop', command: 'npm run dev' },
  { id: 2, label: 'Git Branch', command: 'feature/db-refactor' },
  { id: 3, label: 'Test', command: 'npm run test:unit' },
  { id: 4, label: 'Docker', command: 'compose up -d' },
]

export default function CommandsPanel() {
  return (
    <div className="flex flex-col gap-1.5">
      {MOCK_COMMANDS.map(cmd => (
        <CommandItem key={cmd.id} command={cmd} />
      ))}
    </div>
  )
}
