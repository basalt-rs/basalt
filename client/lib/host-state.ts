import { atom, useAtom } from 'jotai';
import { CurrentTime } from './services/clock';
import { QuestionSubmissionState, SubmissionHistory } from './types';
import { tokenAtom, tryFetch } from './services/auth';
import { useEffect } from 'react';
import { ipAtom } from './services/api';
import { selectedTeamAtom } from '@/hooks/use-teams';
import { TeamInfo } from './services/teams';

export const currentHostTabAtom = atom<'questions' | 'teams' | 'gen' | 'leaderboard'>('questions');
export const clockAtom = atom<CurrentTime | undefined>();
export const selectedQuestionAtom = atom<number | null>(null);

export const getHistory = async (
    ip: string,
    team: TeamInfo | null,
    question: number | null,
    token: string | null
) => {
    if (team === null || question === null || token === null) {
        return null;
    }

    const submissionHistory = await tryFetch<SubmissionHistory[]>(
        `${ip}/testing/submissions?user_id=${encodeURI(team.id)}&question_index=${question}`,
        token
    );

    if (!submissionHistory) return null;
    return submissionHistory;
};

const historyAtom = atom<SubmissionHistory[] | null>([]);
export const useSubmissionHistory = () => {
    const [question] = useAtom(selectedQuestionAtom);
    const [team] = useAtom(selectedTeamAtom);
    const [token] = useAtom(tokenAtom);
    const [ip] = useAtom(ipAtom);
    const [history, setHistory] = useAtom(historyAtom);

    useEffect(() => {
        if (ip) {
            getHistory(ip, team, question, token).then((x) => {
                setHistory(x);
            });
        }
    }, [ip, team, question, token, setHistory]);

    return [history, setHistory] as const;
};

export const selectedTeamSubmissionsAtom = atom(async (get) => {
    const team = get(selectedTeamAtom);
    const token = get(tokenAtom);
    const ip = get(ipAtom);

    if (team === null || token === null) return [];

    const submissions = await tryFetch<QuestionSubmissionState[]>(
        `${ip}/testing/state?user_id=${encodeURI(team.id)}`,
        token
    );

    return submissions ?? [];
});
