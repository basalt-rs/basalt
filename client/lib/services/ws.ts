import { atom, useAtom } from 'jotai';
import { TestResults, TestState } from '../types';
import { Announcement } from '../types';
import { TeamInfo } from './teams';

type EVENT_MAPPING = {
    'game-paused': object;
    'game-unpaused': {
        timeLeftInSeconds: number;
    };
    'team-update': {
        team: string;
        new_score: number;
        new_states: TestState[];
    };
    'new-announcement': Announcement;
    'team-connected': TeamInfo;
    'team-disconnected': TeamInfo;
};

type WebsocketSend =
    | { kind: 'run-test'; id: number; language: string; solution: string; problem: number }
    | { kind: 'submit'; id: number; language: string; solution: string; problem: number };

interface WebsocketError {
    kind: 'error';
    id?: number;
    message: string;
}

export interface WebsocketRes {
    'run-test': {
        kind: 'test-results';
        id: number;
        results: TestResults;
        percent: number;
    };
    submit:
        | {
              kind: 'submit';
              id: number;
              results: TestResults;
              percent: number;
              remainingAttempts: number | null;
          }
        | WebsocketError;
}

type BroadcastEventKind = keyof EVENT_MAPPING;

type BroadcastEventFn<K extends BroadcastEventKind> = (data: EVENT_MAPPING[K]) => void;

type BasaltBroadcastEvent<K extends BroadcastEventKind> = { kind: K } & EVENT_MAPPING[K];

type BasaltEvent =
    | { kind: 'broadcast'; broadcast: { kind: BroadcastEventKind } & unknown }
    | WebsocketRes[keyof WebsocketRes];

class BasaltWSClient {
    private broadcastHandlers: {
        [K in keyof EVENT_MAPPING]: {
            id: string | null;
            fn: (d: unknown) => void;
            oneTime: boolean;
        }[];
    } = {
        'game-paused': [],
        'game-unpaused': [],
        'team-update': [],
        'new-announcement': [],
        'team-connected': [],
        'team-disconnected': [],
    };
    private onCloseTasks: (() => void)[] = [];
    private pendingTasks: {
        id: number;
        resolve: (t: WebsocketRes[keyof WebsocketRes]) => void;
        reject: () => void;
    }[] = [];
    private nextId = 0;

    private ws!: WebSocket;
    public ip: string | null = null;
    public token: string | null = null;
    public isOpen: boolean = false;

    private retries: number = 0;

    constructor(
        private endpoint: string,
        private enabled: boolean = true
    ) {
        console.debug('constructing WS');
    }

    public establish(ip: string, token: string | null, retries: number = 0) {
        this.enabled = true;
        this.isOpen = true;
        this.token = token;
        this.ip = ip;
        this.ws = new WebSocket(
            `${this.ip}/${this.endpoint}`,
            this.token ? [this.token] : undefined
        );
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
                        this.establish(ip, this.token, this.retries + 1);
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
                    case 'broadcast':
                        {
                            const { kind, ...data } = msg.broadcast as BasaltBroadcastEvent<
                                typeof msg.broadcast.kind
                            >;
                            if (!(kind in this.broadcastHandlers)) return;

                            for (const { fn } of this.broadcastHandlers[kind]) {
                                fn(data);
                            }
                        }
                        break;
                    default:
                        {
                            if (Object.hasOwn(msg, 'id')) {
                                for (let i = this.pendingTasks.length; i--; ) {
                                    const { id, resolve } = this.pendingTasks[i];
                                    if (id === msg.id) {
                                        this.pendingTasks.splice(i, 1);
                                        resolve(msg);
                                    }
                                }
                            }
                        }
                        break;
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
            this.broadcastHandlers[eventName][idx] = {
                id,
                fn: fn as (data: unknown) => void,
                oneTime: false,
            };
        } else {
            this.broadcastHandlers[eventName].push({
                id,
                fn: fn as (data: unknown) => void,
                oneTime: false,
            });
        }
    }

    public sendAndWait<T extends Omit<WebsocketSend, 'id'>, U extends WebsocketRes[T['kind']]>(
        data: T
    ): Promise<U> {
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
        console.debug('websocket closed, ws=', this.ws);
        if (this.ws) {
            this.ws.close();
        }
        this.enabled = false;
        this.cleanup();
    }

    private cleanup() {
        this.pendingTasks.forEach(({ reject }) => reject());
        if (this.isOpen) {
            this.onCloseTasks.forEach((t) => t());
        }
    }

    public registerCleanup(task: () => void) {
        this.onCloseTasks.push(task);
    }
}

export const basaltWSClientAtom = atom(new BasaltWSClient('ws'));

export const useWebSocket = () => {
    const [ws] = useAtom(basaltWSClientAtom);

    const establish = (ip: string, token: string | null) => {
        if (!ws.isOpen) {
            ws.establish(ip, token);
        }
    };

    const drop = () => {
        ws.closeConnection();
    };

    return [ws, establish, drop] as const;
};
