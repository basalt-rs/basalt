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
import { Ellipsis, Copy } from 'lucide-react';
import Timer from '@/components/Timer';
import HostNavbar from '@/components/HostNavbar';
import TeamInspector from './TeamInspector';
import { useCurrentTeam, useTeamsAtom, useCurrentHostTab } from '@/lib/host-state';

export default function Host() {
    const [questions, setQuestions] = useState([
        {
            question: 'Sort an Array of Integers',
            description: 'Sort an array of integers in ascending order and return it.',
            languages: null,
            points: '10',
            tests: [
                { input: '2 11 15 0', output: '0 2 11 15' },
                { input: '0 11 2 15', output: '0 2 11 15' },
                { input: '15 11 2 0', output: '0 2 11 15' },
            ],
            enabled: true,
        },
        {
            question: 'Sort an Array of Characters Alphabetically',
            description:
                'Sort an array of characters alphabetically and return them as a single string.',
            languages: ['rs'],
            points: '15',
            tests: [
                { input: 'a e h f', output: 'aefh' },
                { input: 'd a l b', output: 'abdl' },
                { input: 'p y r g', output: 'gpry' },
            ],
            enabled: false,
        },
        {
            question: 'Hexadecimal in Reverse Order',
            description:
                'Convert characters to hexadecimal values and return them in reverse order.',
            languages: ['rs', 'java'],
            points: '25',
            tests: [
                { input: 'A B C D', output: '13 12 11 10' },
                { input: 'E D A C', output: '12 10 13 14' },
                { input: 'F A B E', output: '14 11 10 15' },
            ],
            enabled: true,
        },
    ]);
    const { teamList, setTeamList } = useTeamsAtom();
    const { setSelectedTeam } = useCurrentTeam();
    const { currentTab, setCurrentTab } = useCurrentHostTab();

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

    const handleQuestionSwitch = (question: string) => {
        setQuestions((prev) =>
            prev.map((q) => (q.question === question ? { ...q, enabled: !q.enabled } : q))
        );
    };

    return (
        <ResizablePanelGroup direction="horizontal" className="flex max-h-screen flex-grow">
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
                                className={`flex w-full justify-between p-1.5 ${team.status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-500'}`}
                                key={index}
                            >
                                <p className="w-1/2 truncate">{team.name}</p>
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

            <ResizablePanel
                className="flex min-h-screen w-full flex-col items-center"
                defaultSize={70}
            >
                <span className="flex w-full justify-start p-1.5">
                    <HostNavbar />
                </span>

                <Separator />

                <div className="flex h-full w-full flex-col justify-start overflow-y-auto">
                    {currentTab === 'questions' && (
                        <ul className="mt-2.5 flex flex-col">
                            <QuestionAccordion
                                questions={questions}
                                handleQuestionSwitch={handleQuestionSwitch}
                            />
                        </ul>
                    )}
                    {currentTab === 'teams' && (
                        <div className="m-2.5 flex h-full max-h-full flex-col">
                            <TeamInspector />
                        </div>
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
