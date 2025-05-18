import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Plus } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useState } from "react";
import { useTeams } from "@/hooks/use-teams";
import { toast } from "@/hooks";

const formSchema = z.object({
    username: z.string().min(4).max(50),
    displayName: z.string().min(4).max(50),
    password: z.string().min(4).max(50),
})

export const AddTeamDialog = ({ afterSubmit }: { afterSubmit: () => void }) => {
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
            if (ex === 409) {
                form.setError('username', { message: 'A user with this name already exists' });
            }
        }
    };

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
                                    <Input placeholder="Username" {...field} />
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
                                    <Input placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full pt-4">
                        <div className="float-end flex space-x-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="more" checked={addMore} onCheckedChange={setAddMore} />
                                <Label htmlFor="more">Add More</Label>
                            </div>
                            <Button type="submit">
                                <Plus className="pr-0.5" /> Add Team
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div >
    );
};
