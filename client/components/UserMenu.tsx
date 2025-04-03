'use client';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Button } from './ui/button';
import { User, Sun, Moon, SunMoon, LogOut, Settings } from 'lucide-react';
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
import { useSetAtom } from 'jotai';
import { tokenAtom } from '@/lib/services/auth';
import { RESET } from 'jotai/utils';
import { Editor } from './Settings';

export default function UserMenu() {
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
        </>
    );
}
