import { Terminal as XTerminal } from "@xterm/xterm";
import { create } from "zustand";

interface TerminalState {
  terminal: XTerminal | null;

  initTerminalSession(terminal: XTerminal | null): Promise<void>;
  dispose(): void;
}

const useTerminalStore = create<TerminalState>()((set) => ({
  terminal: null,

  initTerminalSession: async (terminal) => {
    set({ terminal: terminal });

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
    if (this.terminal != null) {
      this.terminal?.dispose();
      this.terminal = null;
    }
  },
}));

export { useTerminalStore };
