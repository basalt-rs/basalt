import { atom } from 'jotai';
import { leaderboard } from '../types';
import { toast } from '@/hooks/use-toast';
import { ipAtom } from './api';

export const leaderboardAtom = atom(async (get) => {
    const ip = get(ipAtom);
    if (ip === null) return [];
    const res = await fetch(`${ip}/leaderboard`);
    if (!res.ok) {
        toast({
            title: 'Error',
            description: 'There was an error while loading questions.',
        });
        return [];
    }
    return (await res.json()) as leaderboard[];
});
