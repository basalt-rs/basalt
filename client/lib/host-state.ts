import { atom, useAtom } from 'jotai';
import { CurrentTime } from './services/clock';
import { QuestionSubmissionState, SubmissionHistory, Team } from './types';
import { API, tokenAtom, tryFetch } from './services/auth';

const teamsAtom = atom<Team[]>([
    { name: 'team1', password: 'password1', points: 300, status: true },
    { name: 'team2', password: 'password2', points: 126, status: true },
]);
export const useTeams = () => {
    const [teamList, setTeamList] = useAtom(teamsAtom);
    return { teamList, setTeamList };
};

const selectedTeamIdxAtom = atom(-1);
const selectedTeamAtom = atom((get) => {
    const idx = get(selectedTeamIdxAtom);
    const allTeams = get(teamsAtom);

    if (idx === -1) {
        return null;
    } else {
        return allTeams[idx];
    }
});
export const useSelectedTeam = () => {
    const [selectedTeam] = useAtom(selectedTeamAtom);
    return { selectedTeam };
};

export const useSelectedTeamIdx = () => {
    const [selectedTeamIdx, setSelectedTeamIdx] = useAtom(selectedTeamIdxAtom);
    return { selectedTeamIdx, setSelectedTeamIdx };
};

const currentHostTabAtom = atom<'questions' | 'teams'>('questions');
export const useCurrentHostTab = () => {
    const [currentTab, setCurrentTab] = useAtom(currentHostTabAtom);
    return { currentTab, setCurrentTab };
};

export const clockAtom = atom<CurrentTime | undefined>();
export const selectedQuestionAtom = atom<number | null>(null);

export const questionSubmissionHistoryAtom = atom(async (get) => {
    const question = get(selectedQuestionAtom);
    const team = get(selectedTeamAtom);
    const token = get(tokenAtom);
    const ip = API;

    if (team === null || question === null || token === null) return null;

    const submissionHistory = await tryFetch<SubmissionHistory[]>(
        `${ip}/testing/submissions?username=${encodeURI(team.name)}&question_index=${question}`,
        token,
    );

    if (!submissionHistory) return null;

    console.log(submissionHistory);

    return submissionHistory;
});

export const selectedTeamSubmissionsAtom = atom(async (get) => {
    const team = get(selectedTeamAtom);
    const token = get(tokenAtom);
    const ip = API;

    if (team === null || token === null) return [];

    const submissions = await tryFetch<QuestionSubmissionState[]>(
        `${ip}/testing/state?username=${encodeURI(team.name)}`,
        token,
    );

    return submissions ?? [];
});
