import { atomWithStorage } from 'jotai/utils';

// Default Editor Configurations
export const editorSettingsAtom = atomWithStorage('editor-settings', {
    theme: 'monokai',
    options: [
        'enable-auto-indent',
        'show-line-numbers',
        'enable-live-autocompletion',
        'enable-live-autocompletion',
    ],
    fontSize: 12,
    softTabs: 4,
    keybind: 'ace',
    cursorStyle: 'ace',
    foldStyle: 'manual',
});
