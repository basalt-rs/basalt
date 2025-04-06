'use client';
import { Button } from './ui/button';
import { Pause, Play, Wrench } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';
import { clockAtom } from '@/lib/host-state';

interface TimerProps {
    isHost?: boolean;
    isPaused: boolean;
    onPause?: () => Promise<void>;
    onPlay?: () => Promise<void>;
}

export default function Timer({ isHost = false, onPause, onPlay, isPaused }: TimerProps) {
    const [clock] = useAtom(clockAtom);
    console.log(isPaused);

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
                {isHost && (
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
                <p
                    className={`my-2 text-[8vmin] font-thin ${!isPaused ? `` : `text-muted-foreground`}`}
                >
                    {formatTime(clock?.timeLeftInSeconds ?? 0)}
                </p>
                {isHost && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            toast({
                                title: 'Coming Soon',
                                description: 'This feature is coming soon!',
                                variant: 'destructive',
                            });
                        }}
                    >
                        <Wrench strokeWidth={0} fill="currentColor" />
                    </Button>
                )}
            </span>
        </div>
    );
}
