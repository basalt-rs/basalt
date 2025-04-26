'use client';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Button } from './ui/button';
import { User, Sun, Moon, SunMoon, LogOut, Settings, Bell } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useRouter } from 'next/navigation';
import { useSetAtom, useAtom } from 'jotai';
import { tokenAtom } from '@/lib/services/auth';
import { RESET } from 'jotai/utils';
import { Editor } from './Settings';
import { announcementsAtom } from '@/lib/host-state';

export default function UserMenu() {
    const [announcementList, _setAnnouncementList] = useAtom(announcementsAtom);
    const [announcementsOpen, setAnnouncementsOpen] = useState(false);
    const { setTheme } = useTheme();
    const setToken = useSetAtom(tokenAtom);
    const router = useRouter();
    const [settingsOpen, setOpen] = useState(false);
    const logout = () => {
        setToken(RESET);
        router.replace('/');
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline">
                        <User />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setAnnouncementsOpen(true)}>
                            <Bell />
                            Announcements
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <SunMoon />
                                Theme
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => setTheme('light')}>
                                        <Sun className="pr-0.5" />
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                                        <Moon className="pr-0.5" />
                                        Dark
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => setOpen(true)}>
                            <Settings /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOut />
                            Log Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenuPortal>
            </DropdownMenu>

            <Dialog open={settingsOpen} onOpenChange={setOpen}>
                <DialogContent className="min-w-[600px] max-w-[40vw]">
                    <DialogHeader>
                        <DialogTitle className="flex justify-center">Settings</DialogTitle>
                    </DialogHeader>
                    <Editor />
                </DialogContent>
            </Dialog>

            <Dialog open={announcementsOpen} onOpenChange={setAnnouncementsOpen}>
                <DialogContent className="min-w-[600px] max-w-[40vw]">
                    <DialogHeader>
                        <DialogTitle className="flex justify-center">Announcements</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[50vh] space-y-4 overflow-y-auto">
                        {announcementList.length > 0 ? (
                            announcementList.map((announcement, index) => (
                                <div key={index} className="rounded-lg border bg-muted p-3">
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(announcement.time).toLocaleString()}
                                    </p>
                                    <p>{announcement.message}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground">
                                No announcements available.
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
