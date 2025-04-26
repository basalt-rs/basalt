import { useAtom } from 'jotai';
import { ipAtom } from './api';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { announcementsAtom } from '../host-state';
import { Announcement } from '../types';

export const useAnnouncements = () => {
    const [ip] = useAtom(ipAtom);
    const [_announcements, setAnnouncements] = useAtom(announcementsAtom);

    useEffect(() => {
        if (!ip) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No backend IP address provided.',
            });
        }

        const correctedIP = ip?.trim().replace(/^https?:\/\//, '');

        if (!correctedIP) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Backend IP address is invalid after stripping protocol.',
            });
            return;
        }

        const ws = new WebSocket(`ws://${correctedIP}/ws`);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.kind === 'broadcast' && data.broadcast.kind === 'new-announcement') {
                    const newAnnouncement: Announcement = {
                        id: data.broadcast.id,
                        sender: data.broadcast.sender,
                        time: data.broadcast.time,
                        message: data.broadcast.message,
                    };
                    setAnnouncements((prev) => [...prev, newAnnouncement]);
                    toast({
                        title: 'New Announcement',
                        description: newAnnouncement.message,
                    });
                }
            } catch (_err) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description:
                        'A WebSocket error occurred, check the console for further details.',
                });
            }
        };
        ws.onerror = () => {
            toast({
                variant: 'destructive',
                title: 'WebSocket Error',
                description: 'A connection error occurred with the backend.',
            });
        };
    }, [ip, setAnnouncements]);
};
