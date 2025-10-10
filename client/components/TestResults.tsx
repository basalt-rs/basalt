import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Diff } from './Diff';
import { CodeBlock } from './util';
import * as Accordion from './ui/accordion';
import * as Tabs from './ui/tabs';
import { inlineDiffAtom } from '@/lib/competitor-state';
import AnsiConvert from 'ansi-to-html';
import { useAtom } from 'jotai';
import { Check, Loader2, X } from 'lucide-react';
import { TestResults, TestResultState } from '@/lib/types';
import { useTesting } from '@/lib/services/testing';
import { currQuestionAtom } from '@/lib/services/questions';
import { useEffect, useState } from 'react';
import { formatDuration } from '@/lib/utils';

const c = new AnsiConvert();
const convertAnsi = (x: string): string => {
    return c.toHtml(x);
};

const InputOutput = ({
    input,
    expected,
    actual,
    useDiff = true,
}: {
    input: string;
    expected: string;
    actual: string;
    useDiff: boolean;
}) => {
    const [inline, setInline] = useAtom(inlineDiffAtom);
    return (
        <>
            {useDiff && (
                <div className="flex w-full flex-row justify-end">
                    <span className="flex flex-row items-center gap-2">
                        <Switch checked={inline} onCheckedChange={setInline} />
                        <Label>Inline diff</Label>
                    </span>
                </div>
            )}
            <div className="flex flex-row gap-6">
                {input && (
                    <div className="flex h-full flex-grow flex-col gap-2">
                        <b>Input</b>
                        <CodeBlock text={input} />
                    </div>
                )}
                {useDiff ? (
                    <Diff left={expected} right={actual} inline={inline} />
                ) : (
                    <>
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Expected Output</b>
                            <CodeBlock text={expected} />
                        </div>
                        <div className="flex h-full flex-grow flex-col gap-2">
                            <b>Actual Output</b>
                            <CodeBlock text={actual} />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

const stylisedState = (state: TestResultState) => {
    switch (state) {
        case 'pass': return 'Pass';
        case 'runtime-fail': return 'Failed at Runtime';
        case 'timed-out': return 'Timed Out';
        case 'incorrect-output': return 'Incorrect Output';
        default: throw new Error(`Unhandled stylisedState: '${state}'`);
    }
};

const OutputItem = ({ res, index }: { res: TestResults | null; index: number; }) => {
    const { testResults } = useTesting();
    const [currentQuestion] = useAtom(currQuestionAtom);

    return (
        <Accordion.AccordionItem value={`test-${index}`} disabled={res === null || testResults!.kind === 'submission'}>
            <Accordion.AccordionTrigger className="px-8" hideChevron={testResults?.kind === 'submission'}>
                <div className="items-center justify-between flex flex-row w-full">
                    <h1>
                        <b>Test Case {index + 1}</b>
                    </h1>
                    {
                        res === null
                            ? <Loader2 className="text-in-progress animate-spin" />
                            : res.state === 'pass'
                                ? <Check className="text-pass" />
                                : <p className="flex flex-row gap-4">
                                    {stylisedState(res.state)} <X className="text-fail" />
                                </p>
                    }
                </div>
            </Accordion.AccordionTrigger>
            <Accordion.AccordionContent className="px-8 pb-8">
                {res !== null && testResults!.kind === 'test' && (
                    <>
                        {res.exitStatus !== 0 && (
                            <p>
                                <span className="font-bold">Exit Status:</span> {res.exitStatus}
                            </p>
                        )}
                        <InputOutput
                            input={currentQuestion.tests[res.index].input}
                            expected={currentQuestion.tests[res.index].output}
                            actual={res.stdout}
                            useDiff={res.state !== 'pass'}
                        />
                        {res.stderr && (
                            <div className="pt-1 flex flex-col gap-1">
                                <p className="font-bold">Standard Error</p>
                                <CodeBlock text={convertAnsi(res.stderr)} rawHtml />
                            </div>
                        )}
                    </>
                )}
            </Accordion.AccordionContent>
        </Accordion.AccordionItem>
    );
};

export default function TestResultsComponent() {
    const { testResults } = useTesting();
    const [openAccordions, setOpenAccordions] = useState<string[]>([]);

    // This comonent is only rendered when testResults !== null
    if (testResults === null) throw new Error('Unreachable');

    useEffect(() => {
        // Collapse open accordions if they are loading
        setOpenAccordions(a => {
            if (testResults.resultState === 'compile-fail') return [];
            return a.filter(o => testResults.results[+o.split('-')[1]] !== null);
        })
    }, [testResults]);

    switch (testResults.resultState) {
        case 'test-complete':
        case 'partial-results': {
            const complete = testResults.resultState === 'test-complete';
            const compilerTab = complete && (testResults.compileStderr || testResults.compileStdout);
            const completed = testResults.results.reduce((p, c) => c === null ? p : p + 1, 0);
            return (
                <>
                    <Progress
                        value={completed / testResults.cases * 100}
                        color={testResults.kind === 'test' ? 'bg-in-progress/50' : 'bg-pass/50'}
                    />
                    <ScrollArea className="h-full w-full">
                        <Tabs.Tabs defaultValue="tests">
                            <div className="flex justify-between items-center py-2 px-4">
                                {testResults.kind === 'submission' && (
                                    <p className="flex flex-row gap-2">
                                        <span className="font-bold">Score:</span> {complete ? testResults.score : <Loader2 className="animate-spin" />}
                                    </p>
                                )}

                                <p className="flex flex-row gap-2">
                                    <span className="font-bold">Passed:</span>
                                    {
                                        complete ? testResults.passed : testResults.results.reduce((p, c) => c?.state === 'pass' ? p + 1 : p, 0)
                                    } / {
                                        complete ? testResults.passed + testResults.failed : testResults.cases
                                    }
                                </p>

                                <p className="flex flex-row gap-2">
                                    <span className="font-bold">Time Taken:</span> {complete
                                        ? formatDuration(testResults.timeTaken)
                                        : <Loader2 className="animate-spin" />
                                    }
                                </p>

                                {compilerTab
                                    && (
                                        <Tabs.TabsList>
                                            <Tabs.TabsTrigger value="tests">Tests</Tabs.TabsTrigger>
                                            <Tabs.TabsTrigger value="compiler-output">Compiler Output</Tabs.TabsTrigger>
                                        </Tabs.TabsList>
                                    )}
                            </div>
                            <Separator />
                            <Tabs.TabsContent value="tests" className="mt-0">
                                <Accordion.Accordion type="multiple" value={openAccordions} onValueChange={setOpenAccordions}>
                                    {testResults.results?.map((res, i) => (
                                        <OutputItem res={res} index={i} key={i} />
                                    ))}
                                </Accordion.Accordion>
                            </Tabs.TabsContent>
                            {complete && compilerTab && (
                                <Tabs.TabsContent value="compiler-output" className="gap-2 px-4">
                                    {testResults.compileStdout && (
                                        <div>
                                            <p className="font-bold">Compiler Standard Output</p>
                                            <CodeBlock text={convertAnsi(testResults.compileStdout)} rawHtml />
                                        </div>
                                    )}
                                    {testResults.compileStderr && (
                                        <div>
                                            <p className="font-bold">Compiler Standard Error</p>
                                            <CodeBlock text={convertAnsi(testResults.compileStderr)} rawHtml />
                                        </div>
                                    )}
                                </Tabs.TabsContent>
                            )}
                        </Tabs.Tabs>
                    </ScrollArea>
                </>
            );
        }
        case 'compile-fail': {
            return (
                <>
                    <Progress value={100} color="bg-fail/50" />
                    <ScrollArea className="h-full w-full">
                        <div className="px-8 py-8">
                            <p className="pb-2 text-2xl text-fail">Solution failed to compile</p>
                            <p>
                                <span className="font-bold">Exit Status:</span> {testResults.compileExitStatus}
                            </p>
                            {testResults.compileStdout && (
                                <div>
                                    <p className="font-bold">Standard Output</p>
                                    <CodeBlock text={convertAnsi(testResults.compileStdout)} rawHtml />
                                </div>
                            )}
                            {testResults.compileStderr && (
                                <div>
                                    <p className="font-bold">Standard Error</p>
                                    <CodeBlock text={convertAnsi(testResults.compileStderr)} rawHtml />
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </>
            );
        }
    }

};
