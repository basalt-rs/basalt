import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const EditorOptions = [
    { id: 'enable-auto-indent', label: 'Enable Auto Indent' },
    { id: 'highlight-active-line', label: 'Highlight Active Line' },
    { id: 'show-line-numbers', label: 'Show Line Numbers' },
    { id: 'relative-line-numbers', label: 'Relative Line Numbers' },
    { id: 'show-indent-guides', label: 'Show Indent Guides' },
    { id: 'highlight-indent-guides', label: 'Highlight Indent Guides' },
    { id: 'wrap-with-quotes', label: 'Wrap with Quotes' },
    { id: 'live-autocompletion', label: 'Live Autocompletion' },
    { id: 'incremental-search', label: 'Incremental Search' },
    { id: 'read-only', label: 'Read-Only Mode' },
    { id: 'show-token-info', label: 'Show Token Info' },
    { id: 'custom-scrollbar', label: 'Custom Scrollbar' },
];

export function SettingsPanel() {
    return (
        <Dialog>
            <Tabs defaultValue="general">
                <TabsList className="flex space-x-2">
                    <TabsTrigger value="general" disabled>
                        General Settings
                    </TabsTrigger>
                    <TabsTrigger value="editor">Editor Configurations</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <h1>General Content</h1>
                </TabsContent>
                <TabsContent value="editor" className="flex flex-col gap-2">
                    <div>
                        <Button variant="outline">Theme</Button>
                    </div>
                    <div className="max-h-15 grid rounded-md border border-gray-300 p-2">
                        {EditorOptions.map((option) => (
                            <label key={option.id} className="flex items-center space-x-2">
                                <input type="checkbox" id={option.id} />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                    <Button variant="outline">Submit Changes</Button>
                </TabsContent>
            </Tabs>
        </Dialog>
    );
}
