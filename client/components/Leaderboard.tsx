import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import Timer from '@/components/Timer';
import { useClock } from '@/hooks/use-clock';
import { Status } from './Status';
import { useLeaderboard } from '@/lib/services/leaderboard';
import { useWebSocket } from '@/lib/services/ws';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { tokenAtom } from '@/lib/services/auth';
import { ipAtom } from '@/lib/services/api';
import { ScrollArea } from './ui/scroll-area';

const trophyColor = (rank: number) => ['text-yellow-500', 'text-gray-500', 'text-amber-600'][rank];

const TeamRank = () => {
    const leaderboard = useLeaderboard();

    return (
        <div className="flex flex-col items-center gap-4">
            {leaderboard.map((player, index) => (
                <Card
                    key={player.user.id}
                    className="flex w-1/2 min-w-[600px] flex-row p-6 text-xl shadow-md"
                >
                    <div className="flex w-1/3 flex-row items-center gap-2">
                        <b>{player.user.displayName || player.user.username}</b>
                        {index < 3 && (
                            <span className={trophyColor(index)}>
                                <Trophy fill="currentColor" size="1em" />
                            </span>
                        )}
                    </div>

                    <div className="flex w-1/3 items-center justify-center gap-2">
                        {player.submissionStates.map((testResult, index) => (
                            <Status key={index} status={testResult} />
                        ))}
                    </div>

                    <span className="w-1/3 text-end align-middle">{player.score} pts</span>
                </Card>
            ))}
        </div>
    );
};

export default function Leaderboard({ showTimer = true }) {
    const { clock, isPaused } = useClock();
    const [ip] = useAtom(ipAtom);
    const [token] = useAtom(tokenAtom);
    const { establishWs } = useWebSocket();
    useEffect(() => {
        if (ip) establishWs(ip, token);
    }, [establishWs, ip, token]);
    return (
        <>
            {showTimer && clock && (
                <div className="flex w-full justify-center pt-8">
                    <Timer isHost={false} isPaused={isPaused} />
                </div>
            )}
            <ScrollArea className="flex-grow overflow-y-auto pb-4">
                <TeamRank />
            </ScrollArea>
        </>
    );
}
