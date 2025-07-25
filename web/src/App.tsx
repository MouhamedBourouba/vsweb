import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { create } from 'zustand'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'

interface EditorState {
  editor: monaco.editor.IStandaloneCodeEditor | null
  setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void
}

const useAppState = create<EditorState>()((set) => {
  return {
    editor: null,
    setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => { set({ editor: editor }) }
  }
})

function Terminal() {
  return (<div>Terminal</div>)
}

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

function FileTree() {
  return (<div>File tree</div>)
}

function App() {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-screen">
      <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
        <FileTree />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={80}>
        <ResizablePanelGroup direction='vertical'>
          <ResizablePanel>
            <Editor className="h-full w-full" />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <Terminal />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>


    </ResizablePanelGroup>
  )
}

export default App
