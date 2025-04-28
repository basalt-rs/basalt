import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks';
import { Send } from 'lucide-react';
import { announcementsAtom } from '@/lib/services/announcement';
import { useAtom } from 'jotai';
import { useState, useRef, useEffect } from 'react';
import { ipAtom } from '@/lib/services/api';
import { tokenAtom } from '@/lib/services/auth';

export default function AnnouncementForm() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [ip] = useAtom(ipAtom);
    const [authToken] = useAtom(tokenAtom);
    const [announcementList] = useAtom(announcementsAtom);
    const { toast } = useToast();
    const [input, setInput] = useState('');

    const postAnnouncement = async (ip: string | null, message: string) => {
        try {
            const res = await fetch(`${ip}/announcements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ message }),
            });
            if (!res.ok) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'An error occured while sending your announcement.',
                });
                return null;
            }
            const result = await res.json();
            toast({
                title: 'Announcement Sent',
            });
            return result;
        } catch (err) {
            console.error('Could not make announcement: ', err);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred while sending your announcement.',
            });
            return null;
        }
    };

    const addAnnouncement = async () => {
        if (!input.trim()) {
            toast({ title: 'Message is Empty', variant: 'default' });
            return;
        }
        const message: string = input.trim();
        await postAnnouncement(ip, message);

        setInput('');
    };

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [announcementList]);

    return (
        <div className="py-2">
            <div ref={containerRef} className="max-h-72 gap-2 space-y-1 overflow-y-auto py-2">
                {announcementList.map((announcement, index) => (
                    <div key={index} className="rounded-lg border p-2 px-3">
                        <strong className="mr-2 text-sm">
                            {new Date(announcement.time).toLocaleTimeString()}:
                        </strong>
                        <span>{announcement.message}</span>
                    </div>
                ))}
            </div>
            <span className="flex items-center gap-1">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addAnnouncement();
                        }
                    }}
                    placeholder="Announcement ..."
                    className="h-fit w-full rounded-lg border-2 p-2"
                />
                <Button onClick={addAnnouncement}>
                    <Send />
                </Button>
            </span>
        </div>
    );
}
