import { clockAtom } from '@/lib/host-state';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { getClock, updateClock } from '@/lib/services/clock';
import { useState } from 'react';
import { tokenAtom } from '@/lib/services/auth';

export const useClock = () => {
    const [clock, setClock] = useAtom(clockAtom);
    const [ticker, setTicker] = useState<NodeJS.Timeout | null>(null);
    const [authToken] = useAtom(tokenAtom);

    const pauseTicker = () => {
        setTicker((prev) => {
            if (prev) clearInterval(prev);
            return null;
        });
    };

    useQuery({
        queryKey: ['clock'],
        queryFn: async () => {
            const res = await getClock();
            if (res === null) {
                setClock({ isPaused: true, timeLeftSeconds: 0 });
                pauseTicker();
                return;
            }

            if (!ticker)
                setTicker((prev) => {
                    if (prev) clearInterval(prev);
                    return setInterval(() => {
                        setClock((clockPrev) =>
                            clockPrev === undefined
                                ? res
                                : { ...clockPrev, timeLeftSeconds: clockPrev.timeLeftSeconds - 1 }
                        );
                    }, 1000);
                });
        },
        refetchInterval: 15,
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
