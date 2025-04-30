import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useTeams } from '@/hooks/use-teams';
export default function TeamInfo() {
    const { selectedTeam } = useTeams();

    return (
        selectedTeam !== null && (
            <div className="flex h-full w-full flex-col p-4">
                <div className="w-full">
                    <span className="flex items-center justify-between text-2xl font-bold">
                        {selectedTeam.team}
                        {!selectedTeam.disconnected &&
                        (selectedTeam.lastSeenMs
                            ? Math.abs(Date.now() - selectedTeam.lastSeenMs) < 45 * 1000
                            : false) ? (
                            <p className="text-green-500">Connected</p>
                        ) : (
                            <p className="text-gray-300 dark:text-gray-500">Disconnected</p>
                        )}
                    </span>
                </div>
                <div className="flex h-full w-full flex-col gap-4 text-lg">
                    <span className="flex justify-between align-middle">
                        <p>
                            <strong>Points: </strong>
                            {selectedTeam.score}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => {
                                toast({
                                    title: 'Coming Soon',
                                    description: 'This feature is coming soon!',
                                    variant: 'destructive',
                                });
                            }}
                        >
                            Submission History
                        </Button>
                    </span>
                </div>
            </div>
        )
    );
}
