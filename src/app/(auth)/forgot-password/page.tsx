'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const { toast } = useToast();

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsLoading(true);
        try {
            if (!auth) {
                throw new Error("Authentication service is not available.");
            }
            await sendPasswordResetEmail(auth, data.email);
            toast({
                title: "Password Reset Email Sent",
                description: "Check your inbox for a link to reset your password.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to send password reset email.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
                    <CardDescription>Enter your email to receive a password reset link.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="name@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full text-white bg-gradient-to-r from-primary to-accent" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Remember your password?{' '}
                                <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                                    Login
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
