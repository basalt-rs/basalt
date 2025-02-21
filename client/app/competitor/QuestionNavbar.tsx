'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Question = {
    question: string;
    description: string;
    input: string;
    output: string;
    failedOutput: string;
    expectedOutput: string;
    status: string;
};

type QuestionState = 'complete' | 'in-progress' | 'not-attempted' | 'failed';

export default function QuestionNavbar({
    setCurrentQuestion,
}: {
    setCurrentQuestion: (question: Question) => void;
}) {
    const [questions] = useState<Question[]>([
        {
            question: 'Sort an Array of Integers',
            description: 'Sort an array of integers in ascending order and return it.',
            input: '2 11 15 0',
            output: '0 2 11 15',
            failedOutput: '2 0 11 15',
            expectedOutput: '0 2 11 15',
            status: 'complete',
        },
        {
            question: 'Sort an Array of Characters Alphabetically',
            description:
                'Sort an array of characters alphabetically and return them as a single string.',
            input: 'h e l o',
            output: 'e h l o',
            failedOutput: 'h o e l',
            expectedOutput: 'e h l o',
            status: 'in-progress',
        },
        {
            question: 'Hexadecimal in Reverse Order',
            description:
                'Convert characters to hexadecimal values and return them in reverse order.',
            input: 'A B C D',
            output: '13 12 11 10',
            failedOutput: '10 11 12 13',
            expectedOutput: '13 12 11 10',
            status: 'failed',
        },
        {
            question: 'Some of Digits',
            description:
                'Write a function that takes a positive integer as input and returns the sum of its digits.',
            input: '1 2 3 4',
            output: '10',
            failedOutput: '5',
            expectedOutput: '10',
            status: 'not-attempted',
        },
    ]);

    const [selectedQuestion, setSelectedQuestion] = useState<Question>(questions[0]);

    const questionStatusColor = (questionState: QuestionState) => {
        const classMap: Record<QuestionState, string> = {
            complete: 'border-pass',
            'in-progress': 'border-in-progress',
            'not-attempted': 'border-not-attempted',
            failed: 'border-fail ',
        };
        return classMap[questionState];
    };

    const selectedQuestionColor = (questionState: QuestionState) => {
        const classMap: Record<QuestionState, string> = {
            complete: 'bg-pass',
            'in-progress': 'bg-in-progress',
            'not-attempted': 'bg-not-attempted',
            failed: 'bg-fail ',
        };
        return classMap[questionState];
    };

    return (
        <div className="flex flex-row items-center border-t p-1">
            <div className="flex w-full flex-row flex-nowrap gap-1 overflow-x-auto">
                {questions.map((q, index) => (
                    <Button
                        variant="ghost"
                        size="icon"
                        key={index}
                        onClick={() => {
                            setCurrentQuestion(q);
                            setSelectedQuestion(q);
                        }}
                        className={`size-9 rounded-full border-2 p-1 font-bold ${questionStatusColor(q.status as QuestionState)} ${q === selectedQuestion ? selectedQuestionColor(q.status as QuestionState) : ''}`}
                    >
                        {index + 1}
                    </Button>
                ))}
            </div>
            <span className="ml-auto">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Programming Language" />
                    </SelectTrigger>
                    <SelectContent className="min-w-20">
                        <SelectGroup>
                            <SelectLabel>Languages</SelectLabel>
                            <SelectItem value="Python">Python</SelectItem>
                            <SelectItem value="Java">Java</SelectItem>
                            <SelectItem value="JavaScript">JavaScript</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </span>
        </div>
    );
}
