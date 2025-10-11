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
import { EditorSettings, Keymap, LineNumbers } from '@/lib/editor/settings';
import themes, { Theme } from '@/lib/editor/themes';
import { ScrollArea } from './ui/scroll-area';

type Option<K> = { id: K; label: string; description?: string };

const TOGGLES: Option<keyof EditorSettings>[] = [
    { id: 'highlightActiveLine', label: 'Highlight Active Line' },
    { id: 'minimap', label: 'Show Minimap' },
    { id: 'indentGuides', label: 'Indent Guides' },
    { id: 'autocompletion', label: 'Enable Autocompletion' },
    { id: 'highlightMatchingBracket', label: 'Higlight Matching Brackets' },
    { id: 'highlightSelectionMatches', label: 'Highlight Matching Selections' },
    { id: 'autoCloseBrackets', label: 'Automatically Clost Brackets' },
];

const KEYMAPS: Option<Keymap>[] = [
    { id: 'default', label: 'Default' },
    { id: 'vscode', label: 'VSCode' },
    { id: 'vim', label: 'VIM' },
    { id: 'emacs', label: 'Emacs' },
];

const LINE_NUMBERS: Option<LineNumbers>[] = [
    { id: 'off', label: 'Off' },
    { id: 'normal', label: 'Normal' },
    { id: 'relative', label: 'Relative' },
];

const TABS = [
    { id: 'general', label: 'General', disabled: true },
    { id: 'editor', label: 'Editor', disabled: false },
] as const;

const parseInRange = (num: string, min: number, max?: number): number => {
    const n = +num;
    if (isNaN(n) || n <= min) return min;
    if (max && n >= max) return max;
    return n;
};

const EditorTab = () => {
    const [editorSettings, setEditorSettings] = useAtom(editorSettingsAtom);

    return (
        <div className="m-2 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <Label className="font-bold">Theme</Label>
                <Select
                    value={editorSettings.theme}
                    onValueChange={(theme: Theme) =>
                        setEditorSettings({ ...editorSettings, theme })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.entries(themes).map(([id, { name }]) => (
                                <SelectItem key={id} value={id}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1">
                <Label className="font-bold">Line Numbers</Label>
                <Select
                    value={editorSettings.lineNumbers}
                    onValueChange={(lineNumbers: LineNumbers) =>
                        setEditorSettings({ ...editorSettings, lineNumbers })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a line number style" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {LINE_NUMBERS.map(({ id, label }) => (
                                <SelectItem key={id} value={id}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1">
                <Label className="font-bold">Font Size</Label>
                <Input
                    type="number"
                    value={editorSettings.fontSize}
                    min={12}
                    onChange={(e) =>
                        setEditorSettings({
                            ...editorSettings,
                            fontSize: parseInRange(e.target.value, 12),
                        })
                    }
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="font-bold">Tab Size</Label>
                <Input
                    type="number"
                    value={editorSettings.tabSize}
                    onChange={(e) =>
                        setEditorSettings({
                            ...editorSettings,
                            tabSize: parseInRange(e.target.value, 1, 16),
                        })
                    }
                />
            </div>

            <div className="flex flex-col gap-1">
                <Label className="font-bold">Keymap</Label>
                <Select
                    value={editorSettings.keymap}
                    onValueChange={(keymap: Keymap) =>
                        setEditorSettings({ ...editorSettings, keymap })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select keymap" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {KEYMAPS.map((keymap) => (
                                <SelectItem key={keymap.id} value={keymap.id}>
                                    {keymap.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1">
                {TOGGLES.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                        <Switch
                            className="gap-1"
                            checked={!!editorSettings[option.id]}
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
        </div>
    );
};

export default function Settings() {
    const [selectedItem, setSelectedItem] = useState<(typeof TABS)[number]['id']>('editor');

    return (
        <div className="flex h-full w-full flex-row gap-8">
            <div className="flex w-1/4 flex-col space-y-2">
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

            <ScrollArea className="flex-grow p-2">
                {selectedItem === 'editor' && <EditorTab />}
            </ScrollArea>
        </div>
    );
}
