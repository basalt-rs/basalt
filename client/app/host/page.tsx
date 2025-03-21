'use client';
import React, { useState, useEffect } from 'react';
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
import HostNavbar, { tabChangeEmitter } from '@/components/HostNavbar';
import TeamInspector from './TeamInspector';

export default function Host() {
    const [selectedTab, setSelectedTab] = useState<'questions' | 'teams'>('questions');
    const [tabChange, setTabChange] = useState<string | null>();
    const [selectedTeam, setSelectedTeam] = useState<{
        name: string;
        password: string;
        points: number;
        status: boolean;
    } | null>(null);
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
    const [teamList, setTeamList] = useState([
        { name: 'Team1', password: 'password1', points: 300, status: true },
        { name: 'Team2', password: 'password2', points: 126, status: true },
        { name: 'Team3', password: 'password3', points: 0, status: false },
        { name: 'Team4', password: 'password4', points: 299, status: true },
        { name: 'Team5', password: 'password5', points: 0, status: true },
        { name: 'Team6', password: 'password6', points: 5, status: false },
        { name: 'Team7', password: 'password7', points: 125, status: true },
    ]);

    useEffect(() => {
        tabChangeEmitter.on('tabChange', setSelectedTab);

        return () => {
            tabChangeEmitter.off('tabChange', setSelectedTab);
        };
    }, []);

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
                                                        setSelectedTab('teams');
                                                        setTabChange('teams');
                                                    }}
                                                >
                                                    Inspect
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
                    <HostNavbar tabUpdate={tabChange} />
                </span>

                <Separator />

                <div className="flex h-full w-full flex-col justify-start overflow-y-auto">
                    {selectedTab === 'questions' && (
                        <ul className="mt-2.5 flex flex-col">
                            <QuestionAccordion
                                questions={questions}
                                handleQuestionSwitch={handleQuestionSwitch}
                            />
                        </ul>
                    )}
                    {selectedTab === 'teams' && (
                        <div className="m-2.5 flex h-full max-h-full flex-col">
                            <TeamInspector
                                teams={teamList}
                                selectedTeam={selectedTeam}
                                setSelectedTeam={setSelectedTeam}
                            />
                        </div>
                    )}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
