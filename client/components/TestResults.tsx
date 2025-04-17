import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CodeBlock, Diff } from './util';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { inlineDiffAtom } from '@/lib/competitor-state';
import AnsiConvert from 'ansi-to-html';
import { useAtom } from 'jotai';
import { Check, CircleX, Clock, TriangleAlert } from 'lucide-react';
import { SimpleOutput, Test, TestOutput } from '@/lib/types';
import { useTesting } from '@/lib/services/testing';

const c = new AnsiConvert();
const convertAnsi = (x: string): string => {
    return c.toHtml(x);
};

const IncorrectOutput = ({ input, expected, actual }: { input: string; expected: string; actual: string; }) => {
    const [inline, setInline] = useAtom(inlineDiffAtom);
    return (
        <>
            <div className="flex flex-row justify-between w-full">
                <h1 className="text-2xl flex items-center gap-2 py-2">
                    <CircleX className="text-fail" />
                    Incorrect Output
                </h1>
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
                {output.stdout &&
                    <div className="flex h-full flex-grow flex-col gap-2">
                        <b>Standard Output</b>
                        <CodeBlock text={convertAnsi(output.stdout)} rawHtml />
                    </div>
                }
                {output.stderr &&
                    <div className="flex h-full flex-grow flex-col gap-2">
                        <b>Standard Error</b>
                        <CodeBlock text={convertAnsi(output.stderr)} rawHtml />
                    </div>
                }
                {(!output.stdout && !output.stderr) && <p>No output</p>}
            </div>
        </>
    );
};

const TestDetails = ({ output, test }: { output: TestOutput; test: Test; }) => {
    if (output === 'Pass') {
        return (
            <h1 className="text-2xl flex items-center gap-2">
                <Check className="text-pass" />
                Test Passed!
            </h1>
        );
    }

    if (output.Fail === 'Timeout') {
        return (
            <h1 className="text-2xl flex gap-2 items-center">
                <Clock className="text-red" />
                Solution timed out
            </h1>
        );
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

export const TestResults = () => {
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
            return (
                <h1 className="w-full h-full justify-center text-2xl flex flex-col items-center">
                    <TriangleAlert className="text-fail my-4" size={72} />
                    There was an error running your {testResults.submitKind === 'test' ? 'test' : 'submission'}, please contact a competition host.
                </h1>
            );
        }
        case 'compile-fail': {
            return (
                <div className="p-8">
                    <p className="text-fail text-xl pb-2">Solution failed to compile</p>
                    <CodeBlock text={convertAnsi(testResults.stderr)} rawHtml />
                </div>
            )
        }
        case 'other-error': {
            return (
                <h1 className="text-2xl p-4">
                    <span className="text-fail">Submission Attempt Failed:</span> { testResults.message }
                </h1>
            );
        }
        default: throw 'unreachable';
    }
}
