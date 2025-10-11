import React, { useEffect, useRef, useState } from 'react';
import CodeMirror, { Extension, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useAtom } from 'jotai';
import {
    editorContentAtom,
    editorSettingsAtom,
    selectedLanguageAtom,
} from '@/lib/competitor-state';
import { getExtensions } from '@/lib/editor';

export default function CodeEditor() {
    const [editorContent, setEditorContent] = useAtom(editorContentAtom);
    const [settings] = useAtom(editorSettingsAtom);
    const [language] = useAtom(selectedLanguageAtom);
    const $editor = useRef<ReactCodeMirrorRef>(null);
    const [extensions, setExtensions] = useState<Extension[]>([]);

    useEffect(() => {
        setExtensions(getExtensions(settings, language?.syntax));
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
            theme="none"
            className="h-full w-full"
            value={editorContent}
            onChange={setEditorContent}
            basicSetup={false}
        />
    );
}
