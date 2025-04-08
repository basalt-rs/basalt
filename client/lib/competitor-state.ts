import { atomWithStorage } from 'jotai/utils';
import { atom, useAtom } from 'jotai';
import { allQuestionsAtom, currQuestionIdxAtom } from './services/questions';

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

export const currentTabAtom = atom<'text-editor' | 'leaderboard'>('text-editor');

const editorsAtom = atom<string[]>([]);
const editorContentAtom = atom(
    async (get) => {
        const editors = get(editorsAtom);
        const questionIdx = get(currQuestionIdxAtom);
        return editors[questionIdx] ?? '';
    },
    async (get, set, newContent: string) => {
        const questionIdx = get(currQuestionIdxAtom);
        console.log('set content 1', { newContent });
        set(editorsAtom, (editors: string[]) => {
            console.log('set content', { editors, newContent });
            editors[questionIdx] = newContent;
            return editors;
        })
    }
);

export const useEditorContent = () => {
    const [editorContent, setEditorContent] = useAtom(editorContentAtom);
    return {
        editorContent,
        setEditorContent,
    };
};
