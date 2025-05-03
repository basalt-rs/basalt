import { ipAtom } from '@/lib/services/api';
import { convertTeam, getTeams, RawTeamInfo, TeamInfo } from '@/lib/services/teams';
import { useWebSocket } from '@/lib/services/ws';
import { useQuery } from '@tanstack/react-query';
import { atom, useAtom, useAtomValue } from 'jotai';

const teamsAtom = atom<Record<string, TeamInfo>>({});
const teamsListAtom = atom((get) => Object.values(get(teamsAtom)));
const selectedTeamAtom = atom<TeamInfo | null>(null);
export const useTeams = () => {
    const ip = useAtomValue(ipAtom);
    const { ws } = useWebSocket();
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
        setTeams((prev) => {
            prev[parsedTeam.team] = parsedTeam;
            // has to be new object so jotai actually knows it changed... (L)
            return { ...prev };
        });
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

    ws.registerEvent('team-connected', updateTeam, 'use-team-connection-handler');
    ws.registerEvent('team-disconnected', updateTeam, 'use-team-disconnection-handler');

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
