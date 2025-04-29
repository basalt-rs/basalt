import { atom, useAtom } from 'jotai';
import { currentUserAtom, tokenAtom } from './auth';
import { QuestionResponse, QuestionSubmissionState } from '../types';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useWebSocket } from './ws';
import { ipAtom } from './api';

export const currQuestionIdxAtom = atom(0);
export const allQuestionsAtom = atom(async (get) => {
    const ip = get(ipAtom);
    if (ip === null) return [];
    const res = await fetch(`${ip}/questions`);
    if (!res.ok) {
        toast({
            title: 'Error',
            description: 'There was an error while loading questions.',
        });
        return [];
    }
    return (await res.json()) as QuestionResponse[];
});
export const currQuestionAtom = atom(async (get) => {
    const idx = get(currQuestionIdxAtom);
    const allQuestions = await get(allQuestionsAtom);

    return allQuestions[idx];
});

const statesAtom = atom<QuestionSubmissionState[] | null>(null);
const currentStateAtom = atom(
    (get) => {
        const states = get(statesAtom);
        const idx = get(currQuestionIdxAtom);
        return states && states[idx];
    },
    (
        get,
        set,
        newState:
            | QuestionSubmissionState
            | ((state: QuestionSubmissionState) => QuestionSubmissionState)
    ) => {
        const idx = get(currQuestionIdxAtom);
        set(statesAtom, (states) => {
            if (!states) return states;
            return (
                states &&
                states.map((s, i) =>
                    i === idx ? (typeof newState === 'function' ? newState(s) : newState) : s
                )
            );
        });
    }
);
export const useSubmissionStates = () => {
    const [states, setStates] = useAtom(statesAtom);
    const [token] = useAtom(tokenAtom);
    const [ws] = useWebSocket();
    const [currentUser] = useAtom(currentUserAtom);
    const [ip] = useAtom(ipAtom);
    const [currentState, setCurrentState] = useAtom(currentStateAtom);

    useEffect(() => {
        (async () => {
            if (!ip || !token) return;

            const res = await fetch(`${ip}/testing/state`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStates(await res.json());
        })();
    }, [ip, token, setStates]);

    ws.registerEvent('team-update', (x) => {
        if (currentUser?.username === x.team) {
            setStates((states) => {
                if (!states) return states;

                const newStates: typeof states = [];
                x.new_states.forEach((state, i) => {
                    newStates[i] = { ...states[i], state };
                });
                return newStates;
            });
        }
    });

    return { allStates: states, setCurrentState, currentState };
};
