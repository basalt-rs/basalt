import React, { useEffect, useRef, useState } from 'react';
import CodeMirror, { Extension, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useAtom } from 'jotai';
import { editorSettingsAtom } from '@/lib/competitor-state';
import { cn } from '@/lib/utils';
import { type LanguageSyntax } from '@/lib/editor/langs';
import { getExtensions } from '@/lib/editor';

export const CodeViewer = ({
    code,
    language = 'javascript',
    className = '',
}: {
    code: string;
    language?: LanguageSyntax;
    className?: string;
}) => {
    const [settings] = useAtom(editorSettingsAtom);
    const $editor = useRef<ReactCodeMirrorRef>(null);
    const [extensions, setExtensions] = useState<Extension[]>([]);

    useEffect(() => {
        setExtensions(getExtensions(settings, language));
        if ($editor.current) {
            // TODO: this seems less than ideal
            $editor.current.editor?.querySelectorAll<HTMLElement>('.cm-editor *').forEach((e) => {
                e.style.fontSize = `${settings.fontSize}px`;
            });
        }
    }, [language, settings, $editor]);

    return (
        <CodeMirror
            extensions={extensions}
            ref={$editor}
            autoFocus
            readOnly
            theme="none"
            className={cn('h-full w-full', className)}
            value={code}
            basicSetup={false}
        />
    );
};
