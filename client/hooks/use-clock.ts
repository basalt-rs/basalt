import { clockAtom } from '@/lib/host-state';
import { atom, useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { getClock, updateClock } from '@/lib/services/clock';
import { tokenAtom } from '@/lib/services/auth';
import { basaltWSClientAtom } from '@/lib/services/ws';

const tickerAtom = atom<NodeJS.Timeout | null>(null);

export const useClock = () => {
    const [basaltWs] = useAtom(basaltWSClientAtom);
    const [clock, setClock] = useAtom(clockAtom);
    const [ticker, setTicker] = useAtom(tickerAtom);
    const [authToken] = useAtom(tokenAtom);

    const startTicking = () => {
        setTicker((prev) => {
            if (prev) clearInterval(prev);
            return setInterval(decrementTimer, 1000);
        });
    };

    const stopTicking = () => {
        setTicker((prev) => {
            if (prev) clearInterval(prev);
            return null;
        });
    };

    const decrementTimer = () => {
        setClock((prev) =>
            prev === undefined
                ? undefined
                : prev.isPaused
                  ? prev
                  : { ...prev, timeLeftInSeconds: prev?.timeLeftInSeconds - 1 }
        );
    };

    useQuery({
        queryKey: ['clock', clock?.isPaused ?? true],
        queryFn: async () => {
            const res = await getClock();
            if (res === null) {
                setClock({ isPaused: true, timeLeftInSeconds: 0 });
                return 1;
            }

            setClock(res);
            if (!ticker && !res.isPaused) startTicking();

            return 0;
        },
        refetchInterval: 15 * 1000,
    });

    basaltWs.registerEvent('game-paused', () => {
        stopTicking();
        setClock((prev) =>
            prev ? { ...prev, isPaused: true } : { timeLeftInSeconds: 0, isPaused: true }
        );
    });

    basaltWs.registerEvent('game-unpaused', (data) => {
        setClock({ isPaused: false, ...data });
        startTicking();
    });

    const pause = async () => {
        if (!authToken) return;
        await updateClock(
            {
                isPaused: true,
            },
            authToken
        );
    };

    const unPause = async () => {
        if (!authToken) return;
        await updateClock(
            {
                isPaused: false,
            },
            authToken
        );
    };

    return {
        clock,
        isPaused: clock?.isPaused ?? true,
        pause,
        unPause,
    };
};
