import { atom } from 'jotai';
import { LeaderboardEntry } from '../types';
import { toast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';
import { ipAtom } from './api';
import { useEffect } from 'react';
import { useWebSocket } from './ws';

const leaderboardAtom = atom<LeaderboardEntry[]>([]);

export const useLeaderboard = () => {
    const [ip] = useAtom(ipAtom);
    const ws = useWebSocket();
    const [leaderboard, setLeaderboard] = useAtom(leaderboardAtom);

    const rankLeaderboard = (data: LeaderboardEntry[]) => {
        data.sort((a, b) => b.score - a.score);
    };

    useEffect(() => {
        (async () => {
            if (!ip) {
                return;
            }

            const res = await fetch(`${ip}/leaderboard`);

            if (!res.ok) {
                toast({
                    title: 'There was an error fetching the leaderboard',
                    variant: 'destructive',
                });
                return;
            }
            const leaderboard: LeaderboardEntry[] = await res.json();
            rankLeaderboard(leaderboard);
            setLeaderboard(leaderboard);
        })();
    }, [ip, setLeaderboard, ws]);
    ws.registerEvent(
        'team-update',
        (update) => {
            console.log('update this sucker', setLeaderboard);
            setLeaderboard((leaderboard) => {
                const temp = leaderboard.map((item) =>
                    item.username === update.team
                        ? {
                              username: update.team,
                              score: update.new_score,
                              submissionStates: update.new_states,
                          }
                        : item
                );
                rankLeaderboard(temp);
                return temp;
            });
        },
        'team updates'
    );

    return leaderboard;
};
