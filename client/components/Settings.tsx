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
import { editorSettingsAtom } from '@/lib/competitor-state';
import { Label } from './ui/label';

const EDITOR_OPTIONS = [
    { id: 'highlightActiveLine', label: 'Highlight Active Line' },
    { id: 'autoIndent', label: 'Enable Auto Indent' },
    { id: 'relativeLine', label: 'Relative Line Numbers' },
    { id: 'showLineNumbers', label: 'Show Line Numbers' },
    { id: 'showIndentGuides', label: 'Show Indent Guides' },
    { id: 'basicAutocompletion', label: 'Enable Autocompletion' },
    { id: 'liveAutocompletion', label: 'Enable Live Autocompletion' },
] as const;

const THEMES = [
    { id: 'monokai', label: 'Monokai' },
    { id: 'github', label: 'GitHub' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'kuroir', label: 'Kuroir' },
    { id: 'twilight', label: 'Twilight' },
    { id: 'xcode', label: 'Xcode' },
    { id: 'textmate', label: 'Textmate' },
    { id: 'solarized_dark', label: 'Solarized Dark' },
    { id: 'solarized_light', label: 'Solarized Light' },
    { id: 'terminal', label: 'Terminal' },
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

export function Editor() {
    const [selectedItem, setSelectedItem] = useState<string>('editor');
    const [editorSettings, setEditorSettings] = useAtom(editorSettingsAtom);

    return (
        <div className="flex h-full w-full flex-row justify-between">
            <div className="flex h-full w-1/3 flex-col space-y-2">
                <h1 className="flex justify-center font-bold">Configuration Options</h1>
                <Button variant="outline" onClick={() => setSelectedItem('general')} disabled>
                    General Configurations
                </Button>
                <Button
                    variant={selectedItem === 'editor' ? 'secondary' : 'ghost'}
                    onClick={() => setSelectedItem('editor')}
                >
                    Editor Configurations
                </Button>
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
                                value={editorSettings.softTabs}
                                onChange={(e) =>
                                    setEditorSettings({
                                        ...editorSettings,
                                        softTabs: parseInt(e.target.value, 10) || 4,
                                    })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Keybindings:</Label>
                            <Select
                                value={editorSettings.keybind}
                                onValueChange={(keybind) =>
                                    setEditorSettings({ ...editorSettings, keybind })
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
                                onValueChange={(cursorStyle) =>
                                    setEditorSettings({ ...editorSettings, cursorStyle })
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
                                    foldStyle: 'manual' | 'markbegin' | 'markbeginend'
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
