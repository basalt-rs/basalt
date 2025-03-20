import { getDefaultStore } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const ipAtom = atomWithStorage<string | null>('ip', null);

const parseGameCode = (gameCode: string): string | null => {
    if (!/[a-z]{12}/i.test(gameCode)) {
        return null;
    }

    gameCode = gameCode.toLowerCase();

    const idx = (α: string) => α.charCodeAt(0) - 'a'.charCodeAt(0);
    const parseByte = (s: string, index: number): number =>
        (idx(s[index]) << 4) + idx(s[index + 1]);

    const ip = Array.from({ length: 4 }, (_, i) => parseByte(gameCode, i * 2)).join('.');
    const port = (parseByte(gameCode, 8) << 8) + parseByte(gameCode, 10);

    return `${ip}:${port}`;
};

export const setIp = (ipOrGameCode: string) => {
    const store = getDefaultStore();
    if (/^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{1,4}$/.test(ipOrGameCode)) {
        const ip = ipOrGameCode;
        store.set(ipAtom, ip.startsWith('http') ? ip : `http://${ip}`);
        console.log('ip addr', ip);
        return true;
    }
    const gc = parseGameCode(ipOrGameCode);
    if (gc) {
        store.set(ipAtom, 'http://' + gc);
        console.log('game code', ipOrGameCode, '=>', store.get(ipAtom));
        return true;
    }

    return false;
};
