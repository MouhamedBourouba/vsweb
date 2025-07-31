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

var socket: WebSocket;
var isInit = false;

const useTerminalStore = create<TerminalState>()((set, get) => ({
  terminal: null,
  fitAddon: null,

  initTerminalSession: async (terminal, fitAddon) => {
    set({ terminal: terminal, fitAddon: fitAddon });
    try {
      socket = new WebSocket("ws://localhost:8080/shell");
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
      isInit = true;
    } catch (error) {
      // Todo: handle errors
      console.log("error Connecting to ws");
    }
  },

  dispose: function (): void {
    if (isInit) {
      isInit = false;
      get().fitAddon?.dispose();
      get().terminal?.dispose();
      get().terminal = null;
      get().fitAddon = null;
    }
  },

  onResize: function (): void {
    if (!isInit) {
      return;
    }

    get().fitAddon?.fit();

    // sync with the server
    // Todo: add debounced value to not overwhelm the server
    let resizeMessage = [
      "/resize",
      get().terminal!.rows.toString(),
      get().terminal!.cols.toString(),
    ].join(" ");

    socket.send(resizeMessage);
  },
}));
export { useTerminalStore };
