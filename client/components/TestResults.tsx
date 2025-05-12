import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Diff } from './Diff';
import { CodeBlock } from './util';
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

const IncorrectOutput = ({
    input,
    expected,
    actual,
}: {
    input: string;
    expected: string;
    actual: string;
}) => {
    const [inline, setInline] = useAtom(inlineDiffAtom);
    return (
        <>
            <div className="flex w-full flex-row justify-between">
                <h1 className="flex items-center gap-2 py-2 text-2xl">
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
            {error && (
                <div>
                    <p className="pb-2 text-xl">{error}</p>
                </div>
            )}
            <div className="flex flex-row gap-4">
                {output.stdout && (
                    <div className="flex h-full flex-grow flex-col gap-2">
                        <b>Standard Output</b>
                        <CodeBlock text={convertAnsi(output.stdout)} rawHtml />
                    </div>
                )}
                {output.stderr && (
                    <div className="flex h-full flex-grow flex-col gap-2">
                        <b>Standard Error</b>
                        <CodeBlock text={convertAnsi(output.stderr)} rawHtml />
                    </div>
                )}
                {!output.stdout && !output.stderr && <p>No output</p>}
            </div>
        </>
    );
};

const TestDetails = ({ output, test }: { output: TestOutput; test: Test }) => {
    if (output.kind === 'pass') {
        return (
            <h1 className="flex items-center gap-2 text-2xl">
                <Check className="text-pass" />
                Test Passed!
            </h1>
        );
    }

    if (output.reason === 'timeout') {
        return (
            <h1 className="flex items-center gap-2 text-2xl">
                <Clock className="text-red" />
                Solution timed out
            </h1>
        );
    }

    if (output.reason === 'incorrect-output') {
        return <IncorrectOutput input={test.input} expected={test.output} actual={output.stdout} />;
    }

    return <GeneralError error="Solution crashed" output={output} />;
};

const SingleResult = ({
    output,
    test,
    index,
}: {
    output: TestOutput;
    test: Test;
    index: number;
}) => {
    return (
        <>
            <AccordionTrigger className="items-center justify-between px-8">
                <h1>
                    <b>Test Case {index + 1}</b>
                </h1>
                <h1 className={`flex items-center justify-center text-${output.kind}`}>
                    <b>{output.kind.toUpperCase()}</b>
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
    if (!testResults?.kind) return null;
    switch (testResults.kind) {
        case 'individual': {
            return (
                <>
                    <Progress
                        value={testResults.passed * 100 / (testResults.passed + testResults.failed)}
                        color={
                            testResults.submitKind === 'test' ? 'bg-in-progress/50' : 'bg-pass/50'
                        }
                    />
                    <Accordion type="single" collapsible>
                        {testResults.kind === 'individual'
                            ? testResults.tests?.map(([output, test], i) => (
                                  <AccordionItem key={i} value={`test-${i}`}>
                                      <SingleResult output={output} test={test} index={i} />
                                  </AccordionItem>
                              ))
                            : []}
                    </Accordion>
                </>
            );
        }
        case 'internal-error': {
            return (
                <h1 className="flex h-full w-full flex-col items-center justify-center text-2xl">
                    <TriangleAlert className="my-4 text-fail" size={72} />
                    There was an error running your{' '}
                    {testResults.submitKind === 'test' ? 'test' : 'submission'}, please contact a
                    competition host.
                </h1>
            );
        }
        case 'compile-fail': {
            return (
                <div className="p-8">
                    <p className="pb-2 text-xl text-fail">Solution failed to compile</p>
                    <CodeBlock text={convertAnsi(testResults.stderr)} rawHtml />
                </div>
            );
        }
        case 'other-error': {
            return (
                <h1 className="p-4 text-2xl">
                    <span className="text-fail">Submission Attempt Failed:</span>{' '}
                    {testResults.message}
                </h1>
            );
        }
        default:
            throw 'unreachable';
    }
};
