import { CodeViewer } from '@/components/CodeViewer';
import { Elapsed } from '@/components/Elapsed';
import { Status } from '@/components/Status';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip } from '@/components/util';
import {
    getHistory,
    selectedQuestionAtom,
    selectedTeamSubmissionsAtom,
    useSubmissionHistory,
} from '@/lib/host-state';
import { ipAtom } from '@/lib/services/api';
import { tokenAtom } from '@/lib/services/auth';
import { allQuestionsAtom } from '@/lib/services/questions';
import { useWebSocket } from '@/lib/services/ws';
import { atom, useAtom } from 'jotai';
import { ArrowRight, Loader, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { selectedTeamAtom } from '@/lib/host-state';

const formatScore = (score: number): string => {
    const s = score % 1 ? score.toFixed(2) : score.toLocaleString();
    return s + ' ' + (score === 1 ? 'point' : 'points');
};

const selectedItemAtom = atom(0);
const HistoryTitle = () => {
    const [questions] = useAtom(allQuestionsAtom);
    const [selectedQuestion] = useAtom(selectedQuestionAtom);
    const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom);
    const [history, setHistory] = useSubmissionHistory();
    const [loading, setLoading] = useState(false);
    const [selectedTeam] = useAtom(selectedTeamAtom);
    const [token] = useAtom(tokenAtom);
    const [ip] = useAtom(ipAtom);
    const [ws] = useWebSocket();

    if (selectedQuestion === null || history === null) {
        return <h1 className="pb-4 text-2xl font-bold">Submission History</h1>;
    }

    const refresh = async () => {
        setLoading(true);
        if (ip) setHistory(await getHistory(ip, selectedTeam, selectedQuestion, token));
        setLoading(false);
    };

    ws.registerEvent(
        'team-update',
        (_) => {
            refresh();
            setSelectedItem((i) => i + 1);
        },
        'submission-history'
    );

    return (
        <h1 className="flex flex-row justify-between pb-4 text-2xl font-bold">
            <span className="flex gap-2">
                Submission History - {questions[selectedQuestion].title}
                <Tooltip tooltip="Refresh">
                    <Button size="icon" variant="ghost" onClick={refresh}>
                        <RefreshCw className={loading ? 'animate-spin' : ''} />
                    </Button>
                </Tooltip>
            </span>
            <span>
                {history[selectedItem] ? (
                    formatScore(history[selectedItem].score)
                ) : (
                    <Loader className="animate-spin" />
                )}
            </span>
        </h1>
    );
};

const SubmissionHistory = () => {
    const [history] = useSubmissionHistory();
    const [selectedItem, setSelectedItem] = useAtom(selectedItemAtom);

    if (!history) return null;

    return (
        <div className="flex flex-grow flex-row gap-2">
            <ScrollArea className="w-1/4">
                <div className="flex w-full flex-col gap-1">
                    {history.map((h, i) => (
                        <Button
                            key={i}
                            variant={selectedItem === i ? 'secondary' : 'ghost'}
                            onClick={() => setSelectedItem(i)}
                        >
                            <span className="flex w-full flex-row items-center justify-between">
                                <span className="flex flex-row gap-2">
                                    <Status status={h.success ? 'pass' : 'fail'} />
                                    Submission {history.length - i}
                                </span>
                                <Elapsed time={h.time} />
                            </span>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
            <div className="h-full flex-grow">
                <CodeViewer code={history[selectedItem]?.code} className="rounded-md" />
            </div>
        </div>
    );
};

export default function TeamInfo() {
    const [questions] = useAtom(allQuestionsAtom);
    const [selectedQuestion, setSelectedQuestion] = useAtom(selectedQuestionAtom);
    const [selectedTeamSubmissions] = useAtom(selectedTeamSubmissionsAtom);
    const [selectedTeam] = useAtom(selectedTeamAtom);

    return (
        selectedTeam !== null && (
            <div className="flex h-full w-full flex-col gap-4 p-4">
                <div className="flex items-center justify-between font-bold">
                    <div className="flex flex-col">
                        <p className="text-2xl">{selectedTeam.name}</p>
                        <p>
                            <strong>Points: </strong>
                            {selectedTeam.points}
                        </p>
                    </div>
                    {selectedTeam.status ? (
                        <p className="text-2xl text-green-500">Connected</p>
                    ) : (
                        <p className="text-2xl text-gray-300 dark:text-gray-500">Disconnected</p>
                    )}
                </div>
                <div className="flex flex-grow flex-col">
                    <HistoryTitle />
                    {selectedQuestion === null ? (
                        <div className="flex w-full flex-col gap-1 py-2">
                            {questions.map((q, i) => (
                                <Tooltip
                                    key={i}
                                    tooltip="This question has not been attempted"
                                    disabled={selectedTeamSubmissions[i].state !== 'not-attempted'}
                                >
                                    <Card
                                        className={
                                            selectedTeamSubmissions[i].state === 'not-attempted'
                                                ? 'cursor-not-allowed text-muted-foreground'
                                                : 'cursor-pointer hover:bg-muted/20 hover:underline'
                                        }
                                        onClick={
                                            selectedTeamSubmissions[i].state === 'not-attempted'
                                                ? () => {}
                                                : () => setSelectedQuestion(i)
                                        }
                                    >
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                {q.title}
                                                <span className="flex w-72 flex-row justify-between gap-2">
                                                    <Status
                                                        status={selectedTeamSubmissions[i].state}
                                                        showLabel
                                                    />
                                                    <ArrowRight />
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                    </Card>
                                </Tooltip>
                            ))}
                        </div>
                    ) : (
                        <SubmissionHistory />
                    )}
                </div>
            </div>
        )
    );
}
