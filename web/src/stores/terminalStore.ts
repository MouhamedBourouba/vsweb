import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { create } from "zustand";

interface TerminalState {
  terminal: XTerminal | null;
  fitAddon: FitAddon | null;

  initTerminalSession(terminal: XTerminal, fitAddon: FitAddon): Promise<void>;
  onResize(): void;
  dispose(): void;
}

const useTerminalStore = create<TerminalState>()((set, get) => ({
  terminal: null,
  fitAddon: null,

  initTerminalSession: async (terminal, fitAddon) => {
    set({ terminal: terminal, fitAddon: fitAddon });

    let socket = new WebSocket("ws://localhost:8080/shell");

    socket.onerror = (message) => {
      console.log(message);
    };

    socket.onmessage = (message) => {
      terminal?.write(message.data);
    };

    socket.onopen = (_) => {
      terminal?.onData((data) => {
        socket.send(data);
      });
    };
  },

  dispose: function (): void {
    if (get().terminal != null) {
      get().fitAddon?.dispose();
      get().terminal?.dispose();
      get().terminal = null;
      get().fitAddon = null;
    }
  },

  onResize: function (): void {
    get().fitAddon?.fit();
  },
}));

export { useTerminalStore };
