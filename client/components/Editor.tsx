import React from 'react';
import AceEditor from 'react-ace';

export default function CodeEditor() {
    return (
        <AceEditor
            mode="javascript"
            theme="monokai"
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="100%"
            value=""
        />
    );
}
