export type TeamInfo = {
    team: string;
    info: {
        checkedIn: boolean;
        lastSeen?: Date | null;
        disconnected: boolean;
    };
};

export const getTeams = async (ip: string) => {
    const res = await fetch(`${ip}/teams`);
    if (res.ok) {
        return (await res.json()) as TeamInfo[];
    } else throw new Error('');
};
