import { useAtom, useSetAtom } from 'jotai';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Plus, Wifi, WifiOff } from 'lucide-react';
import { currentHostTabAtom, selectedQuestionAtom } from '@/lib/host-state';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import TeamInfo from './TeamInfo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTeams } from '@/hooks/use-teams';
import * as Dialog from '@/components/ui/dialog';
import { useState } from 'react';
import AddTeamDialog from '@/components/AddTeamDialog';

export default function TeamInspector() {
    const { teamsList, selectedTeam, setSelectedTeam, setSelectedTeamById } = useTeams();
    const [selectedQuestion, setSelectedQuestion] = useAtom(selectedQuestionAtom);
    const [showAddTeam, setShowAddTeam] = useState(false);
    const setCurrentTab = useSetAtom(currentHostTabAtom);

    const back = () => {
        if (selectedQuestion !== null) {
            setSelectedQuestion(null);
        } else if (selectedTeam !== null) {
            setSelectedTeam(null);
        } else {
            throw 'unreachable';
        }
    };
    return (
        <div className="flex flex-grow flex-col">
            <div
                className={`flex flex-row items-center gap-2 px-2 pt-2 ${selectedTeam === null ? 'justify-end' : 'justify-between'}`}
            >
                {selectedTeam !== null && (
                    <Button variant="ghost" className="flex" onClick={back}>
                        <ArrowLeft />
                        Back
                    </Button>
                )}
                {selectedTeam === null && (
                    <Dialog.Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
                        <Dialog.DialogTrigger asChild>
                            <Button variant="outline" className="flex">
                                <Plus />
                                Add Team
                            </Button>
                        </Dialog.DialogTrigger>
                        <Dialog.DialogContent>
                            <Dialog.DialogHeader>
                                <Dialog.DialogTitle>Add Team</Dialog.DialogTitle>
                            </Dialog.DialogHeader>
                            <AddTeamDialog
                                afterSubmit={() => setShowAddTeam(false)}
                                onBulkGenChange={() => {
                                    setCurrentTab('gen');
                                    setShowAddTeam(false);
                                }}
                            />
                        </Dialog.DialogContent>
                    </Dialog.Dialog>
                )}
                <Select
                    value={selectedTeam ? selectedTeam.id : ''}
                    onValueChange={(value) => setSelectedTeamById(value)}
                >
                    <SelectTrigger className="flex w-fit">
                        <SelectValue placeholder="Select A Team" />
                    </SelectTrigger>
                    <SelectContent>
                        {teamsList.map((team) => (
                            <SelectItem value={team.id} key={team.id}>
                                <div className="flex gap-1">
                                    {!team.disconnected &&
                                    (team.lastSeenMs
                                        ? Math.abs(Date.now() - team.lastSeenMs) < 45 * 1000
                                        : false) ? (
                                        <Wifi className="text-green-500" />
                                    ) : (
                                        <WifiOff className="text-gray-300 dark:text-gray-500" />
                                    )}
                                    {team.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-2" />
            <div className="flex-grow p-2">
                {selectedTeam === null ? (
                    <div className="flex w-full flex-col gap-1">
                        {teamsList.map((team, index) => (
                            <Card
                                key={index}
                                className="cursor-pointer"
                                onClick={() => setSelectedTeam(team)}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span className="flex items-center gap-1">
                                            {!team.disconnected &&
                                            (team.lastSeenMs
                                                ? Math.abs(Date.now() - team.lastSeenMs) < 45 * 1000
                                                : false) ? (
                                                <Wifi className="text-green-500" />
                                            ) : (
                                                <WifiOff className="text-gray-300 dark:text-gray-500" />
                                            )}
                                            {team.name}
                                        </span>
                                        <p>{team.score} points</p>
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
