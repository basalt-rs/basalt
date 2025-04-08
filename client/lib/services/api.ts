import { getDefaultStore, useAtom } from 'jotai';
import { atomWithStorage, RESET } from 'jotai/utils';

export const ipOrGameCodeAtom = atomWithStorage<string>('ip_or_game_code', '');
export const ipAtom = atomWithStorage<string | null>('ip', null);

export const useIp = () => {
    const [ip, setIp] = useAtom(ipAtom);

    return {
        ip,
        setIp: (ipOrGameCode: string) => {
            if (/^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{1,4}$/.test(ipOrGameCode)) {
                const ip = ipOrGameCode;
                setIp(ip.startsWith('http') ? ip : `http://${ip}`);
                console.log('ip addr', ip);
                return true;
            }
            const gc = parseGameCode(ipOrGameCode);
            if (gc) {
                setIp('http://' + gc);
                console.log('game code', ipOrGameCode, '=>', ip);
                return true;
            }

            return false;
        }
    };
}

const rleDecode = (encoded: string): string => {
    let out = '';
    for (let i = 0; i < encoded.length; ++i) {
        const c = encoded[i];
        if (!isNaN(+c)) {
            out += encoded[++i].repeat(+c);
        } else {
            out += c;
        }
    }
    return out;
};

const parseGameCode = (gameCode: string): string | null => {
    gameCode = rleDecode(gameCode.toLowerCase());

    if (!/[a-z]{12}/i.test(gameCode)) {
        return null;
    }


    const idx = (α: string) => α.charCodeAt(0) - 'a'.charCodeAt(0);
    const parseByte = (s: string, index: number): number =>
        (idx(s[index]) << 4) + idx(s[index + 1]);

    const ip = Array.from({ length: 4 }, (_, i) => parseByte(gameCode, i * 2)).join('.');
    const port = (parseByte(gameCode, 8) << 8) + parseByte(gameCode, 10);

    return `${ip}:${port}`;
};


export const resetIp = () => {
    const store = getDefaultStore();
    store.set(ipAtom, RESET);
    store.set(ipOrGameCodeAtom, '');
}:
