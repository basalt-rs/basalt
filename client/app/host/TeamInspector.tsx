import { useAtom } from 'jotai';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { selectedQuestionAtom, teamsAtom, selectedTeamAtom, selectedTeamIdxAtom } from '@/lib/host-state';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import TeamInfo from './TeamInfo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function TeamInspector() {
    const [teamList] = useAtom(teamsAtom);
    const [selectedTeam] = useAtom(selectedTeamAtom);
    const [selectedTeamIdx, setSelectedTeamIdx] = useAtom(selectedTeamIdxAtom);
    const [selectedQuestion, setSelectedQuestion] = useAtom(selectedQuestionAtom);

    const back = () => {
        if (selectedQuestion !== null) {
            setSelectedQuestion(null);
        } else if (selectedTeam !== null) {
            setSelectedTeamIdx(-1);
        } else {
            throw 'unreachable';
        }
    };

    return (
        <div className="flex flex-grow flex-col">
            <div
                className={`flex flex-row items-center px-2 pt-2 ${selectedTeam === null ? 'justify-end' : 'justify-between'}`}
            >
                {selectedTeam !== null && (
                    <Button variant="ghost" className="flex" onClick={back}>
                        <ArrowLeft />
                        Back
                    </Button>
                )}
                <Select
                    value={selectedTeamIdx < 0 ? '' : `${selectedTeamIdx}`}
                    onValueChange={(value) => setSelectedTeamIdx(+value)}
                >
                    <SelectTrigger className="flex w-fit">
                        <SelectValue placeholder="Select A Team" />
                    </SelectTrigger>
                    <SelectContent>
                        {teamList.map((team, index) => (
                            <SelectItem value={`${index}`} key={index}>
                                <div className="flex gap-1">
                                    {team.status ? (
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
