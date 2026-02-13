'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { sendPasswordReset } from '@/app/actions';

const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
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
            const result = await sendPasswordReset(data.email);
            if (result.success) {
                 toast({
                    title: "Password Reset Email Sent",
                    description: "If an account exists for that email, a reset link has been sent. Please check your inbox.",
                });
            } else {
                throw new Error(result.message);
            }
           
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
        <>
            <div className="mb-8 text-left">
                <h1 className="text-3xl font-bold font-headline">Forgot Password</h1>
                <p className="text-muted-foreground mt-1">Enter your email to receive a password reset link.</p>
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
                                        placeholder="name@example.com" 
                                        {...field}
                                        className="bg-background border-border h-12 rounded-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
            </Form>
            <p className="text-center text-sm text-muted-foreground mt-8">
                Remember your password?{' '}
                <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                    Login
                </Link>
            </p>
        </>
    );
}
