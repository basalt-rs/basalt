import { atom, createStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Role = 'competitor' | 'admin';
export interface User {
    username: string;
    role: Role;
}

const API = 'http://localhost:8517';

export const tokenAtom = atomWithStorage<string | null>('auth_token', null);
export const currentUserAtom = atom(async (get) => await getCurrentUser(get(tokenAtom)));
export const roleAtom = atom(async (get) => (await get(currentUserAtom))?.role);

export const getCurrentUser = async (token: string | null = null): Promise<User | null> => {
    const store = createStore();
    if (token === null) {
        token = store.get(tokenAtom);
        if (token === null) return null;
    }

    const res = await fetch(`${API}/auth/me`, {
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

export const login = async (username: string, password: string): Promise<Role | null> => {
    const store = createStore();
    const res = await fetch(`${API}/auth/login`, {
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
