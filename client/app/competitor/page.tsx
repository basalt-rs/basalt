'use client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Timer from '@/components/Timer';
import CompetitorNavbar from '@/components/CompetitorNavbar';
import { Textarea } from '@/components/ui/textarea';
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
    SelectGroup,
    SelectLabel,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Leaderboard from '../leaderboard/page';
import { QuestionResponse, TestState } from '@/lib/types';
import {
    allQuestionsAtom,
    allStatesAtom,
    currQuestionAtom,
    currQuestionIdxAtom,
} from '@/lib/services/questions';
import { ExtractAtomValue, useAtom } from 'jotai';
import { Circle, FileDown, FlaskConical, SendHorizonal, Upload } from 'lucide-react';
import { testColor } from '@/lib/utils';
import { Markdown } from '@/components/Markdown';
import { CodeBlock, Tooltip } from '@/components/util';
import { Button } from '@/components/ui/button';
import { currentTabAtom } from '@/lib/competitor-state';
import { toast } from '@/hooks/use-toast';

const EditorButtons = () => {
    const [currQuestion] = useAtom(currQuestionAtom);
    const notImplemented = () =>
        toast({
            title: 'Not Yet Implemented',
            description: 'Check back later!',
            variant: 'destructive',
        });
    return (
        <div className="flex flex-row items-center justify-between gap-3 border-t p-1">
            <div className="flex flex-row">
                <Tooltip tooltip="Load File">
                    <Button size="icon" variant="ghost" onClick={notImplemented}>
                        <Upload />
                    </Button>
                </Tooltip>
                <Tooltip tooltip="Download Packet">
                    <Button size="icon" variant="ghost" onClick={notImplemented}>
                        <FileDown />
                    </Button>
                </Tooltip>
            </div>
            <div className="flex flex-row">
                <Tooltip tooltip="Run Tests">
                    <Button size="icon" variant="ghost" onClick={notImplemented}>
                        <FlaskConical className="text-in-progress" />
                    </Button>
                </Tooltip>
                <Tooltip tooltip="Submit Solution">
                    <Button size="icon" variant="ghost" onClick={notImplemented}>
                        <SendHorizonal className="text-pass" />
                    </Button>
                </Tooltip>
                <span className="ml-auto">
                    <Select>
                        <SelectTrigger className="w-56" value={currQuestion.languages?.[0]}>
                            <SelectValue placeholder="Programming Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {currQuestion.languages?.map(l =>
                                <SelectItem key={l} value={l}>{l}</SelectItem>
                            )}
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
                    <Textarea className="flex-grow" />
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

const TestResults = () => {
    const [currQuestion] = useAtom(currQuestionAtom);
    return (
        <div className="w-full">
            <Accordion type="single" collapsible>
                {currQuestion.tests
                    .flatMap((t) => [t, t, t]) // TODO: remove flatmap once this uses the actual test output
                    .map((test, i) => (
                        <AccordionItem key={i} value={`test-${i}`}>
                            <AccordionTrigger className="items-center justify-between px-8">
                                <h1>
                                    <b>Test Case {i + 1}</b>
                                </h1>
                                <h1 className="flex items-center justify-center text-pass">
                                    <b>PASS</b>
                                </h1>
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-row gap-4 px-8">
                                {test.input && (
                                    <div className="flex h-full flex-grow flex-col gap-2">
                                        <b>Input</b>
                                        <CodeBlock text={test.input} />
                                    </div>
                                )}
                                <div className="flex h-full flex-grow flex-col gap-2">
                                    <b>Expected Output</b>
                                    <CodeBlock text={test.output} />
                                </div>
                                <div className="flex h-full flex-grow flex-col gap-2">
                                    <b>Actual Output</b>
                                    <CodeBlock text="Not yet implemented" />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
            </Accordion>
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
    const [allStates] = useAtom(allStatesAtom);
    const [currQuestion, setCurrQuestionIdx] = useAtom(currQuestionIdxAtom);
    const [tab] = useAtom(currentTabAtom);

    return (
        <div className="h-screen">
            <div>
                <CompetitorNavbar />
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
                                    <Timer isHost={false} startingTime={4500} isActive={true} />
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
                                <ResizablePanel defaultSize={100} className="h-full">
                                    <ScrollArea className="h-full w-full">
                                        <TestResults />
                                    </ScrollArea>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
}
