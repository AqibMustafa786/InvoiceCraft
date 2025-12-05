
'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        try {
            if (!auth || !firestore) {
                throw new Error("Firebase services are not available.");
            }
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = userCredential.user;

            // Auto-generate a company ID for the new user
            const companyId = `COMP_${user.uid.substring(0, 8).toUpperCase()}`;

            // Create user profile in the global users collection
            await setDoc(doc(firestore, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                name: data.name,
                companyId: companyId, // Assign companyId
                role: 'admin',         // New users are admins of their own company
                plan: 'free',          // Default to free plan
                planExpires: null,     // No expiration for free plan
                createdAt: serverTimestamp(),
            });

            // Optional: Create a company document as well
            await setDoc(doc(firestore, "companies", companyId), {
                id: companyId,
                name: `${data.name}'s Company`,
                ownerId: user.uid,
                createdAt: serverTimestamp(),
            });


            toast({
                title: "Account Created",
                description: "You’re on the Free Plan. Welcome to InvoiceCraft!",
            });
            router.push('/');
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Sign up Failed",
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                    <CardDescription>Join InvoiceCraft and start creating professional invoices in minutes.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full text-white bg-gradient-to-r from-primary to-accent" disabled={isLoading}>
                               {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                             <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{' '}
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
