import { toast } from '@/hooks';
import { atom, useAtom } from 'jotai';
import { allQuestionsAtom, currQuestionAtom, currQuestionIdxAtom, useSubmissionStates } from './questions';
import { useWebSocket } from './ws';
import { SubmissionHistory, TestResults } from '../types';
import { editorContentAtom, selectedLanguageAtom } from '../competitor-state';
import { ToastActionElement } from '@/components/ui/toast';
import { tokenAtom, tryFetch } from './auth';
import { ipAtom } from './api';

type ActiveKind = 'test' | 'submission';
const testResultsAtom = atom<
    | null
    | (
        | ({ resultState: 'compile-fail' } & SubmissionHistory)
        | { resultState: 'partial-results'; results: (TestResults | null)[]; cases: number; }
        | ({ resultState: 'test-complete'; results: TestResults[]; cases: number; } & SubmissionHistory)
    ) & { kind: ActiveKind }

>(null);
const pendingAtom = atom<ActiveKind | null>(get => {
    const x = get(testResultsAtom);
    return x !== null && x.resultState === 'partial-results'
        ? x.kind
        : null;
});
export const useTesting = () => {
    const [testResults, setTestResults] = useAtom(testResultsAtom);
    const { ws } = useWebSocket();
    const [editorContent] = useAtom(editorContentAtom);
    const [currentQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [currentQuestion] = useAtom(currQuestionAtom);
    const [selectedLanguage] = useAtom(selectedLanguageAtom);
    const { setCurrentState } = useSubmissionStates();
    const [token] = useAtom(tokenAtom);
    const [ip] = useAtom(ipAtom);
    const [pending] = useAtom(pendingAtom);

    const runTests = async (kind: ActiveKind) => {
        if (token === null) return;
        if (ip === null) return;
        if (selectedLanguage === undefined) return;

        const out = await tryFetch<{ id: string; cases: number; }>(`/questions/${currentQuestionIdx}/${kind}s`, token, ip, {
            method: 'POST',
            bodyJson: {
                language: selectedLanguage.toLowerCase(),
                solution: editorContent,
            },
        });

        if (out === null) {
            setTestResults(null);
            return;
        }

        setTestResults({
            resultState: 'partial-results',
            kind,
            results: Array.from({ length: out.cases }, () => null),
            cases: out.cases,
        });

        const testId: string = out.id;
        const wsPrefix = `tests-${currentQuestionIdx}`;
        const removeWsListeners = () => {
            ws.removeEvent('tests-error', `${wsPrefix}-error`);
            ws.removeEvent('test-results', `${wsPrefix}-results`);
            ws.removeEvent('tests-complete', `${wsPrefix}-complete`);
            ws.removeEvent('tests-cancelled', `${wsPrefix}-cancelled`);
            ws.removeEvent('tests-compile-fail', `${wsPrefix}-compile-fail`);
        };

        ws.registerEvent('tests-error', ({ id }) => {
            if (id === testId) {
                setTestResults(null);
                toast({
                    title: 'An unexpected error occurred while running your tests',
                    description: 'Please contact a competition host.',
                    variant: 'destructive',
                });
                removeWsListeners();
            }
        }, `${wsPrefix}-error`, false);

        ws.registerEvent('tests-cancelled', ({ id }) => {
            if (id === testId) {
                setTestResults(null);
                removeWsListeners();
                toast({
                    title: 'Your running tests have been cancelled',
                });
            }
        }, `${wsPrefix}-cancelled`, false);

        ws.registerEvent('tests-complete', (data) => {
            if (data.id === testId) {
                setTestResults({
                    resultState: 'test-complete',
                    kind,
                    cases: out.cases,
                    ...data,
                });
                removeWsListeners();
                setCurrentState(s => ({ ...s, remainingAttempts: data.remainingAttempts }));
            }
        }, `${wsPrefix}-complete`, false);

        ws.registerEvent('tests-compile-fail', (data) => {
            if (data.id === testId) {
                setTestResults({
                    resultState: 'compile-fail',
                    kind,
                    ...data,
                });
                removeWsListeners();
            }
        }, `${wsPrefix}-compile-fail`, false);

        ws.registerEvent('test-results', ({ id, results }) => {
            if (id === testId) {
                setTestResults(old => {
                    if (!old || old.resultState !== 'partial-results') {
                        console.error(`Recieved 'test-results' for '${id}' while results were in state '${old?.resultState}'`);
                        return old;
                    }

                    console.log('before', old.results);
                    const newResults = old === null ? [] : [...old.results];
                    for (const result of results) {
                        newResults[result.index] = result;
                    }
                    console.log('after', newResults);

                    return {
                        resultState: 'partial-results',
                        kind,
                        cases: old.cases,
                        results: newResults,
                    };
                });
            }
        }, `${wsPrefix}-results`, false);
    };

    return { testResults, runTests, pending };
};
