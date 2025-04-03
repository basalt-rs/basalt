import { atomWithStorage } from 'jotai/utils';

export interface EditorSettings {
    theme: string;
    autoIndent: boolean;
    showLineNumbers: boolean;
    basicAutocompletion: boolean;
    liveAutocompletion: boolean;
    highlightActiveLine: boolean;
    relativeLine: boolean;
    showIndentGuides: boolean;
    fontSize: number;
    softTabs: number;
    keybind: 'ace' | 'vscode' | 'vim' | 'emacs' | 'sublime' | undefined;
    cursorStyle: 'ace' | 'slim' | 'smooth' | 'smooth-slim' | 'wide' | undefined;
    foldStyle: 'manual' | 'markbegin' | 'markbeginend' | undefined;
}

// Default Editor Configurations
export const editorSettingsAtom = atomWithStorage<EditorSettings>('editor-settings', {
    theme: 'monokai',
    autoIndent: true,
    showLineNumbers: true,
    basicAutocompletion: true,
    liveAutocompletion: true,
    highlightActiveLine: false,
    relativeLine: false,
    showIndentGuides: false,
    fontSize: 12,
    softTabs: 4,
    keybind: 'ace',
    cursorStyle: 'ace',
    foldStyle: 'manual',
});
