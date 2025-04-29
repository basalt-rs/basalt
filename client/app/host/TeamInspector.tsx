'use client';

import { useAtom } from 'jotai';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { teamsAtom, selectedTeamAtom, selectedTeamIdxAtom } from '@/lib/host-state';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import TeamInfo from './TeamInfo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function TeamInspector() {
    const [teamList, _setTeamList] = useAtom(teamsAtom);
    const [selectedTeam, _setSelectedTeam] = useAtom(selectedTeamAtom);
    const [_selectedTeamIdx, setSelectedTeamIdx] = useAtom(selectedTeamIdxAtom);

    return (
        <div className="flex flex-col">
            <div
                className={`flex h-full w-full flex-row items-center px-2 ${selectedTeam === null ? 'justify-end' : 'justify-between'}`}
            >
                {selectedTeam !== null && (
                    <Button variant="ghost" className="flex" onClick={() => setSelectedTeamIdx(-1)}>
                        <ArrowLeft />
                        View All Teams
                    </Button>
                )}
                <Select
                    value={selectedTeam?.name || ''}
                    onValueChange={(value) => setSelectedTeamIdx(+value)}
                >
                    <SelectTrigger className="flex w-fit">
                        <SelectValue placeholder="Select A Team">
                            {selectedTeam === null ? (
                                ''
                            ) : (
                                <span className="flex gap-1">
                                    {selectedTeam.status ? (
                                        <Wifi className="text-green-500" />
                                    ) : (
                                        <WifiOff className="text-gray-300 dark:text-gray-500" />
                                    )}
                                    {selectedTeam.name}
                                </span>
                            )}
                            {selectedTeam?.name || 'Select A Team'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {teamList.map((team, index) => (
                            <SelectItem value={`${index}`} key={index}>
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
            <div className="p-2">
                {selectedTeam === null ? (
                    <div className="flex w-full flex-col gap-1">
                        {teamList.map((team, index) => (
                            <Card
                                key={index}
                                className="cursor-pointer"
                                onClick={() => setSelectedTeamIdx(index)}
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
                                        <p>{team.points} points</p>
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
