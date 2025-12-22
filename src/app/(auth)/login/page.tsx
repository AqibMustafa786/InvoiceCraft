
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Github, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { auth } = useFirebase();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            if (!auth) {
                throw new Error("Authentication service is not available.");
            }
            await signInWithEmailAndPassword(auth, data.email, data.password);
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            router.push('/');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold font-headline">Welcome back</h1>
                <p className="text-muted-foreground mt-1">Please Enter your Account details</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="email" 
                                        placeholder="johndoe@gmail.com" 
                                        {...field}
                                        className="bg-background border-border h-12 rounded-lg"
                                    />
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
                                 <div className="flex items-center">
                                    <FormLabel>Password</FormLabel>
                                     <Link
                                        href="/forgot-password"
                                        className="ml-auto inline-block text-sm text-primary underline-offset-4 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <FormControl>
                                    <div className="relative">
                                        <Input 
                                            type={showPassword ? "text" : "password"} 
                                            {...field}
                                            className="bg-background border-border h-12 rounded-lg pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </form>
            </Form>

             <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <Button variant="outline" className="h-12"><Github className="h-5 w-5" /></Button>
                <Button variant="outline" className="h-12"><svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.75 8.36,4.73 12.19,4.73C15.28,4.73 17.04,6.84 17.04,6.84L19,4.88C19,4.88 16.7,3 12.19,3C6.42,3 2,7.42 2,12C2,16.58 6.42,21 12.19,21C18.1,21 22,16.25 22,11.53C22,11.31 21.68,11.1 21.35,11.1V11.1Z" /></svg></Button>
                <Button variant="outline" className="h-12"><svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg></Button>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-8">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
                    Create an account
                </Link>
            </p>
        </>
    );
}
