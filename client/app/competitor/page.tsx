'use client';
import { useEffect, useRef } from 'react';
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
import { ExtractAtomValue, useAtom, useSetAtom } from 'jotai';
import { FileDown, FlaskConical, Loader2, SendHorizonal, Upload } from 'lucide-react';
import { Markdown } from '@/components/Markdown';
import { CodeBlock, Tooltip } from '@/components/util';
import { Button } from '@/components/ui/button';
import { currentTabAtom, editorContentAtom, selectedLanguageAtom } from '@/lib/competitor-state';
import { WithPauseGuard } from '@/components/PauseGuard';
import { useClock } from '@/hooks/use-clock';
import { isTauri } from '@tauri-apps/api/core';
import Link from 'next/link';
import { ipAtom } from '@/lib/services/api';
import { download } from '@/lib/tauri';
import { TestResults } from '@/components/TestResults';
import { useTesting } from '@/lib/services/testing';
import { Status } from '@/components/Status';
import { useAnnouncements } from '@/lib/services/announcement';
import { ToastAction } from '@radix-ui/react-toast';
import QuestionAccordion from '../host/QuestionAccordion';
import { QuestionDetails } from '@/components/QuestionDetails';

const EditorButtons = () => {
    const setEditorContent = useSetAtom(editorContentAtom);
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [currQuestion] = useAtom(currQuestionAtom);
    const [ip] = useAtom(ipAtom);
    const { loading, runTests, submit } = useTesting();
    const { currentState } = useSubmissionStates();
    const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
    const setCurrQuestionIdx = useSetAtom(currQuestionIdxAtom);

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

    const submitSolution = () => {
        submit(<ToastAction altText="Next Question" onClick={() => setCurrQuestionIdx(n => n + 1)}>Next Question</ToastAction>);
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
                            {currentState?.state === 'pass'
                                ? <p>You&apos;ve already passed this question!</p>
                                : currentState && currentState.remainingAttempts !== null && (
                                    <p className={currentState.remainingAttempts === 0 ? 'text-fail' : ''}>
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
                        onClick={submitSolution}
                        disabled={!!loading || currentState?.state === 'pass' || currentState?.remainingAttempts === 0}
                    >
                        {loading === 'submit' ? (
                            <Loader2 className="animate-spin text-pass" />
                        ) : (
                            <SendHorizonal className="text-pass" />
                        )}
                    </Button>
                </Tooltip>
                <span className="ml-auto">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="Programming Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {currQuestion?.languages?.map((l) => (
                                <SelectItem key={l.name} value={l.name}>
                                    {l.name}
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
    const { loading, testResults, clearTestResults } = useTesting();
    const [currQuestionIdx] = useAtom(currQuestionIdxAtom);
    const prevIdx = useRef(currQuestionIdx);
    
    useEffect(() => {
        if (prevIdx.current !== currQuestionIdx) {
            clearTestResults();
            prevIdx.current = currQuestionIdx;
        }
    }, [currQuestionIdx, clearTestResults]);

    switch (tab) {
        case 'text-editor':
            return (

                <ResizablePanelGroup direction="vertical" className="h-full">
                    <ResizablePanel defaultSize={400} className="h-full">
                        <div className="flex h-full flex-col">
                            <EditorButtons />
                            <CodeEditor />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    {(loading || testResults) && (
                        <ResizablePanel
                            defaultSize={100}
                            minSize={10}
                            collapsible={true}
                            collapsedSize={0}
                            className="h-full">
                            <ScrollArea className="h-full w-full">
                                <TestResultsPanel />
                            </ScrollArea>
                        </ResizablePanel>
                    )}
                </ResizablePanelGroup>
            );
        case 'leaderboard':
            return (
                <ScrollArea className="h-full w-full border pt-4">
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

export default function Competitor() {
    const [currentQuestion] = useAtom(currQuestionAtom);
    const [allQuestions] = useAtom(allQuestionsAtom);
    const { allStates } = useSubmissionStates();
    const { pause, unPause, isPaused } = useClock();
    const [currQuestion, setCurrQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [tab] = useAtom(currentTabAtom);

    useAnnouncements();

    return (
        <div className="flex h-screen flex-col">
            <CompetitorNavbar />
            <WithPauseGuard isPaused={isPaused}>
                <div className="h-full">
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
                                        value={`${currQuestion}`}
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
                                        <QuestionDetails question={currentQuestion} />
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
                            <TabContent tab={tab} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </WithPauseGuard>
        </div>
    );
}
