export type RawTeamInfo = {
    team: string;
    score: number;
    checkedIn: boolean;
    lastSeen?: string | null;
    disconnected: boolean;
};

export type TeamInfo = {
    team: string;
    score: number;
    checkedIn: boolean;
    lastSeenMs?: number | null;
    disconnected: boolean;
};

const parseDate = (r: RawTeamInfo): TeamInfo => ({
    ...r,
    lastSeenMs: r.lastSeen ? Date.parse(r.lastSeen) : null,
});

export const getTeams = async (ip: string) => {
    const res = await fetch(`${ip}/teams`);
    if (res.ok) {
        const result = (await res.json()) as TeamInfo[];
        return result.map(parseDate);
    } else throw new Error('');
};
