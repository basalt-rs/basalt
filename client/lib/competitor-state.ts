import { atomWithStorage } from 'jotai/utils';
import { atom, useAtom } from 'jotai';
import { allQuestionsAtom, currQuestionIdxAtom } from './services/questions';
import { TestResults, TestState } from './types';
import { basaltWSClientAtom } from './services/ws';
import { toast } from '@/hooks';

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

const editorsAtom = atomWithStorage<string[]>('editors', []);
const editorContentAtom = atom(
    async (get) => {
        const editors = get(editorsAtom);
        const questionIdx = get(currQuestionIdxAtom);
        console.log(editors, questionIdx);
        return editors[questionIdx] ?? '';
    },
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

const selectedLanguageAtom = atom<string>('java');
const testsLoadingAtom = atom<'test' | 'submit' | null>(null);
const testResultsAtom = atom<(TestResults & { percent: number }) | null>(null);
export const useTesting = () => {
    const [loading, setLoading] = useAtom(testsLoadingAtom);
    const [testResults, setTestResults] = useAtom(testResultsAtom);
    const [ws] = useAtom(basaltWSClientAtom);
    const { editorContent } = useEditorContent();
    const [currentQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [selectedLanguage] = useAtom(selectedLanguageAtom);

    const runTests = async () => {
        setLoading('test');
        const { results, percent } = await ws.sendAndWait({
            kind: 'run-test',
            language: selectedLanguage,
            problem: currentQuestionIdx,
            solution: editorContent,
        });


        setTestResults({ ...results, percent });
        if (results.kind === 'compile-fail') {
            toast({
                title: 'Test code failed to comile',
                variant: 'destructive',
            });
        } else if (results.kind === 'internal-error') {
            toast({
                title: 'There was an error while running your test.',
                description: 'Please contact a competition host',
                variant: 'destructive',
            });
        }

        setLoading(null);
    };

    const submit = async () => {
        setLoading('submit');
        await new Promise((res) => setTimeout(res, 5000));
        setTestResults({ kind: 'internal-error' });
        setLoading(null);
    };

    return { loading, runTests, submit, testResults };
};
