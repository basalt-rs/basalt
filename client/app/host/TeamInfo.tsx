import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSelectedTeam } from '@/lib/host-state';

export default function TeamInfo() {
    const { selectedTeam } = useSelectedTeam();

    return (
        selectedTeam !== null && (
            <div className="flex h-full w-full flex-col p-4">
                <div className="flex items-center justify-between font-bold">
                    <div className="flex flex-col">
                        <p className="text-2xl">{selectedTeam.name}</p>
                        <p>
                            <strong>Points: </strong>
                            {selectedTeam.points}
                        </p>
                    </div>
                    {selectedTeam.status ? (
                        <p className="text-green-500 text-2xl">Connected</p>
                    ) : (
                        <p className="text-gray-300 dark:text-gray-500 text-2xl">Disconnected</p>
                    )}
                </div>
            </div>
        )
    );
}
