
'use client';

import { useState, useEffect } from 'react';
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
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Save, Globe, Hash } from 'lucide-react';
import type { Client } from '@/lib/types';

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
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSave: () => void;
}

export function ClientFormDialog({ open, onOpenChange, client, onSave }: ClientFormDialogProps) {
  const { userProfile } = useUserAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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
      notes: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (client) {
        form.reset(client);
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
          notes: ''
        });
      }
    }
  }, [client, open, form]);

  const onSubmit = async (data: ClientFormValues) => {
    setIsSaving(true);
    if (!firestore || !userProfile?.companyId) {
      toast({ title: "Error", description: "Cannot save client. User or company not identified.", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    try {
      let idToSave: string;
      if (isNewClient) {
        const safeName = data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const safeCompany = (data.companyName || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const baseId = safeCompany ? `${safeName}-${safeCompany}` : safeName;
        idToSave = `${baseId}-${Math.random().toString(36).substring(2, 7)}`;
      } else {
        idToSave = client!.id;
      }

      const dataToSave: Client = {
        id: idToSave,
        companyId: userProfile.companyId,
        name: data.name,
        email: data.email,
        companyName: data.companyName || '',
        phone: data.phone || '',
        address: data.address || '',
        shippingAddress: data.shippingAddress || '',
        website: data.website || '',
        taxId: data.taxId || '',
        notes: data.notes || '',
        updatedAt: serverTimestamp(),
        createdAt: isNewClient ? serverTimestamp() : client?.createdAt,
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
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle>{isNewClient ? 'Create New Client' : 'Edit Client'}</DialogTitle>
          <DialogDescription>
            {isNewClient ? 'Add a new client to your records.' : `Editing ${client?.name}.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 py-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="companyName" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Billing Address</FormLabel><FormControl><Textarea {...field} className="h-16" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="shippingAddress" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">Shipping Address</FormLabel><FormControl><Textarea {...field} className="h-16" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="website" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Website</FormLabel>
                <FormControl><div className="relative flex items-center"><Globe className="absolute left-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9 text-xs h-9" {...field} /></div></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="taxId" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Tax ID</FormLabel>
                <FormControl><div className="relative flex items-center"><Hash className="absolute left-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9 text-xs h-9" {...field} /></div></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Internal Notes</FormLabel>
                <FormControl><Textarea className="h-16" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>

        <DialogFooter className="mt-auto pt-4 gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" disabled={isSaving} onClick={form.handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
