import { toast } from '@/hooks';
import { atom, useAtom } from 'jotai';
import { currQuestionIdxAtom, useSubmissionStates } from './questions';
import { useEditorContent } from '../competitor-state';
import { useWebSocket } from './ws';
import { TestResults } from '../types';

const selectedLanguageAtom = atom<string>('java');
const testsLoadingAtom = atom<'test' | 'submit' | null>(null);
const testResultsAtom = atom<
    (TestResults & { percent: number; submitKind: 'test' | 'submit' }) | null
>(null);
export const useTesting = () => {
    const [loading, setLoading] = useAtom(testsLoadingAtom);
    const [testResults, setTestResults] = useAtom(testResultsAtom);
    const ws = useWebSocket();
    const { editorContent } = useEditorContent();
    const [currentQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [selectedLanguage] = useAtom(selectedLanguageAtom);
    const { setCurrentState } = useSubmissionStates();

    const runTests = async () => {
        setLoading('test');
        const { results, percent } = await ws.sendAndWait({
            kind: 'run-test',
            language: selectedLanguage,
            problem: currentQuestionIdx,
            solution: editorContent,
        });

        setTestResults({ ...results, percent, submitKind: 'test' });
        setLoading(null);
    };

    const submit = async () => {
        setLoading('submit');
        const res = await ws.sendAndWait({
            kind: 'submit',
            language: selectedLanguage,
            problem: currentQuestionIdx,
            solution: editorContent,
        });

        if (res.kind === 'submit') {
            setTestResults({ ...res.results, percent: res.percent, submitKind: 'submit' });
            const isPass =
                res.results.kind === 'individual' &&
                res.results.tests.every((t) => t[0] === 'Pass');
            if (!isPass) {
                toast({
                    title: `You have ${res.remainingAttempts} ${res.remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining`,
                });
            }
            setCurrentState((s) => ({
                ...s,
                remainingAttempts: res.remainingAttempts,
            }));
        } else {
            setTestResults({
                kind: 'other-error',
                message: res.message,
                percent: 0,
                submitKind: 'submit',
            });
        }
        setLoading(null);
    };

    return { loading, runTests, submit, testResults };
};
