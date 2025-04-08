import { atom } from 'jotai';
import { API } from './auth';

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

    private retries: number = 0;

    constructor(
        private endpoint: string,
        private enabled: boolean = true
    ) {
        console.debug('constructing WS');
        this.establish(0);
    }

    public establish(retries: number = 0) {
        this.enabled = true;
        this.ws = new WebSocket(this.endpoint);
        this.ws.onopen = () => {
            console.debug('connected to websocket backend');
            this.retries = retries - 1;
        };
        this.ws.onclose = () => {
            if (this.enabled) {
                console.debug('disconnected to websocket backend');
                // retry connection with exponential backoff
                setTimeout(
                    () => {
                        this.establish(this.retries + 1);
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
        this.enabled = false;
        this.cleanup();
    }

    private cleanup() {
        this.onCloseTasks.forEach((t) => t());
    }

    public registerCleanup(task: () => void) {
        this.onCloseTasks.push(task);
    }
}

export const basaltWSClientAtom = atom(new BasaltWSClient(`${API}/ws`));
