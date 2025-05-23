'use client';
import QuestionAccordion from './QuestionAccordion';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAtom } from 'jotai';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis, Loader2, Wifi, WifiOff } from 'lucide-react';
import Timer from '@/components/Timer';
import HostNavbar from '@/components/HostNavbar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { currentHostTabAtom } from '@/lib/host-state';
import TeamInspector from './TeamInspector';
import { useClock } from '@/hooks/use-clock';
import { useWebSocket } from '@/lib/services/ws';
import { useEffect } from 'react';
import { ipAtom } from '@/lib/services/api';
import { tokenAtom } from '@/lib/services/auth';
import AnnouncementForm from './AnnoucementForm';
import { useAnnouncements } from '@/lib/services/announcement';
import { useTeams } from '@/hooks/use-teams';
import { TeamInfo } from '@/lib/services/teams';
import Leaderboard from '@/components/Leaderboard';

export default function Host() {
    const { teamsList, setSelectedTeam, isLoading } = useTeams();
    const [currentTab, setCurrentTab] = useAtom(currentHostTabAtom);
    const { isPaused, pause, unPause } = useClock();
    const { establishWs } = useWebSocket();
    const [ip] = useAtom(ipAtom);
    const [token] = useAtom(tokenAtom);

    useEffect(() => {
        if (ip && token) establishWs(ip, token);
    }, [establishWs, ip, token]);

    useAnnouncements();

    const notYetImplemented = () =>
        toast({
            title: 'Not Yet Implemented',
            description: 'Check back later!',
            variant: 'destructive',
        });

    const disconnectAllTeams = () => {
        notYetImplemented();
    };

    const handleDisconnectTeam = (_: TeamInfo) => {
        notYetImplemented();
    };

    const handleRemoveTeam = (_: TeamInfo) => {
        notYetImplemented();
    };

    return (
        <ResizablePanelGroup direction="horizontal" className="flex h-screen flex-grow">
            <ResizablePanel className="flex flex-col justify-between" defaultSize={30} maxSize={50}>
                <div>
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
                    {isLoading && (
                        <div className="flex flex-col items-center pt-4">
                            <Loader2 className="animate-spin" />
                        </div>
                    )}
                    <div className="flex max-h-[45vh] flex-col gap-1.5 space-y-1 overflow-y-auto overflow-x-hidden p-2.5">
                        {teamsList
                            .sort((a, b) => b.score - a.score || a.team.localeCompare(b.team))
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
                                                ? Math.abs(Date.now() - team.lastSeenMs) < 45 * 1000
                                                : false) ? (
                                                <div>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedTeam(team);
                                                            setCurrentTab('teams');
                                                        }}
                                                    >
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDisconnectTeam(team)}
                                                    >
                                                        Kick
                                                    </DropdownMenuItem>
                                                </div>
                                            ) : (
                                                <div>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleRemoveTeam(team)}
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
                </div>
                <div>
                    <div className="flex h-72 flex-col justify-end">
                        <AnnouncementForm />
                    </div>
                    <Separator className="mb-2.5" />
                    <span className="mb-2.5 flex flex-col items-center justify-center">
                        <Timer isHost={true} isPaused={isPaused} onPlay={unPause} onPause={pause} />
                    </span>
                </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={70} className="flex h-screen flex-col">
                <span className="flex w-full justify-start p-1.5">
                    <HostNavbar />
                </span>

                <Separator />

                {currentTab === 'questions' && (
                    <ScrollArea className="w-full flex-grow pt-2">
                        <QuestionAccordion />
                    </ScrollArea>
                )}

                {currentTab === 'teams' && <TeamInspector />}

                {currentTab === 'leaderboard' && <Leaderboard />}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
