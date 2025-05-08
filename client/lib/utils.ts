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
/**
 * If `date` is a number, it is the elapsedSecons, if it is a date or a string,
 * it will be treated as the start time
 */
export const relativeTime = (date: Date | string | number) => {
    const elapsedSecs = typeof date === 'number' ? date : ((new Date(date)).valueOf() - Date.now()) / 1000;
    if (Math.abs(elapsedSecs) < 60) {
        return RTF.format(Math.round(elapsedSecs), 'second');
    }
    const elapsedMins = Math.trunc(elapsedSecs / 60);
    if (Math.abs(elapsedMins) < 60) {
        return RTF.format(elapsedMins, 'minute');
    }
    const elapsedHours = Math.trunc(elapsedMins / 60);
    return RTF.format(elapsedHours, 'hour');
};
