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
import { login, roleAtom } from '@/lib/auth';
import { atom, Provider, useAtom, useSetAtom } from 'jotai';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ipAtom, setIp } from '@/lib/api';
import { atomWithStorage } from 'jotai/utils';

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
    const [ip] = useAtom(ipAtom);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async () => {
        const { username, password } = form.getValues();

        console.log(username, password);

        const role = await login(ip!, username, password);
        if (role) {
            router.replace(`/${role}`);
        } else {
            setMessage('Invalid username or password.');
            form.reset();
        }
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle>Log In</CardTitle>
                <CardDescription>
                    Login using your username and password to join the competition
                </CardDescription>
            </CardHeader>
            <CardContent>
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

                        <div className="flex w-full flex-row justify-end">
                            <Button>
                                <ArrowRight />
                            </Button>
                        </div>
                    </form>
                </Form>

                {message && <p>{message}</p>}
            </CardContent>

            <CardFooter>
                <Button asChild variant="link">
                    <Link href="/leaderboard">Show Leaderboard</Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

const ipOrGameCodeAtom = atomWithStorage<string>('ip_or_game_code', '');
const GameCode = () => {
    const setTab = useSetAtom(activeTabAtom);
    const [ipOrGameCode, setIpOrGameCode] = useAtom(ipOrGameCodeAtom);
    const [ip] = useAtom(ipAtom);
    const GameCodeSchema = z.object({
        code: z
            .string()
            .regex(
                /^([a-z]{12}|(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{1,4})$/i,
                'Must be a game code or IPv4 address'
            ),
    });
    const form = useForm<z.infer<typeof GameCodeSchema>>({
        resolver: zodResolver(GameCodeSchema),
        defaultValues: {
            code: '',
        },
    });

    useEffect(() => {
        form.setValue('code', ipOrGameCode || ip || '');
    }, [form, ipOrGameCode, ip]);

    const onSubmit = async () => {
        const { code } = form.getValues();
        console.log(code);
        if (setIp(code)) {
            setIpOrGameCode(code);
            setTab('login');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Game Code</CardTitle>
                <CardDescription>Enter the competition game code to connect</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Game Code or IP"
                                            className="font-mono"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full flex-row justify-end">
                            <Button>
                                <ArrowRight />
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

const activeTabAtom = atom<'ip' | 'login'>('ip');
const LoginTabs = () => {
    const [tab, setTab] = useAtom(activeTabAtom);
    const [ip] = useAtom(ipAtom);

    return (
        <Tabs value={tab} onValueChange={(t) => setTab(t as typeof tab)} className="w-[400px]">
            <TabsList>
                <TabsTrigger value="ip">Game Code</TabsTrigger>
                <TabsTrigger value="login" disabled={!ip}>
                    Log In
                </TabsTrigger>
            </TabsList>
            <TabsContent value="ip">
                <GameCode />
            </TabsContent>
            <TabsContent value="login">
                <Login />
            </TabsContent>
        </Tabs>
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
                <Suspense fallback={<Loading />}>{role ? <Loading /> : <LoginTabs />}</Suspense>
            </Provider>
        </div>
    );
}
