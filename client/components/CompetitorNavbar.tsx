'use client';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentTabAtom } from '@/lib/competitor-state';
import { ExtractAtomValue, useAtom } from 'jotai';
import UserMenu from './UserMenu';

export default function CompetitorNavbar() {
    const [tab, setTab] = useAtom(currentTabAtom);

    return (
        <div className="item-center flex w-full justify-between p-1.5">
            <div className="flex w-1/6">
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>Import File</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Edit</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>Undo</MenubarItem>
                            <MenubarItem>Redo</MenubarItem>
                            <MenubarItem>Cut</MenubarItem>
                            <MenubarItem>Copy</MenubarItem>
                            <MenubarItem>Paste</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Team</MenubarTrigger>
                        <MenubarContent>
                            <MenubarRadioGroup>
                                <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                                <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                                <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
                            </MenubarRadioGroup>
                            <MenubarSeparator />
                            <MenubarItem inset>Edit</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem inset>Add Team Member</MenubarItem>
                            <MenubarItem inset>Contact Instructor</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
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
