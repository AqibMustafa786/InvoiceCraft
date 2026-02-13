
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider, getRedirectResult } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, Suspense } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { bootstrapUser } from '@/firebase/auth-helpers';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}

function LoginContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { auth } = useFirebase();
    const router = useRouter();
    const { toast } = useToast();

    // Custom validation logic is handled in onSubmit/onError
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const searchParams = useSearchParams();

    useEffect(() => {
        const companyId = searchParams.get('companyId');
        if (companyId) {
            sessionStorage.setItem('companyIdHint', companyId);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!auth) return;
        getRedirectResult(auth)
            .then(async (result) => {
                if (result) {
                    setIsLoading(true);
                    bootstrapUser(result.user);
                    toast({
                        title: "Login Successful",
                        description: `Welcome, ${result.user.displayName}!`,
                    });
                    router.push('/dashboard');
                }
            })
            .catch((error) => {
                setError(error.message || "Failed to sign in after redirect.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [auth, router, toast]);

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            if (!auth) {
                throw new Error("Authentication service is not available.");
            }
            await signInWithEmailAndPassword(auth, data.email, data.password);
            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Login error:", error.code, error.message);
            let errorMessage = "An unexpected error occurred.";

            // Map Firebase errors to user-friendly messages
            switch (error.code) {
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password. Please try again.";
                    break;
                case 'auth/user-not-found':
                    errorMessage = "Account not found. Please create an account.";
                    break;
                case 'auth/wrong-password':
                    errorMessage = "Incorrect password. Please try again.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many failed attempts. Please try again later.";
                    break;
                case 'auth/user-disabled':
                    errorMessage = "This account has been disabled.";
                    break;
                default:
                    errorMessage = error.message;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onInvalid = (errors: any) => {
        // Handle specific validation messages requested by user
        if (errors.email && errors.password) {
            setError("Please enter both email and password.");
        } else if (errors.email) {
            setError("Please enter your email address.");
        } else if (errors.password) {
            setError("Please enter your password.");
        }
    };

    const onSocialLogin = async (providerName: 'google' | 'github' | 'facebook') => {
        setIsLoading(true);
        setError(null);
        if (!auth) {
            setError("Authentication service is not available.");
            setIsLoading(false);
            return;
        }

        let provider;
        if (providerName === 'google') {
            provider = new GoogleAuthProvider();
        } else if (providerName === 'github') {
            provider = new GithubAuthProvider();
        } else {
            provider = new FacebookAuthProvider();
        }

        try {
            const userCredential = await signInWithPopup(auth, provider);
            bootstrapUser(userCredential.user);
            toast({
                title: "Login Successful",
                description: `Welcome, ${userCredential.user.displayName}!`,
            });
            router.push('/dashboard');
        } catch (error: any) {
            if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
                try {
                    await signInWithRedirect(auth, provider);
                } catch (redirectError: any) {
                    setError(redirectError.message || `Failed to sign in with ${providerName}.`);
                    setIsLoading(false);
                }
            } else {
                setError(error.message || `Failed to sign in with ${providerName}.`);
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold font-headline">Welcome back</h1>
                <p className="text-muted-foreground mt-1">Please Enter your Account details</p>
            </div>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-6 overflow-hidden"
                    >
                        <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                <span>{error}</span>
                            </div>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
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
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if (error) setError(null); // Clear error on type
                                        }}
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
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (error) setError(null); // Clear error on type
                                            }}
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
                <Button variant="outline" className="h-12" onClick={() => onSocialLogin('github')} disabled={isLoading}><svg className="h-5 w-5" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg></Button>
                <Button variant="outline" className="h-12" onClick={() => onSocialLogin('google')} disabled={isLoading}><svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.75 8.36,4.73 12.19,4.73C15.28,4.73 17.04,6.84 17.04,6.84L19,4.88C19,4.88 16.7,3 12.19,3C6.42,3 2,7.42 2,12C2,16.58 6.42,21 12.19,21C18.1,21 22,16.25 22,11.53C22,11.31 21.68,11.1 21.35,11.1V11.1Z" /></svg></Button>
                <Button variant="outline" className="h-12" onClick={() => onSocialLogin('facebook')} disabled={isLoading}><svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" /></svg></Button>
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
