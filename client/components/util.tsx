import * as CnTooltip from '@/components/ui/tooltip';
import { PropsWithChildren, ReactNode } from 'react';

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
