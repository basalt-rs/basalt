'use client';
import QuestionAccordion from './QuestionAccordion';
import { Separator } from '@/components/ui/separator';
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
import { Ellipsis, Wifi, WifiOff } from 'lucide-react';
import Timer from '@/components/Timer';
import HostNavbar from '@/components/HostNavbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSelectedTeamIdx, useCurrentHostTab } from '@/lib/host-state';
import TeamInspector from './TeamInspector';
import { useClock } from '@/hooks/use-clock';
import { useTeams } from '@/hooks/use-teams';

export default function Host() {
    const { teamsList: teamList } = useTeams();
    const { setSelectedTeamIdx } = useSelectedTeamIdx();
    const { currentTab, setCurrentTab } = useCurrentHostTab();
    const { isPaused, pause, unPause } = useClock();

    const handleDisconnectTeam = (_: string) => {
        // TODO(Jack): Add toast
        console.log('TOAST HERE');
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
                            <DropdownMenuItem disabled>Kick All</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Separator />
                <div className="flex flex-col gap-1.5 overflow-y-auto p-2.5">
                    {teamList
                        .sort((a, b) => b.score - a.score)
                        .map((team, index) => (
                            <span
                                className="flex w-full justify-between rounded border p-1.5"
                                key={index}
                            >
                                <p className="w-1/2 truncate">
                                    <span className="flex gap-1">
                                        {!team.disconnected &&
                                        (team.lastSeenMs
                                            ? Math.abs(Date.now() - team.lastSeenMs) < 45 * 1000
                                            : false) ? (
                                            <Wifi className="text-green-500" />
                                        ) : (
                                            <WifiOff className="text-gray-300 dark:text-gray-500" />
                                        )}
                                        {team.team}
                                    </span>
                                </p>
                                <p>{team.score} pts</p>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="pr-0.5">
                                        <Ellipsis />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {!team.disconnected &&
                                        (team.lastSeenMs
                                            ? Math.abs(Date.now() - team.lastSeenMs) < 45
                                            : false) ? (
                                            <div>
                                                <DropdownMenuItem>Message</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedTeamIdx(index);
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
                                                        <DropdownMenuSubContent />
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDisconnectTeam(team.team)}
                                                >
                                                    Kick
                                                </DropdownMenuItem>
                                            </div>
                                        ) : (
                                            <div>
                                                <DropdownMenuSeparator />
                                            </div>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </span>
                        ))}
                </div>

                <div className="mb-2.5 mt-auto flex flex-col items-center justify-center">
                    <Separator className="mb-2.5" />
                    <Timer isHost={true} isPaused={isPaused} onPlay={unPause} onPause={pause} />
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={70} className="flex h-screen flex-col">
                <span className="flex w-full justify-start p-1.5">
                    <HostNavbar />
                </span>

                <Separator />

                {currentTab === 'questions' ? (
                    <ScrollArea className="w-full flex-grow pt-2">
                        <QuestionAccordion />
                    </ScrollArea>
                ) : (
                    <ScrollArea className="w-full flex-grow pt-2">
                        <TeamInspector />
                    </ScrollArea>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
