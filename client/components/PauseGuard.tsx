import { PauseCircle } from 'lucide-react';
import { PropsWithChildren } from 'react';
import Timer from './Timer';

export interface PauseGuardProps {
    isPaused?: boolean;
    withHeader?: boolean;
    paragraph?: string | null;
}

export const WithPauseGuard = ({ isPaused, children }: PropsWithChildren<PauseGuardProps>) => {
    if (isPaused)
        return (
            <div className="relative min-h-full min-w-full cursor-not-allowed">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="h-full w-full blur-lg">{children}</div>
                </div>
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center">
                    <PauseCircle className="h-36 w-36" />
                    <p className="mt-1 text-2xl opacity-50">Paused by Host</p>
                    <Timer isPaused={isPaused} />
                </div>
            </div>
        );
    else return children;
};
