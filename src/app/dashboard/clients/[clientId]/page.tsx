
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
import { ArrowLeft, Save } from 'lucide-react';
import type { Client, Invoice, Estimate, Quote } from '@/lib/types';

const CLIENTS_COLLECTION = 'clients';

export default function ClientProfilePage() {
  const { clientId } = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { firestore } = useFirebase();
  const { toast } = useToast();

  const isNewClient = clientId === 'new';
  const [clientData, setClientData] = useState<Partial<Client>>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    address: '',
  });

  const docRef = useMemoFirebase(() => {
    if (isNewClient || !firestore || !userProfile?.companyId) return null;
    return doc(firestore, 'companies', userProfile.companyId, CLIENTS_COLLECTION, clientId as string);
  }, [clientId, isNewClient, firestore, userProfile?.companyId]);

  const { data: existingClient, isLoading: isLoadingClient } = useDoc<Client>(docRef);
  
  const invoicesQuery = useMemoFirebase(() => (firestore && userProfile?.companyId && clientData.name ? query(collection(firestore, 'companies', userProfile.companyId, 'invoices'), where('client.name', '==', clientData.name)) : null), [firestore, userProfile?.companyId, clientData.name]);
  const estimatesQuery = useMemoFirebase(() => (firestore && userProfile?.companyId && clientData.name ? query(collection(firestore, 'companies', userProfile.companyId, 'estimates'), where('client.name', '==', clientData.name)) : null), [firestore, userProfile?.companyId, clientData.name]);

  const { data: invoices } = useCollection<Invoice>(invoicesQuery);
  const { data: estimates } = useCollection<Estimate>(estimatesQuery);

  useEffect(() => {
    if (existingClient) {
      setClientData(existingClient);
    }
  }, [existingClient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!firestore || !userProfile?.companyId) {
      toast({ title: "Error", description: "Cannot save client. User or company not identified.", variant: "destructive" });
      return;
    }
    
    if (!clientData.name || !clientData.email) {
      toast({ title: "Validation Error", description: "Name and Email are required.", variant: "destructive" });
      return;
    }

    try {
      let idToSave = isNewClient ? doc(collection(firestore, 'companies', userProfile.companyId, CLIENTS_COLLECTION)).id : (clientId as string);
      
      const dataToSave = {
        ...clientData,
        id: idToSave,
        companyId: userProfile.companyId,
        updatedAt: serverTimestamp(),
        createdAt: isNewClient ? serverTimestamp() : existingClient?.createdAt,
      };

      await setDoc(doc(firestore, 'companies', userProfile.companyId, CLIENTS_COLLECTION, idToSave), dataToSave);
      
      toast({ title: "Success", description: `Client ${isNewClient ? 'created' : 'updated'} successfully.` });
      
      if (isNewClient) {
        router.push(`/dashboard/clients/${idToSave}`);
      }
    } catch (error) {
      console.error("Error saving client: ", error);
      toast({ title: "Error", description: "Failed to save client data.", variant: "destructive" });
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
        <h1 className="text-3xl font-bold font-headline">{isNewClient ? 'Create New Client' : clientData.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Manage the contact and address details for this client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={clientData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" name="companyName" value={clientData.companyName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={clientData.email} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={clientData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" value={clientData.address} onChange={handleInputChange} />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Client</Button>
          </div>
        </CardContent>
      </Card>

      {!isNewClient && (
        <Card>
          <CardHeader>
            <CardTitle>Associated Documents</CardTitle>
            <CardDescription>All invoices and estimates related to {clientData.name}.</CardDescription>
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

