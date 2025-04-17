import * as CnTooltip from '@/components/ui/tooltip';
import { PropsWithChildren, useEffect, useState } from 'react';
import { diffLines, Change } from 'diff';

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

export const CodeBlock = ({ text, rawHtml = false }: { text: string; rawHtml?: boolean; }) => (
    rawHtml
        ? <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white" dangerouslySetInnerHTML={{ __html: text }} />
        : <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">{text}</pre>
);

// added/removed can never be true/true, but there is no useful way to represent that here because of diff's types.
const DiffLine = ({ children, added = false, removed = false }: PropsWithChildren<{ added?: boolean; removed?: boolean }>) => (
    <span className={`before:inline-block before:w-2 ${added ? `before:content-['+'] before:text-green-400` : removed ? `before:content-['-'] before:text-red-500` : ''} ${added ? 'bg-green-400/50' : removed ? 'bg-red-400/50' : ''}`}>
        {children}
    </span>
);

export const Diff = ({ left, right, inline }: { left: string; right: string; inline: boolean; }) => {
    const [diff, setDiff] = useState<Change[]>([]);
    useEffect(() => {
        const diff = diffLines(left, right);
        const diff2 = diff.flatMap(d => d.count === 1
            ? { ...d, value: d.value.replace(/\n$/, '') }
            : d.value.replace(/\n$/, '').split('\n')
                .map(value => ({ ...d, value: value || ' ' })));
        setDiff(diff2);
    }, [left, right, inline, setDiff]);

    if (inline) {
        return (
            <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                {diff.map((d, i) =>
                    <DiffLine key={i} added={d.added} removed={d.removed}>
                        {d.value + '\n'}
                    </DiffLine>
                )}
            </pre >
        );
    }

    return (
        <>
            <div className="flex h-full flex-grow flex-col gap-2">
                <b>Expected Output</b>
                <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                    {diff.filter(x => !x.added).map((d, index) =>
                        <DiffLine key={index} removed={d.removed}>
                            {d.value + '\n'}
                        </DiffLine>
                    )}
                </pre>
            </div>
            <div className="flex h-full flex-grow flex-col gap-2">
                <b>Actual Output</b>
                <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                    {diff.filter(x => !x.removed).map((d, index) =>
                        <DiffLine key={index} added={d.added}>
                            {d.value + '\n'}
                        </DiffLine>
                    )}
                </pre>
            </div>
        </>
    );
};
