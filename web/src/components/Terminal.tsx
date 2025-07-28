import { useEffect, useRef } from "react"
import { useAppState } from "@/store"
import { Terminal as XTerminal } from '@xterm/xterm'

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

export default Terminal
