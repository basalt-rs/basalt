import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Diff } from './Diff';
import { CodeBlock } from './util';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { inlineDiffAtom } from '@/lib/competitor-state';
import AnsiConvert from 'ansi-to-html';
import { useAtom } from 'jotai';
import { Check, CircleX, Clock, Loader2, TriangleAlert, X } from 'lucide-react';
import { Test, TestResults, TestResultState } from '@/lib/types';
import { useTesting } from '@/lib/services/testing';
import { currQuestionAtom } from '@/lib/services/questions';

const c = new AnsiConvert();
const convertAnsi = (x: string): string => {
    return c.toHtml(x);
};

const IncorrectOutput = ({
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
            <div className="flex flex-row gap-4">
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
        case 'runtime-fail': return 'Runtime Fail';
        case 'timed-out': return 'Timed Out';
        case 'incorrect-output': return 'Incorrect Output';
        default: throw new Error(`Unhandled stylisedState: '${state}'`);
    }
};

const OutputItem = ({ res, index }: { res: TestResults | null; index: number; }) => {
    const [currentQuestion] = useAtom(currQuestionAtom);

    return (
        <AccordionItem value={`test-${index}`} disabled={res === null}>
            <AccordionTrigger className="px-8">
                <div className="items-center justify-between pr-8 flex flex-row w-full">
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
            </AccordionTrigger>
            <AccordionContent className="px-8">
                {res !== null && (
                    <>
                        {res.exitStatus !== 0 && (
                            <p>
                                <span className="font-bold">Exit Status:</span> {res.exitStatus}
                            </p>
                        )}
                        <IncorrectOutput
                            input={currentQuestion.tests[res.index].input}
                            expected={currentQuestion.tests[res.index].output}
                            actual={res.stdout}
                            useDiff={res.state !== 'pass'}
                        />
                        {res.stderr && (
                            <div>
                                <p className="font-bold">Standard Error</p>
                                <CodeBlock text={convertAnsi(res.stderr)} rawHtml />
                            </div>
                        )}
                    </>
                )}
            </AccordionContent>
        </AccordionItem>
    );
};

export const TestResultsComp = () => {
    const { testResults } = useTesting();

    if (testResults === null) throw new Error('Unreachable');

    switch (testResults.resultState) {
        case 'partial-results': {
            return (
                <>
                    <Progress
                        value={
                            testResults.results.reduce((p, c) => c === null ? p : p + 1, 0)
                            / testResults.results.length
                            * 100
                        }
                        color={
                            testResults.kind === 'test' ? 'bg-in-progress/50' : 'bg-pass/50'
                        }
                    />
                    <Accordion type="multiple">
                        {testResults.results?.map((res, i) => (
                            <OutputItem res={res} index={i} key={i} />
                        ))}
                    </Accordion>
                </>
            );
        }
        case 'compile-fail': {
            return (
                <>
                    <Progress value={100} color="bg-fail/50" />
                    <div className="px-8 py-2">
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
                </>
            );
        }
    }

};
