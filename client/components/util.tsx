import * as CnTooltip from '@/components/ui/tooltip';
import { PropsWithChildren } from 'react';

export const Tooltip = ({
    tooltip,
    children,
    side = 'bottom',
}: PropsWithChildren<{ tooltip: string; side?: 'top' | 'right' | 'bottom' | 'left' }>) => (
    <CnTooltip.TooltipProvider>
        <CnTooltip.Tooltip>
            <CnTooltip.TooltipTrigger asChild>{children}</CnTooltip.TooltipTrigger>
            <CnTooltip.TooltipContent side={side}>
                <p>{tooltip}</p>
            </CnTooltip.TooltipContent>
        </CnTooltip.Tooltip>
    </CnTooltip.TooltipProvider>
);

export const CodeBlock = ({ text, rawHtml = false }: { text: string; rawHtml?: boolean }) => (
    rawHtml
        ? <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white" dangerouslySetInnerHTML={{ __html: text }} />
        : <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">{text}</pre>
);
