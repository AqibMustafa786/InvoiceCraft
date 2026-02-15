'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { Company } from '@/lib/types';
import { Loader2, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { bootstrapUser } from '@/firebase/auth-helpers';
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Inter, Roboto, Playfair_Display, Montserrat } from 'next/font/google';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-roboto', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
    initialCompany: Company | null;
    slug: string;
}

export function LoginForm({ initialCompany, slug }: LoginFormProps) {
    const { firestore, auth } = useFirebase();
    const router = useRouter();
    const { toast } = useToast();

    const [company, setCompany] = useState<Company | null>(initialCompany);
    const [isLoading, setIsLoading] = useState(!initialCompany);

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    useEffect(() => {
        if (initialCompany) return;

        const fetchCompany = async () => {
            if (!firestore) return;

            try {
                const q = query(
                    collection(firestore, 'companies'),
                    where('portalSettings.slug', '==', slug),
                    limit(1)
                );
                const snapshot = await getDocs(q);
                if (snapshot.empty) {
                    setIsLoading(false);
                    return;
                }
                const data = snapshot.docs[0].data() as Company;

                if (!data.portalSettings?.enabled) {
                    setIsLoading(false);
                    return;
                }

                setCompany(data);
                sessionStorage.setItem('companyIdHint', data.id);
            } catch (err) {
                console.error("Error fetching branded portal (client fallback):", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompany();
    }, [slug, firestore, initialCompany]);


    const onSubmit = async (data: LoginFormValues) => {
        if (!auth) return;
        setIsLoggingIn(true);
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
            await bootstrapUser(userCredential.user);
            toast({ title: "Login Successful", description: `Welcome back to ${company?.name || 'InvoiceCraft'}` });
            router.push('/dashboard');
        } catch (error: any) {
            let message = "Invalid email or password.";
            if (error.code === 'auth/too-many-requests') message = "Too many attempts. Try later.";
            setError(message);
        } finally {
            setIsLoggingIn(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Portal Not Found</h2>
                    <p className="text-muted-foreground mb-4">We couldn't find a client portal for this address.</p>
                    <Button onClick={() => router.push('/login')}>Go to Main Login</Button>
                </div>
            </div>
        )
    }

    const { portalSettings } = company;

    const getRadiusClass = (radius: string) => {
        switch (radius) {
            case 'none': return 'rounded-none';
            case 'sm': return 'rounded-sm';
            case 'md': return 'rounded-md';
            case 'lg': return 'rounded-lg';
            case 'xl': return 'rounded-xl';
            case '2xl': return 'rounded-2xl';
            case 'full': return 'rounded-[2rem]';
            default: return 'rounded-2xl';
        }
    };

    const getShadowClass = (depth: string) => {
        switch (depth) {
            case 'none': return 'shadow-none';
            case 'sm': return 'shadow-sm';
            case 'md': return 'shadow-md';
            case 'lg': return 'shadow-lg';
            case 'xl': return 'shadow-xl';
            case '2xl': return 'shadow-2xl';
            default: return 'shadow-xl';
        }
    };

    const getBackgroundStyle = () => {
        if (portalSettings?.backgroundStyle === 'solid') return { backgroundColor: portalSettings.backgroundColor };
        if (portalSettings?.backgroundStyle === 'gradient') {
            return { background: `linear-gradient(135deg, ${portalSettings.backgroundColor}, ${portalSettings.gradientColor || '#ffffff'})` };
        }
        if (portalSettings?.backgroundStyle === 'mesh') {
            return {
                background: `radial-gradient(at 0% 0%, ${portalSettings.backgroundColor} 0px, transparent 50%),
                                radial-gradient(at 50% 0%, ${portalSettings.gradientColor} 0px, transparent 50%),
                                radial-gradient(at 100% 0%, ${portalSettings.backgroundColor} 0px, transparent 50%)`,
                backgroundColor: portalSettings.backgroundColor
            };
        }
        return { backgroundColor: portalSettings?.backgroundColor || '#f8fafc' };
    };

    const getFontClass = () => {
        switch (portalSettings?.fontFace) {
            case 'Roboto': return roboto.className;
            case 'Playfair Display': return playfair.className;
            case 'Montserrat': return montserrat.className;
            default: return inter.className;
        }
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center p-4 transition-all duration-700 ${getFontClass()}`}
            style={getBackgroundStyle()}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div
                    className={`${getRadiusClass(portalSettings?.borderRadius || '2xl')} ${getShadowClass(portalSettings?.shadowDepth || 'xl')} p-8 space-y-8 border border-white/20 transition-all duration-500`}
                    style={{
                        backgroundColor: portalSettings?.glassmorphism ? 'rgba(255, 255, 255, 0.65)' : 'white',
                        backdropFilter: portalSettings?.glassmorphism ? 'blur(16px) saturate(180%)' : 'none',
                        WebkitBackdropFilter: portalSettings?.glassmorphism ? 'blur(16px) saturate(180%)' : 'none',
                    }}
                >
                    <div className="text-center space-y-4">
                        {company.logoUrl ? (
                            <motion.img
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                src={company.logoUrl}
                                alt={company.name}
                                className="h-14 mx-auto object-contain"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                                <ShieldCheck className="h-10 w-10 text-primary" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight" style={{ color: portalSettings?.fontColor }}>{portalSettings?.title}</h1>
                            <p className="text-sm font-medium" style={{ color: portalSettings?.fontColor, opacity: 0.8 }}>{portalSettings?.description}</p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs uppercase tracking-widest font-bold" style={{ color: portalSettings?.fontColor, opacity: 0.9 }}>Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name@company.com"
                                                {...field}
                                                className="h-12 border-zinc-200 bg-white/50 focus:bg-white text-zinc-900 placeholder:text-zinc-500 transition-colors"
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
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="text-xs uppercase tracking-widest font-bold" style={{ color: portalSettings?.fontColor, opacity: 0.9 }}>Password</FormLabel>
                                            <a href="#" className="text-xs font-semibold text-primary/80 hover:text-primary underline-offset-4 hover:underline">Reset Helper</a>
                                        </div>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    {...field}
                                                    className="h-12 border-zinc-200 bg-white/50 focus:bg-white text-zinc-900 placeholder:text-zinc-500 transition-colors pr-12"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-12 w-12 text-zinc-400 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-bold transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-primary/20"
                                style={{
                                    backgroundColor: portalSettings?.primaryColor || '#9333ea',
                                    borderRadius: portalSettings?.borderRadius === 'full' ? '9999px' : undefined
                                }}
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                {portalSettings?.loginButtonText || 'Sign In'}
                            </Button>
                        </form>
                    </Form>

                    <div className="pt-6 text-center border-t border-zinc-200/50">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: portalSettings?.fontColor, opacity: 0.7 }}>{portalSettings?.footerText || 'Powered by InvoiceCraft'}</p>
                    </div>
                </div>

                <div className="text-center mt-8 space-y-2">
                    <p className="text-xs text-zinc-500 font-medium max-w-[280px] mx-auto opacity-80">
                        Interested in building your own portal? <a href="/" className="font-bold text-zinc-700 hover:text-primary transition-colors">Learn more about InvoiceCraft.</a>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
