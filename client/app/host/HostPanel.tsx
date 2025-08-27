import { ScrollArea } from '@/components/ui/scroll-area';
import { currentHostTabAtom } from '@/lib/host-state';
import { useAtom } from 'jotai';
import QuestionAccordion from './QuestionAccordion';
import TeamInspector from './TeamInspector';
import Leaderboard from '@/components/Leaderboard';
import BulkTeamGen from './BulkTeamGen';

export default function HostPanel() {
    const [currentTab] = useAtom(currentHostTabAtom);

    switch (currentTab) {
        case 'questions':
            return (
                <ScrollArea className="w-full flex-grow pt-2">
                    <QuestionAccordion />
                </ScrollArea>
            );
        case 'teams':
            return <TeamInspector />;
        case 'leaderboard':
            return <Leaderboard className="p-4" />;
        case 'gen':
            return <BulkTeamGen />;
    }
}
