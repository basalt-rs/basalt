export interface CurrentTime {
    isPaused: boolean;
    isOver: boolean;
    timeLeftInSeconds: number;
}

export interface ClockUpdateBody {
    isPaused: boolean;
}

export const getClock = async (
    ip: string,
    authToken: string | null = null
): Promise<CurrentTime | null> => {
    const res = await fetch(`${ip}/clock`, {
        headers: authToken
            ? {
                  Authorization: `Bearer ${authToken}`,
              }
            : {},
    });
    if (res.ok) {
        return (await res.json()) as CurrentTime;
    } else return null;
};

export const updateClock = async (
    body: ClockUpdateBody,
    authToken: string,
    ip: string
): Promise<CurrentTime | null> => {
    const res = await fetch(`${ip}/clock`, {
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
