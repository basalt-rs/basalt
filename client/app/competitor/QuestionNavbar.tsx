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
import { Check, FileDown, FlaskConical, Play, Send, SendHorizonal, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

const Foo = ({ tooltip, children }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default function QuestionNavbar() {
    return (
        <div className="flex flex-row items-center border-t p-1 gap-3 justify-between">
            <div className="flex flex-row">
                <Foo tooltip="Import urmom">
                    <Button size="icon" variant="ghost">
                        <Upload />
                    </Button>
                </Foo>
                <Foo tooltip="Download urdad">
                    <Button size="icon" variant="ghost">
                        <FileDown />
                    </Button>
                </Foo>
            </div>
            <div className="flex flex-row">
                <Button size="icon" variant="ghost">
                    <FlaskConical className="text-in-progress" />
                </Button>
                <Button size="icon" variant="ghost">
                    <SendHorizonal className="text-pass" />
                </Button>
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
        </div>
    );
}
