'use client';
import { useRef } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Timer from '@/components/Timer';
import CompetitorNavbar from '@/components/CompetitorNavbar';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Leaderboard from '@/components/Leaderboard';
import CodeEditor from '@/components/Editor';
import { QuestionResponse, TestState } from '@/lib/types';
import {
    allQuestionsAtom,
    currQuestionAtom,
    currQuestionIdxAtom,
    useSubmissionStates,
} from '@/lib/services/questions';
import { ExtractAtomValue, useAtom } from 'jotai';
import { FileDown, FlaskConical, Loader2, SendHorizonal, Upload } from 'lucide-react';
import { Markdown } from '@/components/Markdown';
import { CodeBlock, Tooltip } from '@/components/util';
import { Button } from '@/components/ui/button';
import { currentTabAtom, useEditorContent } from '@/lib/competitor-state';
import { WithPauseGuard } from '@/components/PauseGuard';
import { useClock } from '@/hooks/use-clock';
import { TestResults } from '@/components/TestResults';
import { useTesting } from '@/lib/services/testing';
import { Status } from '@/components/Status';
import { isTauri } from '@tauri-apps/api/core';
import Link from 'next/link';
import { ipAtom } from '@/lib/services/api';
import { download } from '@/lib/tauri';

const EditorButtons = () => {
    const { setEditorContent } = useEditorContent();
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [currQuestion] = useAtom(currQuestionAtom);
    const { loading, runTests, submit } = useTesting();
    const { currentState } = useSubmissionStates();
    const [ip] = useAtom(ipAtom);

    const downloadPdf = (ip: string) => {
        download(`${ip}/competition/packet`);
    };

    const handleUploadBtnClick = () => {
        fileUploadRef.current?.click();
    };

    const handleFileUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        const content = await file.text();
        setEditorContent(content);

        event.target.value = '';
    };

    return (
        <div className="flex flex-row items-center justify-between gap-3 border-t p-1">
            <div className="flex flex-row">
                <Tooltip tooltip="Load File">
                    <Button size="icon" variant="ghost" onClick={handleUploadBtnClick}>
                        <Upload />
                    </Button>
                </Tooltip>
                <input
                    ref={fileUploadRef}
                    type="file"
                    accept=".txt"
                    onChange={handleFileUploadChange}
                    className="hidden"
                />
                <Tooltip tooltip="Download Packet">
                    {isTauri() ? (
                        <Button size="icon" variant="ghost" onClick={() => downloadPdf(ip!)}>
                            <FileDown />
                        </Button>
                    ) : (
                        <Button size="icon" variant="ghost" asChild>
                            <Link href={`${ip}/competition/packet`} download>
                                <FileDown />
                            </Link>
                        </Button>
                    )}
                </Tooltip>
            </div>
            <div className="flex flex-row">
                <Tooltip tooltip="Run Tests">
                    <Button size="icon" variant="ghost" onClick={runTests} disabled={!!loading}>
                        {loading === 'test' ? (
                            <Loader2 className="animate-spin text-in-progress" />
                        ) : (
                            <FlaskConical className="text-in-progress" />
                        )}
                    </Button>
                </Tooltip>
                <Tooltip
                    tooltip={
                        <div className="text-center">
                            <p>Submit Solution</p>
                            {currentState && currentState.remainingAttempts !== null && (
                                <p
                                    className={
                                        currentState.remainingAttempts === 0 ? 'text-fail' : ''
                                    }
                                >
                                    {currentState.remainingAttempts}{' '}
                                    {currentState.remainingAttempts === 1 ? 'attempt' : 'attempts'}{' '}
                                    remaining
                                </p>
                            )}
                        </div>
                    }
                >
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={submit}
                        disabled={!!loading || currentState?.remainingAttempts === 0}
                    >
                        {loading === 'submit' ? (
                            <Loader2 className="animate-spin text-pass" />
                        ) : (
                            <SendHorizonal className="text-pass" />
                        )}
                    </Button>
                </Tooltip>
                <span className="ml-auto">
                    <Select>
                        <SelectTrigger className="w-56" defaultValue={currQuestion?.languages?.[0]}>
                            <SelectValue placeholder="Programming Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {currQuestion?.languages?.map((l) => (
                                <SelectItem key={l} value={l}>
                                    {l}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </span>
            </div>
        </div>
    );
};

const TabContent = ({ tab }: { tab: ExtractAtomValue<typeof currentTabAtom> }) => {
    switch (tab) {
        case 'text-editor':
            return (
                <div className="flex h-full flex-col">
                    <EditorButtons />
                    <CodeEditor />
                </div>
            );
        case 'leaderboard':
            return (
                <ScrollArea className="h-full w-full border pt-20">
                    <Leaderboard showTimer={false} />
                </ScrollArea>
            );
        default:
            return 'unreachable';
    }
};

const TestResultsPanel = () => {
    const { loading } = useTesting();
    return (
        <div className="w-full">
            {loading ? (
                <Loader2 size={64} className="mx-auto my-4 animate-spin text-in-progress" />
            ) : (
                <TestResults />
            )}
        </div>
    );
};

const QuestionDetails = ({
    question: { title, description, tests },
}: {
    question: QuestionResponse;
    status: TestState;
}) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="font-bold">{title}</h1>
            <div>
                <Markdown markdown={description || ''} />

                <h1 className="mt-2 w-full text-center font-bold">Example</h1>
                <div className="flex flex-col gap-2">
                    {tests[0].input && (
                        <div>
                            <strong>Input</strong>
                            <CodeBlock text={tests[0].input} />
                        </div>
                    )}
                    <div>
                        <strong>Output</strong>
                        <CodeBlock text={tests[0].output} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Competitor() {
    const [currentQuestion] = useAtom(currQuestionAtom);
    const [allQuestions] = useAtom(allQuestionsAtom);
    const { allStates } = useSubmissionStates();
    const { pause, unPause, isPaused } = useClock();
    const [currQuestion, setCurrQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [tab] = useAtom(currentTabAtom);
    const { loading, testResults } = useTesting();

    return (
        <div className="h-screen">
            <div>
                <CompetitorNavbar />
            </div>
            <WithPauseGuard isPaused={isPaused}>
                <div className="flex h-[95vh]">
                    <div className="flex-grow">
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel
                                defaultSize={35}
                                maxSize={55}
                                collapsible={true}
                                collapsedSize={0}
                                minSize={10}
                                className="border-black-300 h-full border-t"
                            >
                                <ResizablePanelGroup direction="vertical" className="h-full">
                                    <ScrollArea className="flex flex-grow flex-col items-center justify-center p-4">
                                        <Select
                                            defaultValue={`${currQuestion}`}
                                            onValueChange={(v) => setCurrQuestionIdx(+v)}
                                        >
                                            <SelectTrigger className="mx-auto my-2 w-1/2 max-w-56">
                                                <SelectValue placeholder="Select a Question..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {allQuestions.map((q, i) => (
                                                    <SelectItem key={i} value={`${i}`}>
                                                        <div className="flex flex-row items-center gap-2">
                                                            <Status status={allStates?.[i].state} />
                                                            {q.title}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {currentQuestion && (
                                            <QuestionDetails
                                                question={currentQuestion}
                                                status="pass"
                                            />
                                        )}
                                    </ScrollArea>
                                    <div className="py-2.5">
                                        <Separator className="mb-2.5 mt-2.5" />
                                        <Timer
                                            isHost={false}
                                            onPlay={unPause}
                                            onPause={pause}
                                            isPaused={isPaused}
                                        />
                                    </div>
                                </ResizablePanelGroup>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel className="">
                                <ResizablePanelGroup direction="vertical" className="h-full">
                                    <ResizablePanel defaultSize={400} className="h-full">
                                        <TabContent tab={tab} />
                                    </ResizablePanel>
                                    <ResizableHandle />
                                    {(loading || testResults) && (
                                        <ResizablePanel defaultSize={100} className="h-full">
                                            <ScrollArea className="h-full w-full">
                                                <TestResultsPanel />
                                            </ScrollArea>
                                        </ResizablePanel>
                                    )}
                                </ResizablePanelGroup>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </div>
            </WithPauseGuard>
        </div>
    );
}
