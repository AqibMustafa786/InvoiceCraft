

'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { useCollection, useDoc, deleteDocumentNonBlocking, updateDocumentNonBlocking, useFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Client, Estimate, Invoice, Quote, InsuranceDocument, AuditLogEntry, DocumentStatus } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Edit, ArrowLeft, DollarSign, Clock, FileWarning, Files, XCircle, FilePlus2, FileText, Shield, Trash2, History, MoreHorizontal, Eye } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, subYears, eachMonthOfInterval, startOfMonth, isValid } from 'date-fns';
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


const currencySymbols: { [key: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: '₨',
};

type DocumentType = Invoice | Estimate | Quote | InsuranceDocument;
const STATUS_OPTIONS: DocumentStatus[] = ['draft', 'sent', 'paid', 'overdue', 'accepted', 'rejected', 'expired', 'active', 'cancelled'];

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

const processData = (data: any): any => {
    if (!data) return null;
    const processed: any = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (value && typeof value === 'object' && value.toDate) { // Firestore Timestamp check
                processed[key] = value.toDate();
            } else if (value && typeof value === 'object' && !Array.isArray(value)) {
                processed[key] = processData(value); // Recurse for nested objects
            } else {
                processed[key] = value;
            }
        }
    }
    return processed;
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
  
  const { data: rawClient, isLoading: isClientLoading } = useDoc<Client>(clientRef);
  const { data: invoices, isLoading: isInvoicesLoading } = useCollection<Invoice>(invoicesQuery);
  const { data: estimates, isLoading: isEstimatesLoading } = useCollection<Estimate>(estimatesQuery);

  const client = useMemo(() => processData(rawClient), [rawClient]);

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
    const sortedLog = (auditLog || []).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
                <AvatarImage src={client.avatarUrl || ''} alt={client.name} />
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
                                This will permanently delete the client and all associated documents. This action cannot be undone.
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
        <div className="lg:col-span-2 space-y-6">
            <ClientDashboardStats documents={allDocuments} />
        </div>
      </div>
      
       <Card>
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
                                <TableCell>{currencySymbols[inv.currency] || '$'}{inv.summary.grandTotal.toFixed(2)}</TableCell>
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
                                                  backgroundColor={inv.backgroundColor || 'hsl(var(--background))'}
                                                  textColor={inv.textColor || 'hsl(var(--foreground))'}
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







