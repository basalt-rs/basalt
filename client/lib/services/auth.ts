import { atom, useAtom, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ipAtom, resetIp } from './api';

export type Role = 'competitor' | 'admin';
export interface User {
    username: string;
    role: Role;
}

export const tokenAtom = atomWithStorage<string | null>('auth_token', null);
export const currentUserAtom = atom(async (get) => {
    const token = get(tokenAtom)
    const ip = get(ipAtom);
    if (token === null) return null;

    try {
        const res = await fetch(`${ip}/auth/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            return null;
        }
        return (await res.json()) as User;
    } catch (e: unknown) {
        if (`${e}`.includes('Load failed')) {
            resetIp();
            return null;
        }

        throw e;
    }
});
export const roleAtom = atom(async (get) => (await get(currentUserAtom))?.role);

export const useLogin = () => {
    const [ip] = useAtom(ipAtom);
    const setTokenAtom = useSetAtom(tokenAtom);

    return async (username: string, password: string): Promise<Role | null> => {
        const res = await fetch(`${ip}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'content-type': 'application/json',
            },
        });
        if (res.ok) {
            const { token, role } = await res.json();
            setTokenAtom(token);
            return role;
        } else {
            return null;
        }
    };
};
