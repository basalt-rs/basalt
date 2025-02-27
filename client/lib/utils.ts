import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TestState } from './types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const testColor = (testOutput: TestState) => {
    // See: https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names
    const classMap: Record<TestState, string> = {
        pass: 'text-pass',
        fail: 'text-fail',
        'in-progress': 'text-in-progress',
        'not-attempted': 'text-not-attempted',
    };

    return classMap[testOutput];
};
