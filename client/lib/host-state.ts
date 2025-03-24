import { atom, useAtom } from 'jotai';

const teams = atom([
    { name: 'Team1', password: 'password1', points: 300, status: true },
    { name: 'Team2', password: 'password2', points: 126, status: true },
    { name: 'Team3', password: 'password3', points: 0, status: false },
    { name: 'Team4', password: 'password4', points: 299, status: true },
    { name: 'Team5', password: 'password5', points: 0, status: true },
    { name: 'Team6', password: 'password6', points: 5, status: false },
    { name: 'Team7', password: 'password7', points: 125, status: true },
]);
export const useTeamsAtom = () => {
    const [teamList, setTeamList] = useAtom(teams);
    return { teamList, setTeamList };
};

const currentTeam = atom<null | {
    name: string;
    password: string;
    points: number;
    status: boolean;
}>(null);
export const useCurrentTeam = () => {
    const [selectedTeam, setSelectedTeam] = useAtom(currentTeam);
    return { selectedTeam, setSelectedTeam };
};

const currentHostTab = atom<'questions' | 'teams'>('questions');
export const useCurrentHostTab = () => {
    const [currentTab, setCurrentTab] = useAtom(currentHostTab);
    return { currentTab, setCurrentTab };
};
