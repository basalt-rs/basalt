import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useAtom } from 'jotai';
import { editorSettingsAtom, selectedLanguageAtom, useEditorContent } from '@/lib/competitor-state';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import { currQuestionAtom } from '@/lib/services/questions';

const languages = [
    'abap',
    'abc',
    'actionscript',
    'ada',
    'alda',
    'apex',
    'applescript',
    'aql',
    'asciidoc',
    'asl',
    'astro',
    'autohotkey',
    'basic',
    'batchfile',
    'bibtex',
    'c9search',
    'cirru',
    'clojure',
    'cobol',
    'coffee',
    'coldfusion',
    'crystal',
    'csharp',
    'csp',
    'css',
    'csv',
    'curly',
    'cuttlefish',
    'd',
    'dart',
    'diff',
    'django',
    'dockerfile',
    'dot',
    'drools',
    'edifact',
    'eiffel',
    'ejs',
    'elixir',
    'elm',
    'erlang',
    'flix',
    'forth',
    'fortran',
    'fsharp',
    'fsl',
    'ftl',
    'gcode',
    'gherkin',
    'gitignore',
    'glsl',
    'gobstones',
    'golang',
    'graphqlschema',
    'groovy',
    'haml',
    'handlebars',
    'haskell',
    'haxe',
    'hjson',
    'html',
    'ini',
    'io',
    'ion',
    'jack',
    'jade',
    'java',
    'javascript',
    'jexl',
    'json',
    'json5',
    'jsp',
    'jssm',
    'jsx',
    'julia',
    'kotlin',
    'latex',
    'latte',
    'less',
    'liquid',
    'lisp',
    'livescript',
    'logiql',
    'logtalk',
    'lsl',
    'lua',
    'luapage',
    'lucene',
    'makefile',
    'markdown',
    'mask',
    'matlab',
    'maze',
    'mediawiki',
    'mel',
    'mips',
    'mixal',
    'mushcode',
    'mysql',
    'nasal',
    'nginx',
    'nim',
    'nix',
    'nsis',
    'nunjucks',
    'objectivec',
    'ocaml',
    'odin',
    'partiql',
    'pascal',
    'perl',
    'pgsql',
    'php',
    'pig',
    'plsql',
    'powershell',
    'praat',
    'prisma',
    'prolog',
    'properties',
    'protobuf',
    'prql',
    'puppet',
    'python',
    'qml',
    'r',
    'raku',
    'razor',
    'rdoc',
    'red',
    'redshift',
    'rhtml',
    'robot',
    'rst',
    'ruby',
    'rust',
    'sac',
    'sass',
    'scad',
    'scala',
    'scheme',
    'scrypt',
    'scss',
    'sh',
    'sjs',
    'slim',
    'smarty',
    'smithy',
    'snippets',
    'space',
    'sparql',
    'sql',
    'sqlserver',
    'stylus',
    'svg',
    'swift',
    'tcl',
    'terraform',
    'tex',
    'text',
    'textile',
    'toml',
    'tsv',
    'tsx',
    'turtle',
    'twig',
    'typescript',
    'vala',
    'vbscript',
    'velocity',
    'verilog',
    'vhdl',
    'visualforce',
    'vue',
    'wollok',
    'xml',
    'yaml',
    'zeek',
    'zig',
] as const;

languages.forEach(l => import(`ace-builds/src-noconflict/mode-${l}`));

export default function CodeEditor() {
    const { editorContent, setEditorContent } = useEditorContent();
    const [editorSettings] = useAtom(editorSettingsAtom);
    const [languageValue] = useAtom(selectedLanguageAtom);
    const [editorTheme, setEditorTheme] = useState(editorSettings.theme);
    const [question] = useAtom(currQuestionAtom);

    useEffect(() => {
        (async () => {
            await import(`ace-builds/src-noconflict/theme-${editorSettings.theme}`);
            setEditorTheme(editorSettings.theme);

            if (editorSettings.keybind !== 'ace') {
                await import(`ace-builds/src-noconflict/keybinding-${editorSettings.keybind}`);
            }
            if (languageValue) {
                await import(
                    `ace-builds/src-noconflict/mode-${question?.languages?.find((l) => l.name === languageValue)?.syntax || 'plaintext'}`
                );
            }
        })();
    }, [editorSettings, languageValue, question]);

    return (
        <AceEditor
            mode={question?.languages?.find((l) => l.name === languageValue)?.syntax || 'plaintext'}
            theme={editorTheme}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="100%"
            value={editorContent}
            onChange={(newValue) => setEditorContent(newValue)}
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
