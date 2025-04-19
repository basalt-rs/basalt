import { atomWithStorage } from 'jotai/utils';
import { atom, useAtom } from 'jotai';
import { currQuestionIdxAtom } from './services/questions';

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
    fontSize: 16,
    tabSize: 4,
    keybind: 'ace',
    cursorStyle: 'ace',
    foldStyle: 'manual',
});

export const currentTabAtom = atom<'text-editor' | 'leaderboard'>('text-editor');

const editorsAtom = atomWithStorage<string[]>('editors', []);
const editorContentAtom = atom(
    // get the entry from editorsAtom or default to the empty string
    async (get) => {
        const editors = get(editorsAtom);
        const questionIdx = get(currQuestionIdxAtom);
        return editors[questionIdx] ?? '';
    },
    // set the entry in editorsAtom to the content when updated
    async (get, set, newContent: string) => {
        const questionIdx = get(currQuestionIdxAtom);
        set(editorsAtom, ([...editors]: string[]) => {
            editors[questionIdx] = newContent;
            return editors;
        });
    }
);

export const useEditorContent = () => {
    const [editorContent, setEditorContent] = useAtom(editorContentAtom);
    return {
        editorContent,
        setEditorContent,
    };
};

export interface TestResult {
    state: 'pass' | 'fail';
    input: string;
    expectedOutput: string;
    actualOutput: string;
    stderr: string;
}

export const inlineDiffAtom = atomWithStorage('inline-diff', false);
