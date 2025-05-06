import { atom, useAtom } from 'jotai';
import { CurrentTime } from './services/clock';
import { QuestionSubmissionState, SubmissionHistory, Team } from './types';
import { tokenAtom, tryFetch } from './services/auth';
import { useEffect } from 'react';
import { ipAtom } from './services/api';

export const teamsAtom = atom<Team[]>([
    { name: 'team1', password: 'password1', points: 300, status: true },
    { name: 'team2', password: 'password2', points: 126, status: true },
]);

export const selectedTeamIdxAtom = atom(-1);
export const selectedTeamAtom = atom((get) => {
    const idx = get(selectedTeamIdxAtom);
    const allTeams = get(teamsAtom);

    if (idx === -1) {
        return null;
    } else {
        return allTeams[idx];
    }
});

export const currentHostTabAtom = atom<'questions' | 'teams'>('questions');

export const clockAtom = atom<CurrentTime | undefined>();
export const selectedQuestionAtom = atom<number | null>(null);

export const getHistory = async (
    ip: string,
    team: Team | null,
    question: number | null,
    token: string | null
) => {
    if (team === null || question === null || token === null) {
        return null;
    }

    const submissionHistory = await tryFetch<SubmissionHistory[]>(
        `${ip}/testing/submissions?username=${encodeURI(team.name)}&question_index=${question}`,
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
        `${ip}/testing/state?username=${encodeURI(team.name)}`,
        token
    );

    return submissions ?? [];
});
