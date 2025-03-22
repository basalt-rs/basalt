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

export default function HostNavbar() {
    const { currentTab, setCurrentTab } = useCurrentHostTab();

    return (
        <div className="flex w-full justify-between">
            <span>
                <Button size="icon" variant="ghost">
                    <FileDown />
                </Button>
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
