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

    const pauseTicker = () => {
        setTicker((prev) => {
            if (prev) clearInterval(prev);
            return null;
        });
    };

    const decrementTimer = () => {
        console.log('DECREMENTING');
        setClock((prev) =>
            prev === undefined
                ? undefined
                : { ...prev, timeLeftInSeconds: prev?.timeLeftInSeconds - 11 }
        );
    };

    useQuery({
        queryKey: ['clock', clock?.isPaused ?? true],
        queryFn: async () => {
            const res = await getClock();
            if (res === null) {
                setClock({ isPaused: true, timeLeftInSeconds: 0 });
                pauseTicker();
                return;
            }

            setClock(res);

            if (!ticker)
                setTicker((prev) => {
                    console.log('setting ticker');
                    if (prev) clearInterval(prev);
                    return setInterval(() => decrementTimer(), 1000);
                });
        },
        refetchInterval: 15 * 1000,
    });

    basaltWs.registerEvent('game-paused', () => {
        console.log('game paused fr');
        setClock((prev) =>
            prev ? { ...prev, isPaused: true } : { timeLeftInSeconds: 0, isPaused: true }
        );
    });

    basaltWs.registerEvent('game-unpaused', (data) => {
        console.log('game unpaused fr');
        setClock({ isPaused: false, ...data });
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
