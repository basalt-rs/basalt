import { Button } from './ui/button';
import { Input } from './ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form';
import { Check, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTeams } from '@/hooks/use-teams';
import { toast } from '@/hooks';
import { Tooltip } from './util';
import { DialogFooter } from './ui/dialog';
import { randomName } from '@/lib/utils';
import { TeamInfo } from '@/lib/services/teams';

const formSchema = z.object({
    username: z.string().min(4).max(50),
    displayName: z.string().min(4).max(50).optional(),
});

export const EditTeamDialog = ({
    afterSubmit,
    team,
}: {
    afterSubmit: () => void;
    team: TeamInfo | null;
}) => {
    const { renameTeam } = useTeams();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: team?.name,
            displayName: team?.displayName || '',
        },
    });

    if (team === null) return null;

    const submit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setLoading(true);
        try {
            const patch = {
                username: team.name === values.username ? null : values.username,
                displayName:
                    team.displayName === values.displayName
                        ? null
                        : values.displayName
                          ? { set: values.displayName }
                          : ('reset' as const),
            };
            const res = await renameTeam(team.id, patch);
            if (res) {
                afterSubmit();
                toast({
                    title: 'User successfully updated',
                });
            }
        } catch (ex) {
            const x = ex as { status: number; body: string[] };
            if (x.status === 409) {
                form.setError('username', { message: 'A user with this name already exists' });
            }
        }
        setLoading(false);
    };

    const randomiseUsername = () => {
        const { username, displayName } = randomName();
        form.setValue('username', username, { shouldDirty: true, shouldTouch: true });
        form.setValue('displayName', displayName, { shouldDirty: true, shouldTouch: true });
    };

    const filterUsername = (og: string): string =>
        og
            .toLowerCase()
            .replace(/_? +$/, '_')
            .replace(/[^a-z0-9_-]/g, '');

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        rules={{
                            onChange: (e) => {
                                form.setValue('username', filterUsername(e.target.value), {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                });
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center space-x-2">
                                        <Input placeholder="Username" {...field} />
                                        <Tooltip tooltip="Randomise Username and Display Name">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={randomiseUsername}
                                            >
                                                <RefreshCw />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    This is the name the user will use to log in.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center space-x-2">
                                        <Input placeholder="Display Name" {...field} />
                                        <Tooltip tooltip="Remove Display Name">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() =>
                                                    form.setValue('displayName', '', {
                                                        shouldDirty: true,
                                                        shouldTouch: true,
                                                    })
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    <span className="block">
                                        This is the name that will be shown on the leaderboard.
                                    </span>
                                    <em>
                                        {team.displayName &&
                                            !field.value &&
                                            'Display name will be reset.'}
                                    </em>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter className="pt-4">
                        <div className="flex w-full justify-end">
                            <Button type="submit" disabled={loading || !form.formState.isDirty}>
                                {loading ? <Loader2 className="animate-spin" /> : <Check />} Update
                                Team
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </Form>
        </div>
    );
};
