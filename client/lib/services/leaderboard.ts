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
    const { ws } = useWebSocket();
    const [leaderboard, setLeaderboard] = useAtom(leaderboardAtom);

    const sortLeaderboard = (data: LeaderboardEntry[]) => {
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
            sortLeaderboard(leaderboard);
            setLeaderboard(leaderboard);
        })();
    }, [ip, setLeaderboard]);
    ws.registerEvent(
        'team-update',
        (users) => {
            setLeaderboard((leaderboard) => {
                const temp = leaderboard.map((item) => {
                    const user = users.find((x) => x.id === item.user.id);
                    if (user) {
                        return {
                            user: {
                                ...item.user,
                                displayName: user.displayName,
                                username: user.name,
                            },
                            score: user.newScore,
                            submissionStates: user.newStates,
                        };
                    } else {
                        return item;
                    }
                });
                sortLeaderboard(temp);
                return temp;
            });
        },
        'team updates'
    );
    ws.registerEvent(
        'team-rename',
        (rename) => {
            setLeaderboard((leaderboard) => {
                const temp = leaderboard.map((item) =>
                    item.user.id === rename.id
                        ? {
                              ...item,
                              user: {
                                  ...item.user,
                                  username: rename.name,
                                  displayName: rename.display_name,
                              },
                          }
                        : item
                );
                sortLeaderboard(temp);
                return temp;
            });
        },
        'use-leaderboard-team-rename'
    );

    return leaderboard;
};
