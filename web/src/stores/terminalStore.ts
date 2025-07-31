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

function debouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  timeout: number,
) {
  let timeoutHandler: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutHandler !== null) {
      clearTimeout(timeoutHandler);
    }

    timeoutHandler = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}

let debouncedTerminalSizeSync = debouncedCallback(
  (terminal: XTerminal, socket: WebSocket) => {
    const resizeMessage = `/resize ${terminal!.rows.toString()} ${terminal!.cols.toString()}`;
    socket.send(resizeMessage);
  },
  500,
);

let socket: WebSocket;
let isInit = false;

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
    const { terminal, fitAddon } = get();

    fitAddon?.fit();
    debouncedTerminalSizeSync(terminal!, socket);
  },
}));

export { useTerminalStore };
