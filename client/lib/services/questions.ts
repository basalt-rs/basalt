import { atom } from "jotai";
import { API } from "./auth"; // TODO: This will be moved after #13 is complete
import { QuestionResponse, TestState } from "../types";
import { toast } from "@/hooks/use-toast";

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
export const allStatesAtom = atom(async (get) => {
    const questions = await get(allQuestionsAtom);
    const hard = ['pass', 'in-progress', 'fail'] as const;
    return questions.map((_, i) => i < hard.length ? hard[i] : 'not-attempted' as TestState);
});
export const currQuestionAtom = atom(async (get) => {
    const idx = get(currQuestionIdxAtom);
    const allQuestions = await get(allQuestionsAtom);

    return allQuestions[idx];
});
