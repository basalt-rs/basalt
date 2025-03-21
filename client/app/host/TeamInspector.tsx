'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dispatch, SetStateAction } from 'react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dot } from 'lucide-react';
interface TeamInspectorProps {
    teams: {
        name: string;
        password: string;
        points: number;
        status: boolean;
    }[];
    selectedTeam?: {
        name: string;
        password: string;
        points: number;
        status: boolean;
    } | null;
    setSelectedTeam: Dispatch<
        SetStateAction<{ name: string; password: string; points: number; status: boolean } | null>
    >;
}

export default function TeamInspector({
    teams,
    selectedTeam,
    setSelectedTeam,
}: TeamInspectorProps) {
    const teamList = teams;
    return (
        <div className="flex h-full w-full flex-col items-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="w-fit" variant="outline">
                        {selectedTeam && (
                            <Dot
                                className={`${selectedTeam.status ? 'text-green-500' : 'text-gray-300 dark:text-gray-500'}`}
                            />
                        )}
                        {selectedTeam?.name || 'Select A Team'}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            setSelectedTeam(null);
                        }}
                    >
                        Select A Team
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {teamList.map((team, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => {
                                setSelectedTeam(team);
                            }}
                        >
                            <Dot
                                className={`${team.status ? 'text-green-500' : 'text-gray-300 dark:text-gray-500'}`}
                            />
                            {team.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
            {selectedTeam && (
                <Card className="mt-2 flex h-full w-full flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <p className="text-lg">{selectedTeam?.name}</p>
                            <p
                                className={`ml-auto ${selectedTeam.status ? 'text-green-500' : 'text-gray-300 dark:text-gray-500'}`}
                            >
                                {selectedTeam.status ? 'Connected' : 'Disconnected'}
                            </p>
                        </CardTitle>
                        <CardContent className="flex flex-col">
                            <Separator className="my-1" />
                            <p>
                                <strong>points:</strong> {selectedTeam.points}
                            </p>
                        </CardContent>
                    </CardHeader>
                </Card>
            )}
        </div>
    );
}
