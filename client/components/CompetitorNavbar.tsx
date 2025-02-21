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
import { useState, useEffect } from 'react';
import { EventEmitter } from 'events';
import UserMenu from './UserMenu';

const tabChangeEmitter = new EventEmitter();

export default function CompetitorNavbar() {
    const [tabValue, setTabValue] = useState('text-editor');

    const handleTabChange = (value: string) => {
        setTabValue(value);
        tabChangeEmitter.emit('tabChange', value);
    };

    useEffect(() => {
        tabChangeEmitter.emit('tabChange', tabValue);
    }, [tabValue]);

    return (
        <div className="item-center flex min-w-full justify-between p-1.5">
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

            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Tabs
                            defaultValue="text-editor"
                            value={tabValue}
                            onValueChange={handleTabChange}
                        >
                            <TabsList>
                                <TabsTrigger value="text-editor">Text Editor</TabsTrigger>
                                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <UserMenu />
        </div>
    );
}

export { tabChangeEmitter };
