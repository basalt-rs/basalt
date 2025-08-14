import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Moon, Sun, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function LeaderboardMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { setTheme } = useTheme();

    return (
        <div
            className={`duration-250 absolute right-0 top-0 pb-4 pl-4 pr-1 pt-1 transition-opacity ${
                isMenuOpen ? 'opacity-100' : 'opacity-0 hover:opacity-100'
            }`}
        >
            <DropdownMenu onOpenChange={setIsMenuOpen} open={isMenuOpen}>
                <DropdownMenuTrigger>
                    <Menu />
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
                    </DropdownMenuContent>
                </DropdownMenuPortal>
            </DropdownMenu>
        </div>
    );
}
