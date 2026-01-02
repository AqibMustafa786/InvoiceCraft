
'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Invoice, Client } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Clock, AlertTriangle, Users, ArrowLeft } from 'lucide-react';
import { format, subYears, eachMonthOfInterval, startOfYear, isAfter } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toDateSafe, toNumberSafe } from '@/lib/utils';


const currencySymbols: { [key: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨',
};

const safeFormat = (date: any, formatString: string) => {
    const d = toDateSafe(date);
    return d ? format(d, formatString) : "Invalid Date";
}

export default function AnalyticsPage() {
  const { userProfile } = useAuth();
  const { firestore } = useFirebase();
  const [revenueRange, setRevenueRange] = useState<'monthly' | 'yearly'>('monthly');
  const router = useRouter();

  const companyId = userProfile?.companyId;

  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return query(collection(firestore, 'companies', companyId, 'invoices'));
  }, [firestore, companyId]);

  const clientsQuery = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return query(collection(firestore, 'companies', companyId, 'clients'));
  }, [firestore, companyId]);

  const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);
  const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);

  const analyticsData = useMemo(() => {
    if (!invoices) return null;

    const paidInvoices = invoices.filter(i => i.status === 'paid');
    const sentInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'overdue');

    const totalRevenue = paidInvoices.reduce((acc, i) => acc + (toNumberSafe(i.summary?.grandTotal)), 0);
    const outstandingAmount = sentInvoices.reduce((acc, i) => acc + (toNumberSafe(i.summary?.grandTotal)) - (toNumberSafe(i.amountPaid)), 0);
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + (toNumberSafe(i.summary?.grandTotal)) - (toNumberSafe(i.amountPaid)), 0);
    
    return {
      totalRevenue,
      outstandingAmount,
      overdueAmount,
      totalClients: clients?.length || 0,
      paidInvoices,
    };
  }, [invoices, clients]);

  const revenueChartData = useMemo(() => {
    if (!analyticsData) return [];
    
    let data: { name: string, revenue: number }[] = [];
    const now = new Date();
    
    const paidInvoicesWithDate = analyticsData.paidInvoices.filter(invoice => {
        const invoiceDate = toDateSafe(invoice.invoiceDate);
        return !!invoiceDate;
    });

    if (revenueRange === 'yearly') {
        const start = startOfYear(now);
        const months = eachMonthOfInterval({ start, end: now });
        const dataMap = new Map(months.map(d => [format(d, 'MMM'), { name: format(d, 'MMM'), revenue: 0 }]));

        paidInvoicesWithDate.forEach(invoice => {
            const invoiceDate = toDateSafe(invoice.invoiceDate)!;
            if (isAfter(invoiceDate, start)) {
                const monthKey = format(invoiceDate, 'MMM');
                if (dataMap.has(monthKey)) {
                    dataMap.get(monthKey)!.revenue += toNumberSafe(invoice.summary.grandTotal);
                }
            }
        });
        data = Array.from(dataMap.values());
    } else { // monthly
        const last12Months = eachMonthOfInterval({ start: subYears(now, 1), end: now });
        const dataMap = new Map(last12Months.map(d => [format(d, 'yyyy-MMM'), { name: format(d, 'MMM yy'), revenue: 0 }]));

        paidInvoicesWithDate.forEach(invoice => {
            const invoiceDate = toDateSafe(invoice.invoiceDate)!;
             if (isAfter(invoiceDate, subYears(now,1))) {
                const monthKey = format(invoiceDate, 'yyyy-MMM');
                if (dataMap.has(monthKey)) {
                    dataMap.get(monthKey)!.revenue += toNumberSafe(invoice.summary.grandTotal);
                }
            }
        });
        data = Array.from(dataMap.values());
    }

    return data;
}, [analyticsData, revenueRange]);

  const clientRevenueData = useMemo(() => {
    if (!analyticsData) return [];
    
    const clientRevenue: Record<string, { name: string, revenue: number }> = {};

    analyticsData.paidInvoices.forEach(invoice => {
        const clientName = invoice.client.name;
        if (!clientRevenue[clientName]) {
            clientRevenue[clientName] = { name: clientName, revenue: 0 };
        }
        clientRevenue[clientName].revenue += toNumberSafe(invoice.summary.grandTotal);
    });

    return Object.values(clientRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [analyticsData]);

  const currency = invoices?.[0]?.currency || 'USD';
  const symbol = currencySymbols[currency] || '$';

  if (isLoadingInvoices || isLoadingClients) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'paid': return 'success';
        case 'sent': return 'secondary';
        case 'overdue': return 'destructive';
        case 'draft': default: return 'outline';
    }
  };
  
  const pageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-start">
         <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
        </Button>
       </div>
      <motion.h1 variants={itemVariants} className="text-3xl font-bold font-headline">Analytics</motion.h1>
      
      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{toNumberSafe(analyticsData?.totalRevenue).toFixed(2)}</div><p className="text-xs text-muted-foreground">From {analyticsData?.paidInvoices.length} paid invoices</p></CardContent></Card>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Outstanding Amount</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{toNumberSafe(analyticsData?.outstandingAmount).toFixed(2)}</div></CardContent></Card>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Overdue Amount</CardTitle><AlertTriangle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{toNumberSafe(analyticsData?.overdueAmount).toFixed(2)}</div></CardContent></Card>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Clients</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{analyticsData?.totalClients}</div></CardContent></Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Revenue Overview</CardTitle>
              <Tabs defaultValue="monthly" onValueChange={(value) => setRevenueRange(value as any)} className="w-auto">
                <TabsList className="h-7 text-xs">
                  <TabsTrigger value="monthly">Last 12 Months</TabsTrigger>
                  <TabsTrigger value="yearly">This Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>Total revenue from paid invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${symbol}${value / 1000}k`} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{backgroundColor: 'hsl(var(--background))'}} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
          <CardHeader>
            <CardTitle>Top Clients by Revenue</CardTitle>
            <CardDescription>Your most valuable clients based on paid invoices.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientRevenueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={80} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{backgroundColor: 'hsl(var(--background))'}} formatter={(value) => `${symbol}${toNumberSafe(value).toFixed(2)}`}/>
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

       <motion.div variants={itemVariants}>
         <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your 5 most recently updated invoices.</CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {invoices?.slice(0, 5).map(invoice => (
                    <TableRow key={invoice.id}>
                    <TableCell>{invoice.client.name}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge></TableCell>
                    <TableCell>{safeFormat(invoice.updatedAt, "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">{symbol}{toNumberSafe(invoice.summary.grandTotal).toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
         </Card>
       </motion.div>
    </motion.div>
  );
}
