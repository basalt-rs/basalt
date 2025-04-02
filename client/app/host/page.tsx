'use client';
import React, { useState } from 'react';
import QuestionAccordion from './QuestionAccordion';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
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
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Copy, Wifi, WifiOff } from 'lucide-react';
import Timer from '@/components/Timer';
import HostNavbar from '@/components/HostNavbar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Host() {
    const [teamList, setTeamList] = useState([
        { name: 'Team1', password: 'password1', points: 300, status: true },
        { name: 'Team2', password: 'password2', points: 126, status: true },
        { name: 'Team3', password: 'password3', points: 0, status: false },
        { name: 'Team4', password: 'password4', points: 299, status: true },
        { name: 'Team5', password: 'password5', points: 0, status: true },
        { name: 'Team6', password: 'password6', points: 5, status: false },
        { name: 'Team7', password: 'password7', points: 125, status: true },
    ]);

    const disconnectAllTeams = () => {
        const updatedTeams = teamList.map((team) => ({
            ...team,
            status: false,
        }));
        setTeamList(updatedTeams);
    };

    const handleDisconnectTeam = (teamName: string) => {
        setTeamList((prev) =>
            prev.map((team) => (team.name === teamName ? { ...team, status: false } : team))
        );
        setSelectedTeam((prev) =>
            prev && prev.name === teamName ? { ...prev, status: false } : prev
        );
    };

    const handleRemoveTeam = (teamName: string) => {
        setTeamList((prev) => prev.filter((team) => team.name !== teamName));
    };

    return (
        <ResizablePanelGroup direction="horizontal" className="flex h-screen flex-grow">
            <ResizablePanel className="flex flex-col justify-center" defaultSize={30} maxSize={50}>
                <div className="flex h-fit items-center justify-between p-2">
                    <div />
                    <p className="text-2xl uppercase">Teams</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={disconnectAllTeams}>
                                Kick All
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Separator />
                <div className="flex flex-col gap-1.5 overflow-y-auto p-2.5">
                    {teamList
                        .sort((a, b) => b.points - a.points)
                        .map((team, index) => (
                            <span
                                className="flex w-full justify-between rounded border p-1.5"
                                key={index}
                            >
                                <p className="w-1/2 truncate">
                                    <span className="flex gap-1">
                                        {team.status ? (
                                            <Wifi className="text-green-500" />
                                        ) : (
                                            <WifiOff className="text-gray-300 dark:text-gray-500" />
                                        )}
                                        {team.name}
                                    </span>
                                </p>
                                <p>{team.points} pts</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="pr-0.5">
                                        <Ellipsis />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {team.status ? (
                                            <div>
                                                <DropdownMenuItem>Message</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedTeam(team);
                                                        setCurrentTab('teams');
                                                    }}
                                                >
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        Info
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(
                                                                        team.password
                                                                    );
                                                                    toast({
                                                                        title: 'Password Copied',
                                                                        description: `The password for '${team.name}' has been saved to your clipboard`,
                                                                        variant: 'default',
                                                                    });
                                                                }}
                                                            >
                                                                <Copy />
                                                                Copy Password
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDisconnectTeam(team.name)}
                                                >
                                                    Kick
                                                </DropdownMenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(
                                                            team.password
                                                        );
                                                        toast({
                                                            title: 'Password Copied',
                                                            description: `The password for '${team.name}' has been saved to your clipboard`,
                                                            variant: 'default',
                                                        });
                                                    }}
                                                >
                                                    <Copy />
                                                    Copy Password
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleRemoveTeam(team.name)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </div>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </span>
                        ))}
                </div>

                <div className="mb-2.5 mt-auto flex flex-col items-center justify-center">
                    <Separator className="mb-2.5" />
                    <Timer isHost={true} startingTime={4500} isActive={true} />
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={70} className="flex h-screen flex-col">
                <span className="flex w-full justify-start p-1.5">
                    <HostNavbar />
                </span>

                <Separator />

                <ScrollArea className="w-full flex-grow pt-2">
                    <QuestionAccordion />
                </ScrollArea>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
