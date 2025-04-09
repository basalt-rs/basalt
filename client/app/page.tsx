'use client';
import { Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, roleAtom } from '@/lib/services/auth';
import { Provider, useAtom } from 'jotai';
import { Loader2 } from 'lucide-react';

const LoginFormSchema = z.object({
    username: z.string().min(4, { message: 'Username must be at least 4 characters.' }),
    password: z.string().min(4, { message: 'Password must be at least 4 characters.' }),
});
type LoginFormValues = z.infer<typeof LoginFormSchema>;

const Loading = () => {
    return <Loader2 className="animate-spin" size={72} />;
};

const Login = () => {
    const router = useRouter();
    const [message, setMessage] = useState<string>('');

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async () => {
        const { username, password } = form.getValues();

        const role = await login(username, password);
        if (role) {
            router.replace(`/${role}`);
        } else {
            setMessage('Invalid username or password.');
            form.reset();
        }
    };
    return (
        <>
            <div className="flex flex-col flex-wrap items-center">
                <h1 className="mb-1 text-6xl font-bold">Log In</h1>
                <h2 className="mb-1.5">Please enter a username and password to get started!</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
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
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-center">
                            <Button className="mt-2 w-full">Log In</Button>
                        </div>
                    </form>
                </Form>

                {message && <p>{message}</p>}
            </div>

            <div className="height-20 flex items-center justify-center">
                <Button asChild variant="link">
                    <Link href="/leaderboard">Leaderboard</Link>
                </Button>
            </div>
        </>
    );
};

export default function Home() {
    const router = useRouter();
    const [role] = useAtom(roleAtom);

    useEffect(() => {
        if (role) {
            router.replace(`/${role}`);
        }
    }, [router, role]);

    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Provider>
                <Suspense fallback={<Loading />}>{role ? <Loading /> : <Login />}</Suspense>
            </Provider>
        </div>
    );
}
