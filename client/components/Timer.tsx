'use client';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Pause, Play, Wrench } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TimerProps {
    isHost?: boolean;
    startingTime: number;
    isActive: boolean;
}

export default function Timer({ isHost = false, startingTime, isActive = false }: TimerProps) {
    const [time, setTime] = useState(startingTime);
    const [timerIsActive, setTimerIsActive] = useState(isActive);

    const formatTime = (secondsRemaining: number) => {
        const hours = Math.floor(secondsRemaining / 3600);
        const minutes = Math.floor((secondsRemaining % 3600) / 60);
        const seconds = secondsRemaining % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (timerIsActive) {
            const id = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 0) {
                        clearInterval(id);
                        setTimerIsActive(false);
                        return 0;
                    } else {
                        return prev - 1;
                    }
                });
            }, 1000);
            return () => clearInterval(id);
        } else {
            return () => null;
        }
    }, [timerIsActive]);

    return (
        <div className="flex w-full flex-col items-center gap-1">
            <span className="flex items-center gap-2">
                {isHost && (
                    <div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTimerIsActive(!timerIsActive)}
                        >
                            {timerIsActive ? (
                                <Pause strokeWidth={0} fill="currentColor" />
                            ) : (
                                <Play strokeWidth={0} fill="currentColor" />
                            )}
                        </Button>
                    </div>
                )}
                <p
                    className={`my-2 text-[8vmin] font-thin ${timerIsActive ? `` : `text-muted-foreground`}`}
                >
                    {formatTime(time)}
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
