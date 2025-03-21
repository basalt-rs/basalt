'use client';
import UserMenu from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EventEmitter } from 'events';

const tabChangeEmitter = new EventEmitter();

interface HostNavbarProps {
    tabUpdate?: string | null;
}

export default function HostNavbar({ tabUpdate }: HostNavbarProps) {
    const [tabValue, setTabValue] = useState('questions');

    const handleTabChange = (value: string) => {
        setTabValue(value);
        tabChangeEmitter.emit('tabChange', value);
    };

    useEffect(() => {
        if (tabUpdate) {
            handleTabChange(tabUpdate);
        }
    }, [tabUpdate]);

    useEffect(() => {
        tabChangeEmitter.emit('tabChange', tabValue);
    }, [tabValue]);

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
                            <Tabs
                                defaultValue="text-editor"
                                value={tabValue}
                                onValueChange={handleTabChange}
                            >
                                <TabsList>
                                    <TabsTrigger value="questions">Questions</TabsTrigger>
                                    <TabsTrigger value="teams">Teams</TabsTrigger>
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

export { tabChangeEmitter };
