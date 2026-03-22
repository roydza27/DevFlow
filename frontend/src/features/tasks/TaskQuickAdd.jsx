import { useState } from 'react'
import Input from '../../components/ui/Input'

export default function TaskQuickAdd({ onAdd }) {
  const [value, setValue] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim())
      setValue('')
    }
  }

  return (
    <Input
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Add task… (Enter)"
    />
  )
}
