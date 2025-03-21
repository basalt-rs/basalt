'use client';
import { Switch } from '@/components/ui/switch';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';

interface QuestionAccordionProps {
    questions: {
        question: string;
        description: string;
        languages: string[] | null;
        points: string;
        tests: {
            input: string;
            output: string;
        }[];
        enabled: boolean;
    }[];
    handleQuestionSwitch: (question: string) => void;
}

export default function QuestionAccordion({
    questions,
    handleQuestionSwitch,
}: QuestionAccordionProps) {
    return (
        <Accordion type="single" collapsible className="w-full px-2">
            {questions.map((q, index) => (
                <AccordionItem
                    key={index}
                    value={`question-${index}`}
                    className={`mb-1 rounded border px-2.5 duration-200 ${q.enabled ? '' : 'bg-[#6664] text-[#333] dark:text-muted-foreground'}`}
                >
                    <AccordionTrigger className="text-md flex max-w-full">
                        <p className="w-2/3 truncate">
                            {index + 1}. {q.question}
                        </p>
                        <p>{q.points} pts</p>
                    </AccordionTrigger>
                    <AccordionContent className="pr-1.5">
                        <div>
                            <div className="flex justify-between">
                                <p className="text-sm">{q.description}</p>
                                <span className="flex items-center gap-1">
                                    <Label>Enabled</Label>
                                    <Switch
                                        checked={q.enabled}
                                        onCheckedChange={() => handleQuestionSwitch(q.question)}
                                    />
                                </span>
                            </div>

                            {q.languages !== null && (
                                <p className="text-sm">
                                    <strong>
                                        {q.languages.length !== 1 ? 'Languages: ' : 'Language: '}
                                    </strong>{' '}
                                    {q.languages.join(', ').toUpperCase()}
                                </p>
                            )}

                            <div className="flex flex-col text-sm">
                                <Accordion type="single" collapsible>
                                    {q.tests.map((test, testNum) => (
                                        <AccordionItem key={testNum} value={`test-${testNum}`}>
                                            <AccordionTrigger>
                                                <h1>
                                                    <strong>Test Case #{testNum + 1}</strong>
                                                </h1>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <span className="flex w-full flex-row gap-2">
                                                    <div className="w-full">
                                                        <h2>Input</h2>
                                                        <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-black dark:bg-slate-800 dark:text-white">
                                                            {test.input}
                                                        </pre>
                                                    </div>
                                                    <div className="w-full">
                                                        <h2>Output</h2>
                                                        <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-black dark:bg-slate-800 dark:text-white">
                                                            {test.output}
                                                        </pre>
                                                    </div>
                                                </span>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
