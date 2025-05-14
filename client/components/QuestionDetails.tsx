import { QuestionResponse } from '@/lib/types';
import { Markdown } from './Markdown';
import { Accordion, AccordionContent, AccordionTrigger } from './ui/accordion';
import { AccordionItem } from '@radix-ui/react-accordion';
import { CodeBlock } from './util';

export const QuestionDetails = ({
    question: { title, description, tests },
}: {
    question: QuestionResponse;
}) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <h1 className="font-bold">{title}</h1>
            <div>
                <Markdown markdown={description || ''} />

                <Accordion type="multiple" defaultValue={['test-0']}>
                    {tests.map((test, i) => (
                        <AccordionItem key={i} value={`test-${i}`}>
                            <AccordionTrigger>
                                <h1 className="text-xl font-bold">Test Case #{i + 1}</h1>
                            </AccordionTrigger>
                            <AccordionContent>
                                <span className="flex w-full flex-row gap-2">
                                    {test.input && (
                                        <div className="w-full">
                                            <h2>Input</h2>
                                            <CodeBlock text={test.input} />
                                        </div>
                                    )}
                                    <div className="w-full">
                                        <h2>Output</h2>
                                        <CodeBlock text={test.output} />
                                    </div>
                                </span>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
};
