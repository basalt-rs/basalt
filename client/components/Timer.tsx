'use client';
import { Button } from './ui/button';
import { Loader2, Pause, Play } from 'lucide-react';
import { useAtom } from 'jotai';
import { clockAtom } from '@/lib/host-state';
import classNames from 'classnames';

interface TimerProps {
    isHost?: boolean;
    isPaused: boolean;
    onPause?: () => Promise<void>;
    onPlay?: () => Promise<void>;
}

export default function Timer({ isHost = false, onPause, onPlay, isPaused }: TimerProps) {
    const [clock] = useAtom(clockAtom);

    const handlePause = async () => {
        if (onPause) await onPause();
    };

    const handlePlay = async () => {
        if (onPlay) await onPlay();
    };

    const formatTime = (secondsRemaining: number) => {
        if (secondsRemaining <= 0) {
            return 'Complete';
        }
        const hours = Math.floor(secondsRemaining / 3600);
        const minutes = Math.floor((secondsRemaining % 3600) / 60);
        const seconds = secondsRemaining % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex w-full flex-col items-center gap-1">
            <span className="flex items-center gap-2">
                {!clock && (
                    <div>
                        <Loader2 size={48} className="animate-spin" />
                    </div>
                )}
                {clock && isHost && (
                    <div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => (isPaused ? handlePlay() : handlePause())}
                        >
                            {isPaused ? (
                                <Play strokeWidth={0} fill="currentColor" />
                            ) : (
                                <Pause strokeWidth={0} fill="currentColor" />
                            )}
                        </Button>
                    </div>
                )}
                {clock && (
                    <p
                        className={classNames('my-2 text-6xl font-thin', {
                            'text-fail': clock?.timeLeftInSeconds <= 300 && !clock?.isPaused,
                        })}
                    >
                        {formatTime(clock?.timeLeftInSeconds ?? 0)}
                    </p>
                )}
            </span>
        </div>
    );
}
