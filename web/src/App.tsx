import { useEffect, useRef } from 'react'
import * as monaco from 'monaco-editor'
import { create } from 'zustand'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'

import { Terminal as XTerminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

interface EditorState {
  editor: monaco.editor.IStandaloneCodeEditor | null
  terminal: XTerminal | null

  setEditor: (editor: monaco.editor.IStandaloneCodeEditor | null) => void
  setTerminal: (terminal: XTerminal | null) => void
}

const useAppState = create<EditorState>()((set) => {
  return {
    editor: null,
    terminal: null,

    setEditor(editor) {
      set({ editor: editor })
    },
    setTerminal(terminal) {
      set({ terminal: terminal })
    },
  }
})

function Terminal({ className = "" }: { className?: string }) {
  const setTerminal = useAppState((state) => state.setTerminal)
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const xterm = useRef<XTerminal | null>(null)

  useEffect(() => {
    if (terminalRef.current && !xterm.current) {
      xterm.current = new XTerminal({
        theme: {
          background: '#1e1e1e',
          foreground: '#ffffff'
        },
        fontSize: 14,
        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
      })
      xterm.current.open(terminalRef.current)

      setTerminal(xterm.current)

      xterm.current.write("Terminal ready!\r\n$ ")

      return () => {
        if (xterm.current) {
          xterm.current.dispose()
          xterm.current = null
        }
        setTerminal(null)
      }
    }
  }, [])

  return <div className={className} ref={terminalRef}></div>
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
  return (<div className='flex flex-col bg-amber-600'>File tree</div>)
}

function App() {
  return (
    <div className='h-screen w-screen'>
      <ResizablePanelGroup direction="horizontal" className="h-screen w-screen">
        <ResizablePanel defaultSize={20} minSize={10} maxSize={30}>
          <FileTree />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction='vertical'>

            <ResizablePanel defaultSize={80} minSize={20}>
              <Editor className='size-full'></Editor>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel>
              <Terminal className='size-full' />
            </ResizablePanel>

          </ResizablePanelGroup>
        </ResizablePanel>


      </ResizablePanelGroup>
    </div>
  )
}

export default App
