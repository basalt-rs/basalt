import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';
import { currQuestionIdxAtom } from './services/questions';
import { Language } from './types';
import { defaultEditorSettings, EditorSettings } from './editor/settings';

export const editorSettingsAtom = atomWithStorage<EditorSettings>(
    'editor-settings',
    defaultEditorSettings
);
export const currentTabAtom = atom<'text-editor' | 'leaderboard'>('text-editor');

const editorsAtom = atomWithStorage<string[]>('editors', []);
export const editorContentAtom = atom(
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

export const selectedLanguageAtom = atom<Language | null>(null);

export interface TestResult {
    state: 'pass' | 'fail';
    input: string;
    expectedOutput: string;
    actualOutput: string;
    stderr: string;
}

export const inlineDiffAtom = atomWithStorage('inline-diff', false);
