
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { useFirebase, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, setDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Globe, Hash, Pencil } from 'lucide-react';
import type { Client, Invoice, Estimate } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const CLIENTS_COLLECTION = 'clients';

const clientSchema = z.object({
  name: z.string().min(1, { message: "Full name is required." }),
  companyName: z.string().optional(),
  email: z.string().email({ message: "Invalid email format." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  shippingAddress: z.string().optional(),
  website: z.string().optional(),
  taxId: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function ClientProfilePage() {
  const { clientId } = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const isNewClient = clientId === 'new';

  const docRef = useMemoFirebase(() => {
    if (isNewClient || !firestore || !userProfile?.companyId) return null;
    return doc(firestore, 'companies', userProfile.companyId, CLIENTS_COLLECTION, clientId as string);
  }, [clientId, isNewClient, firestore, userProfile?.companyId]);

  const { data: existingClient, isLoading: isLoadingClient } = useDoc<Client>(docRef);
  
  const invoicesQuery = useMemoFirebase(() => {
    if (firestore && userProfile?.companyId && existingClient?.companyName && !isNewClient) {
      return query(
        collection(firestore, 'companies', userProfile.companyId, 'invoices'), 
        where('client.companyName', '==', existingClient.companyName)
      );
    }
    return null;
  }, [firestore, userProfile?.companyId, existingClient, isNewClient]);

  const estimatesQuery = useMemoFirebase(() => {
    if (firestore && userProfile?.companyId && existingClient?.companyName && !isNewClient) {
      return query(
        collection(firestore, 'companies', userProfile.companyId, 'estimates'), 
        where('client.companyName', '==', existingClient.companyName)
      );
    }
    return null;
  }, [firestore, userProfile?.companyId, existingClient, isNewClient]);


  const { data: invoices } = useCollection<Invoice>(invoicesQuery);
  const { data: estimates } = useCollection<Estimate>(estimatesQuery);

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
    if (existingClient) {
      form.reset(existingClient);
    }
  }, [existingClient, form]);

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
        idToSave = clientId as string;
      }
      
      const dataToSave: Client = {
        id: idToSave,
        companyId: userProfile.companyId,
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: isNewClient ? serverTimestamp() : existingClient?.createdAt,
      };

      await setDoc(doc(firestore, 'companies', userProfile.companyId, CLIENTS_COLLECTION, idToSave), dataToSave, { merge: true });
      
      toast({ title: "Success", description: `Client ${isNewClient ? 'created' : 'updated'} successfully.` });
      
      if (isNewClient) {
        router.push(`/dashboard/clients/${idToSave}`);
      }
    } catch (error) {
      console.error("Error saving client: ", error);
      toast({ title: "Error", description: "Failed to save client data.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingClient) {
    return <div className="container mx-auto p-4 md:p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold font-headline">{isNewClient ? 'Create New Client' : form.getValues('name')}</h1>
      </div>

      <Card className="bg-card shadow-lg">
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Manage the contact and address details for this client.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <FormItem><FormLabel>Billing Address</FormLabel><FormControl><Textarea {...field} className="h-24" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="shippingAddress" render={({ field }) => (
                  <FormItem><FormLabel>Shipping Address</FormLabel><FormControl><Textarea {...field} className="h-24" /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="website" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl><div className="relative flex items-center"><Globe className="absolute left-3 h-5 w-5 text-muted-foreground" /><Input className="pl-10" {...field} /></div></FormControl>
                    <FormMessage />
                  </FormItem>
                 )} />
                  <FormField control={form.control} name="taxId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID / VAT Number</FormLabel>
                      <FormControl><div className="relative flex items-center"><Hash className="absolute left-3 h-5 w-5 text-muted-foreground" /><Input className="pl-10" {...field} /></div></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <div className="md:col-span-2">
                    <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Internal Notes</FormLabel>
                        <FormControl><div className="relative flex items-center"><Pencil className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /><Textarea className="pl-10 h-24" {...field} /></div></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSaving}><Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Client'}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {!isNewClient && (
        <Card>
          <CardHeader>
            <CardTitle>Associated Documents</CardTitle>
            <CardDescription>All invoices and estimates related to {form.getValues('name')}.</CardDescription>
          </CardHeader>
          <CardContent>
             <Tabs defaultValue="invoices">
                <TabsList>
                    <TabsTrigger value="invoices">Invoices ({invoices?.length || 0})</TabsTrigger>
                    <TabsTrigger value="estimates">Estimates ({estimates?.length || 0})</TabsTrigger>
                </TabsList>
                <TabsContent value="invoices" className="mt-4">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices && invoices.map(inv => (
                                <TableRow key={inv.id}>
                                    <TableCell>{inv.invoiceNumber}</TableCell>
                                    <TableCell><Badge>{inv.status}</Badge></TableCell>
                                    <TableCell className="text-right">${inv.summary.grandTotal.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                 <TabsContent value="estimates" className="mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {estimates && estimates.map(est => (
                                <TableRow key={est.id}>
                                    <TableCell>{est.estimateNumber}</TableCell>
                                    <TableCell><Badge>{est.status}</Badge></TableCell>
                                    <TableCell className="text-right">${est.summary.grandTotal.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
    

    

    

    