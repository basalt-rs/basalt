import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const DTF = Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'medium' });
export const humanTime = (date: Date | string) => {
    const date2 = typeof date === 'string' ? new Date(date) : date;
    return DTF.format(date2);
};

const RTF = new Intl.RelativeTimeFormat(undefined, { style: 'long' });
export const relativeTime = (date: Date | string) => {
    const date2 = typeof date === 'string' ? new Date(date) : date;
    const elapsedSecs = (date2.valueOf() - Date.now()) / 1000;
    if (Math.abs(elapsedSecs) < 60) {
        return '< 1 minute ago';
    }
    const elapsedMins = Math.trunc(elapsedSecs / 60);
    if (Math.abs(elapsedMins) < 60) {
        return RTF.format(elapsedMins, 'minute');
    }
    const elapsedHours = Math.trunc(elapsedMins / 60);
    return RTF.format(elapsedHours, 'hour');
};
