import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { EditorSettings, editorSettingsAtom } from '@/lib/competitor-state';
import { Label } from './ui/label';

const EDITOR_OPTIONS = [
    { id: 'highlightActiveLine', label: 'Highlight Active Line' },
    { id: 'useSoftTabs', label: 'Enable Soft Tabs' },
    { id: 'relativeLineNumbers', label: 'Relative Line Numbers' },
    { id: 'showGutter', label: 'Show Gutter' },
    { id: 'displayIndentGuides', label: 'Show Indent Guides' },
    { id: 'enableBasicAutocompletion', label: 'Enable Autocompletion' },
    { id: 'enableLiveAutocompletion', label: 'Enable Live Autocompletion' },
] as const;

const THEMES = [
    { id: 'ambiance', label: 'Ambiance' },
    { id: 'chaos', label: 'Chaos' },
    { id: 'chrome', label: 'Chrome' },
    { id: 'cloud9_day', label: 'Cloud9 Day' },
    { id: 'cloud9_night', label: 'Cloud9 Night' },
    { id: 'cloud9_night_low_color', label: 'Cloud9 Night Low Color' },
    { id: 'cloud_editor_dark', label: 'Cloud Editor Dark' },
    { id: 'cloud_editor', label: 'Cloud Editor' },
    { id: 'clouds', label: 'Clouds' },
    { id: 'clouds_midnight', label: 'Clouds Midnight' },
    { id: 'cobalt', label: 'Cobalt' },
    { id: 'crimson_editor', label: 'Crimson Editor' },
    { id: 'dawn', label: 'Dawn' },
    { id: 'dracula', label: 'Dracula' },
    { id: 'dreamweaver', label: 'Dreamweaver' },
    { id: 'eclipse', label: 'Eclipse' },
    { id: 'github_dark', label: 'GitHub Dark' },
    { id: 'github', label: 'GitHub' },
    { id: 'github_light_default', label: 'GitHub Light Default' },
    { id: 'gob', label: 'Gob' },
    { id: 'gruvbox_dark_hard', label: 'Gruvbox Dark Hard' },
    { id: 'gruvbox', label: 'Gruvbox' },
    { id: 'gruvbox_light_hard', label: 'Gruvbox Light Hard' },
    { id: 'idle_fingers', label: 'Idle Fingers' },
    { id: 'iplastic', label: 'iPlastic' },
    { id: 'katzenmilch', label: 'Katzenmilch' },
    { id: 'kr_theme', label: 'KR Theme' },
    { id: 'kuroir', label: 'Kuroir' },
    { id: 'merbivore', label: 'Merbivore' },
    { id: 'merbivore_soft', label: 'Merbivore Soft' },
    { id: 'mono_industrial', label: 'Mono Industrial' },
    { id: 'monokai', label: 'Monokai' },
    { id: 'nord_dark', label: 'Nord Dark' },
    { id: 'one_dark', label: 'One Dark' },
    { id: 'pastel_on_dark', label: 'Pastel on Dark' },
    { id: 'solarized_dark', label: 'Solarized Dark' },
    { id: 'solarized_light', label: 'Solarized Light' },
    { id: 'sqlserver', label: 'SQL Server' },
    { id: 'terminal', label: 'Terminal' },
    { id: 'textmate', label: 'Textmate' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'tomorrow_night_blue', label: 'Tomorrow Night Blue' },
    { id: 'tomorrow_night_bright', label: 'Tomorrow Night Bright' },
    { id: 'tomorrow_night_eighties', label: 'Tomorrow Night Eighties' },
    { id: 'tomorrow_night', label: 'Tomorrow Night' },
    { id: 'twilight', label: 'Twilight' },
    { id: 'vibrant_ink', label: 'Vibrant Ink' },
    { id: 'xcode', label: 'Xcode' },
] as const;

const KEYBINDS = [
    { id: 'ace', label: 'Ace (Default)' },
    { id: 'vscode', label: 'VSCode' },
    { id: 'vim', label: 'Vim' },
    { id: 'emacs', label: 'Emacs' },
    { id: 'sublime', label: 'Sublime' },
] as const;

