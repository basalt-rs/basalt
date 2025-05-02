import { diffLines, Change } from 'diff';
import { PropsWithChildren, useEffect, useState } from 'react';

// added/removed can never be true/true, but there is no useful way to represent that here because of diff's types.
const DiffLine = ({
    children,
    added = false,
    removed = false,
}: PropsWithChildren<{ added?: boolean; removed?: boolean }>) => (
    <span
        className={`before:mx-1 before:inline-block before:w-2 ${added ? `bg-green-700/30 before:text-green-400 before:content-['+']` : removed ? `bg-red-700/30 before:text-red-400 before:content-['-']` : ''}`}
    >
        {children}
    </span>
);

export const Diff = ({ left, right, inline }: { left: string; right: string; inline: boolean }) => {
    const [diff, setDiff] = useState<Change[]>([]);
    useEffect(() => {
        const diff = diffLines(left, right);
        const diff2 = diff.flatMap((d) =>
            d.count === 1
                ? { ...d, value: d.value.replace(/\n$/, '') }
                : d.value
                      .replace(/\n$/, '')
                      .split('\n')
                      .map((value) => ({ ...d, value: value || ' ' }))
        );
        setDiff(diff2);
    }, [left, right, inline, setDiff]);

    if (inline) {
        return (
            <div className="flex h-full flex-grow flex-col gap-2">
                <b>Output</b>
                <pre className="flex-grow rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                    {diff.map((d, i) => (
                        <DiffLine key={i} added={d.added} removed={d.removed}>
                            {d.value + '\n'}
                        </DiffLine>
                    ))}
                </pre>
            </div>
        );
    }

    return (
        <>
            <div className="flex h-full flex-grow flex-col gap-2">
                <b>Expected Output</b>
                <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                    {diff
                        .filter((x) => !x.added)
                        .map((d, index) => (
                            <DiffLine key={index} removed={d.removed}>
                                {d.value + '\n'}
                            </DiffLine>
                        ))}
                </pre>
            </div>
            <div className="flex h-full flex-grow flex-col gap-2">
                <b>Actual Output</b>
                <pre className="w-full rounded-sm bg-slate-800 px-4 py-2 font-mono text-white">
                    {diff
                        .filter((x) => !x.removed)
                        .map((d, index) => (
                            <DiffLine key={index} added={d.added}>
                                {d.value + '\n'}
                            </DiffLine>
                        ))}
                </pre>
            </div>
        </>
    );
};

