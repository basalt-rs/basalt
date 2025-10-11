import React, { useEffect, useRef, useState } from 'react';
import CodeMirror, { BasicSetupOptions, Extension, basicSetup, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { keymap, lineNumbers } from '@codemirror/view';
import { search } from "@codemirror/search"
import { StreamLanguage } from '@codemirror/language';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import { showMinimap } from '@replit/codemirror-minimap';
import { vim } from "@replit/codemirror-vim"
import { emacs } from "@replit/codemirror-emacs"
import { vscodeKeymap } from "@replit/codemirror-vscode-keymap"
import { useAtom } from 'jotai';
import {
    editorContentAtom,
    editorSettingsAtom,
    selectedLanguageAtom,
} from '@/lib/competitor-state';
import langs from '@/lib/editor/langs';
import themes from '@/lib/editor/themes';

const relativeLineNumbers = () => lineNumbers({
    formatNumber: (lineNo, state) => {
        // Trailing spaces are trimmed, so ' ' + ZWSP
        const SPACE = ' ​';
        if (lineNo > state.doc.lines) {
            return lineNo + SPACE;
        }
        const cursorLine = state.doc.lineAt(state.selection.asSingle().ranges[0].to).number;
        if (lineNo === cursorLine) {
            return cursorLine + SPACE;
        } else {
            return Math.abs(cursorLine - lineNo).toString();
        }
    },
});

export default function CodeEditor() {
    const [editorContent, setEditorContent] = useAtom(editorContentAtom);
    const [settings] = useAtom(editorSettingsAtom);
    const [language] = useAtom(selectedLanguageAtom);
    const $editor = useRef<ReactCodeMirrorRef>(null);
    const [extensions, setExtensions] = useState<Extension[]>([]);

    useEffect(() => {
        const basicOptions: BasicSetupOptions = {
            allowMultipleSelections: true,
            autocompletion: settings.autocompletion,
            bracketMatching: settings.highlightMatchingBracket,
            closeBrackets: settings.autoCloseBrackets,
            closeBracketsKeymap: true,
            completionKeymap: true,
            defaultKeymap: settings.keymap === 'default',
            drawSelection: true, // ?
            dropCursor: true,
            foldGutter: true,
            foldKeymap: false,
            highlightActiveLine: settings.highlightActiveLine,
            highlightActiveLineGutter: true,
            highlightSelectionMatches: settings.highlightSelectionMatches,
            highlightSpecialChars: true,
            /// undo history
            history: true,
            historyKeymap: true,
            /// configures whether some inputs trigger reindentation of the current line.
            indentOnInput: true,
            lineNumbers: settings.lineNumbers !== 'off',
            lintKeymap: true,
            searchKeymap: settings.keymap === 'default',
            /// Alt+left mouse to select in a rectangle
            rectangularSelection: true,
            /// Crosshair cursor for ^^^
            crosshairCursor: true,
            syntaxHighlighting: true,
            tabSize: settings.tabSize,
        };

        const extensions = [
            ...basicSetup(basicOptions),
            search(), // See https://github.com/uiwjs/react-codemirror/issues/404#issuecomment-1809447795
        ];

        const lang = language ? langs[language.syntax] : undefined;
        if (lang)
            extensions.push(StreamLanguage.define(lang));
        if (settings.lineNumbers === 'relative')
            extensions.push(relativeLineNumbers());
        if (settings.indentGuides)
            extensions.push(indentationMarkers({ thickness: 3 }));
        if (settings.theme)
            extensions.push(themes[settings.theme]?.extension ?? themes.red);
        if (settings.minimap) {
            extensions.push(showMinimap.compute(['doc'], _state => ({
                create: (_v) => ({ dom: document.createElement('div') }),
                displayText: 'blocks',
                showOverlay: 'mouse-over',
            })));
        }

        switch (settings.keymap) {
            case 'default': break;
            case 'vscode': extensions.push(keymap.of(vscodeKeymap)); break;
            case 'vim': extensions.push(vim()); break;
            case 'emacs': extensions.push(emacs()); break;
        }

        if ($editor.current) {
            // TODO: this seems less than ideal
            $editor.current.editor?.querySelectorAll<HTMLElement>('.cm-editor *').forEach(e => {
                e.style.fontSize = `${settings.fontSize}px`;
            });
        }
        console.debug('rebuilt extensions');

        setExtensions(extensions);
    }, [language, settings, $editor]);

    return (
        <CodeMirror
            extensions={extensions}
            ref={$editor}
            autoFocus
            theme="none"
            className="w-full h-full"
            value={editorContent}
            onChange={setEditorContent}

            basicSetup={false}
        />
    );
}
