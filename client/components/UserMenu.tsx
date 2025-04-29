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
import { useLogin } from '@/lib/services/auth';
import { Editor } from './Settings';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
    const { setTheme } = useTheme();
    const { logout } = useLogin();
    const router = useRouter();
    const [settingsOpen, setOpen] = useState(false);

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
                        <DropdownMenuItem onClick={() => { logout(); router.replace('/') }}>
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
