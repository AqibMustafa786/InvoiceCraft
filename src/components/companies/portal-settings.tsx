'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserAuth } from '@/context/auth-provider';
import { useFirebase } from '@/firebase';
import { doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Globe, Palette, Layout, ShieldCheck, Eye, Type, Layers, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PortalSettings as PortalSettingsType, Company } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const portalSchema = z.object({
    enabled: z.boolean(),
    slug: z.string().min(3).max(20).regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
    title: z.string().min(2, "Title is required"),
    description: z.string(),
    loginButtonText: z.string().min(1),
    backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
    footerText: z.string().optional(),
    // Modern Options
    glassmorphism: z.boolean(),
    borderRadius: z.string(),
    shadowDepth: z.string(),
    backgroundStyle: z.string(),
    gradientColor: z.string().optional(),
    fontFace: z.string(),
    fontColor: z.string().optional(),
});

type PortalFormValues = z.infer<typeof portalSchema>;

export function PortalSettings() {
    const { userProfile } = useUserAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [companyData, setCompanyData] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<PortalFormValues>({
        resolver: zodResolver(portalSchema),
        defaultValues: {
            enabled: false,
            slug: '',
            title: 'Welcome back',
            description: 'Sign in to access your company portal',
            loginButtonText: 'Sign In',
            backgroundColor: '#f8fafc',
            primaryColor: '#9333ea',
            footerText: 'Powered by InvoiceCraft',
            glassmorphism: false,
            borderRadius: 'lg',
            shadowDepth: 'md',
            backgroundStyle: 'solid',
            gradientColor: '#e9d5ff',
            fontFace: 'Inter',
            fontColor: '#18181b', // Default zinc-900
        }
    });

    useEffect(() => {
        const fetchCompany = async () => {
            if (!userProfile?.companyId || !firestore) return;
            try {
                const companyRef = doc(firestore, 'companies', userProfile.companyId);
                const { getDoc } = await import('firebase/firestore');
                const snap = await getDoc(companyRef);
                if (snap.exists()) {
                    const data = snap.data() as Company;
                    setCompanyData(data);
                    if (data.portalSettings) {
                        form.reset({
                            ...form.getValues(),
                            ...data.portalSettings
                        });
                    } else {
                        // Default slug if not set
                        form.setValue('slug', data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                        form.setValue('title', `Team ${data.name}`);
                    }
                }
            } catch (error) {
                console.error("Error fetching company:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCompany();
    }, [userProfile?.companyId, firestore, form]);

    const onSubmit = async (data: PortalFormValues) => {
        if (!userProfile?.companyId || !firestore) return;
        setIsSaving(true);

        try {
            // Check slug uniqueness (if changed)
            if (data.slug !== companyData?.portalSettings?.slug) {
                const q = query(
                    collection(firestore, 'companies'),
                    where('portalSettings.slug', '==', data.slug)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    form.setError('slug', { message: "This slug is already taken by another company." });
                    setIsSaving(false);
                    return;
                }
            }

            const companyRef = doc(firestore, 'companies', userProfile.companyId);
            await updateDoc(companyRef, {
                portalSettings: data,
                updatedAt: new Date()
            });

            toast({ title: "Settings Saved", description: "Your login portal has been updated." });
            setCompanyData(prev => prev ? ({ ...prev, portalSettings: data }) : null);
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    const watchedValues = form.watch();

    const getRadiusClass = (radius: string) => {
        switch (radius) {
            case 'none': return 'rounded-none';
            case 'sm': return 'rounded-sm';
            case 'md': return 'rounded-md';
            case 'lg': return 'rounded-lg';
            case 'xl': return 'rounded-xl';
            case '2xl': return 'rounded-2xl';
            case 'full': return 'rounded-full';
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
            default: return 'shadow-2xl';
        }
    };

    const getBackgroundStyle = () => {
        if (watchedValues.backgroundStyle === 'solid') return watchedValues.backgroundColor;
        if (watchedValues.backgroundStyle === 'gradient') {
            return `linear-gradient(135deg, ${watchedValues.backgroundColor}, ${watchedValues.gradientColor || '#ffffff'})`;
        }
        if (watchedValues.backgroundStyle === 'mesh') {
            return `radial-gradient(at 0% 0%, ${watchedValues.backgroundColor} 0px, transparent 50%),
                    radial-gradient(at 50% 0%, ${watchedValues.gradientColor} 0px, transparent 50%),
                    radial-gradient(at 100% 0%, ${watchedValues.backgroundColor} 0px, transparent 50%)`;
        }
        return watchedValues.backgroundColor;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Login Portal</h3>
                    <p className="text-sm text-muted-foreground">
                        Create a custom branded experience for your employees.
                    </p>
                </div>
                {watchedValues.enabled && (
                    <Button variant="outline" size="sm" asChild>
                        <a href={`/c/${watchedValues.slug}/login`} target="_blank" rel="noreferrer">
                            <Eye className="mr-2 h-4 w-4" /> View Portal
                        </a>
                    </Button>
                )}
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                            <TabsTrigger value="general"><Layout className="mr-2 h-4 w-4" /> Configuration</TabsTrigger>
                            <TabsTrigger value="design"><Palette className="mr-2 h-4 w-4" /> Design & Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-6 pt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Portal Activation</CardTitle>
                                    <CardDescription>Enable or disable your custom login URL.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="enabled"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Active Status</FormLabel>
                                                    <FormDescription>
                                                        When active, users can login via your custom URL.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Portal Slug (URL)</FormLabel>
                                                <div className="flex items-center">
                                                    <div className="bg-muted px-3 py-2 border border-r-0 rounded-l-md text-sm text-muted-foreground whitespace-nowrap">
                                                        invoicecraft.com/c/
                                                    </div>
                                                    <FormControl>
                                                        <Input placeholder="acme-corp" className="rounded-l-none" {...field} />
                                                    </FormControl>
                                                </div>
                                                <FormDescription>
                                                    The unique address your employees will use to sign in.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Content Settings</CardTitle>
                                    <CardDescription>Customize the text shown on your login page.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Header Title</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subtitle/Instructions</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="loginButtonText"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Button Label</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="design" className="space-y-6 pt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Theme & Styles</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="backgroundStyle"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Background Style</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="solid">Solid Color</SelectItem>
                                                                    <SelectItem value="gradient">Linear Gradient</SelectItem>
                                                                    <SelectItem value="mesh">Mesh Gradient</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="fontFace"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Font Family</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Inter">Inter (Sans)</SelectItem>
                                                                    <SelectItem value="Roboto">Roboto (Clean)</SelectItem>
                                                                    <SelectItem value="Playfair Display">Playfair (Serif)</SelectItem>
                                                                    <SelectItem value="Montserrat">Montserrat (Modern)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="fontColor"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Font Color</FormLabel>
                                                            <div className="flex gap-2">
                                                                <FormControl><Input type="color" className="w-10 h-10 p-1" {...field} /></FormControl>
                                                                <Input value={field.value} onChange={field.onChange} className="flex-1" />
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="backgroundColor"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Base Color</FormLabel>
                                                            <div className="flex gap-2">
                                                                <FormControl><Input type="color" className="w-10 h-10 p-1" {...field} /></FormControl>
                                                                <Input value={field.value} onChange={field.onChange} className="flex-1" />
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                                {(watchedValues.backgroundStyle === 'gradient' || watchedValues.backgroundStyle === 'mesh') && (
                                                    <FormField
                                                        control={form.control}
                                                        name="gradientColor"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Accent Color</FormLabel>
                                                                <div className="flex gap-2">
                                                                    <FormControl><Input type="color" className="w-10 h-10 p-1" {...field} /></FormControl>
                                                                    <Input value={field.value} onChange={field.onChange} className="flex-1" />
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />
                                                )}
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="primaryColor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Button Color</FormLabel>
                                                        <div className="flex gap-2">
                                                            <FormControl><Input type="color" className="w-10 h-10 p-1" {...field} /></FormControl>
                                                            <Input value={field.value} onChange={field.onChange} className="flex-1" />
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="h-4 w-4" /> Card Effects</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="glassmorphism"
                                                render={({ field }) => (
                                                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Glassmorphism</FormLabel>
                                                            <FormDescription className="text-[10px]">Translucent frosted effect.</FormDescription>
                                                        </div>
                                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="borderRadius"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Corner Radius</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="none">Sharp</SelectItem>
                                                                    <SelectItem value="sm">Small</SelectItem>
                                                                    <SelectItem value="md">Medium</SelectItem>
                                                                    <SelectItem value="lg">Large</SelectItem>
                                                                    <SelectItem value="xl">Extra Large</SelectItem>
                                                                    <SelectItem value="2xl">Double Extra Large</SelectItem>
                                                                    <SelectItem value="full">Round</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="shadowDepth"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Shadow Depth</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="none">Flat</SelectItem>
                                                                    <SelectItem value="sm">Light</SelectItem>
                                                                    <SelectItem value="md">Standard</SelectItem>
                                                                    <SelectItem value="lg">Deep</SelectItem>
                                                                    <SelectItem value="xl">Soft</SelectItem>
                                                                    <SelectItem value="2xl">Dynamic</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader><CardTitle>Footer</CardTitle></CardHeader>
                                        <CardContent>
                                            <FormField
                                                control={form.control}
                                                name="footerText"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Footer Message</FormLabel>
                                                        <FormControl><Input {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                        <Eye className="h-4 w-4" /> Live Preview
                                    </div>
                                    <div
                                        className="border rounded-xl aspect-[4/3] flex items-center justify-center p-8 overflow-hidden transition-all duration-500 relative"
                                        style={{
                                            background: getBackgroundStyle(),
                                            fontFamily: watchedValues.fontFace === 'Inter' ? 'inherit' : `${watchedValues.fontFace}, sans-serif`
                                        }}
                                    >
                                        <div
                                            className={`${getRadiusClass(watchedValues.borderRadius)} ${getShadowClass(watchedValues.shadowDepth)} p-6 w-full max-w-sm space-y-4 border border-border/50 transition-all duration-300`}
                                            style={{
                                                backgroundColor: watchedValues.glassmorphism ? 'rgba(255, 255, 255, 0.4)' : 'white',
                                                backdropFilter: watchedValues.glassmorphism ? 'blur(12px)' : 'none',
                                                WebkitBackdropFilter: watchedValues.glassmorphism ? 'blur(12px)' : 'none',
                                            }}
                                        >
                                            <div className="space-y-2 text-center">
                                                {companyData?.logoUrl ? (
                                                    <img src={companyData.logoUrl} alt="Logo" className="h-10 mx-auto object-contain mb-2" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                                        <ShieldCheck className="h-6 w-6 text-primary" />
                                                    </div>
                                                )}
                                                <h4 className="text-xl font-bold" style={{ color: watchedValues.fontColor }}>{watchedValues.title}</h4>
                                                <p className="text-xs" style={{ color: watchedValues.fontColor, opacity: 0.8 }}>{watchedValues.description}</p>
                                            </div>

                                            <div className="space-y-3">
                                                <Skeleton className="h-9 w-full opacity-50" />
                                                <Skeleton className="h-9 w-full opacity-50" />
                                                <Button
                                                    className="w-full h-9 transition-colors duration-300 pointer-events-none"
                                                    style={{
                                                        backgroundColor: watchedValues.primaryColor,
                                                        borderRadius: watchedValues.borderRadius === 'full' ? '9999px' : 'inherit'
                                                    }}
                                                >
                                                    {watchedValues.loginButtonText}
                                                </Button>
                                            </div>

                                            <div className="pt-2 text-center">
                                                <p className="text-[10px]" style={{ color: watchedValues.fontColor, opacity: 0.7 }}>{watchedValues.footerText}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-center text-muted-foreground italic">Note: Google Fonts will be fully rendered on the live portal.</p>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <Button type="submit" className="w-[200px]" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

