import * as CnTooltip from '@/components/ui/tooltip';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';

export const Tooltip = ({
    tooltip,
    children,
    side = 'bottom',
    delayDuration = 700,
    disabled = false,
}: PropsWithChildren<{
    tooltip: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    delayDuration?: number;
    disabled?: boolean;
}>) =>
    disabled ? (
        <span>{children}</span>
    ) : (
        <CnTooltip.TooltipProvider>
            <CnTooltip.Tooltip delayDuration={delayDuration}>
                <CnTooltip.TooltipTrigger asChild disabled={false}>
                    <span>{children}</span>
                </CnTooltip.TooltipTrigger>
                <CnTooltip.TooltipContent side={side}>{tooltip}</CnTooltip.TooltipContent>
            </CnTooltip.Tooltip>
        </CnTooltip.TooltipProvider>
    );

export const CodeBlock = ({ text, rawHtml = false }: { text: string; rawHtml?: boolean }) =>
    rawHtml ? (
        <pre
            className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white"
            dangerouslySetInnerHTML={{ __html: text }}
        />
    ) : (
        <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">{text}</pre>
    );

const DTF = Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'medium' });
export const humanTime = (date: Date | string) => {
    const date2 = typeof date === 'string' ? new Date(date) : date;
    return DTF.format(date2);
};

const RTF = new Intl.RelativeTimeFormat(undefined, { style: 'long' });
export const relativeTime = (date: Date | string) => {
    const date2 = typeof date === 'string' ? new Date(date) : date;
    const elapsedSecs = (date2.valueOf() - Date.now()) / 1000;
    console.log(elapsedSecs);
    if (Math.abs(elapsedSecs) < 60) {
        return RTF.format(elapsedSecs, 'second');
    }
    const elapsedMins = Math.trunc(elapsedSecs / 60);
    if (Math.abs(elapsedMins) < 60) {
        return RTF.format(elapsedMins, 'minute');
    }
    const elapsedHours = Math.trunc(elapsedMins / 60);
    return RTF.format(elapsedHours, 'hour');
};
