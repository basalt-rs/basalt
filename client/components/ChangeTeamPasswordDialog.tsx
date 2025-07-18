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
import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useTeams } from '@/hooks/use-teams';
import { toast } from '@/hooks';
import { DialogFooter } from './ui/dialog';
import { TeamInfo } from '@/lib/services/teams';

const formSchema = z
    .object({
        password: z.string().min(4).max(50),
        passwordConfirm: z.string().min(4).max(50),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: 'Passwords do not match',
        path: ['passwordConfirm'],
    });

export const ChangeTeamPasswordDialog = ({
    afterSubmit,
    team,
}: {
    afterSubmit: () => void;
    team: TeamInfo | null;
}) => {
    const { changeTeamPassword } = useTeams();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: '',
            passwordConfirm: '',
        },
    });

    if (team === null) return null;

    const submit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setLoading(true);
        const res = await changeTeamPassword(team.id, values.password);
        if (res) {
            afterSubmit();
            toast({
                title: 'User successfully updated',
            });
        }
        setLoading(false);
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center space-x-2">
                                        <Input placeholder="Username" {...field} />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    This is the password the user will use to log in.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="passwordConfirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="flex w-full items-center space-x-2">
                                        <Input placeholder="Display Name" {...field} />
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    <span className="block">
                                        This must match the password provided above.
                                    </span>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter className="pt-4">
                        <div className="flex w-full justify-end">
                            <Button type="submit" disabled={loading || !form.formState.isDirty}>
                                {loading ? <Loader2 className="animate-spin" /> : <Check />} Update
                                Password
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </Form>
        </div>
    );
};
