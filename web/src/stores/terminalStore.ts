import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { create } from "zustand";

let socket: WebSocket;
let isInit = false;
let registeredSocketCallBack = false;

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

function connectToWs(terminal: XTerminal) {
  terminal?.onData((data) => {
    if (socket.readyState == WebSocket.OPEN) {
      socket.send(data);
    }
  });

  let retry = () => {
    try {
      socket = new WebSocket("ws://localhost:8080/shell");

      socket.onopen = (_) => {
        console.log("WS connected");
      };

      socket.onerror = (message) => {
        console.log(message);
      };

      socket.onmessage = (message) => {
        terminal?.write(message.data);
      };

      socket.onclose = (_) => {
        if (isInit) {
          setTimeout(() => {
            if (socket.readyState == WebSocket.CLOSED) {
              retry();
            }
          }, 1000);
        }
      };
    } catch (error) {
      // Todo: handle errors
      // Todo: Add loading state
      console.log(error);
    }
  };
  retry();
}

const useTerminalStore = create<TerminalState>()((set, get) => ({
  terminal: null,
  fitAddon: null,

  initTerminalSession: async (terminal, fitAddon) => {
    isInit = true;
    set({ terminal: terminal, fitAddon: fitAddon });
    connectToWs(terminal);
  },

  dispose: function (): void {
    if (isInit) {
      get().fitAddon?.dispose();
      get().terminal?.dispose();

      get().terminal = null;
      get().fitAddon = null;

      isInit = false;
      registeredSocketCallBack = false;
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
