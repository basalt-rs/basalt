import { toast } from '@/hooks';
import { atom, useAtom } from 'jotai';
import { currQuestionIdxAtom, useSubmissionStates } from './questions';
import { useWebSocket } from './ws';
import { SubmissionHistory, TestResults } from '../types';
import { editorContentAtom, selectedLanguageAtom } from '../competitor-state';
import { tokenAtom, tryFetch } from './auth';
import { ipAtom } from './api';

type ActiveKind = 'test' | 'submission';
type TestComplete = { results: TestResults[]; cases: number } & SubmissionHistory;
type PartialResults = {
    results: (TestResults | null)[];
    cases: number;
    compileOutput: { stdout: string; stderr: string } | null;
};

const testResultsAtom = atom<
    | null
    | ((
          | ({ resultState: 'compile-fail' } & SubmissionHistory)
          | ({ resultState: 'partial-results' } & PartialResults)
          | ({ resultState: 'test-complete' } & TestComplete)
      ) & { kind: ActiveKind })
>(null);
const pendingAtom = atom<ActiveKind | null>((get) => {
    const x = get(testResultsAtom);
    return x !== null && x.resultState === 'partial-results' ? x.kind : null;
});
export const useTesting = () => {
    const [testResults, setTestResults] = useAtom(testResultsAtom);
    const { ws } = useWebSocket();
    const [editorContent] = useAtom(editorContentAtom);
    const [currentQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [selectedLanguage] = useAtom(selectedLanguageAtom);
    const { setCurrentState } = useSubmissionStates();
    const [token] = useAtom(tokenAtom);
    const [ip] = useAtom(ipAtom);
    const [pending] = useAtom(pendingAtom);

    const runTests = async (
        kind: ActiveKind
    ): Promise<{ id: string; activeTest: Promise<SubmissionHistory> } | null> => {
        if (token === null) return null;
        if (ip === null) return null;
        if (selectedLanguage === undefined) return null;

        const out = await tryFetch<{ id: string; cases: number }>(
            `/questions/${currentQuestionIdx}/${kind}s`,
            token,
            ip,
            {
                method: 'POST',
                bodyJson: {
                    language: selectedLanguage.toLowerCase(),
                    solution: editorContent,
                },
            }
        );

        if (out === null) {
            setTestResults(null);
            return null;
        }

        let resolve: (result: SubmissionHistory) => void;
        let reject: (reason: 'cancelled' | 'error') => void;
        const promise = new Promise<SubmissionHistory>((res, rej) => {
            resolve = res;
            reject = rej;
        });

        setTestResults({
            resultState: 'partial-results',
            kind,
            results: Array.from({ length: out.cases }, () => null),
            cases: out.cases,
            compileOutput: null,
        });

        const testId: string = out.id;
        const wsPrefix = `tests-${currentQuestionIdx}`;
        const removeWsListeners = () => {
            ws.removeEvent('tests-error', `${wsPrefix}-error`);
            ws.removeEvent('test-results', `${wsPrefix}-results`);
            ws.removeEvent('tests-complete', `${wsPrefix}-complete`);
            ws.removeEvent('tests-cancelled', `${wsPrefix}-cancelled`);
            ws.removeEvent('tests-compile-fail', `${wsPrefix}-compile-fail`);
            ws.removeEvent('tests-compiled', `${wsPrefix}-compiled`);
        };

        setCurrentState((old) => ({
            ...old,
            state: old.state === 'not-attempted' ? 'in-progress' : old.state,
        }));

        ws.registerEvent(
            'tests-error',
            ({ id }) => {
                if (id === testId) {
                    setTestResults(null);
                    toast({
                        title: 'An unexpected error occurred while running your tests',
                        description: 'Please contact a competition host.',
                        variant: 'destructive',
                    });
                    removeWsListeners();
                    reject('error');
                }
            },
            `${wsPrefix}-error`,
            false
        );

        ws.registerEvent(
            'tests-cancelled',
            ({ id }) => {
                if (id === testId) {
                    setTestResults(null);
                    removeWsListeners();
                    toast({
                        title: 'Your running tests have been cancelled',
                    });
                    reject('cancelled');
                }
            },
            `${wsPrefix}-cancelled`,
            false
        );

        ws.registerEvent(
            'tests-complete',
            (data) => {
                if (data.id === testId) {
                    setTestResults({
                        resultState: 'test-complete',
                        kind,
                        cases: out.cases,
                        ...data,
                    });

                    setCurrentState((old) => ({
                        ...old,
                        state:
                            kind === 'test'
                                ? old.state === 'not-attempted'
                                    ? 'in-progress'
                                    : old.state
                                : data.results.every((t) => t.state === 'pass')
                                  ? 'pass'
                                  : 'fail',
                    }));
                    resolve(data);
                    removeWsListeners();
                    setCurrentState((s) => ({ ...s, remainingAttempts: data.remainingAttempts }));
                }
            },
            `${wsPrefix}-complete`,
            false
        );

        ws.registerEvent(
            'tests-compile-fail',
            (data) => {
                if (data.id === testId) {
                    setTestResults({
                        resultState: 'compile-fail',
                        kind,
                        ...data,
                    });
                    setCurrentState((old) => ({
                        ...old,
                        state:
                            kind === 'test'
                                ? old.state === 'not-attempted'
                                    ? 'in-progress'
                                    : old.state
                                : 'fail',
                    }));
                    resolve(data);
                    removeWsListeners();
                }
            },
            `${wsPrefix}-compile-fail`,
            false
        );

        ws.registerEvent(
            'test-results',
            ({ id, results }) => {
                if (id === testId) {
                    setTestResults((old) => {
                        if (!old || old.resultState !== 'partial-results') {
                            console.error(
                                `Recieved 'test-results' for '${id}' while results were in state '${old?.resultState}'`
                            );
                            return old;
                        }

                        const newResults = old === null ? [] : [...old.results];
                        for (const result of results) {
                            newResults[result.index] = result;
                        }

                        return {
                            resultState: 'partial-results',
                            kind,
                            cases: old.cases,
                            results: newResults,
                            compileOutput: old.compileOutput,
                        };
                    });
                }
            },
            `${wsPrefix}-results`,
            false
        );

        ws.registerEvent(
            'tests-compiled',
            ({ id, stdout, stderr }) => {
                if (id === testId) {
                    setTestResults((old) => {
                        if (!old || old.resultState !== 'partial-results') {
                            console.error(
                                `Recieved 'tests-compiled' for '${id}' while results were in state '${old?.resultState}'`
                            );
                            return old;
                        }

                        return {
                            resultState: 'partial-results',
                            kind,
                            cases: old.cases,
                            results: old.results,
                            compileOutput: { stdout, stderr },
                        };
                    });
                }
            },
            `${wsPrefix}-compiled`,
            false
        );

        return {
            id: testId,
            activeTest: promise,
        };
    };

    return {
        testResults,
        runTests,
        pending,
        resetTestResults: () => setTestResults(null),
    };
};
