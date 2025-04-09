import { atom, getDefaultStore } from 'jotai';
import { tokenAtom } from './auth';
import { TestResults } from '../types';
import { ipAtom } from './api';

type EVENT_MAPPING = {
    'game-paused': object;
    'game-unpaused': {
        timeLeftInSeconds: number;
    };
};

type WebsocketSend =
    | { kind: 'run-test'; id: number; language: string; solution: string; problem: number; }
    | { kind: 'submit'; id: number; language: string; solution: string; problem: number; };

export interface WebsocketRes {
    'run-test': {
        kind: 'test-results';
        id: number;
        results: TestResults;
        percent: number;
    };
    'submit': {
        kind: 'submit';
        id: number;
        results: TestResults;
        percent: number;
    };
}

type BroadcastEventKind = keyof EVENT_MAPPING;

type BroadcastEventFn<K extends BroadcastEventKind> = (data: EVENT_MAPPING[K]) => void;

type BasaltBroadcastEvent<K extends BroadcastEventKind> = { kind: K } & EVENT_MAPPING[K];

type BasaltEvent = { kind: 'broadcast'; broadcast: { kind: BroadcastEventKind } & unknown } | WebsocketRes[keyof WebsocketRes];

class BasaltWSClient {
    private broadcastHandlers: {
        [K in keyof EVENT_MAPPING]: { id: string | null; fn: (d: unknown) => void; oneTime: boolean }[];
    } = {
            'game-paused': [],
            'game-unpaused': [],
        };
    private onCloseTasks: (() => void)[] = [];
    private pendingTasks: { id: number; resolve: (t: WebsocketRes[keyof WebsocketRes]) => void; reject: () => void }[] = [];
    private nextId = 0;

    private ws!: WebSocket;
    private open: boolean;
    private openWaiting: (() => void)[] = []

    private retries: number = 0;

    constructor(
        private endpoint: string,
        private enabled: boolean = true
    ) {
        console.debug('constructing WS');
        // this.establish(0);
    }

    public isEstablished() {
        return !!this.ws;
    }

    public waitForOpen(): Promise<void> {
        if (this.open) return new Promise(res => res());
        let done: (() => void) | undefined;
        const x =  new Promise<void>((res) => done = res);
        this.openWaiting.push(done!);
        return x;
    }

    public establish(ip: string, token: string | null, retries: number = 0) {
        this.enabled = true;
        console.log('establishing ws connection', { ip, token });
        this.ws = new WebSocket(ip + this.endpoint, token ? [token] : undefined);
        this.ws.onopen = () => {
            console.debug('connected to websocket backend');
            this.retries = retries - 1;
            this.open = true;
            this.openWaiting.forEach(x => x());
            this.openWaiting = [];
        };
        this.ws.onclose = () => {
            this.open = false;
            if (this.enabled) {
                console.debug('disconnected to websocket backend');
                // retry connection with exponential backoff
                setTimeout(
                    () => {
                        const store = getDefaultStore();
                        const ip = store.get(ipAtom)!;
                        if (ip) {
                            this.establish(ip, store.get(tokenAtom), this.retries + 1);
                        }
                    },
                    2 ** retries * 1000
                );
            }
        };
        this.ws.onmessage = (m) => {
            try {
                const msg = JSON.parse(m.data) as BasaltEvent;
                console.log('msg', msg);
                switch (msg.kind) {
                    case 'broadcast': {
                        const { kind, ...data } = msg.broadcast as BasaltBroadcastEvent<typeof msg.broadcast.kind>;
                        if (!(kind in this.broadcastHandlers)) return;

                        for (const { fn } of this.broadcastHandlers[kind]) {
                            fn(data);
                        }
                    } break;
                    default: {
                        if (Object.hasOwn(msg, 'id')) {
                            for (let i = this.pendingTasks.length; i--;) {
                                const { id, resolve } = this.pendingTasks[i];
                                if (id === msg.id) {
                                    this.pendingTasks.splice(i, 1);
                                    resolve(msg);
                                }
                            }
                        }
                    } break;
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
            this.broadcastHandlers[eventName][idx] = { id, fn: fn as (data: unknown) => void, oneTime: false };
        } else {
            this.broadcastHandlers[eventName].push({ id, fn: fn as (data: unknown) => void, oneTime: false });
        }
    }

    public sendAndWait<T extends Omit<WebsocketSend, 'id'>, U extends WebsocketRes[T['kind']]>(data: T): Promise<U> {
        console.log(data);
        const id = this.nextId++;
        const send: WebsocketSend = { ...data, id };
        let resolve: ((u: WebsocketRes[keyof WebsocketRes]) => void) | undefined = undefined;
        let reject: (() => void) | undefined = undefined;
        const promise = new Promise<U>((res, rej) => {
            resolve = res as typeof resolve;
            reject = rej;
        });
        this.pendingTasks.push({ id, resolve: resolve!, reject: reject! });
        console.log('send', send);
        this.ws.send(JSON.stringify(send));
        return promise;
    }

    public closeConnection() {
        this.enabled = false;
        this.cleanup();
    }

    private cleanup() {
        this.pendingTasks.forEach(({ reject }) => reject());
        this.onCloseTasks.forEach((t) => t());
    }

    public registerCleanup(task: () => void) {
        this.onCloseTasks.push(task);
    }
}

// TODO: Make this get the token once, perhaps move the token to "establish" and call that on login
//       Or, add an auth method within the ws?  Seems kind of weird, though
export const basaltWSClientAtom = atom(new BasaltWSClient(`/ws`));
