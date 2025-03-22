'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Wifi, WifiOff } from 'lucide-react';
import { useTeamsAtom, useCurrentTeam } from '@/lib/host-state';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function TeamInspector() {
    const { teamList } = useTeamsAtom();
    const { selectedTeam, setSelectedTeam } = useCurrentTeam();

    return (
        <div className="flex h-full w-full flex-col items-center">
            <Select
                onValueChange={(value) =>
                    setSelectedTeam(teamList.find((team) => team.name === value) || null)
                }
            >
                <SelectTrigger className="flex w-fit">
                    <SelectValue
                        placeholder={
                            selectedTeam ? (
                                <span className="flex gap-1">
                                    {selectedTeam.status ? (
                                        <Wifi className="text-green-500" />
                                    ) : (
                                        <WifiOff className="text-gray-300 dark:text-gray-500" />
                                    )}
                                    {selectedTeam.name}
                                </span>
                            ) : (
                                'Select A Team'
                            )
                        }
                    />
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
            <Separator className="my-2" />
            {selectedTeam && (
                <Card className="flex h-full w-full">
                    <CardHeader className="w-full">
                        <CardTitle className="flex justify-between">
                            {selectedTeam.name}
                            {selectedTeam.status ? (
                                <p className="text-green-500">Connected</p>
                            ) : (
                                <p className="text-gray-300 dark:text-gray-500">Disconnected</p>
                            )}
                        </CardTitle>
                    </CardHeader>
                </Card>
            )}
        </div>
    );
}
