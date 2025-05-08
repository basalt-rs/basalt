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
import { useLogin, roleAtom } from '@/lib/services/auth';
import { atom, Provider, useAtom, useSetAtom } from 'jotai';
import { ArrowRight, Loader2 } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import * as Breadcrumb from '@/components/ui/breadcrumb';
import { ipOrGameCodeAtom, useIp } from '@/lib/services/api';

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
    const { login } = useLogin();
    const [loading, setLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async () => {
        const { username, password } = form.getValues();

        setLoading(true);
        try {
            const role = await login(username, password);
            if (role) {
                router.replace(`/${role}`);
                return; // don't reset loading state
            } else {
                setMessage('Invalid username or password');
                form.reset();
            }
        } catch (_: unknown) {
            setMessage('Invalid game code');
            form.reset();
        }
        setLoading(false);
    };

    return (
        <>
            <CardContent className="flex flex-col gap-1">
                <CardTitle>Log In</CardTitle>
                <CardDescription>
                    Login using your username and password to join the competition
                </CardDescription>
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

                        <div className="flex w-full flex-row items-center justify-between">
                            <span className="items-center text-destructive">{message}</span>
                            <Button disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>

            <CardFooter>
                <Button asChild variant="link">
                    <Link href="/leaderboard">Show Leaderboard</Link>
                </Button>
            </CardFooter>
        </>
    );
};

const GameCode = () => {
    const setTab = useSetAtom(activeTabAtom);
    const [ipOrGameCode, setIpOrGameCode] = useAtom(ipOrGameCodeAtom);
    const { ip, setIp } = useIp();
    const GameCodeSchema = z.object({
        code: z
            .string()
            .regex(
                /^([a-z0-9]{0,12}|(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}:\d{1,4})$/i,
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
        } else {
            form.setError('code', { message: 'Must be a game code or IPv4 address' });
        }
    };

    return (
        <>
            <CardContent className="flex flex-col gap-1">
                <CardTitle>Game Code</CardTitle>
                <CardDescription>Enter the competition game code to connect</CardDescription>
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
            <CardFooter />
        </>
    );
};

const activeTabAtom = atom<'ip' | 'login'>('ip');
const LoginTabs = () => {
    const [tab, setTab] = useAtom(activeTabAtom);

    return (
        <>
            <Card className="flex w-[450px] flex-col justify-between">
                <CardHeader>
                    <Breadcrumb.Breadcrumb>
                        <Breadcrumb.BreadcrumbList>
                            {tab === 'login' && (
                                <>
                                    <Breadcrumb.BreadcrumbItem>
                                        <Button
                                            variant="link"
                                            className="px-0"
                                            onClick={() => setTab('ip')}
                                        >
                                            Game Code
                                        </Button>
                                    </Breadcrumb.BreadcrumbItem>
                                    <Breadcrumb.BreadcrumbSeparator />
                                </>
                            )}
                            <Breadcrumb.BreadcrumbPage>
                                {tab === 'login' ? 'Log In' : 'Game Code'}
                            </Breadcrumb.BreadcrumbPage>
                        </Breadcrumb.BreadcrumbList>
                    </Breadcrumb.Breadcrumb>
                </CardHeader>
                {tab === 'ip' && <GameCode />}
                {tab === 'login' && <Login />}
            </Card>
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
                <Suspense fallback={<Loading />}>{role ? <Loading /> : <LoginTabs />}</Suspense>
            </Provider>
        </div>
    );
}
