'use client';
import UserMenu from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentHostTab } from '@/lib/host-state';
import { Tooltip } from './util';
import { useAtom } from 'jotai';
import { ipAtom } from '@/lib/services/api';
import { download } from '@/lib/tauri';
import { isTauri } from '@tauri-apps/api/core';
import Link from 'next/link';

export default function HostNavbar() {
    const { currentTab, setCurrentTab } = useCurrentHostTab();
    const [ip] = useAtom(ipAtom);

    const downloadPdf = (ip: string) => {
        download(`${ip}/competition/packet`);
    };

    return (
        <div className="flex w-full justify-between">
            <span>
                <Tooltip tooltip="Download Packet">
                    {isTauri() ? (
                        <Button size="icon" variant="ghost" onClick={() => downloadPdf(ip!)}>
                            <FileDown />
                        </Button>
                    ) : (
                        <Button size="icon" variant="ghost" asChild>
                            <Link href={`${ip}/competition/packet`} download>
                                <FileDown />
                            </Link>
                        </Button>
                    )}
                </Tooltip>
            </span>
            <span>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Tabs defaultValue="text-editor" value={currentTab}>
                                <TabsList>
                                    <TabsTrigger
                                        value="questions"
                                        onClick={() => setCurrentTab('questions')}
                                    >
                                        Questions
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="teams"
                                        onClick={() => setCurrentTab('teams')}
                                    >
                                        Teams
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </span>
            <span>
                <UserMenu />
            </span>
        </div>
    );
}
