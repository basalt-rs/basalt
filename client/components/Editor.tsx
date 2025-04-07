import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useAtom } from 'jotai';
import { editorSettingsAtom, useEditorContent } from '@/lib/competitor-state';
import 'ace-builds/src-noconflict/theme-monokai';
import('ace-builds/src-noconflict/mode-javascript');
import 'ace-builds/src-noconflict/keybinding-vim';
import 'ace-builds/src-noconflict/keybinding-emacs';
import 'ace-builds/src-noconflict/keybinding-sublime';
import 'ace-builds/src-noconflict/ext-language_tools';

// TODO: Need to have languages imported and hooked up in the Select to sync these items together
// const languages = [
//     'ada',
//     'basic',
//     'batchfile',
//     'c_cpp',
//     'clojure',
//     'cobol',
//     'csharp',
//     'd',
//     'dart',
//     'ejs',
//     'elixir',
//     'elm',
//     'erlang',
//     'forth',
//     'fortran',
//     'fsharp',
//     'golang',
//     'java',
//     'javascript',
//     'julia',
//     'kotlin',
//     'lisp',
//     'lua',
//     'mips',
//     'nim',
//     'nix',
//     'ocaml',
//     'odin',
//     'pascal',
//     'perl',
//     'php',
//     'powershell',
//     'prolog',
//     'python',
//     'r',
//     'ruby',
//     'rust',
//     'scala',
//     'scheme',
//     'sh',
//     'typescript',
//     'zig',
// ];

export default function CodeEditor() {
    const { editorContent } = useEditorContent();
    const [editorSettings] = useAtom(editorSettingsAtom);
    const [editorTheme, setEditorTheme] = useState(editorSettings.theme);
    const [editorValue, setEditorValue] = useState(editorContent ? editorContent : '');

    useEffect(() => {
        if (editorContent) {
            setEditorValue(editorContent);
        }
    }, [editorContent]);

    useEffect(() => {
        (async () => {
            await import(`ace-builds/src-noconflict/theme-${editorSettings.theme}`);
            setEditorTheme(editorSettings.theme);

            if (editorSettings.keybind !== 'ace') {
                await import(`ace-builds/src-noconflict/keybinding-${editorSettings.keybind}`);
            }
        })();
    }, [editorSettings]);

    return (
        <AceEditor
            mode="javascript"
            theme={editorTheme}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="100%"
            value={editorValue}
            onChange={(newValue) => setEditorValue(newValue)}
            setOptions={{
                fontSize: editorSettings.fontSize,
                tabSize: editorSettings.tabSize,
                useSoftTabs: editorSettings.useSoftTabs,
                enableBasicAutocompletion: editorSettings.enableBasicAutocompletion,
                enableLiveAutocompletion: editorSettings.enableLiveAutocompletion,
                highlightActiveLine: editorSettings.highlightActiveLine,
                showGutter: editorSettings.showGutter,
                displayIndentGuides: editorSettings.displayIndentGuides,
                relativeLineNumbers: editorSettings.relativeLineNumbers,
                foldStyle: editorSettings.foldStyle,
            }}
            keyboardHandler={editorSettings.keybind}
        />
    );
}
