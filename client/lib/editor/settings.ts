import { Theme } from './themes';

export type Keymap = 'default' | 'vscode' | 'vim' | 'emacs';
export type LineNumbers = 'off' | 'normal' | 'relative';

export interface EditorSettings {
    theme: Theme;
    keymap: Keymap;
    fontSize: number;
    autocompletion: boolean;
    minimap: boolean;
    lineNumbers: LineNumbers;
    highlightMatchingBracket: boolean;
    autoCloseBrackets: boolean;
    highlightActiveLine: boolean;
    highlightSelectionMatches: boolean;
    tabSize: number;
    indentGuides: boolean;

    // useSoftTabs: boolean;
    // showGutter: boolean;
    // displayIndentGuides: boolean;
    // cursorStyle: 'ace' | 'slim' | 'smooth' | 'smooth-slim' | 'wide';
    // foldStyle: 'manual' | 'markbegin' | 'markbeginend';
}

export const defaultEditorSettings: EditorSettings = {
    theme: 'monokai',
    keymap: 'default',
    fontSize: 16,
    autocompletion: true,
    minimap: true,
    lineNumbers: 'normal',
    highlightMatchingBracket: true,
    autoCloseBrackets: true,
    highlightActiveLine: true,
    highlightSelectionMatches: true,
    tabSize: 4,
    indentGuides: false,

    // useSoftTabs: true,
    // showGutter: true,
    // cursorStyle: 'ace',
    // foldStyle: 'manual',
};
