import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import Timer from '@/components/Timer';
import { useClock } from '@/hooks/use-clock';
import { Status } from './Status';
import { useLeaderboard } from '@/lib/services/leaderboard';

const trophyColor = (rank: number) => ['text-yellow-500', 'text-gray-500', 'text-amber-600'][rank];

const TeamRank = () => {
    const leadboardData = useLeaderboard();

    console.log(leadboardData);

    return (
        <div className="flex flex-col items-center gap-4">
            {leadboardData.map((player, index) => (
                <Card
                    key={player.username}
                    className="flex w-1/2 min-w-[600px] flex-row p-6 text-xl shadow-md"
                >
                    <div className="flex w-1/3 flex-row items-center gap-2">
                        <b>{player.username}</b>
                        {index + 1 < 3 && (
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
    return (
        <div className="h-full">
            {showTimer && clock && (
                <div className="flex w-full justify-center pt-8">
                    <Timer isHost={false} isPaused={isPaused} />
                </div>
            )}
            <TeamRank />
        </div>
    );
}
