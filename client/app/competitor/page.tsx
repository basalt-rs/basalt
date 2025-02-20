'use client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Timer from '@/components/Timer';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import CompetitorNavbar, { tabChangeEmitter } from '@/components/CompetitorNavbar';
import { Textarea } from '@/components/ui/textarea';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Leaderboard from '../leaderboard/page';
import QuestionNavbar from './QuestionNavbar';

const TabContent = () => {
    const [selectedTab, setSelectedTab] = useState<'text-editor' | 'leaderboard'>('text-editor');

    useEffect(() => {
        tabChangeEmitter.on('tabChange', setSelectedTab);

        return () => {
            tabChangeEmitter.off('tabChange', setSelectedTab);
        };
    }, []);

    if (selectedTab === 'leaderboard') {
        return (
            <ScrollArea className="h-full w-full border">
                <Leaderboard showTimer={false} />
            </ScrollArea>
        );
    } else {
        return <Textarea />;
    }
};

// TODO: need to bring in Question Information from host component as am input for this func
const QuestionDetails = ({
    questionDetails,
}: {
    questionDetails: {
        question: string;
        description: string;
        input: string;
        output: string;
        status: string;
    };
}) => {
    const { question, description, input, output } = questionDetails;
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <h1>
                <b>Question Title</b>
            </h1>
            <h1>{question}</h1>
            <div>
                <p>{description}</p>

                <div className="flex flex-col gap-2">
                    <div>
                        <strong>Input</strong>
                        <pre className="rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                            {input}
                        </pre>
                    </div>
                    <div>
                        <strong>Output</strong>
                        <pre className="rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                            {output}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

// TODO: need to be able to grab info from the text editor and have this func take it as a param
const RunTest = () => {
    return (
        <div className="mx-4 flex w-full flex-col items-center gap-2">
            <Button variant="outline" className="h-12 w-full max-w-72">
                <b>Test</b>
            </Button>
            <Button variant="outline" className="h-12 w-full max-w-72">
                <b>Submit</b>
            </Button>
        </div>
    );
};

const TestResults = ({
    testData,
}: {
    testData: {
        input: string;
        output: string;
        failedOutput: string;
        expectedOutput: string;
    };
}) => {
    const { input, output, failedOutput, expectedOutput } = testData;
    return (
        <div className="w-full">
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="items-center justify-between px-8">
                        <h1>
                            <b>Test Case 1</b>
                        </h1>
                        <h1 className="flex items-center justify-center text-green-500">
                            <b>PASS</b>
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-row gap-4 px-8">
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Input</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {input}
                            </pre>
                        </div>
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Output</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {output}
                            </pre>
                        </div>
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Expected Output</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {expectedOutput}
                            </pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger className="items-center justify-between px-8">
                        <h1>
                            <b>Test Case 2</b>
                        </h1>
                        <h1 className="flex items-center justify-center text-red-700">
                            <b>FAIL</b>
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-row gap-[10vw] px-8">
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Input</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {input}
                            </pre>
                        </div>
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Output</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {failedOutput}
                            </pre>
                        </div>
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Expected Output</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {expectedOutput}
                            </pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger className="items-center justify-between px-8">
                        <h1>
                            <b>Test Case 3</b>
                        </h1>
                        <h1 className="flex items-center justify-center text-red-700">
                            <b>FAIL</b>
                        </h1>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-row gap-[10vw] px-8">
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Input</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {input}
                            </pre>
                        </div>
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Output</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {failedOutput}
                            </pre>
                        </div>
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Expected Output</b>
                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                                {expectedOutput}
                            </pre>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default function Competitor() {
    const [currentQuestion, setCurrentQuestion] = useState({
        question: 'Sort an Array of Integers',
        description: 'Sort an array of integers in ascending order and return it.',
        input: '2 11 15 0',
        output: '0 2 11 15',
        failedOutput: '2 0 11 15',
        expectedOutput: '0 2 11 15',
        status: 'complete',
    });

    return (
        <div className="h-screen">
            <div>
                <CompetitorNavbar />
            </div>

            <div className="flex h-[95vh]">
                <div className="flex-grow">
                    <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel
                            defaultSize={20}
                            maxSize={25}
                            className="border-black-300 h-full border-t"
                        >
                            <ResizablePanelGroup direction="vertical" className="h-full">
                                <div className="flex h-full flex-col pt-8">
                                    <div className="box-border flex flex-col p-4">
                                        <QuestionDetails questionDetails={currentQuestion} />
                                    </div>
                                    <div className="mt-auto flex w-full flex-row justify-center">
                                        <RunTest />
                                    </div>
                                    <div className="py-2.5">
                                        <Separator className="mb-2.5 mt-2.5" />
                                        <Timer isHost={false} startingTime={4500} isActive={true} />
                                    </div>
                                </div>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel className="">
                            <span className="max-w-screen w-full">
                                <QuestionNavbar setCurrentQuestion={setCurrentQuestion} />
                            </span>
                            <ResizablePanelGroup direction="vertical" className="h-full">
                                <ResizablePanel defaultSize={400} className="h-full">
                                    <div className="max-w-screen flex h-full">
                                        <TabContent />
                                    </div>
                                </ResizablePanel>
                                <ResizableHandle />
                                <ResizablePanel defaultSize={100} className="h-full">
                                    <ScrollArea className="h-full w-full">
                                        <div>
                                            <TestResults testData={currentQuestion} />
                                        </div>
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
