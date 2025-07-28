import { useEffect, useRef } from "react"
import * as monaco from 'monaco-editor'
import { useAppState } from "@/store"

function Editor({ className = "", theme = "vs-dark" }: { className?: string, theme?: string }) {
  const setEditor = useAppState((appState) => (appState.setEditor))
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const editor = monaco.editor.create(containerRef.current, {
      value: "// edit ur code here",
      language: 'javascript',
      autoIndent: 'advanced',
      automaticLayout: true,
      renderWhitespace: 'all',
      renderLineHighlight: 'all',
      minimap: {
        scale: 10
      },
      tabSize: 2,
      insertSpaces: true,
      formatOnType: true,
      formatOnPaste: true,
      detectIndentation: true,
      trimAutoWhitespace: true,
      theme: theme,
    })

    setEditor(editor)

    return () => {
      editor.dispose()
    }
  }, [])

  return <div className={className} ref={containerRef}></div>
}

export default Editor
