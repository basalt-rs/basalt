import { atomWithStorage } from 'jotai/utils';
import { atom, useAtom } from 'jotai';

export interface EditorSettings {
    theme: string;
    useSoftTabs: boolean;
    showGutter: boolean;
    enableBasicAutocompletion: boolean;
    enableLiveAutocompletion: boolean;
    highlightActiveLine: boolean;
    relativeLineNumbers: boolean;
    displayIndentGuides: boolean;
    fontSize: number;
    tabSize: number;
    keybind: 'ace' | 'vscode' | 'vim' | 'emacs' | 'sublime' | undefined;
    cursorStyle: 'ace' | 'slim' | 'smooth' | 'smooth-slim' | 'wide' | undefined;
    foldStyle: 'manual' | 'markbegin' | 'markbeginend' | undefined;
}

// Default Editor Configurations
export const editorSettingsAtom = atomWithStorage<EditorSettings>('editor-settings', {
    theme: 'monokai',
    useSoftTabs: true,
    showGutter: true,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    highlightActiveLine: false,
    relativeLineNumbers: false,
    displayIndentGuides: false,
    fontSize: 12,
    tabSize: 4,
    keybind: 'ace',
    cursorStyle: 'ace',
    foldStyle: 'manual',
});

export interface EditorSettings {
    theme: string;
    useSoftTabs: boolean;
    showGutter: boolean;
    enableBasicAutocompletion: boolean;
    enableLiveAutocompletion: boolean;
    highlightActiveLine: boolean;
    relativeLineNumbers: boolean;
    displayIndentGuides: boolean;
    fontSize: number;
    tabSize: number;
    keybind: 'ace' | 'vscode' | 'vim' | 'emacs' | 'sublime' | undefined;
    cursorStyle: 'ace' | 'slim' | 'smooth' | 'smooth-slim' | 'wide' | undefined;
    foldStyle: 'manual' | 'markbegin' | 'markbeginend' | undefined;
}

export const currentTabAtom = atom<'text-editor' | 'leaderboard'>('text-editor');

export const selectedLanguageAtom = atom<string>();

const editorContentAtom = atom<string>('');
export const useEditorContent = () => {
    const [editorContent, setEditorContent] = useAtom(editorContentAtom);
    return { editorContent, setEditorContent };
};
