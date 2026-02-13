'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUserAuth } from '@/context/auth-provider';
import { useFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Save, Loader2, UploadCloud } from 'lucide-react';
import type { Client, AuditLogEntry } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Label } from '@/components/ui/label';

const CLIENTS_COLLECTION = 'clients';

const clientSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  companyName: z.string().optional(),
  email: z.string().email({ message: "Invalid email format." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  shippingAddress: z.string().optional(),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  taxId: z.string().optional(),
  notes: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave: () => void;
}

const diffClients = (original: Partial<Client>, updated: Partial<Client>): string[] => {
  const changes: string[] = [];
  if (!original || !updated) return changes;

  const formatKey = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'empty';
    const strValue = String(value);
    return `"${strValue.substring(0, 30)}${strValue.length > 30 ? '...' : ''}"`;
  };

  const allKeys = new Set([...Object.keys(original), ...Object.keys(updated)]);

  allKeys.forEach(key => {
    if (['id', 'companyId', 'createdAt', 'updatedAt', 'auditLog'].includes(key)) return;

    const originalValue = (original as any)[key];
    const updatedValue = (updated as any)[key];

    if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
      changes.push(`${formatKey(key)} changed from ${formatValue(originalValue)} to ${formatValue(updatedValue)}`);
    }
  });

  return changes;
};

export function ClientFormDialog({ open, onOpenChange, client, onSave }: ClientFormDialogProps) {
  const { user, userProfile } = useUserAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(client?.avatarUrl);

  const isNewClient = !client;

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      shippingAddress: '',
      website: '',
      taxId: '',
      notes: '',
      avatarUrl: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (client) {
        form.reset(client);
        setAvatarPreview(client.avatarUrl);
      } else {
        form.reset({
          name: '',
          companyName: '',
          email: '',
          phone: '',
          address: '',
          shippingAddress: '',
          website: '',
          taxId: '',
          notes: '',
          avatarUrl: '',
        });
        setAvatarPreview(undefined);
      }
    }
  }, [client, open, form]);

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ title: "Image too large", description: "Please upload an image smaller than 4MB.", variant: "destructive" });
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!response.ok) throw new Error('Upload failed');

        const { url } = await response.json();
        setAvatarPreview(url);
        form.setValue('avatarUrl', url);
        toast({ title: "Avatar Uploaded", description: "The new avatar has been set." });
      } catch (error) {
        console.error("Upload error:", error);
        toast({ title: "Upload Failed", description: "Could not upload the image.", variant: "destructive" });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const onSubmit = async (data: ClientFormValues) => {
    setIsSaving(true);
    if (!firestore || !userProfile?.companyId || !user) {
      toast({ title: "Error", description: "Cannot save client. User or company not identified.", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    try {
      let idToSave: string;
      let auditLog: AuditLogEntry[] = client?.auditLog || [];

      if (isNewClient) {
        const safeName = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const safeCompany = (data.companyName || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const baseId = safeCompany ? `${safeName}-${safeCompany}` : safeName;
        idToSave = `${baseId}-${Math.random().toString(36).substring(2, 7)}`;
        auditLog.push({
          id: crypto.randomUUID(),
          action: 'created',
          timestamp: Timestamp.now(),
          user: { name: user.displayName || user.email, email: user.email },
          version: 1,
        });
      } else {
        idToSave = client!.id;
        const changes = diffClients(client, data);
        if (changes.length > 0) {
          auditLog.push({
            id: crypto.randomUUID(),
            action: 'updated',
            timestamp: Timestamp.now(),
            user: { name: user.displayName || user.email, email: user.email },
            version: (client.auditLog?.length || 0) + 1,
            changes: changes
          });
        }
      }

      const dataToSave: Client = {
        id: idToSave,
        companyId: userProfile.companyId,
        ...data,
        avatarUrl: avatarPreview || '',
        updatedAt: serverTimestamp(),
        createdAt: isNewClient ? serverTimestamp() : client?.createdAt,
        auditLog: auditLog,
      };

      await setDoc(doc(firestore, 'companies', userProfile.companyId, CLIENTS_COLLECTION, idToSave), dataToSave, { merge: true });

      toast({ title: "Success", description: `Client ${isNewClient ? 'created' : 'updated'} successfully.` });
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving client: ", error);
      toast({ title: "Error", description: "Failed to save client data.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">{isNewClient ? 'Create New Client' : 'Edit Client'}</DialogTitle>
          <DialogDescription>
            {isNewClient ? 'Add a new client to your records.' : `Editing ${client?.name}.`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-6 -mr-6">
          <Form {...form}>
            <form className="space-y-4 px-1">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatarPreview || ''} />
                  <AvatarFallback>{form.watch('name')?.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label>Profile Picture</Label>
                  <Button asChild variant="outline" className="w-full">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                      {isUploading ? 'Uploading...' : 'Upload Picture'}
                    </label>
                  </Button>
                  <Input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarUpload} accept="image/*" />
                </div>
              </div>

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="companyName" render={({ field }) => (
                <FormItem><FormLabel>Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Billing Address</FormLabel><FormControl><Textarea {...field} className="h-20" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="shippingAddress" render={({ field }) => (
                <FormItem><FormLabel>Shipping Address</FormLabel><FormControl><Textarea {...field} className="h-20" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem><FormLabel>Website</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="taxId" render={({ field }) => (
                <FormItem><FormLabel>Tax ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Internal Notes</FormLabel><FormControl><Textarea className="h-24" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="mt-auto pt-4 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSaving} onClick={form.handleSubmit(onSubmit)}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
