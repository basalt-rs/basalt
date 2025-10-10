import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { useAtom } from 'jotai';
import {
    editorContentAtom,
    editorSettingsAtom,
    selectedLanguageAtom,
} from '@/lib/competitor-state';
import { currQuestionAtom } from '@/lib/services/questions';
import { vim } from "@replit/codemirror-vim"
import langs from '@/lib/editor/lang';

export default function CodeEditor() {
    const [editorContent, setEditorContent] = useAtom(editorContentAtom);
    const [editorSettings] = useAtom(editorSettingsAtom);
    const [language] = useAtom(selectedLanguageAtom);
    const [question] = useAtom(currQuestionAtom);

    const lang = language ? langs[language.syntax] ?? langs.java : langs.java;

    return (
        <CodeMirror
            extensions={[
                StreamLanguage.define(lang),
                vim(),
            ]}
            theme="dark"
            height="100%"
            className="w-full h-full"
            value={editorContent}
            onChange={setEditorContent}
        />
    );
}
