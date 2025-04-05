import { API } from './auth';

export interface CurrentTime {
    isPaused: boolean;
    timeLeftSeconds: number;
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
        },
        body: body as unknown as BodyInit,
    });
    if (res.ok) {
        return (await res.json()) as CurrentTime;
    } else return null;
};
