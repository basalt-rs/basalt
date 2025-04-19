import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useAtom } from 'jotai';
import { editorSettingsAtom } from '@/lib/competitor-state';
import 'ace-builds/src-noconflict/theme-monokai';
import('ace-builds/src-noconflict/mode-javascript');
import 'ace-builds/src-noconflict/keybinding-vim';
import 'ace-builds/src-noconflict/keybinding-emacs';
import 'ace-builds/src-noconflict/keybinding-sublime';
import 'ace-builds/src-noconflict/ext-language_tools';

export const CodeViewer = ({ code, className = '' }: { code: string; className?: string; }) => {
    const [editorSettings] = useAtom(editorSettingsAtom);
    const [editorTheme, setEditorTheme] = useState(editorSettings.theme);

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
            value={code}
            className={className}
            setOptions={{
                readOnly: true,
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
