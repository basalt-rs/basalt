import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useAtom } from 'jotai';
import { editorSettingsAtom, selectedLanguageAtom } from '@/lib/competitor-state';
import 'ace-builds/esm-resolver';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

export default function CodeEditor() {
    const [editorSettings] = useAtom(editorSettingsAtom);
    const [languageValue] = useAtom(selectedLanguageAtom);
    const [editorTheme, setEditorTheme] = useState(editorSettings.theme);
    const [editorValue, setEditorValue] = useState('');

    useEffect(() => {
        (async () => {
            await import(`ace-builds/src-noconflict/theme-${editorSettings.theme}`);
            setEditorTheme(editorSettings.theme);

            if (editorSettings.keybind !== 'ace') {
                await import(`ace-builds/src-noconflict/keybinding-${editorSettings.keybind}`);
            }
            if (languageValue) {
                console.log('ace got this', languageValue);
                await import(`ace-builds/src-noconflict/mode-${languageValue}`);
            }
        })();
    }, [editorSettings, languageValue]);

    return (
        <AceEditor
            mode={languageValue}
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
