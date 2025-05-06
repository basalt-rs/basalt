import { atom, useAtom, useSetAtom } from 'jotai';
import { Announcement } from '../types';
import { useWebSocket } from './ws';
import { toast } from '@/hooks';
import { useEffect } from 'react';
import { ipAtom } from './api';
import { tokenAtom } from './auth';
import { get } from 'react-hook-form';

export const announcementsAtom = atom<Announcement[]>([]);

export const useAnnouncements = () => {
    const authToken = get(tokenAtom);
    const [ip] = useAtom(ipAtom);
    const setAnnouncements = useSetAtom(announcementsAtom);
    const { ws } = useWebSocket();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const res = await fetch(`${ip}/announcements`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                if (!res.ok) {
                    return;
                }
                const data = await res.json();
                setAnnouncements(data);
            } catch (_err) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not get announcements...',
                });
            }
        };
        fetchAnnouncements();
    }, [ip, authToken, setAnnouncements]);

    ws.registerEvent(
        'new-announcement',
        (announcement) => {
            setAnnouncements((prev) => [...prev, announcement]);
            toast({
                title: 'New Announcement',
                description: announcement.message,
            });
        },
        'new-announcements'
    );
};
