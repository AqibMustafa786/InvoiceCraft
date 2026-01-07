

'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { useCollection, useDoc, deleteDocumentNonBlocking, updateDocumentNonBlocking, sendDocumentByEmail } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Client, Estimate, Invoice, Quote, InsuranceDocument, AuditLogEntry, DocumentStatus } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Edit, ArrowLeft, DollarSign, Clock, FileWarning, Files, XCircle, FilePlus2, FileText, Shield, Trash2, History, MoreHorizontal, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, subYears, eachMonthOfInterval, startOfMonth, subDays, eachDayOfInterval, startOfYear, isAfter } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { ClientFormDialog } from '@/components/dashboard/client-form-dialog';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HistoryModal } from '@/components/dashboard/history-modal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ClientInvoicePreview } from '@/components/invoice-preview';
import { motion } from 'framer-motion';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { toDateSafe, toNumberSafe } from '@/lib/utils';


const currencySymbols: { [key: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨',
};

type DocumentType = Invoice | Estimate | Quote | InsuranceDocument;
const STATUS_OPTIONS: DocumentStatus[] = ['draft', 'sent', 'paid', 'overdue', 'accepted', 'rejected', 'expired', 'active', 'cancelled'];

function ClientDashboardStats({ documents }: { documents: DocumentType[] }) {
  const stats = useMemo(() => {
    const invoices = documents.filter(d => d.documentType === 'invoice') as Invoice[];
    
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (toNumberSafe(i.summary?.grandTotal)), 0);
    const pendingAmount = invoices.filter(i => i.status === 'sent').reduce((acc, i) => acc + (toNumberSafe(i.summary?.grandTotal)), 0);
    const overdueAmount = invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + (toNumberSafe(i.summary?.grandTotal)), 0);

    return {
      totalInvoices: invoices.length,
      totalRevenue,
      pendingAmount,
      overdueAmount,
      paidAmount: invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (toNumberSafe(i.amountPaid)), 0),
    };
  }, [documents]);

  const currency = (documents[0] as any)?.currency || 'USD';
  const symbol = currencySymbols[currency] || '$';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{stats.totalRevenue.toFixed(2)}</div></CardContent></Card>
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Amount</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{stats.pendingAmount.toFixed(2)}</div></CardContent></Card>
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Overdue Amount</CardTitle><FileWarning className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{symbol}{stats.overdueAmount.toFixed(2)}</div></CardContent></Card>
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Invoices</CardTitle><Files className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalInvoices}</div></CardContent></Card>
    </div>
  );
}

function ClientCharts({ documents }: { documents: DocumentType[] }) {
  const [revenueRange, setRevenueRange] = useState<'monthly' | 'yearly' | 'daily'>('monthly');
  const invoiceData = documents.filter(doc => doc.documentType === 'invoice') as Invoice[];

  const revenueData = useMemo(() => {
    let data: { name: string, revenue: number }[] = [];
    const now = new Date();

    const paidInvoices = invoiceData.filter(invoice => {
        const invoiceDate = toDateSafe(invoice.invoiceDate);
        return invoice.status === 'paid' && !!invoiceDate;
    });

    switch (revenueRange) {
        case 'yearly': {
            const start = startOfYear(now);
            const months = eachMonthOfInterval({ start, end: now });
            const dataMap = new Map(months.map(d => [format(d, 'yyyy-MMM'), { name: format(d, 'MMM'), revenue: 0 }]));

            paidInvoices.forEach(invoice => {
                const invoiceDate = toDateSafe(invoice.invoiceDate)!;
                if (isAfter(invoiceDate, start)) {
                    const monthKey = format(invoiceDate, 'yyyy-MMM');
                    if (dataMap.has(monthKey)) {
                        dataMap.get(monthKey)!.revenue += toNumberSafe(invoice.summary.grandTotal);
                    }
                }
            });
            data = Array.from(dataMap.values());
            break;
        }
        case 'daily': {
            const start = subDays(now, 29);
            const days = eachDayOfInterval({ start, end: now });
            const dataMap = new Map(days.map(d => [format(d, 'yyyy-MM-dd'), { name: format(d, 'd MMM'), revenue: 0 }]));

            paidInvoices.forEach(invoice => {
                const invoiceDate = toDateSafe(invoice.invoiceDate)!;
                if (isAfter(invoiceDate, start)) {
                    const dayKey = format(invoiceDate, 'yyyy-MM-dd');
                    if (dataMap.has(dayKey)) {
                        dataMap.get(dayKey)!.revenue += toNumberSafe(invoice.summary.grandTotal);
                    }
                }
            });
            data = Array.from(dataMap.values());
            break;
        }
        case 'monthly':
        default: {
            const last12Months = eachMonthOfInterval({ start: subYears(now, 1), end: now });
            const dataMap = new Map(last12Months.map(d => [format(d, 'yyyy-MMM'), { name: format(d, 'MMM yy'), revenue: 0 }]));

            paidInvoices.forEach(invoice => {
                const invoiceDate = toDateSafe(invoice.invoiceDate)!;
                if (isAfter(invoiceDate, subYears(now, 1))) {
                  const monthKey = format(invoiceDate, 'yyyy-MMM');
                  if (dataMap.has(monthKey)) {
                      dataMap.get(monthKey)!.revenue += toNumberSafe(invoice.summary.grandTotal);
                  }
                }
            });
            data = Array.from(dataMap.values());
            break;
        }
    }

    return data;
}, [invoiceData, revenueRange]);


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
       <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
        <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Revenue</CardTitle>
              <Tabs defaultValue="monthly" onValueChange={(value) => setRevenueRange(value as any)} className="w-auto">
                <TabsList className="h-7 text-xs">
                  <TabsTrigger value="daily">Last 30 Days</TabsTrigger>
                  <TabsTrigger value="monthly">Last 12 Months</TabsTrigger>
                  <TabsTrigger value="yearly">This Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={revenueData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="bg-card/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Invoice Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const safeFormat = (date: any, formatString: string) => {
    const d = toDateSafe(date);
    return d ? format(d, formatString) : 'N/A';
}

const processData = (data: any): any => {
    if (!data) return null;
    const processed: any = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            processed[key] = toDateSafe(value) || (typeof value === 'object' && !Array.isArray(value) && value !== null ? processData(value) : value);
        }
    }
    return processed;
};

const pageVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};


export default function ClientPage() {
  const { firestore } = useFirebase();
  const { user, userProfile } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { clientId } = params;
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [historyModalState, setHistoryModalState] = useState<{ isOpen: boolean, auditLog: AuditLogEntry[]}>({isOpen: false, auditLog: []});
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; collection: string } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);

  const companyId = userProfile?.companyId;

  const clientRef = useMemoFirebase(() => {
    if (!firestore || !companyId || !clientId) return null;
    return doc(firestore, 'companies', companyId, 'clients', clientId as string);
  }, [firestore, companyId, clientId]);

  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore || !companyId || !clientId) return null;
    return query(collection(firestore, 'companies', companyId, 'invoices'), where('client.clientId', '==', clientId));
  }, [firestore, companyId, clientId]);

  const estimatesQuery = useMemoFirebase(() => {
    if (!firestore || !companyId || !clientId) return null;
    return query(collection(firestore, 'companies', companyId, 'estimates'), where('client.clientId', '==', clientId));
  }, [firestore, companyId, clientId]);
  
  const { data: rawClient, isLoading: isClientLoading } = useDoc<Client>(clientRef);
  const { data: rawInvoices, isLoading: isInvoicesLoading } = useCollection<Invoice>(invoicesQuery);
  const { data: rawEstimates, isLoading: isEstimatesLoading } = useCollection<Estimate>(estimatesQuery);

  const client = useMemo(() => processData(rawClient), [rawClient]);
  const invoices = useMemo(() => rawInvoices?.map(processData), [rawInvoices]);
  const estimates = useMemo(() => rawEstimates?.map(processData), [rawEstimates]);

  const allDocuments: DocumentType[] = [...(invoices || []), ...(estimates || [])];
  
  const getStatusVariant = (status: DocumentStatus) => {
      switch (status) {
          case 'paid':
          case 'accepted':
          case 'active':
               return 'success';
          case 'sent': return 'secondary';
          case 'overdue':
          case 'rejected':
          case 'expired':
          case 'cancelled':
              return 'destructive';
          case 'draft':
          default: return 'outline';
      }
  };

  const handleCreateDocument = (docType: 'invoice' | 'estimate' | 'quote' | 'insurance') => {
    if (!client) return;

    // Check plan limits
    const isBusinessPlan = userProfile?.plan === 'business';
    if (docType === 'invoice' && !isBusinessPlan && (invoices?.length || 0) >= 5) {
        toast({ title: "Free Plan Limit Reached", description: "Upgrade to create unlimited invoices.", variant: "destructive" });
        router.push('/pricing');
        return;
    }
    if (docType === 'estimate' && !isBusinessPlan && (estimates?.length || 0) >= 3) {
        toast({ title: "Free Plan Limit Reached", description: "Upgrade to create unlimited estimates.", variant: "destructive" });
        router.push('/pricing');
        return;
    }
    if ((docType === 'quote' || docType === 'insurance') && !isBusinessPlan) {
        toast({ title: "Upgrade Required", description: `Creating ${docType}s is a Business Plan feature.`, variant: "destructive" });
        router.push('/pricing');
        return;
    }
    
    const queryParams = new URLSearchParams({
        clientId: client.id,
        clientName: client.name,
        clientAddress: client.address,
        clientEmail: client.email,
        clientPhone: client.phone || '',
    });
    router.push(`/create-${docType}?${queryParams.toString()}`);
  }

  const handleDeleteClient = () => {
    if (!clientRef) return;
    deleteDocumentNonBlocking(clientRef);
    toast({
        title: "Client Deleted",
        description: `Client "${client.name}" has been permanently deleted.`,
    });
    router.push('/dashboard?tab=clients');
  };
  
   const handleHistoryClick = (auditLog?: AuditLogEntry[]) => {
    if (!auditLog || auditLog.length === 0) {
      toast({ title: "No History", description: "No history has been recorded for this document yet." });
      return;
    }
    const sortedLog = (auditLog || []).sort((a, b) => {
        const dateA = toDateSafe(a.timestamp);
        const dateB = toDateSafe(b.timestamp);
        if (!dateA || !dateB) return 0;
        return dateB.getTime() - dateA.getTime();
    });
    setHistoryModalState({ isOpen: true, auditLog: sortedLog });
  };
  
  const handleDeleteDocument = () => {
        if (!deleteCandidate || !firestore || !companyId) return;
        const { id, collection: collectionName } = deleteCandidate;
        const docRef = doc(firestore, 'companies', companyId, collectionName, id);
        deleteDocumentNonBlocking(docRef);
        setDeleteCandidate(null);
        toast({
            title: "Document Deleted",
            description: `The document has been deleted.`,
        });
    };

    const handleStatusChange = (id: string, collectionName: string, newStatus: DocumentStatus) => {
        if (!firestore || !companyId) return;
        const docRef = doc(firestore, 'companies', companyId, collectionName, id);
        updateDocumentNonBlocking(docRef, { status: newStatus });
        toast({
            title: "Status Updated",
            description: `Document status changed to "${newStatus}".`,
        });
    };

    const handleEmail = async (docId: string, docType: 'invoice' | 'estimate' | 'quote') => {
        setIsSendingEmail(docId);
        try {
            const result = await sendDocumentByEmail({ docId, docType: docType as 'estimate' | 'quote' });
            if (result.success) {
                toast({
                    title: "Email Sent!",
                    description: `The ${docType} has been sent to the client.`,
                });
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            toast({
                title: "Email Failed",
                description: error.message || `Could not send the ${docType}.`,
                variant: "destructive",
            });
        } finally {
            setIsSendingEmail(null);
        }
    };


  if (isClientLoading || isInvoicesLoading || isEstimatesLoading) {
    return <div>Loading client data...</div>;
  }

  if (!client) {
    return <div>Client not found.</div>;
  }
  
  return (
    <motion.div 
      className="space-y-6"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
       <ClientFormDialog
            open={isClientDialogOpen}
            onOpenChange={setIsClientDialogOpen}
            client={client}
            onSave={() => setIsClientDialogOpen(false)}
        />
        <HistoryModal 
            isOpen={historyModalState.isOpen}
            onClose={() => setHistoryModalState({ isOpen: false, auditLog: [] })}
            auditLog={historyModalState.auditLog}
        />
        <AlertDialog open={deleteCandidate !== null} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this document.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteDocument}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

       <motion.div variants={itemVariants} className="flex justify-between items-start">
         <Button variant="outline" size="icon" onClick={() => router.push('/dashboard?tab=clients')}>
            <ArrowLeft className="h-4 w-4" />
        </Button>
       </motion.div>
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
             <Avatar className="h-16 w-16">
                <AvatarImage src={client.avatarUrl || ''} alt={client.name} />
                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <CardTitle className="text-xl">{client.name}</CardTitle>
                <CardDescription>{client.companyName}</CardDescription>
             </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm p-4 pt-0">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a></div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{client.phone}</span></div>
            <div className="pt-2 flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => setIsClientDialogOpen(true)}><Edit className="mr-2 h-4 w-4" /> Edit Client</Button>
                 <Button size="icon" variant="outline" onClick={() => handleHistoryClick(client.auditLog)}><History className="h-4 w-4" /></Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4"/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the client. This action cannot be undone. Associated documents will NOT be deleted.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteClient} className="bg-destructive hover:bg-destructive/90">Delete Client</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </CardContent>
        </Card>
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <ClientCharts documents={allDocuments} />
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
              <ClientDashboardStats documents={allDocuments} />
          </div>
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={() => handleCreateDocument('invoice')} variant="outline" className="rounded-full">
                    <FilePlus2 className="mr-2 h-3 w-3" />
                    New Invoice
                </Button>
                <Button size="sm" onClick={() => handleCreateDocument('estimate')} variant="outline" className="rounded-full">
                    <FilePlus2 className="mr-2 h-3 w-3" />
                    New Estimate
                </Button>
                <Button size="sm" onClick={() => handleCreateDocument('quote')} variant="outline" className="rounded-full">
                    <FileText className="mr-2 h-3 w-3" />
                    New Quote
                </Button>
                <Button size="sm" onClick={() => handleCreateDocument('insurance')} variant="outline" className="rounded-full">
                    <Shield className="mr-2 h-3 w-3" />
                    New Insurance Doc
                </Button>
            </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="estimates">Estimates</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
           <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader><CardTitle>Invoices</CardTitle></CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Number</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-center">History</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices?.map(inv => (
                            <TableRow key={inv.id}>
                                <TableCell>{inv.invoiceNumber}</TableCell>
                                <TableCell>{currencySymbols[inv.currency] || '$'}{toNumberSafe(inv.summary.grandTotal).toFixed(2)}</TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="outline" className="capitalize w-24 justify-start rounded-full h-7 text-xs">
                                        <Badge variant={getStatusVariant(inv.status)} className="w-full justify-center rounded-full">{inv.status}</Badge>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {STATUS_OPTIONS.map(status => (
                                            <DropdownMenuItem
                                                key={status}
                                                disabled={inv.status === status}
                                                onClick={() => handleStatusChange(inv.id, 'invoices', status)}
                                                className="capitalize text-xs"
                                            >
                                                {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                                <TableCell>{safeFormat(inv.invoiceDate, 'MMM d, yyyy')}</TableCell>
                                <TableCell className="text-center">
                                  <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={() => handleHistoryClick(inv.auditLog)}>
                                      <History className="h-3.5 w-3.5" />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="rounded-full h-7 w-7">
                                              <MoreHorizontal className="h-3.5 w-3.5" />
                                          </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <Sheet>
                                          <SheetTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                              <Eye className="mr-2 h-3.5 w-3.5" />
                                              <span className="text-xs">Preview</span>
                                            </DropdownMenuItem>
                                          </SheetTrigger>
                                          <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
                                            <SheetHeader>
                                              <SheetTitle className="text-white">Invoice Preview</SheetTitle>
                                              <SheetDescription className="text-gray-300">{inv.invoiceNumber}</SheetDescription>
                                            </SheetHeader>
                                             <div className="py-4">
                                                <ClientInvoicePreview 
                                                  invoice={inv} 
                                                  accentColor={inv.accentColor || 'hsl(var(--primary))'}
                                                  backgroundColor={inv.backgroundColor || '#FFFFFF'}
                                                  textColor={inv.textColor || '#374151'}
                                                />
                                             </div>
                                          </SheetContent>
                                        </Sheet>
                                        <DropdownMenuItem asChild>
                                          <Link href={`/create-invoice?draftId=${inv.id}`} className="cursor-pointer">
                                              <Edit className="mr-2 h-3.5 w-3.5" />
                                              <span className="text-xs">Edit</span>
                                          </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEmail(inv.id, 'invoice')} disabled={isSendingEmail === inv.id} className="cursor-pointer">
                                            {isSendingEmail === inv.id ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Mail className="mr-2 h-3.5 w-3.5" />}
                                            <span className="text-xs">Send Email</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDeleteCandidate({id: inv.id, collection: 'invoices'})} className="text-destructive cursor-pointer">
                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                            <span className="text-xs">Delete</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="estimates">
             <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader><CardTitle>Estimates</CardTitle></CardHeader>
            <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Number</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {estimates?.map(est => (
                            <TableRow key={est.id}>
                                <TableCell>{est.estimateNumber}</TableCell>
                                <TableCell>{currencySymbols[est.currency] || '$'}{toNumberSafe(est.summary.grandTotal).toFixed(2)}</TableCell>
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
      </motion.div>
    </motion.div>
  );
}
