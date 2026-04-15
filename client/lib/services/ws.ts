import { atom, useAtom } from 'jotai';
import { SubmissionHistory, TestResults, TestState } from '../types';
import { Announcement } from '../types';
import { toast, ToasterToast } from '@/hooks';
import { relativeTime } from '../utils';
import { TeamInfo } from './teams';

type EVENT_MAPPING = {
    // Broadcast events
    'game-paused': object;
    'game-unpaused': {
        timeLeftInSeconds: number;
    };
    'team-update': {
        teams: {
            id: string;
            name: string;
            displayName: string;
            newScore: number;
            newStates: TestState[];
        }[];
    };
    'team-rename': {
        id: string;
        name: string;
        display_name: string | null;
    };
    'new-announcement': Announcement;
    'team-connected': TeamInfo;
    'team-disconnected': TeamInfo;

    // Private events
    'test-results': {
        id: string;
        results: TestResults[];
    };
    'tests-compiled': {
        id: string;
        stdout: string;
        stderr: string;
    };
    'tests-error': { id: string };
    'tests-cancelled': { id: string };
    'tests-complete': {
        results: TestResults[];
        remainingAttempts: number | null;
    } & SubmissionHistory;
    'tests-compile-fail': SubmissionHistory;
};

type BroadcastEventKind = keyof EVENT_MAPPING;

type BroadcastEventFn<K extends BroadcastEventKind> = (data: EVENT_MAPPING[K]) => void;

type BasaltEvent = { kind: keyof EVENT_MAPPING } & EVENT_MAPPING[keyof EVENT_MAPPING];

class BasaltWSClient {
    private eventHandlers: {
        [K in keyof EVENT_MAPPING]: {
            id: string | null;
            fn: (d: unknown) => void;
            oneTime: boolean;
        }[];
    } = {
        'game-paused': [],
        'game-unpaused': [],
        'team-update': [],
        'team-rename': [],
        'new-announcement': [],
        'team-connected': [],
        'team-disconnected': [],

        'tests-error': [],
        'tests-cancelled': [],
        'tests-complete': [],
        'tests-compile-fail': [],
        'test-results': [],
        'tests-compiled': [],
    };
    private onCloseTasks: (() => void)[] = [];

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
        this.retries = retries;

        this.ws = new WebSocket(
            `${this.ip}/${this.endpoint}`,
            this.token ? [this.token] : undefined
        );
        let pendingToast: {
            id: ToasterToast['id'];
            dismiss: () => void;
            update: (toast: ToasterToast) => void;
        } | null = null;
        this.ws.onopen = () => {
            console.debug('connected to websocket backend');
            this.isOpen = true;
            if (this.retries > 2) {
                pendingToast?.dismiss();
                toast({
                    title: 'Successfully reconnected to competition server.',
                    variant: 'success',
                });
            }
            this.retries = 0;
        };
        this.ws.onclose = () => {
            this.isOpen = false;
            const EXP_BASE = 1.5;
            if (this.enabled) {
                console.debug('disconnected to websocket backend');
                if (this.retries > 2) {
                    pendingToast?.dismiss();
                    pendingToast = toast({
                        title: `Unable to connect to competition server.  Retrying ${relativeTime(EXP_BASE ** retries)}.`,
                        variant: 'destructive',
                    });
                }
                // retry connection with exponential backoff
                setTimeout(
                    () => {
                        this.establish(ip, this.token, this.retries + 1);
                    },
                    EXP_BASE ** retries * 1000
                );
            }
        };
        this.ws.onmessage = (m) => {
            try {
                const msg = JSON.parse(m.data) as BasaltEvent;
                console.log('msg', msg);
                const { kind, ...data } = msg;
                if (!(kind in this.eventHandlers)) return;

                for (let i = this.eventHandlers[kind].length; --i >= 0; ) {
                    const { fn, oneTime } = this.eventHandlers[kind][i];
                    fn(data);
                    if (oneTime) this.eventHandlers[kind].splice(i, 1);
                }
            } catch (e) {
                console.error('Error processing message:', e);
            }
        };
    }

    public registerEvent<K extends keyof EVENT_MAPPING>(
        eventName: K,
        fn: BroadcastEventFn<K>,
        id: string | null = null,
        oneTime: boolean = false
    ) {
        const idx = this.eventHandlers[eventName].findIndex((h) => h.id === id);
        if (idx !== -1) {
            this.eventHandlers[eventName][idx] = {
                id,
                fn: fn as (data: unknown) => void,
                oneTime,
            };
        } else {
            this.eventHandlers[eventName].push({
                id,
                fn: fn as (data: unknown) => void,
                oneTime,
            });
        }
    }

    public removeEvent<K extends keyof EVENT_MAPPING>(eventName: K, id: string): boolean {
        const idx = this.eventHandlers[eventName].findIndex((h) => h.id === id);
        if (idx === -1) return false;
        this.eventHandlers[eventName].splice(idx, 1);
        return true;
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

    return {
        ws,
        establishWs: (ip: string, token: string | null) => {
            if (!ws.isOpen) {
                ws.establish(ip, token);
            }
        },
        dropWs: () => {
            ws.closeConnection();
        },
    };
};
