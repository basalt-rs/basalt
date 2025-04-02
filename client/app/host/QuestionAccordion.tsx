'use client';
import { Switch } from '@/components/ui/switch';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { allQuestionsAtom } from '@/lib/services/questions';
import { useAtom } from 'jotai';
import { Markdown } from '@/components/Markdown';

export default function QuestionAccordion() {
    const [allQuestions] = useAtom(allQuestionsAtom);
    return (
        <Accordion type="single" collapsible className="w-full px-2">
            {allQuestions.map((q, index) => (
                <AccordionItem
                    key={index}
                    value={`question-${index}`}
                    className={`mb-1 rounded border px-2.5 duration-200 ${true ? '' : 'bg-[#6664] text-[#333] dark:text-muted-foreground'}`}
                >
                    <AccordionTrigger className="text-md flex justify-between">
                        <p className="w-2/3 truncate text-xl">{q.title}</p>
                        <p>
                            {q.points} {q.points === 1 ? 'point' : 'points'}
                        </p>
                    </AccordionTrigger>
                    <AccordionContent className="pr-1.5">
                        <div>
                            <div className="flex justify-between">
                                {q.languages && (
                                    <div>
                                        <span className="font-bold">
                                            {q.languages.length !== 1
                                                ? 'Languages: '
                                                : 'Language: '}
                                        </span>
                                        {q.languages.join(', ')}
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Label>Enabled</Label>
                                    <Switch disabled checked={true} />
                                </div>
                            </div>

                            <Markdown markdown={q.description || ''} />

                            <div className="flex flex-col text-sm">
                                <Accordion type="single" collapsible defaultValue="test-0">
                                    {q.tests.map((test, i) => (
                                        <AccordionItem key={i} value={`test-${i}`}>
                                            <AccordionTrigger>
                                                <div className="ml-1 mr-2 flex w-full items-center justify-between">
                                                    <h1 className="text-xl font-bold">
                                                        Test Case #{i + 1}
                                                    </h1>
                                                    {test.visible || (
                                                        <span className="text-gray-400">
                                                            Hidden
                                                        </span>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <span className="flex w-full flex-row gap-2">

                                                    {test.input && (
                                                        <div className="w-full">
                                                            <h2>Input</h2>
                                                            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-black text-white dark:bg-slate-800">
                                                                {test.input}
                                                            </pre>
                                                        </div>
                                                    )}
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
