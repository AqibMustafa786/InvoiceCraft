

'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { useCollection, useDoc, useFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Client, Estimate, Invoice, Quote, InsuranceDocument } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Edit, ArrowLeft, DollarSign, Clock, FileWarning, Files, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, subYears, eachMonthOfInterval, startOfMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { ClientFormDialog } from '@/components/dashboard/client-form-dialog';

const currencySymbols: { [key: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨',
};

type DocumentType = Invoice | Estimate | Quote | InsuranceDocument;

function ClientDashboardStats({ documents }: { documents: DocumentType[] }) {
  const stats = useMemo(() => {
    const invoices = documents.filter(d => d.documentType === 'invoice') as Invoice[];
    
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (i.summary?.grandTotal || 0), 0);
    const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((acc, i) => acc + (i.summary?.grandTotal || 0), 0);
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + (i.summary?.grandTotal || 0), 0);

    return {
      totalInvoices: invoices.length,
      totalRevenue,
      pendingAmount,
      overdueAmount,
      paidAmount: invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (i.amountPaid || 0), 0),
    };
  }, [documents]);

  const currency = (documents[0] as any)?.currency || 'USD';
  const symbol = currencySymbols[currency] || '$';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{stats.totalRevenue.toFixed(2)}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Amount</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{stats.pendingAmount.toFixed(2)}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Overdue Amount</CardTitle><FileWarning className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{stats.overdueAmount.toFixed(2)}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Invoices</CardTitle><Files className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalInvoices}</div></CardContent></Card>
    </div>
  );
}

function ClientCharts({ documents }: { documents: DocumentType[] }) {
  const invoiceData = documents.filter(doc => doc.documentType === 'invoice') as Invoice[];

  const monthlyRevenue = useMemo(() => {
    const last12Months = eachMonthOfInterval({
      start: subYears(new Date(), 1),
      end: new Date(),
    });

    const data = last12Months.map(month => ({
      name: format(month, 'MMM'),
      revenue: 0,
    }));

    invoiceData.forEach(invoice => {
      if (invoice.status === 'paid' && invoice.invoiceDate) {
        const monthIndex = new Date(invoice.invoiceDate).getMonth();
        const year = new Date(invoice.invoiceDate).getFullYear();
        const currentYear = new Date().getFullYear();
        if(year === currentYear || year === currentYear - 1){
            const monthName = format(new Date(invoice.invoiceDate), 'MMM');
            const dataPoint = data.find(d => d.name === monthName);
            if(dataPoint) dataPoint.revenue += invoice.summary.grandTotal;
        }
      }
    });

    return data;
  }, [invoiceData]);

  const statusBreakdown = useMemo(() => {
    const statuses: Record<string, number> = { paid: 0, sent: 0, overdue: 0, draft: 0 };
    invoiceData.forEach(invoice => {
      if (invoice.status in statuses) {
        statuses[invoice.status as keyof typeof statuses]++;
      }
    });
    return Object.entries(statuses).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, fill: `var(--color-${name})` }));
  }, [invoiceData]);

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--primary))" },
    paid: { label: "Paid", color: "hsl(var(--success))" },
    sent: { label: "Sent", color: "hsl(var(--secondary-foreground))" },
    overdue: { label: "Overdue", color: "hsl(var(--destructive))" },
    draft: { label: "Draft", color: "hsl(var(--muted-foreground))" },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4 md:grid-cols-2">
       <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue (Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={monthlyRevenue}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invoice Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <PieChart>
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={60} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const safeFormat = (date: any, formatString: string) => {
    if (!date) return 'N/A';
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, formatString);
    } catch (e) {
        return "Invalid Date";
    }
}


export default function ClientPage() {
  const { firestore } = useFirebase();
  const { userProfile } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { clientId } = params;
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

  const companyId = userProfile?.companyId;

  const clientRef = useMemo(() => {
    if (!firestore || !companyId || !clientId) return null;
    return doc(firestore, 'companies', companyId, 'clients', clientId as string);
  }, [firestore, companyId, clientId]);

  const invoicesQuery = useMemo(() => {
    if (!firestore || !companyId || !clientId) return null;
    return query(collection(firestore, 'companies', companyId, 'invoices'), where('client.clientId', '==', clientId));
  }, [firestore, companyId, clientId]);

  const estimatesQuery = useMemo(() => {
    if (!firestore || !companyId || !clientId) return null;
    return query(collection(firestore, 'companies', companyId, 'estimates'), where('client.clientId', '==', clientId));
  }, [firestore, companyId, clientId]);
  
  const { data: client, isLoading: isClientLoading } = useDoc<Client>(clientRef);
  const { data: invoices, isLoading: isInvoicesLoading } = useCollection<Invoice>(invoicesQuery);
  const { data: estimates, isLoading: isEstimatesLoading } = useCollection<Estimate>(estimatesQuery);

  const allDocuments: DocumentType[] = [...(invoices || []), ...(estimates || [])];

  if (isClientLoading || isInvoicesLoading || isEstimatesLoading) {
    return <div>Loading client data...</div>;
  }

  if (!client) {
    return <div>Client not found.</div>;
  }
  
  return (
    <div className="space-y-6">
       <ClientFormDialog
            open={isClientDialogOpen}
            onOpenChange={setIsClientDialogOpen}
            client={client}
            onSave={() => setIsClientDialogOpen(false)}
        />
       <div className="flex justify-between items-start">
         <Button variant="outline" onClick={() => router.push('/dashboard?tab=clients')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Clients
        </Button>
       </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
             <Avatar className="h-20 w-20">
                <AvatarImage src={client.avatarUrl || ''} />
                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <CardTitle className="text-2xl">{client.name}</CardTitle>
                <CardDescription>{client.companyName}</CardDescription>
             </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{client.phone}</span></div>
            <div className="pt-4 flex gap-2">
                <Button size="sm" className="w-full" onClick={() => setIsClientDialogOpen(true)}><Edit className="mr-2 h-4 w-4" /> Edit Client</Button>
                <Button size="sm" variant="outline" className="w-full"><Mail className="mr-2 h-4 w-4"/> Email Client</Button>
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
            <ClientDashboardStats documents={allDocuments} />
        </div>
      </div>
      
      <ClientCharts documents={allDocuments} />

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
           <Card>
            <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader><TableRow><TableHead>Number</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {invoices?.map(inv => (
                            <TableRow key={inv.id}>
                                <TableCell>{inv.invoiceNumber}</TableCell>
                                <TableCell>{currencySymbols[inv.currency] || '$'}{inv.summary.grandTotal.toFixed(2)}</TableCell>
                                <TableCell><Badge>{inv.status}</Badge></TableCell>
                                <TableCell>{safeFormat(inv.invoiceDate, 'MMM d, yyyy')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="estimates">
             <Card>
            <CardHeader><CardTitle>Estimates</CardTitle></CardHeader>
            <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Number</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {estimates?.map(est => (
                            <TableRow key={est.id}>
                                <TableCell>{est.estimateNumber}</TableCell>
                                <TableCell>{currencySymbols[est.currency] || '$'}{est.summary.grandTotal.toFixed(2)}</TableCell>
                                <TableCell><Badge>{est.status}</Badge></TableCell>
                                <TableCell>{safeFormat(est.estimateDate, 'MMM d, yyyy')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

