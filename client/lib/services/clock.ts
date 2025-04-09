import { API } from './auth';

export interface CurrentTime {
    isPaused: boolean;
    timeLeftInSeconds: number;
}

export interface ClockUpdateBody {
    isPaused: boolean;
}

export const getClock = async (): Promise<CurrentTime | null> => {
    const res = await fetch(`${API}/clock`);
    if (res.ok) {
        return (await res.json()) as CurrentTime;
    } else return null;
};

export const updateClock = async (
    body: ClockUpdateBody,
    authToken: string
): Promise<CurrentTime | null> => {
    const res = await fetch(`${API}/clock`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (res.ok) {
        return (await res.json()) as CurrentTime;
    } else return null;
};
