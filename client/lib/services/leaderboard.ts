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
        data.sort((a, b) => b.score - a.score || a.user.username.localeCompare(b.user.username));
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
            setLeaderboard(([...leaderboard]) => {
                for (const user of users.teams) {
                    const existingIdx = leaderboard.findIndex((l) => l.user.id === user.id);
                    if (existingIdx === -1) {
                        leaderboard.push({
                            user: {
                                id: user.id,
                                displayName: user.displayName,
                                username: user.name,
                                role: 'competitor',
                            },
                            score: user.newScore,
                            submissionStates: user.newStates,
                        });
                    } else {
                        leaderboard[existingIdx] = {
                            user: {
                                ...leaderboard[existingIdx].user,
                                displayName: user.displayName,
                                username: user.name,
                            },
                            score: user.newScore,
                            submissionStates: user.newStates,
                        };
                    }
                }
                sortLeaderboard(leaderboard);
                return leaderboard;
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
