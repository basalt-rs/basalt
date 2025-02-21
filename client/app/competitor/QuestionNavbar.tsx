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
import { allQuestionsAtom, currQuestionIdxAtom } from '@/lib/questions';
import { useAtom } from 'jotai';
import { TestState } from '@/lib/types';

type Question = {
    question: string;
    description: string;
    tests: [
        {
            input: string;
            output: string;
            failedOutput: string;
            expectedOutput: string;
        },
    ];
    status: string;
};

export default function QuestionNavbar() {
    const [allQuestions] = useAtom(allQuestionsAtom);
    // hack so we can demo nicely
    const qStatuses = [
        'pass',
        'in-progress',
        'fail',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted',
        'not-attempted'
    ].slice(0, allQuestions.length);
    allQuestions.map(() => 'pass' as const);

    const [currQuestion, setCurrQuestionIdx] = useAtom(currQuestionIdxAtom);

    const questionStatusColor = (questionState: TestState) => {
        const classMap: Record<TestState, string> = {
            pass: 'border-pass',
            'in-progress': 'border-in-progress',
            'not-attempted': 'border-not-attempted',
            fail: 'border-fail ',
        };
        return classMap[questionState];
    };

    const selectedQuestionColor = (questionState: TestState) => {
        const classMap: Record<TestState, string> = {
            pass: 'bg-pass/50',
            'in-progress': 'bg-in-progress/50',
            'not-attempted': 'bg-not-attempted/50',
            fail: 'bg-fail/50',
        };
        return classMap[questionState];
    };

    return (
        <div className="flex flex-row items-center border-t p-1">
            <div className="flex w-full flex-row flex-nowrap gap-1 overflow-x-auto">
                {allQuestions.map((_, index) => (
                    <Button
                        variant="ghost"
                        size="icon"
                        key={index}
                        onClick={() => setCurrQuestionIdx(index)}
                        className={`size-9 rounded-full border-2 p-1 font-bold ${questionStatusColor(qStatuses[index])} ${index === currQuestion ? selectedQuestionColor(qStatuses[index]) : ''}`}
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
