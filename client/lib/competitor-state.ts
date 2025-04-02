import { atom } from 'jotai';

export const currentTabAtom = atom<'text-editor' | 'leaderboard'>('text-editor');
