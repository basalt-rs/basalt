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
import { currentHostTabAtom } from '@/lib/host-state';
import { toast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';

export default function HostNavbar() {
    const [currentTab, setCurrentTab] = useAtom(currentHostTabAtom);

    return (
        <div className="flex w-full justify-between">
            <span>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        toast({
                            title: 'Coming Soon',
                            description: 'This feature is coming soon!',
                            variant: 'destructive',
                        });
                    }}
                >
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
