import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks';
import { Send } from 'lucide-react';
import { announcementAtom } from '@/lib/host-state';
import { useAtom } from 'jotai';
import { useState, useRef } from 'react';

export default function AnnouncementForm() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [announcementList, setAnnouncementList] = useAtom(announcementAtom);
    const { toast } = useToast();
    const [input, setInput] = useState('');

    const addAnnouncement = () => {
        if (!input.trim()) {
            toast({ title: 'Message is Empty', variant: 'default' });
            return;
        }

        const newAnnouncement = {
            timestamp: new Date().toISOString(),
            message: input.trim(),
        };

        setAnnouncementList((prev) => [...prev, newAnnouncement]);
        toast({ title: 'Announcement Posted!', variant: 'default' });
        setInput('');

        setTimeout(() => {
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }, 0);
    };

    return (
        <div className="py-2">
            <div
                ref={containerRef}
                className="max-h-72 gap-2 space-y-1 overflow-y-auto overflow-x-hidden py-2"
            >
                {announcementList.map((announcement, index) => (
                    <div key={index} className="rounded-lg border p-2 px-3">
                        <strong className="mr-2 text-sm">
                            {new Date(announcement.timestamp).toLocaleTimeString()}:
                        </strong>
                        <span>{announcement.message}</span>
                    </div>
                ))}
            </div>
            <span className="flex items-center gap-1">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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
