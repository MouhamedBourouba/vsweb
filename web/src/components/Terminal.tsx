import { useEffect, useRef } from "react"
import { Terminal as XTerminal } from '@xterm/xterm'
import { useTerminalStore } from "@/stores/terminalStore"
import { FitAddon } from "@xterm/addon-fit"

const bgColor = "#1e1e1e"

function Terminal({ className = "" }: { className?: string }) {
  const terminalStore = useTerminalStore()
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const xterm = new XTerminal({
      theme: {
        background: bgColor,
        foreground: '#ffffff'
      },
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
    })

    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)

    xterm.open(terminalRef.current!)

    terminalStore.initTerminalSession(xterm, fitAddon)

    const observer = new ResizeObserver((_) => terminalStore.onResize())
    observer.observe(terminalRef.current!)

    return () => {
      terminalStore.dispose()
      observer.disconnect()
    }
  }, [])

  return <div className={className} style={{ background: bgColor }} ref={terminalRef}></div>
}

export default Terminal