const CURSOR_STYLES = [
    { id: 'ace', label: 'Ace (Default)' },
    { id: 'slim', label: 'Slim' },
    { id: 'smooth', label: 'Smooth' },
    { id: 'smooth-slim', label: 'Smooth and Slim' },
    { id: 'wide', label: 'Wide' },
] as const;

const FOLDS = [
    { id: 'manual', label: 'Manual' },
    { id: 'markbegin', label: 'Mark Begin' },
    { id: 'markbeginend', label: 'Mark Begin and End' },
] as const;

const TABS = [
    { id: 'general', label: 'General', disabled: true },
    { id: 'editor', label: 'Editor', disabled: false },
] as const;

export function Editor() {
    const [selectedItem, setSelectedItem] = useState<(typeof TABS)[number]['id']>('editor');
    const [editorSettings, setEditorSettings] = useAtom(editorSettingsAtom);

    return (
        <div className="flex h-full w-full flex-row justify-between">
            <div className="flex h-full w-1/3 flex-col space-y-2">
                <h1 className="flex justify-center font-bold">Configuration Options</h1>
                {TABS.map((t, i) => (
                    <Button
                        key={i}
                        variant={selectedItem === t.id ? 'secondary' : 'ghost'}
                        onClick={() => setSelectedItem(t.id)}
                        disabled={t.disabled}
                    >
                        {t.label}
                    </Button>
                ))}
            </div>

            <div className="h-full w-1/2">
                {selectedItem === 'editor' && (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <Label>Theme:</Label>
                            <Select
                                value={editorSettings.theme}
                                onValueChange={(theme) =>
                                    setEditorSettings({ ...editorSettings, theme })
                                }
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {THEMES.map((theme) => (
                                            <SelectItem key={theme.id} value={theme.id}>
                                                {theme.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Editor Configurations:</Label>
                            {EDITOR_OPTIONS.map((option) => (
                                <div key={option.id} className="flex items-center space-x-2">
                                    <Switch
                                        className="gap-1"
                                        checked={editorSettings[option.id]}
                                        onCheckedChange={(checked) =>
                                            setEditorSettings({
                                                ...editorSettings,
                                                [option.id]: checked,
                                            })
                                        }
                                    />
                                    <Label>{option.label}</Label>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Font Size:</Label>
                            <Input
                                className="w-1/2"
                                type="number"
                                value={editorSettings.fontSize}
                                onChange={(e) =>
                                    setEditorSettings({
                                        ...editorSettings,
                                        fontSize: parseInt(e.target.value, 10) || 12,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Soft Tabs:</Label>
                            <Input
                                className="w-1/2"
                                type="number"
                                value={editorSettings.tabSize}
                                onChange={(e) =>
                                    setEditorSettings({
                                        ...editorSettings,
                                        tabSize: parseInt(e.target.value, 10) || 4,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Keybindings:</Label>
                            <Select
                                value={editorSettings.keybind}
                                onValueChange={(keybind) =>
                                    setEditorSettings({
                                        ...editorSettings,
                                        keybind: keybind as EditorSettings['keybind'],
                                    })
                                }
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Keybind" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {KEYBINDS.map((keybind) => (
                                            <SelectItem key={keybind.id} value={keybind.id}>
                                                {keybind.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Cursor Style:</Label>
                            <Select
                                value={editorSettings.cursorStyle}
                                onValueChange={(
                                    cursorStyle: NonNullable<EditorSettings['cursorStyle']>
                                ) =>
                                    setEditorSettings({
                                        ...editorSettings,
                                        cursorStyle,
                                    })
                                }
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Cursor Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {CURSOR_STYLES.map((cursor) => (
                                            <SelectItem key={cursor.id} value={cursor.id}>
                                                {cursor.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Folding:</Label>
                            <Select
                                value={editorSettings.foldStyle}
                                onValueChange={(
                                    foldStyle: NonNullable<EditorSettings['foldStyle']>
                                ) => setEditorSettings({ ...editorSettings, foldStyle })}
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Folding Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {FOLDS.map((fold) => (
                                            <SelectItem key={fold.id} value={fold.id}>
                                                {fold.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
