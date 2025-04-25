import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { ipAtom } from './api';

type EVENT_MAPPING = {
    'game-paused': object;
    'game-unpaused': {
        timeLeftInSeconds: number;
    };
};

type BroadcastEventKind = keyof EVENT_MAPPING;

type BroadcastEventFn<K extends BroadcastEventKind> = (data: EVENT_MAPPING[K]) => void;

type BasaltBroadcastEvent<K extends BroadcastEventKind> = { kind: K } & EVENT_MAPPING[K];

type BasaltEvent = { kind: 'broadcast'; broadcast: { kind: BroadcastEventKind } & unknown };

class BasaltWSClient {
    private broadcastHandlers: {
        [K in keyof EVENT_MAPPING]: { id: string | null; fn: (d: unknown) => void }[];
    } = {
        'game-paused': [],
        'game-unpaused': [],
    };
    private onCloseTasks: (() => void)[] = [];

    private ws!: WebSocket;
    public ip: string | null = null;
    public isOpen: boolean = false;

    private retries: number = 0;

    constructor(
        private endpoint: string,
        private enabled: boolean = true
    ) {
        console.debug('constructing WS');
    }

    public establish(ip: string, retries: number = 0) {
        this.enabled = true;
        this.ip = ip;
        this.ws = new WebSocket(`${this.ip}/${this.endpoint}`);
        this.ws.onopen = () => {
            console.debug('connected to websocket backend');
            this.isOpen = true;
            this.retries = retries - 1;
        };
        this.ws.onclose = () => {
            this.isOpen = false;
            if (this.enabled) {
                console.debug('disconnected to websocket backend');
                // retry connection with exponential backoff
                setTimeout(
                    () => {
                        this.establish(ip, this.retries + 1);
                    },
                    2 ** retries * 1000
                );
            }
        };
        this.ws.onmessage = (m) => {
            try {
                const { kind: msgKind, ...rest } = JSON.parse(m.data) as BasaltEvent;
                switch (msgKind) {
                    case 'broadcast': {
                        const { kind, ...data } = rest.broadcast as BasaltBroadcastEvent<
                            typeof rest.broadcast.kind
                        >;
                        if (!(kind in this.broadcastHandlers)) return;

                        for (const { fn } of this.broadcastHandlers[kind]) {
                            fn(data);
                        }
                    }
                }
            } catch (e) {
                console.error('Error processing message:', e);
            }
        };
    }

    public registerEvent<K extends keyof EVENT_MAPPING>(
        eventName: K,
        fn: BroadcastEventFn<K>,
        id: string | null = null
    ) {
        const idx = this.broadcastHandlers[eventName].findIndex((h) => h.id === id);
        if (idx !== -1) {
            this.broadcastHandlers[eventName][idx] = { id, fn: fn as (data: unknown) => void };
        } else {
            this.broadcastHandlers[eventName].push({ id, fn: fn as (data: unknown) => void });
        }
    }

    public closeConnection() {
        console.debug('websocket closed');
        if (this.ws) {
            this.ws.close();
        }
        this.enabled = false;
        this.cleanup();
    }

    private cleanup() {
        if (this.isOpen) {
            this.onCloseTasks.forEach((t) => t());
        }
    }

    public registerCleanup(task: () => void) {
        this.onCloseTasks.push(task);
    }
}

const basaltWSClientAtom = atom(new BasaltWSClient('ws'));

export const useWebSocket = () => {
    const [ws, setWs] = useAtom(basaltWSClientAtom);
    const [ip] = useAtom(ipAtom);

    useEffect(() => {
        if (ip !== ws.ip) {
            ws.closeConnection();
            if (ip) {
                ws.establish(ip);
            }
        }
    }, [ip, ws, setWs]);

    return ws;
};
