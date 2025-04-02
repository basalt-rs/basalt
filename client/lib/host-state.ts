import { atom, useAtom } from 'jotai';

const teamsAtom = atom([
    { name: 'Team1', password: 'password1', points: 300, status: true },
    { name: 'Team2', password: 'password2', points: 126, status: true },
    { name: 'Team3', password: 'password3', points: 0, status: false },
    { name: 'Team4', password: 'password4', points: 299, status: true },
    { name: 'Team5', password: 'password5', points: 0, status: true },
    { name: 'Team6', password: 'password6', points: 5, status: false },
    { name: 'Team7', password: 'password7', points: 125, status: true },
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
