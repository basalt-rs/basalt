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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useRouter } from 'next/navigation';
import { useSetAtom, useAtom } from 'jotai';
import { tokenAtom } from '@/lib/services/auth';
import { RESET } from 'jotai/utils';
import { Editor } from './Settings';
import { announcementsAtom } from '@/lib/services/announcement';
import { Separator } from './ui/separator';

export default function UserMenu() {
    const [announcementList] = useAtom(announcementsAtom);
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
            <div className="flex gap-1">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="w-9">
                            <Bell />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-[600px] max-w-[40vw]">
                        <p className="flex justify-center text-lg font-bold">Announcements</p>
                        <Separator className="my-1.5" />
                        <div className="max-h-[50vh] space-y-4 overflow-y-auto">
                            {announcementList.length > 0 ? (
                                [...announcementList].reverse().map((announcement, index) => (
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
                    </PopoverContent>
                </Popover>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="outline">
                            <User />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuContent>
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
            </div>
        </>
    );
}
