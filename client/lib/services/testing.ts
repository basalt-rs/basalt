import { toast } from '@/hooks';
import { atom, useAtom } from 'jotai';
import { currQuestionIdxAtom, useSubmissionStates } from './questions';
import { useWebSocket } from './ws';
import { TestResults } from '../types';
import { editorContentAtom, selectedLanguageAtom } from '../competitor-state';

const testsLoadingAtom = atom<'test' | 'submit' | null>(null);
const testResultsAtom = atom<
    (TestResults & { percent: number; submitKind: 'test' | 'submit' }) | null
>(null);
export const useTesting = () => {
    const [loading, setLoading] = useAtom(testsLoadingAtom);
    const [testResults, setTestResults] = useAtom(testResultsAtom);
    const { ws } = useWebSocket();
    const [editorContent] = useAtom(editorContentAtom);
    const [currentQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [selectedLanguage] = useAtom(selectedLanguageAtom);
    const { setCurrentState } = useSubmissionStates();

    const runTests = async () => {
        setLoading('test');
        const { results, percent } = await ws.sendAndWait({
            kind: 'run-test',
            language: selectedLanguage?.toLowerCase() || 'java',
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
            language: selectedLanguage?.toLowerCase() || 'java',
            problem: currentQuestionIdx,
            solution: editorContent,
        });

        if (res.kind === 'submit') {
            setTestResults({ ...res.results, percent: res.percent, submitKind: 'submit' });
            if (res.percent >= 100) {
                toast({
                    title: 'Submission Passed!',
                    variant: 'success',
                });
            } else if (res.remainingAttempts !== null) {
                toast({
                    title: 'Submission Failed!',
                    description: `You have ${res.remainingAttempts} ${res.remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining`,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Submission Failed!',
                    description: `Pass rate: ${res.percent}%`,
                    variant: 'destructive',
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
