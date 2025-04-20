import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import Timer from '@/components/Timer';
import { useClock } from '@/hooks/use-clock';
import { Status } from './Status';

type TestState = 'pass' | 'fail' | 'in-progress' | 'not-attempted';

interface Data {
    rank: number;
    name: string;
    score: number;
    tests: TestState[];
}

const trophyColor = (rank: number) => ['text-yellow-500', 'text-gray-500', 'text-amber-600'][rank];

const TeamRank = () => {
    const data: Data[] = [
        {
            rank: 0,
            name: 'Team 1',
            score: 980,
            tests: ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'pass'],
        },
        {
            rank: 1,
            name: 'Team 2',
            score: 870,
            tests: ['pass', 'pass', 'pass', 'pass', 'pass', 'pass', 'in-progress'],
        },
        {
            rank: 2,
            name: 'Team 3',
            score: 760,
            tests: ['pass', 'pass', 'pass', 'pass', 'pass', 'fail', 'fail'],
        },
        {
            rank: 3,
            name: 'Team 4',
            score: 650,
            tests: [
                'pass',
                'pass',
                'pass',
                'in-progress',
                'not-attempted',
                'not-attempted',
                'not-attempted',
            ],
        },
        {
            rank: 4,
            name: 'Team 5',
            score: 540,
            tests: [
                'pass',
                'pass',
                'in-progress',
                'not-attempted',
                'not-attempted',
                'not-attempted',
                'not-attempted',
            ],
        },
        {
            rank: 5,
            name: 'Team 6',
            score: 530,
            tests: [
                'pass',
                'pass',
                'in-progress',
                'not-attempted',
                'not-attempted',
                'not-attempted',
                'not-attempted',
            ],
        },
        {
            rank: 6,
            name: 'Team 7',
            score: 520,
            tests: [
                'pass',
                'pass',
                'in-progress',
                'not-attempted',
                'not-attempted',
                'not-attempted',
                'not-attempted',
            ],
        },
        {
            rank: 7,
            name: 'Team 8',
            score: 510,
            tests: [
                'pass',
                'pass',
                'in-progress',
                'not-attempted',
                'not-attempted',
                'not-attempted',
                'not-attempted',
            ],
        },
        {
            rank: 8,
            name: 'Team 9',
            score: 500,
            tests: [
                'pass',
                'pass',
                'in-progress',
                'not-attempted',
                'not-attempted',
                'not-attempted',
                'not-attempted',
            ],
        },
    ];

    return (
        <div className="flex flex-col items-center gap-4">
            {data.map((player) => (
                <Card
                    key={player.rank}
                    className="flex w-1/2 min-w-[600px] flex-row p-6 text-xl shadow-md"
                >
                    <div className="flex w-1/3 flex-row items-center gap-2">
                        <b>{player.name}</b>
                        {player.rank < 3 && (
                            <span className={trophyColor(player.rank)}>
                                <Trophy fill="currentColor" size="1em" />
                            </span>
                        )}
                    </div>

                    <div className="flex w-1/3 items-center justify-center gap-2">
                        {player.tests.map((testResult, index) => (
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
