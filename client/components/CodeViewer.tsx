import React from 'react';
import { StreamLanguage } from '@codemirror/language';
import CodeMirror from '@uiw/react-codemirror';
import { useAtom } from 'jotai';
import { editorSettingsAtom } from '@/lib/competitor-state';
import { vim } from '@replit/codemirror-vim';
import { cn } from '@/lib/utils';
import langs, { type LanguageSyntax } from '@/lib/editor/lang';

export const CodeViewer = ({ code, language = 'javascript', className = '' }: { code: string; language?: LanguageSyntax; className?: string }) => {
    const [editorSettings] = useAtom(editorSettingsAtom);

    return (
        <CodeMirror
            extensions={[
                StreamLanguage.define(langs[language]),
                vim(),
            ]}
            theme="dark"
            height="100%"
            className={cn("w-full h-full", className)}
            value={code}
            readOnly
        />
    );
};
