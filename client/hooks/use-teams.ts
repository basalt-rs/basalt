import { ipAtom } from '@/lib/services/api';
import { getTeams, TeamInfo } from '@/lib/services/teams';
import { useWebSocket } from '@/lib/services/ws';
import { useQuery } from '@tanstack/react-query';
import { atom, useAtom, useAtomValue } from 'jotai';

const teamsAtom = atom<Record<TeamInfo['team'], TeamInfo['info']>>({});
const teamsListAtom = atom<TeamInfo[]>([]);
export const useTeams = () => {
    const ip = useAtomValue(ipAtom);
    const basaltWs = useWebSocket();
    const [teams, setTeams] = useAtom(teamsAtom);
    const [teamsList, setTeamsList] = useAtom(teamsListAtom);

    const updateTeams = (teams: TeamInfo[]) => {
        setTeams(teams.reduce((acc, t) => ({ ...acc, [t.team]: t.info }), {}));
        setTeamsList(teams);
    };
    const updateTeam = (team: TeamInfo) => {
        setTeams((prev) => ({ ...prev, [team.team]: team.info }));
        setTeamsList(Object.entries(teams).map(([t, info]) => ({ team: t, info })));
    };

    const { isLoading, isError } = useQuery({
        queryKey: ['teams-list'],
        queryFn: async () => {
            if (ip === null) {
                throw new Error('No IP Set');
            }
            try {
                const result = await getTeams(ip);
                updateTeams(result);
                return result;
            } catch (e: unknown) {
                console.error(e);
                throw new Error('Failed to fetch teams');
            }
        },
        refetchInterval: 15 * 1000,
    });

    basaltWs.registerEvent('team-connected', updateTeam, 'use-team-connection-handler');
    basaltWs.registerEvent('team-disconnected', updateTeam, 'use-team-disconnection-handler');

    return { teams, teamsList, isLoading, isError };
};
