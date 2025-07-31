import { create } from "zustand";
import * as monaco from "monaco-editor";

interface EditorState {
  editor: monaco.editor.IStandaloneCodeEditor | null;

  setEditor: (editor: monaco.editor.IStandaloneCodeEditor | null) => void;
}

const useEditorStore = create<EditorState>()((set) => {
  return {
    editor: null,

    setEditor(editor) {
      set({ editor: editor });
    },
  };
});

export { useEditorStore };
