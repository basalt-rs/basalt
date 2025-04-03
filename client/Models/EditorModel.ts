import { atom } from 'jotai';

// Default Editor Configurations
export const editorSettingsAtom = atom({
    theme: 'monokai',
    options: {
        autoIndent: true,
        showLineNumbers: true,
        basicAutocompletion: true,
        liveAutocompletion: true,
        highlightActiveLine: false,
        relativeLine: false,
        showIndentGuides: false,
    },
    fontSize: 12,
    softTabs: 4,
    keybind: 'ace',
    cursorStyle: 'ace',
    foldStyle: 'manual' | 'markbegin' | 'markbeginend' | 'undefined',
});
