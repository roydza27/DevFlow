import { useEffect, useRef } from 'react'

export default function NoteEditor({ note, onChange, expanded = false }) {
  const editorRef = useRef(null)

  // This component remounts when the note changes (key={note.id} in parent),
  // so this effect only runs once on mount to initialize the contenteditable content.
  useEffect(() => {
    if (!editorRef.current || !note) return
    const content = note.content ?? ''
    editorRef.current.innerText = content
    editorRef.current.dataset.empty = content.trim() === '' ? 'true' : 'false'
  }, []) // intentionally empty — remount via key handles note switches

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-outline">Select or create a note</p>
      </div>
    )
  }

  function handleInput(e) {
    const text = e.currentTarget.innerText
    e.currentTarget.dataset.empty = text.trim() === '' ? 'true' : 'false'
    onChange?.(note.id, text)
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder="Start writing…"
        data-empty="false"
        spellCheck={false}
        className={`note-editor flex-1 overflow-y-auto hide-scrollbar focus:outline-none text-on-surface font-mono leading-7 ${
          expanded ? 'px-12 py-8 text-[15px]' : 'px-4 py-3 text-sm'
        }`}
      />
    </div>
  )
}
