'use client';
import { useRef, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Timer from '@/components/Timer';
import CompetitorNavbar from '@/components/CompetitorNavbar';
import AnsiConvert from 'ansi-to-html';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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
import { QuestionResponse, SimpleOutput, Test, TestOutput, TestState } from '@/lib/types';
import {
    allQuestionsAtom,
    allStatesAtom,
    currQuestionAtom,
    currQuestionIdxAtom,
} from '@/lib/services/questions';
import { ExtractAtomValue, useAtom } from 'jotai';
import { Circle, FileDown, FlaskConical, Loader2, SendHorizonal, Upload } from 'lucide-react';
import { testColor } from '@/lib/utils';
import { Markdown } from '@/components/Markdown';
import { CodeBlock, Diff, Tooltip } from '@/components/util';
import { Button } from '@/components/ui/button';
import { currentTabAtom, inlineDiffAtom, useEditorContent, useTesting } from '@/lib/competitor-state';
import { toast } from '@/hooks/use-toast';
import { WithPauseGuard } from '@/components/PauseGuard';
import { useClock } from '@/hooks/use-clock';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface EditorButtons {
    isPaused: boolean;
}
const EditorButtons = ({ isPaused }: EditorButtons) => {
    const { setEditorContent } = useEditorContent();
    const fileUploadRef = useRef<HTMLInputElement>(null);
    const [currQuestion] = useAtom(currQuestionAtom);
    const { loading, runTests, submit } = useTesting();

    const notImplemented = () =>
        toast({
            title: 'Not Yet Implemented',
            description: 'Check back later!',
            variant: 'destructive',
        });

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
                    <Button
                        disabled={isPaused}
                        size="icon"
                        variant="ghost"
                        onClick={handleUploadBtnClick}
                    >
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
                    <Button size="icon" variant="ghost" onClick={notImplemented}>
                        <FileDown />
                    </Button>
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
                <Tooltip tooltip="Submit Solution">
                    <Button size="icon" variant="ghost" onClick={submit} disabled={!!loading}>
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

const TabContent = ({
    tab,
    isPaused,
}: {
    tab: ExtractAtomValue<typeof currentTabAtom>;
    isPaused: boolean;
}) => {
    switch (tab) {
        case 'text-editor':
            return (
                <div className="flex h-full flex-col">
                    <WithPauseGuard isPaused={isPaused}>
                        <EditorButtons isPaused={isPaused} />
                        <CodeEditor />
                    </WithPauseGuard>
                </div>
            );
        case 'leaderboard':
            return (
                <ScrollArea className="h-full w-full border">
                    <Leaderboard showTimer={false} />
                </ScrollArea>
            );
        default:
            return 'unreachable';
    }
};

const c = new AnsiConvert();
const convertAnsi = (x: string): string => {
    return c.toHtml(x);
};

const IncorrectOutput = ({ input, expected, actual }: { input: string; expected: string; actual: string; }) => {
    const [inline, setInline] = useAtom(inlineDiffAtom);
    return (
        <>
            <div className="flex flex-row justify-between w-full">
                <p className="text-xl pb-2">Incorrect output:</p>
                <span className="flex flex-row items-center gap-2">
                    <Switch checked={inline} onCheckedChange={setInline} />
                    <Label>Inline diff</Label>
                </span>
            </div>
            <div className="flex flex-row gap-4">
                {input && (
                    <div className="flex h-full flex-grow flex-col gap-2">
                        <b>Input</b>
                        <CodeBlock text={input} />
                    </div>
                )}
                <Diff left={expected} right={actual} inline={inline} />
            </div>
        </>
    );
};

const GeneralError = ({ error, output }: { error?: string; output: SimpleOutput }) => {
    return (
        <>
            {error &&
                <div>
                    <p className="text-xl pb-2">{error}</p>
                </div>}
            <div className="flex flex-row gap-4">
                <div className="flex h-full flex-grow flex-col gap-2">
                    <b>Standard Output</b>
                    <CodeBlock text={convertAnsi(output.stdout)} rawHtml={true} />
                </div>
                <div className="flex h-full flex-grow flex-col gap-2">
                    <b>Standard Error</b>
                    <CodeBlock text={convertAnsi(output.stderr)} rawHtml={true} />
                </div>
            </div>
        </>
    );
};

const TestDetails = ({ output, test }: { output: TestOutput; test: Test; }) => {
    if (output === 'Pass') {
        return <p>Pass</p>; // TODO
    }

    if (output.Fail === 'Timeout') {
        return <p>Solution timed out</p>; // TODO
    }

    if ('IncorrectOutput' in output.Fail) {
        return <IncorrectOutput input={test.input} expected={test.output} actual={output.Fail.IncorrectOutput.stdout} />
    }

    return <GeneralError error="Solution crashed" output={output.Fail.Crash} />
};

const SingleResult = ({ output, test, index }: { output: TestOutput; test: Test; index: number; }) => {
    const state = output === 'Pass' ? 'pass' : 'fail';
    return (
        <>
            <AccordionTrigger className="items-center justify-between px-8">
                <h1>
                    <b>Test Case {index + 1}</b>
                </h1>
                <h1 className={`flex items-center justify-center text-${state}`}>
                    <b>{state.toUpperCase()}</b>
                </h1>
            </AccordionTrigger>
            <AccordionContent className="px-8">
                <TestDetails output={output} test={test} />
            </AccordionContent>
        </>
    );
};

const TestResults = () => {
    const { testResults } = useTesting();
    if (testResults === null) return null;
    switch (testResults.kind) {
        case 'individual': {
            return (
                <>
                    <Progress value={testResults.percent} />
                    <Accordion type="single" collapsible>
                        {testResults.kind === 'individual' ?
                            testResults.tests?.map(([output, test], i) => (
                                <AccordionItem key={i} value={`test-${i}`}>
                                    <SingleResult output={output} test={test} index={i} />
                                </AccordionItem>
                            )) : []}
                    </Accordion>
                </>
            );
        }
        case 'internal-error': {
            return <p className="text-fail text-xl">There was an error running tests, please contact a competition host.</p>
        }
        case 'compile-fail': {
            return (
                <div className="p-8">
                    <p className="text-fail text-xl pb-2">Solution failed to compile</p>
                    <CodeBlock text={convertAnsi(testResults.stderr)} rawHtml={true} />
                </div>
            )
        }
        // unreachable
        default: return null;
    }
}

const TestResultsPanel = ({ isPaused }: { isPaused: boolean; }) => {
    const { loading } = useTesting();
    return (
        <WithPauseGuard isPaused={isPaused}>
            <div className="w-full">
                {loading
                    ? <Loader2 size={64} className="mx-auto my-4 animate-spin text-in-progress" />
                    : <TestResults />}
            </div>
        </WithPauseGuard>
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
    const [allStates] = useAtom(allStatesAtom);
    const { pause, unPause, isPaused } = useClock();
    const [currQuestion, setCurrQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [tab] = useAtom(currentTabAtom);
    const { loading, testResults } = useTesting();

    return (
        <div className="h-screen">
            <div>
                <CompetitorNavbar isPaused={isPaused} />
            </div>

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
                                <WithPauseGuard isPaused={isPaused}>
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
                                                        <div className="flex flex-row items-center">
                                                            <Circle
                                                                fill="currentColor"
                                                                className={`${testColor(allStates[i])} h-6 w-6 pr-2`}
                                                            />
                                                            {q.title}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <QuestionDetails question={currentQuestion} status="pass" />
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
                                </WithPauseGuard>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel className="">
                            <ResizablePanelGroup direction="vertical" className="h-full">
                                <ResizablePanel defaultSize={400} className="h-full">
                                    <TabContent isPaused={isPaused} tab={tab} />
                                </ResizablePanel>
                                <ResizableHandle />
                                {(loading || testResults) && (
                                    <ResizablePanel defaultSize={100} className="h-full">
                                        <ScrollArea className="h-full w-full">
                                            <TestResultsPanel isPaused={isPaused} />
                                        </ScrollArea>
                                    </ResizablePanel>
                                )}
                            </ResizablePanelGroup>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
}
