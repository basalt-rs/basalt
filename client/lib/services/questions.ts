import { atom, useAtom } from 'jotai';
import { API, currentUserAtom, tokenAtom } from './auth'; // TODO: This will be moved after #13 is complete
import { QuestionResponse, QuestionSubmissionState } from '../types';
import { toast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useWebSocket } from './ws';

export const currQuestionIdxAtom = atom(0);
export const allQuestionsAtom = atom(async () => {
    const res = await fetch(`${API}/questions`);
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

// export const allStatesAtom = atom<>(async (get) => {
//     const token = get(tokenAtom);
//     const ip = API;
// 
//     if (!ip || !token) return null;
// 
//     const res = await fetch(`${ip}/testing/state`, {
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     return res.json();
// });
const statesAtom = atom<QuestionSubmissionState[] | null>(null);
export const useSubmissionStates = () => {
    const [states, setStates] = useAtom(statesAtom);
    const [token] = useAtom(tokenAtom);
    const ws = useWebSocket();
    const [currentUser] = useAtom(currentUserAtom);
    const ip = API;

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

    }, [ip, token, currentUser, ws, setStates]);

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


    return [states, setStates] as const;
};
