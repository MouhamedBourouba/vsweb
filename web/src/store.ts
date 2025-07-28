import { Terminal as XTerminal } from "@xterm/xterm";
import { create } from "zustand";
import * as monaco from "monaco-editor";

interface AppState {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  terminal: XTerminal | null;

  setEditor: (editor: monaco.editor.IStandaloneCodeEditor | null) => void;
  setTerminal: (terminal: XTerminal | null) => void;
}

const useAppState = create<AppState>()((set) => {
  return {
    editor: null,
    terminal: null,

    setEditor(editor) {
      set({ editor: editor });
    },
    setTerminal(terminal) {
      set({ terminal: terminal });
    },
  };
});

export { useAppState };
