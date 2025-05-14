import { toast } from '@/hooks';
import { atom, useAtom } from 'jotai';
import { allQuestionsAtom, currQuestionIdxAtom, useSubmissionStates } from './questions';
import { useWebSocket } from './ws';
import { TestResults } from '../types';
import { editorContentAtom, selectedLanguageAtom } from '../competitor-state';
import { ToastActionElement } from '@/components/ui/toast';

const testsLoadingAtom = atom<'test' | 'submit' | null>(null);
const testResultsAtom = atom<
    (TestResults & { failed: number; passed: number; submitKind: 'test' | 'submit' }) | null
>(null);
export const useTesting = () => {
    const [loading, setLoading] = useAtom(testsLoadingAtom);
    const [testResults, setTestResults] = useAtom(testResultsAtom);
    const { ws } = useWebSocket();
    const [editorContent] = useAtom(editorContentAtom);
    const [currentQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [allQuestions] = useAtom(allQuestionsAtom);
    const [selectedLanguage] = useAtom(selectedLanguageAtom);
    const { setCurrentState } = useSubmissionStates();

    const runTests = async () => {
        setLoading('test');
        try {
            const { results, failed, passed } = await ws.sendAndWait({
                kind: 'run-test',
                language: selectedLanguage?.toLowerCase() || 'java',
                problem: currentQuestionIdx,
                solution: editorContent,
            });
            setTestResults({ ...results, failed, passed, submitKind: 'test' });
        } catch (ex) {
            console.error('Error running tests:', ex);
            setTestResults(null);
        }
        setLoading(null);
    };

    const submit = async (nextQuestion?: ToastActionElement) => {
        setLoading('submit');
        try {
            const res = await ws.sendAndWait({
                kind: 'submit',
                language: selectedLanguage?.toLowerCase() || 'java',
                problem: currentQuestionIdx,
                solution: editorContent,
            });

            if (res.kind === 'submit') {
                const { passed, failed } = res;
                setTestResults({ ...res.results, failed, passed, submitKind: 'submit' });
                if (res.results.kind === 'individual') {
                    if (failed === 0) {
                        toast({
                            title: 'Submission Passed!',
                            variant: 'success',
                            action:
                                currentQuestionIdx < allQuestions.length - 1
                                    ? nextQuestion
                                    : undefined,
                        });
                    } else {
                        toast({
                            title: `Your solution passed ${passed} out of ${failed + passed} tests.`,
                            description:
                                res.remainingAttempts !== null &&
                                `You have ${res.remainingAttempts} ${res.remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining`,
                            variant: 'destructive',
                        });
                    }
                }
                setCurrentState((s) => ({
                    ...s,
                    remainingAttempts: res.remainingAttempts,
                }));
            } else {
                setTestResults({
                    kind: 'other-error',
                    message: res.message,
                    failed: 0,
                    passed: 0,
                    submitKind: 'submit',
                });
            }
        } catch (ex) {
            console.error('Error running submissions:', ex);
            setTestResults(null);
        }
        setLoading(null);
    };

    return {
        loading,
        runTests,
        submit,
        testResults,
        clearTestResults: () => setTestResults(null),
    };
};
