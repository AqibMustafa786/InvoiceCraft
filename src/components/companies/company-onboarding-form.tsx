'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUserAuth } from '@/context/auth-provider';
import { useFirebase } from '@/firebase';
import { doc, setDoc, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Loader2, UploadCloud, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const companySchema = z.object({
    name: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    address: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
    logoUrl: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export function CompanyOnboardingForm() {
    const { user, userProfile } = useUserAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            address: '',
            phone: '',
            website: '',
            logoUrl: '',
        }
    });

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 4 * 1024 * 1024) {
                toast({ title: "Image too large", description: "Max size is 4MB.", variant: "destructive" });
                return;
            }

            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload', { method: 'POST', body: formData });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Upload failed');
                }

                const { url } = await response.json();
                setLogoPreview(url);
                form.setValue('logoUrl', url);
                toast({ title: "Logo Uploaded", description: "Company logo set." });
            } catch (error: any) {
                console.error("Upload error:", error);
                toast({
                    title: "Upload Failed",
                    description: error.message || "Could not upload image.",
                    variant: "destructive"
                });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const onSubmit = async (data: CompanyFormValues) => {
        if (!user || !firestore) return;
        setIsSaving(true);

        try {
            // 1. Generate Company ID
            const companyId = `COMP_${user.uid.slice(0, 8).toUpperCase()}_${Date.now().toString().slice(-4)}`;

            // 2. Create Company Document
            const companyRef = doc(firestore, 'companies', companyId);
            await setDoc(companyRef, {
                id: companyId,
                name: data.name,
                address: data.address || '',
                phone: data.phone || '',
                website: data.website || '',
                logoUrl: data.logoUrl || '',
                ownerId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 3. Initialize Subcollections (Standard Business Structure)
            const batch = writeBatch(firestore);
            const collections = ['employees', 'clients', 'invoices', 'estimates', 'insurance'];
            collections.forEach(col => {
                const ref = doc(firestore, `companies/${companyId}/${col}`, 'placeholder');
                batch.set(ref, { _init: true, createdAt: serverTimestamp(), description: 'Init collection' });
            });
            await batch.commit();

            // 4. Create User Profile inside Company
            const companyUserRef = doc(firestore, `companies/${companyId}/users`, user.uid);
            await setDoc(companyUserRef, {
                uid: user.uid,
                email: user.email,
                name: userProfile?.name || user.displayName || 'Owner',
                role: 'admin', // Owner is Admin of their company
                status: 'active',
                joinedAt: serverTimestamp(),
            });

            // 5. Update Global User Profile
            const userRef = doc(firestore, 'users', user.uid);
            await updateDoc(userRef, {
                companyId: companyId,
                plan: 'Business', // Upgrade to Business
                role: 'owner',     // Ensure they are marked as owner
                updatedAt: serverTimestamp(),
            });

            toast({
                title: "Company Created!",
                description: "Your workspace is ready. Redirecting...",
            });

            // Force reload or redirect
            window.location.href = '/dashboard';

        } catch (error: any) {
            console.error("Error creating company:", error);
            toast({ title: "Setup Failed", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-card rounded-lg border shadow-sm">
            <div className="text-center mb-6">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Setup Your Company</h1>
                <p className="text-muted-foreground mt-2">Enter your business details to unlock the full dashboard.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    <div className="flex justify-center mb-6">
                        <div className="text-center">
                            <div className="relative h-24 w-24 mx-auto mb-2 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted/30">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                                ) : (
                                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={isUploading}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">{isUploading ? 'Uploading...' : 'Upload Logo'}</p>
                        </div>
                    </div>

                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input placeholder="Acme Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem><FormLabel>Website (Optional)</FormLabel><FormControl><Input placeholder="https://acme.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="+1 234..." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="New York, NY" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                    <Button type="submit" className="w-full mt-4" disabled={isSaving || isUploading}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSaving ? 'Setting up...' : 'Create Workspace'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
