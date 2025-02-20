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
    expectedOutput: string;
    status: string;
};

export default function QuestionNavbar({
    setCurrentQuestion,
}: {
    setCurrentQuestion: (question: Question) => void;
}) {
    const [questions] = useState([
        {
            question: 'Sort an Array of Integers',
            description: 'Sort an array of integers in ascending order and return it.',
            input: '2 11 15 0',
            output: '0 2 11 15',
            expectedOutput: '0 2 11 15',
            status: 'complete',
        },
        {
            question: 'Sort an Array of Characters Alphabetically',
            description:
                'Sort an array of characters alphabetically and return them as a single string.',
            input: 'h e l o',
            output: 'e h l o',
            expectedOutput: 'e h l o',
            status: 'in-progress',
        },
        {
            question: 'Hexadecimal in Reverse Order',
            description:
                'Convert characters to hexadecimal values and return them in reverse order.',
            input: 'A B C D',
            output: '13 12 11 10',
            expectedOutput: '13 12 11 10',
            status: 'failed',
        },
        {
            question: 'Some of Digits',
            description:
                'Write a function that takes a positive integer as input and returns the sum of its digits.',
            input: '1 2 3 4',
            output: '10',
            expectedOutput: '10',
            status: '',
        },
    ]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question>(questions[0]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'complete':
                return 'border-green-500 hover:border-green-300';
            case 'in-progress':
                return 'border-blue-500 hover:border-blue-300';
            case 'failed':
                return 'border-red-500 hover:border-red-300';
            default:
                return 'border-gray-500 hover:border-gray-300';
        }
    };

    const getActiveColor = (status: string) => {
        switch (status) {
            case 'complete':
                return 'bg-green-300 dark:bg-green-700';
            case 'in-progress':
                return 'bg-blue-300 dark:bg-blue-700';
            case 'failed':
                return 'bg-red-300 dark:bg-red-700';
            default:
                return 'bg-gray-300 dark:bg-gray-700';
        }
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
                        className={`rounded-full border-2 p-1 font-bold ${getStatusColor(q.status)} ${q === selectedQuestion ? getActiveColor(q.status) : ''} size-9`}
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
