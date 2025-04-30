import { atom, useAtom } from 'jotai';
import { CurrentTime } from './services/clock';
import { QuestionSubmissionState, SubmissionHistory, Team } from './types';
import { tokenAtom, tryFetch } from './services/auth';
import { useEffect } from 'react';
import { ipAtom } from './services/api';
import { TeamInfo } from './services/teams';
import { selectedTeamAtom, useTeams } from '@/hooks/use-teams';

export const currentHostTabAtom = atom<'questions' | 'teams'>('questions');

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
        `${ip}/testing/submissions?username=${encodeURI(team.team)}&question_index=${question}`,
        token
    );

    if (!submissionHistory) return null;
    return submissionHistory;
};

const historyAtom = atom<SubmissionHistory[] | null>([]);
export const useSubmissionHistory = () => {
    const [question] = useAtom(selectedQuestionAtom);
    const { selectedTeam } = useTeams();
    const [token] = useAtom(tokenAtom);
    const [ip] = useAtom(ipAtom);
    const [history, setHistory] = useAtom(historyAtom);

    useEffect(() => {
        if (ip) {
            getHistory(ip, selectedTeam, question, token).then((x) => {
                setHistory(x);
            });
        }
    }, [ip, selectedTeam, question, token, setHistory]);

    return [history, setHistory] as const;
};

export const selectedTeamSubmissionsAtom = atom(async (get) => {
    const team = get(selectedTeamAtom);
    const token = get(tokenAtom);
    const ip = get(ipAtom);

    console.log('hehehe', { team, token });
    if (team === null || token === null) return [];

    const submissions = await tryFetch<QuestionSubmissionState[]>(
        `${ip}/testing/state?username=${encodeURI(team.team)}`,
        token
    );
    console.log({ submissions });

    return submissions ?? [];
});
