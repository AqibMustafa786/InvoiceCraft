

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ArrowLeft, Save, Globe, Hash, Pencil, Users, DollarSign, Clock, FileWarning, Files, CheckCircle, FileQuestion, Percent, AreaChart, Shield, FilePlus2, Mail } from 'lucide-react';
import type { Client, Invoice, Estimate } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { ChartContainer, ChartTooltipContent, ChartConfig } from "@/components/ui/chart"
import { format } from 'date-fns';


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

type KpiCardProps = {
    title: string;
    value: string | number;
    description?: string;
    icon: React.ReactNode;
};

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description, icon }) => (
    <Card className="bg-card/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

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
    if (firestore && userProfile?.companyId && !isNewClient) {
      return query(
        collection(firestore, 'companies', userProfile.companyId, 'invoices'), 
        where('client.clientId', '==', clientId)
      );
    }
    return null;
  }, [firestore, userProfile?.companyId, clientId, isNewClient]);

  const estimatesQuery = useMemoFirebase(() => {
    if (firestore && userProfile?.companyId && !isNewClient) {
      return query(
        collection(firestore, 'companies', userProfile.companyId, 'estimates'), 
        where('client.clientId', '==', clientId)
      );
    }
    return null;
  }, [firestore, userProfile?.companyId, clientId, isNewClient]);


  const { data: invoices } = useCollection<Invoice>(invoicesQuery);
  const { data: estimates } = useCollection<Estimate>(estimatesQuery);

  const clientKPIs = useMemo(() => {
    if (!invoices || !estimates) return null;
    
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'sent');
    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.summary.grandTotal, 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.summary.grandTotal, 0);
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.summary.grandTotal, 0);

    const acceptedEstimates = estimates.filter(est => est.status === 'accepted');
    const totalEstimatedValue = estimates.reduce((sum, est) => sum + est.summary.grandTotal, 0);

    return {
        totalInvoices: invoices.length,
        totalRevenue,
        pendingAmount,
        overdueAmount,
        totalEstimates: estimates.length,
        acceptedEstimates: acceptedEstimates.length,
        totalEstimatedValue,
    }
  }, [invoices, estimates]);

  const chartData = useMemo(() => {
    if (!invoices) return null;
    const monthlyRevenue: Record<string, number> = {};
    const invoiceStatusCount: Record<string, number> = { paid: 0, sent: 0, overdue: 0, draft: 0 };
    
    invoices.forEach(inv => {
      // Monthly Revenue (for paid invoices)
      if (inv.status === 'paid' && inv.invoiceDate) {
        const month = format(new Date(inv.invoiceDate), 'MMM yyyy');
        if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
        monthlyRevenue[month] += inv.summary.grandTotal;
      }
      
      // Invoice Status
      if(invoiceStatusCount[inv.status] !== undefined) {
        invoiceStatusCount[inv.status]++;
      }
    });

    const revenueChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })).slice(-12);
    const statusChart = Object.entries(invoiceStatusCount).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, fill: `var(--color-${name})`}));

    return { revenueChart, statusChart };
  }, [invoices]);

  const revenueChartConfig = {
      revenue: { label: "Revenue", color: "hsl(var(--primary))" }
  } satisfies ChartConfig

  const statusChartConfig = {
      paid: { label: "Paid", color: "hsl(var(--chart-1))" },
      sent: { label: "Pending", color: "hsl(var(--chart-2))" },
      overdue: { label: "Overdue", color: "hsl(var(--chart-3))" },
      draft: { label: "Draft", color: "hsl(var(--chart-4))" }
  } satisfies ChartConfig


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

  const handleCreateInvoice = () => {
    if (isNewClient) {
      toast({ title: "Save Client First", description: "Please save the client before creating an invoice.", variant: "destructive"});
      return;
    }
    router.push(`/create-invoice?clientId=${clientId}`);
  }

  const handleCreateEstimate = () => {
    if (isNewClient) {
      toast({ title: "Save Client First", description: "Please save the client before creating an estimate.", variant: "destructive"});
      return;
    }
    router.push(`/create-estimate?clientId=${clientId}`);
  }


  if (isLoadingClient) {
    return <div className="container mx-auto p-4 md:p-6"><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/dashboard?tab=clients')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold font-headline">{isNewClient ? 'Create New Client' : form.getValues('name')}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
           <Card className='bg-card/50 backdrop-blur-sm'>
              <CardHeader className="p-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Client Information</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="p-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                    <div className="flex justify-end pt-2">
                      <Button type="submit" size="sm" disabled={isSaving}><Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Client'}</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
             <Card className='bg-card/50 backdrop-blur-sm'>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col space-y-2">
                 <Button onClick={handleCreateInvoice}><FilePlus2 className="mr-2 h-4 w-4" /> Create Invoice</Button>
                 <Button onClick={handleCreateEstimate} variant="secondary"><FilePlus2 className="mr-2 h-4 w-4" /> Create Estimate</Button>
                 <Button variant="outline" onClick={() => window.location.href = `mailto:${form.getValues('email')}`}><Mail className="mr-2 h-4 w-4" /> Email Client</Button>
              </CardContent>
            </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
            {!isNewClient && clientKPIs && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KpiCard title="Total Revenue" value={`$${clientKPIs.totalRevenue.toFixed(2)}`} description={`${clientKPIs.totalInvoices} Invoices`} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Pending Amount" value={`$${clientKPIs.pendingAmount.toFixed(2)}`} icon={<Clock className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Overdue Amount" value={`$${clientKPIs.overdueAmount.toFixed(2)}`} icon={<FileWarning className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Accepted Estimates" value={clientKPIs.acceptedEstimates} description={`${clientKPIs.totalEstimates} total estimates`} icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />} />
                </div>
            )}
             {!isNewClient && chartData && (
                <Card className="bg-card/50 backdrop-blur-sm">
                     <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                    </CardHeader>
                     <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Monthly Revenue</h3>
                           <ChartContainer config={revenueChartConfig} className="h-[200px] w-full">
                                <BarChart data={chartData.revenueChart} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value/1000}k`} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                        <div>
                           <h3 className="text-sm font-semibold mb-2">Invoice Status</h3>
                           <ChartContainer config={statusChartConfig} className="h-[200px] w-full">
                              <PieChart>
                                  <Tooltip content={<ChartTooltipContent hideLabel />} />
                                  <Pie data={chartData.statusChart} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={5} />
                                  <Legend content={({ payload }) => {
                                      return (
                                        <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-xs mt-2">
                                          {payload?.map((entry, index) => (
                                            <li key={`item-${index}`} className="flex items-center gap-1.5">
                                              <div className="h-2.5 w-2.5 rounded-full" style={{backgroundColor: entry.color}} />
                                              {entry.value}
                                            </li>
                                          ))}
                                        </ul>
                                      )
                                    }} />
                              </PieChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {!isNewClient && (
                <Card className='bg-card/50 backdrop-blur-sm'>
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
                                    {invoices && invoices.length > 0 ? invoices.map(inv => (
                                        <TableRow key={inv.id} className="cursor-pointer" onClick={() => router.push(`/create-invoice?draftId=${inv.id}`)}>
                                            <TableCell>{inv.invoiceNumber}</TableCell>
                                            <TableCell><Badge>{inv.status}</Badge></TableCell>
                                            <TableCell className="text-right">${inv.summary.grandTotal.toFixed(2)}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24">No invoices found for this client.</TableCell>
                                        </TableRow>
                                    )}
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
                                    {estimates && estimates.length > 0 ? estimates.map(est => (
                                        <TableRow key={est.id} className="cursor-pointer" onClick={() => router.push(`/create-estimate?draftId=${est.id}`)}>
                                            <TableCell>{est.estimateNumber}</TableCell>
                                            <TableCell><Badge>{est.status}</Badge></TableCell>
                                            <TableCell className="text-right">${est.summary.grandTotal.toFixed(2)}</TableCell>
                                        </TableRow>
                                    )) : (
                                         <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24">No estimates found for this client.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
        </div>
      </div>
    </div>
  );
}

