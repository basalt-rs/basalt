'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useTeams, useSelectedTeam } from '@/lib/host-state';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import TeamInfo from './TeamInfo';
import { Button } from '@/components/ui/button';

export default function TeamInspector() {
    const { teamList } = useTeams();
    const { selectedTeam, setSelectedTeam } = useSelectedTeam();

    return (
        <div className="flex flex-col">
            <div
                className={`flex h-full w-full flex-row items-center ${selectedTeam === null ? 'justify-end' : 'justify-between'}`}
            >
                {selectedTeam !== null && (
                    <Button variant="ghost" className="flex" onClick={() => setSelectedTeam(null)}>
                        <ArrowLeft />
                        View All Teams
                    </Button>
                )}
                <Select
                    value={selectedTeam?.name || ''}
                    onValueChange={(value) => {
                        const team = teamList.find((t) => t.name === value);
                        if (team) setSelectedTeam(team);
                    }}
                >
                    <SelectTrigger className="flex w-fit">
                        <SelectValue placeholder="Select A Team" />
                    </SelectTrigger>
                    <SelectContent>
                        {teamList.map((team, index) => (
                            <SelectItem value={team.name} key={index}>
                                <span className="flex gap-1">
                                    {team.status ? (
                                        <Wifi className="text-green-500" />
                                    ) : (
                                        <WifiOff className="text-gray-300 dark:text-gray-500" />
                                    )}
                                    {team.name}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-2" />
            <div>
                {selectedTeam === null ? (
                    <div className="flex w-full flex-col gap-1">
                        {teamList.map((team, index) => (
                            <Card
                                key={index}
                                className="cursor-pointer"
                                onClick={() => setSelectedTeam(team)}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            {team.status ? (
                                                <Wifi className="text-green-500" />
                                            ) : (
                                                <WifiOff className="text-gray-300 dark:text-gray-500" />
                                            )}
                                            {team.name}
                                        </span>
                                        {team.points}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <TeamInfo />
                )}
            </div>
        </div>
    );
}
