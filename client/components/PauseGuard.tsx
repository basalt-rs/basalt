import { PropsWithChildren } from 'react';

export interface PauseGuardProps {
    isPaused?: boolean;
    withHeader?: boolean;
    paragraph?: string | null;
}

export const WithPauseGuard = ({
    isPaused,
    withHeader,
    paragraph,
    children,
}: PropsWithChildren<PauseGuardProps>) => {
    if (isPaused)
        return (
            <div className="min-h-full min-w-full">
                {withHeader && <h1 className="text-4xl">Game Paused</h1>}
                {paragraph ? (
                    <p>{paragraph}</p>
                ) : (
                    <p>Please wait patiently for an administrator to unpause the game</p>
                )}
            </div>
        );
    else return children;
};
