import { PropsWithChildren } from 'react';

export interface PauseGuardProps {
    isPaused: boolean;
}

export const WithPauseGuard = ({ isPaused, children }: PropsWithChildren<PauseGuardProps>) => {
    if (isPaused)
        return (
            <div>
                <h1>Paused</h1>
            </div>
        );
    else return children;
};
