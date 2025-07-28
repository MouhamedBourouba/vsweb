import { useEffect, useRef } from "react"
import { Terminal as XTerminal } from '@xterm/xterm'
import { useTerminalStore } from "@/stores/terminalStore"

function Terminal({ className = "" }: { className?: string }) {
  const terminalStore = useTerminalStore()
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

      terminalStore.initTerminalSession(xterm.current)

      xterm.current.write("Terminal ready!\r\n$ ")

      return () => {
      }
    }
  }, [])

  return <div className={className} ref={terminalRef}></div>
}

export default Terminal
