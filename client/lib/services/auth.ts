import { toast } from '@/hooks';
import { atom, useAtom } from 'jotai';
import { atomWithStorage, RESET } from 'jotai/utils';
import { ipAtom, resetIp } from './api';
import { basaltWSClientAtom, useWebSocket } from './ws';

export type Role = 'competitor' | 'admin';
export interface User {
    username: string;
    role: Role;
}

export const tokenAtom = atomWithStorage<string | null>('auth_token', null);
export const currentUserAtom = atom(async (get) => {
    const token = get(tokenAtom);
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
        const ws = get(basaltWSClientAtom);
        if (ip && !ws.isOpen) {
            ws.establish(ip, token);
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
    const [token, setToken] = useAtom(tokenAtom);
    const { establishWs, dropWs } = useWebSocket();

    const login = async (username: string, password: string): Promise<Role | null> => {
        const res = await fetch(`${ip}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'content-type': 'application/json',
            },
        });
        if (res.ok) {
            const { token, role } = await res.json();
            setToken(token);
            if (ip) establishWs(ip, token);
            return role;
        } else {
            return null;
        }
    };

    const logout = async (): Promise<void> => {
        if (!token || !ip) {
            console.error('Tried to logout missing session or IP');
        }
        try {
            const res = await fetch(`${ip}/auth/logout`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
            } else {
                console.error('Something went wrong logging out');
                console.error(await res.text());
            }
        } catch (_: unknown) {
            console.error('Network error occurred');
        }
        setToken(RESET);
        dropWs();
    };

    return { login, logout };
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
