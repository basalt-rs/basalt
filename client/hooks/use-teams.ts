import { ipAtom } from '@/lib/services/api';
import { tokenAtom, tryFetch, User } from '@/lib/services/auth';
import { convertTeam, getTeams, RawTeamInfo, TeamInfo } from '@/lib/services/teams';
import { useWebSocket } from '@/lib/services/ws';
import { useQuery } from '@tanstack/react-query';
import { atom, useAtom, useAtomValue } from 'jotai';

export interface CreateTeam {
    username: string;
    displayName: string;
    password: string;
}

export const teamsAtom = atom<Record<string, TeamInfo>>({});
export const teamsListAtom = atom((get) => Object.values(get(teamsAtom)));
export const selectedTeamAtom = atom<TeamInfo | null>(null);
export const useTeams = () => {
    const ip = useAtomValue(ipAtom);
    const token = useAtomValue(tokenAtom);
    const { ws: basaltWs } = useWebSocket();
    const [teams, setTeams] = useAtom(teamsAtom);
    const teamsList = useAtomValue(teamsListAtom);
    const [selectedTeam, setSelectedTeam] = useAtom(selectedTeamAtom);

    const updateTeams = (teams: TeamInfo[]) => {
        setSelectedTeam((prev) => teams.find((t) => t.id === prev?.id) ?? null);
        setTeams(teams.reduce((acc, t) => ({ ...acc, [t.id]: t }), {}));
    };
    const updateTeam = (rawTeam: RawTeamInfo) => {
        const parsedTeam = convertTeam(rawTeam);
        setSelectedTeam((prev) => (prev ? (prev.id === parsedTeam.id ? parsedTeam : prev) : prev));

        setTeams((prev) => ({
            ...prev,
            [parsedTeam.id]: parsedTeam,
        }));
    };

    const setSelectedTeamById = (name: string) => {
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

    const createTeam = async (newTeam: CreateTeam | CreateTeam[]) => {
        if (ip === null || token === null) {
            throw new Error('No IP Set');
        }

        const team = await tryFetch<User>(
            `/teams`,
            token,
            ip,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(newTeam),
            },
            [409]
        );
        return team;
    };

    const renameTeam = async (
        id: string,
        patch: { username: string | null; displayName: null | 'reset' | { set: string } }
    ) => {
        if (ip === null || token === null) {
            throw new Error('No IP Set');
        }

        const team = await tryFetch<User>(
            `/teams/${id}`,
            token,
            ip,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(patch),
            },
            [409]
        );
        return team;
    };

    const changeTeamPassword = async (id: string, password: string) => {
        if (ip === null || token === null) {
            throw new Error('No IP Set');
        }

        const team = await tryFetch<User>(
            `/teams/${id}`,
            token,
            ip,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ password }),
            },
            [409]
        );
        return team;
    };

    basaltWs.registerEvent('team-connected', updateTeam, 'use-team-connection-handler');
    basaltWs.registerEvent('team-disconnected', updateTeam, 'use-team-disconnection-handler');
    basaltWs.registerEvent(
        'team-update',
        (users) => {
            setTeams(({ ...next }) => {
                for (const team of users.teams) {
                    if (!next[team.id]) {
                        next[team.id] = {
                            id: team.id,
                            name: team.name,
                            displayName: team.displayName,
                            score: team.newScore,
                            checkedIn: false,
                            lastSeenMs: null,
                            disconnected: true,
                        };
                    }
                }
                return next;
            });
        },
        'use-team-update-handler'
    );
    basaltWs.registerEvent(
        'team-rename',
        (rename) => {
            setTeams(({ ...next }) => {
                if (next[rename.id]) {
                    next[rename.id] = {
                        ...next[rename.id],
                        name: rename.name,
                        displayName: rename.display_name,
                    };
                }
                return next;
            });
        },
        'use-team-rename-handler'
    );

    return {
        teams,
        teamsList,
        isLoading,
        isError,
        setSelectedTeam,
        selectedTeam,
        setSelectedTeamById,
        renameTeam,
        changeTeamPassword,
        createTeam,
    };
};
