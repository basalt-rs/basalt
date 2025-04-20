import { toast } from '@/hooks';
import { atom, createStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type Role = 'competitor' | 'admin';
export interface User {
    username: string;
    role: Role;
}

export const API = 'http://localhost:8517';

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

export const tryFetch = async <T>(
    url: string | URL,
    token: string,
    init?: Partial<RequestInit>
): Promise<T | null> => {
    const innitBruv: RequestInit = {
        headers: {
            Authorization: `Bearer ${token}`,
            ...(init?.headers ?? {}),
        },
        ...(init ?? {}),
    };

    const res = await fetch(url, innitBruv);

    if (res.ok) {
        return await res.json();
    } else {
        toast({
            title: 'Error Loading',
            description: 'There was an error while attempting to fetch a resource.',
            variant: 'destructive',
        });
        console.error(await res.text());
        return null;
    }
};
