import { atom } from 'jotai';
import { QuestionResponse, TestState } from '../types';
import { toast } from '@/hooks/use-toast';
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
export const allStatesAtom = atom(async (get) => {
    const questions = await get(allQuestionsAtom);
    const hard = ['pass', 'in-progress', 'fail'] as const;
    return questions.map((_, i) => (i < hard.length ? hard[i] : ('not-attempted' as TestState)));
});
export const currQuestionAtom = atom(async (get) => {
    const idx = get(currQuestionIdxAtom);
    const allQuestions = await get(allQuestionsAtom);

    return allQuestions[idx];
});
