'use client';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentTabAtom } from '@/lib/competitor-state';
import { ExtractAtomValue, useAtom } from 'jotai';
import UserMenu from './UserMenu';

export default function CompetitorNavbar() {
    const [tab, setTab] = useAtom(currentTabAtom);

    return (
        <div className="item-center flex w-full justify-between p-1.5">
            <div className="flex w-1/5 justify-start">
                <p />
            </div>

            <NavigationMenu className="flex-grow">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Tabs
                            defaultValue="text-editor"
                            value={tab}
                            onValueChange={(t) =>
                                setTab(t as ExtractAtomValue<typeof currentTabAtom>)
                            }
                        >
                            <TabsList>
                                <TabsTrigger value="text-editor">Text Editor</TabsTrigger>
                                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>

            <div className="flex w-1/6 justify-end">
                <UserMenu />
            </div>
        </div>
    );
}
