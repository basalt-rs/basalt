import { atom, createStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { ipAtom } from './api';

export type Role = 'competitor' | 'admin';
export interface User {
    username: string;
    role: Role;
}

export const tokenAtom = atomWithStorage<string | null>('auth_token', null);
export const currentUserAtom = atom(async (get) => {
    const ip = get(ipAtom);
    if (!ip) return null;
    return await getCurrentUser(ip, get(tokenAtom));
});
export const roleAtom = atom(async (get) => (await get(currentUserAtom))?.role);

export const getCurrentUser = async (
    ip: string,
    token: string | null = null
): Promise<User | null> => {
    const store = createStore();
    if (token === null) {
        token = store.get(tokenAtom);
        if (token === null) return null;
    }

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
};

export const login = async (
    ip: string,
    username: string,
    password: string
): Promise<Role | null> => {
    const store = createStore();
    const res = await fetch(`${ip}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
            'content-type': 'application/json',
        },
    });
    if (res.ok) {
        const { token, role } = await res.json();
        store.set(tokenAtom, token);
        return role;
    } else {
        return null;
    }
};
