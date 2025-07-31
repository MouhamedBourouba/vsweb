import { useEffect, useMemo, useRef } from "react"
import { Terminal as XTerminal } from '@xterm/xterm'
import { useTerminalStore } from "@/stores/terminalStore"
import { FitAddon } from "@xterm/addon-fit"

function Terminal({ className = "" }: { className?: string }) {
  const terminalStore = useTerminalStore()
  const terminalRef = useRef<HTMLDivElement>(null)
  const bgColor = useMemo(() => "#1e1e1e", [])

  useEffect(() => {
    let xterm = new XTerminal({
      theme: {
        background: bgColor,
        foreground: '#ffffff'
      },
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
    })

    let fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)

    xterm.open(terminalRef.current!)

    terminalStore.initTerminalSession(xterm, fitAddon)

    let observer = new ResizeObserver((_) => terminalStore.onResize())
    observer.observe(terminalRef.current!)

    return () => {
      terminalStore.dispose()
      observer.disconnect()
    }
  }, [])

  return <div className={className} style={{ background: "red" }} ref={terminalRef}></div>
}

export default Terminal
