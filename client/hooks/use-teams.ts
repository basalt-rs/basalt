import { ipAtom } from '@/lib/services/api';
import { convertTeam, getTeams, RawTeamInfo, TeamInfo } from '@/lib/services/teams';
import { useWebSocket } from '@/lib/services/ws';
import { useQuery } from '@tanstack/react-query';
import { atom, useAtom, useAtomValue } from 'jotai';

export const teamsAtom = atom<Record<string, TeamInfo>>({});
export const teamsListAtom = atom((get) => Object.values(get(teamsAtom)));
export const selectedTeamAtom = atom<TeamInfo | null>(null);
export const useTeams = () => {
    const ip = useAtomValue(ipAtom);
    const { ws: basaltWs } = useWebSocket();
    const [teams, setTeams] = useAtom(teamsAtom);
    const teamsList = useAtomValue(teamsListAtom);
    const [selectedTeam, setSelectedTeam] = useAtom(selectedTeamAtom);

    const updateTeams = (teams: TeamInfo[]) => {
        setSelectedTeam((prev) => teams.find((t) => t.team === prev?.team) ?? null);
        setTeams(teams.reduce((acc, t) => ({ ...acc, [t.team]: t }), {}));
    };
    const updateTeam = (rawTeam: RawTeamInfo) => {
        const parsedTeam = convertTeam(rawTeam);
        setSelectedTeam((prev) =>
            prev ? (prev.team === parsedTeam.team ? parsedTeam : prev) : prev
        );
        setTeams((prev) => ({
            ...prev,
            [parsedTeam.team]: parsedTeam,
        }));
    };

    const setSelectedTeamByName = (name: string) => {
        const team = teams[name];
        setSelectedTeam((prev) => team ?? prev);
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

    return {
        teams,
        teamsList,
        isLoading,
        isError,
        setSelectedTeam,
        selectedTeam,
        setSelectedTeamByName,
    };
};
