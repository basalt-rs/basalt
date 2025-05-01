import { Pause } from 'lucide-react';
import { PropsWithChildren } from 'react';
import Timer from './Timer';
import { currentTabAtom } from '@/lib/competitor-state';
import { useAtom } from 'jotai';
import Leaderboard from './Leaderboard';

export interface PauseGuardProps {
    isPaused?: boolean;
}

export const WithPauseGuard = ({ isPaused, children }: PropsWithChildren<PauseGuardProps>) => {
    const [tab] = useAtom(currentTabAtom);
    if (isPaused && tab !== 'leaderboard') {
        return (
            <div className="relative min-h-[95vh] min-w-full cursor-not-allowed">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="h-full w-full blur-lg">{children}</div>
                </div>
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background p-8 text-center opacity-50">
                    <Pause fill="currentColor" stroke="none" className="h-48 w-48" />
                    <p className="mt-1 text-3xl font-bold">Competition Paused</p>
                    <Timer isPaused={isPaused} />
                </div>
            </div>
        );
    } else if (isPaused && tab === 'leaderboard') {
        return <Leaderboard />;
    } else return children;
};
