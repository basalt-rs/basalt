'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Send, Wifi, WifiOff } from 'lucide-react';
import { useTeamsAtom, useCurrentTeam } from '@/lib/host-state';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export default function TeamInspector() {
    const { teamList } = useTeamsAtom();
    const { selectedTeam, setSelectedTeam } = useCurrentTeam();

    return (
        <div className="flex h-full w-full flex-col items-center">
            <Select
                value={selectedTeam?.name || ''}
                onValueChange={(value) => {
                    const team = teamList.find((t) => t.name === value);
                    if (team) setSelectedTeam(team);
                }}
            >
                <SelectTrigger className="flex w-fit">
                    <SelectValue placeholder="Select A Team">
                        {selectedTeam ? (
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
                        )}
                    </SelectValue>
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
                <Card className="flex h-full w-full flex-col">
                    <CardHeader className="w-full">
                        <CardTitle className="flex items-center justify-between text-2xl">
                            {selectedTeam.name}
                            {selectedTeam.status ? (
                                <p className="text-green-500">Connected</p>
                            ) : (
                                <p className="text-gray-300 dark:text-gray-500">Disconnected</p>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-full w-full flex-col gap-4 text-lg">
                        <span className="flex justify-between align-middle">
                            <p>
                                <strong>Points: </strong>
                                {selectedTeam.points}
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    toast({
                                        title: 'Coming Soon',
                                        description: 'This feature is coming soon!',
                                        variant: 'destructive',
                                    });
                                }}
                            >
                                Submission History
                            </Button>
                        </span>
                        <div className="flex h-full flex-col rounded border p-4">
                            <span className="mt-auto flex w-auto gap-1 align-middle">
                                <Input type="text" placeholder="Message..." />
                                <Button variant="secondary">
                                    <Send />
                                </Button>
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
