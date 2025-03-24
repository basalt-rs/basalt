import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { editorSettingsAtom } from '@/Models/EditorModel';

const EditorOptions = [
    { id: 'highlight-active-line', label: 'Highlight Active Line' },
    { id: 'auto-indent', label: 'Enable Auto Indent' },
    { id: 'relative-line', label: 'Relative Line Numbers' },
    { id: 'show-line-numbers', label: 'Show Line Numbers' },
    { id: 'show-indent-guides', label: 'Show Indent Guides' },
    { id: 'enable-autocompletion', label: 'Enable Autocompletion' },
    { id: 'enable-live-autocompletion', label: 'Enable Live Autocompletion' },
    { id: 'read-only', label: 'Read-Only Mode' },
] as const;

const Themes = [
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

const Keybinds = [
    { id: 'ace', label: 'Ace (Default)' },
    { id: 'vscode', label: 'VSCode' },
    { id: 'vim', label: 'Vim' },
    { id: 'emacs', label: 'Emacs' },
    { id: 'sublime', label: 'Sublime' },
] as const;

const CursoryStyles = [
    { id: 'ace', label: 'Ace (Default)' },
    { id: 'slim', label: 'Slim' },
    { id: 'smooth', label: 'Smooth' },
    { id: 'smooth-slim', label: 'Smooth and Slim' },
    { id: 'wide', label: 'Wide' },
] as const;

const Folds = [
    { id: 'manual', label: 'Manual' },
    { id: 'markbegin', label: 'Mark Begin' },
    { id: 'markbeginend', label: 'Mark Begin and End' },
] as const;

export function SettingsPanel() {
    const [selectedItem, setSelectedItem] = useState<string>('general');
    const [editorSettings, setEditorSettings] = useAtom(editorSettingsAtom);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(editorSettings.options || []);

    useEffect(() => {
        setSelectedOptions(editorSettings.options || []);
    }, [editorSettings.options]);

    const updateSettings = (newSettings: Partial<typeof editorSettings>) => {
        setEditorSettings({ ...editorSettings, ...newSettings });
        localStorage.setItem(
            'editorSettings',
            JSON.stringify({ ...editorSettings, ...newSettings })
        );
    };

    const handleCheckboxChange = (optionId: string, checked: boolean) => {
        let updatedOptions;

        if (checked) {
            updatedOptions = selectedOptions.includes(optionId)
                ? selectedOptions
                : [...selectedOptions, optionId];
        } else {
            updatedOptions = selectedOptions.filter((id) => id !== optionId);
        }
        console.log(updatedOptions);
        console.log(updatedOptions.includes('enable-live-autocompletion'));
        setSelectedOptions(updatedOptions);
        updateSettings({ options: updatedOptions });
    };

    return (
        <div className="flex h-full w-full flex-row justify-between">
            <div className="flex h-full w-1/3 flex-col space-y-2">
                <h1 className="flex justify-center font-bold">Configuration Options</h1>
                <Button variant="outline" onClick={() => setSelectedItem('general')} disabled>
                    General Configurations
                </Button>
                <Button
                    variant={selectedItem === 'editor' ? 'solid' : 'outline'}
                    onClick={() => setSelectedItem('editor')}
                >
                    Editor Configurations
                </Button>
            </div>

            <div className="h-full w-1/2">
                {selectedItem === 'editor' && (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <label>Theme:</label>
                            <Select
                                value={editorSettings.theme}
                                onValueChange={(theme) => updateSettings({ theme })}
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Themes.map((theme) => (
                                            <SelectItem key={theme.id} value={theme.id}>
                                                {theme.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Editor Configurations:</label>
                            <ul>
                                {EditorOptions.map((option) => (
                                    <li
                                        key={option.id}
                                        className="flex items-center space-x-2 text-sm"
                                    >
                                        <Checkbox
                                            checked={selectedOptions.includes(option.id)}
                                            onCheckedChange={(checked) =>
                                                handleCheckboxChange(option.id, checked as boolean)
                                            }
                                        />
                                        <span>{option.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Font Size:</label>
                            <Input
                                id="font-size"
                                type="number"
                                value={editorSettings.fontSize}
                                onChange={(e) =>
                                    updateSettings({ fontSize: parseInt(e.target.value, 10) || 12 })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Soft Tabs:</label>
                            <Input
                                id="soft-tabs"
                                type="number"
                                value={editorSettings.softTabs}
                                onChange={(e) =>
                                    updateSettings({ softTabs: parseInt(e.target.value, 10) || 4 })
                                }
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Keybindings:</label>
                            <Select
                                value={editorSettings.keybind}
                                onValueChange={(keybind) => updateSettings({ keybind })}
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Keybind" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Keybinds.map((keybind) => (
                                            <SelectItem key={keybind.id} value={keybind.id}>
                                                {keybind.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Cursor Style:</label>
                            <Select
                                value={editorSettings.cursorStyle}
                                onValueChange={(cursorStyle) => updateSettings({ cursorStyle })}
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Cursor Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {CursoryStyles.map((cursor) => (
                                            <SelectItem key={cursor.id} value={cursor.id}>
                                                {cursor.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label>Folding:</label>
                            <Select
                                value={editorSettings.foldStyle}
                                onValueChange={(
                                    foldStyle: 'manual' | 'markbegin' | 'markbeginend'
                                ) => updateSettings({ foldStyle })}
                            >
                                <SelectTrigger className="w-1/2">
                                    <SelectValue placeholder="Select Folding Style" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {Folds.map((fold) => (
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
