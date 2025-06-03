import { Button } from './ui/button';
import { Input } from './ui/input';
import { z } from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Loader2, Plus, RefreshCw, Users } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useState } from 'react';
import { useTeams } from '@/hooks/use-teams';
import { toast } from '@/hooks';
import { Tooltip } from './util';
import { DialogFooter } from './ui/dialog';
import { randomName, randomPassword } from '@/lib/utils';

const formSchema = z.object({
    username: z.string().min(4).max(50),
    displayName: z.string().min(4).max(50),
    password: z.string().min(4).max(50),
})

export const AddTeamDialog = ({ afterSubmit, onBulkGenChange }: { afterSubmit: () => void; onBulkGenChange: (bulkGen: boolean) => void }) => {
    const { createTeam } = useTeams();
    const [addMore, setAddMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            displayName: '',
            password: '',
        },
    });

    const submit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            const team = await createTeam(values);
            if (team) {
                if (addMore) {
                    form.reset();
                } else {
                    afterSubmit();
                }
                toast({
                    title: 'User successfully added',
                });
            }
        } catch (ex) {
            const x = ex as { status: number; body: string[]; };
            if (x.status === 409) {
                form.setError('username', { message: 'A user with this name already exists' });
            }
        }
        setLoading(false);
    };

    const randomiseUsername = () => {
        const { username, displayName } = randomName();
        form.setValue('username', username);
        form.setValue('displayName', displayName);
    };

    const randomisePassword = () => form.setValue('password', randomPassword());

    const filterUsername = (og: string): string => og
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
                        rules={{ onChange: (e) => { form.setValue('username', filterUsername(e.target.value)) } }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center space-x-2">
                                        <Input placeholder="Username" {...field} />
                                        <Tooltip tooltip="Randomise Username and Display Name">
                                            <Button type="button" variant="secondary" onClick={randomiseUsername}>
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
                                    <Input placeholder="Display Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the name that will be shown on the leaderboard.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center space-x-2">
                                        <Input placeholder="Password" {...field} />
                                        <Tooltip tooltip="Randomise Password">
                                            <Button type="button" variant="secondary" onClick={randomisePassword}>
                                                <RefreshCw />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter className="pt-4">
                        <div className="w-full flex justify-between">
                            <Button variant="outline" type="button" onClick={() => onBulkGenChange(true)}>
                                <Users /> Bulk Generate
                            </Button>
                            <div className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="more" checked={addMore} onCheckedChange={(v) => setAddMore(!!v)} />
                                    <Label htmlFor="more">Add More</Label>
                                </div>
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin" /> : <Plus />} Add Team
                                </Button>
                            </div>
                        </div>
                    </DialogFooter>
                </form>
            </Form>
        </div >
    );
};
