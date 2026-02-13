'use client';

import { useMemo, useState } from 'react';
import { useUserAuth } from '@/context/auth-provider';
import { useCollection, useDoc, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import type { Client, Estimate, Invoice, Quote, InsuranceDocument, AuditLogEntry, DocumentStatus } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import {
  Area, AreaChart, Bar, BarChart, Pie, PieChart, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PDFDownloadButton = dynamic(
  () => import('@/components/pdf/pdf-download-button').then(mod => mod.PDFDownloadButton),
  { ssr: false }
);
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Mail, Phone, Edit, ArrowLeft, DollarSign, Clock, FileWarning,
  Files, XCircle, FilePlus2, FileText, Shield, Trash2, History,
  MoreHorizontal, Eye, Loader2, MapPin, Globe, Hash, CheckCircle2,
  Calendar, TrendingUp, TrendingDown, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, subYears, eachMonthOfInterval, startOfMonth, subDays, eachDayOfInterval, startOfYear, isAfter } from 'date-fns';
import { Badge } from '@/components/ui/badge';
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
import { toDateSafe, toNumberSafe, cn } from '@/lib/utils';
import { sendDocumentByEmail } from '@/app/actions';

// --- Constants & Config ---
const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];
const STATUS_COLORS: Record<string, string> = {
  paid: '#22c55e', // green-500
  sent: '#3b82f6', // blue-500
  overdue: '#ef4444', // red-500
  draft: '#94a3b8', // slate-400
  pending: '#f59e0b', // amber-500
  accepted: '#22c55e',
  rejected: '#ef4444',
  expired: '#71717a',
};

const currencySymbols: { [key: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: 'Rs ',
};

type DocumentType = Invoice | Estimate | Quote | InsuranceDocument;
const STATUS_OPTIONS: DocumentStatus[] = ['draft', 'sent', 'paid', 'overdue', 'accepted', 'rejected', 'expired', 'active', 'cancelled'];

// --- Helper Functions ---
const safeFormat = (date: any, formatString: string) => {
  const d = toDateSafe(date);
  return d ? format(d, formatString) : 'N/A';
}


// --- Components ---

function KpiCard({ title, value, subtext, icon: Icon, colorClass }: any) {
  return (
    <Card className={cn(
      "relative overflow-hidden border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg group",
      colorClass
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="h-12 w-12" />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-muted-foreground/70" />
        </div>
        <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

function StatBadge({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-background/50 backdrop-blur-sm text-xs font-medium">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}


export default function ClientPage() {
  const { firestore } = useFirebase();
  const { user, userProfile } = useUserAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { clientId } = params;

  // UI State
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [historyModalState, setHistoryModalState] = useState<{ isOpen: boolean, auditLog: AuditLogEntry[] }>({ isOpen: false, auditLog: [] });
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string; collection: string } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const companyId = userProfile?.companyId;

  // Firebase Refs
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

  // Data Fetching
  const { data: rawClient, isLoading: isClientLoading } = useDoc<Client>(clientRef);
  const { data: rawInvoices, isLoading: isInvoicesLoading } = useCollection<Invoice>(invoicesQuery);
  const { data: rawEstimates, isLoading: isEstimatesLoading } = useCollection<Estimate>(estimatesQuery);

  // Data Processing
  const client = rawClient;
  const invoices = rawInvoices || [];
  const estimates = rawEstimates || [];

  const symbol = '$'; // Default symbol

  // Stats Logic
  const stats = useMemo(() => {
    if (!invoices) return { totalRevenue: 0, pending: 0, overdue: 0, count: 0 };

    const totalRevenue = invoices.filter((i: Invoice) => i.status === 'paid').reduce((acc: number, i: Invoice) => acc + toNumberSafe(i.summary?.grandTotal), 0);
    const pending = invoices.filter((i: Invoice) => i.status === 'sent' || i.status === 'partially-paid').reduce((acc: number, i: Invoice) => acc + (toNumberSafe(i.summary?.grandTotal) - toNumberSafe(i.amountPaid)), 0);
    const overdue = invoices.filter((i: Invoice) => i.status === 'overdue').reduce((acc: number, i: Invoice) => acc + (toNumberSafe(i.summary?.grandTotal) - toNumberSafe(i.amountPaid)), 0);

    return { totalRevenue, pending, overdue, count: invoices.length };
  }, [invoices]);

  // Chart Data Logic
  const revenueChartData = useMemo(() => {
    if (!invoices.length) return [];
    const now = new Date();
    // Last 12 Months
    const months = eachMonthOfInterval({ start: subYears(now, 1), end: now });
    const dataMap = new Map(months.map(d => [format(d, 'MMM yy'), { name: format(d, 'MMM'), revenue: 0 }]));

    invoices.forEach((inv: Invoice) => {
      if (inv.status === 'paid' && inv.invoiceDate) {
        const date = toDateSafe(inv.invoiceDate);
        if (date && isAfter(date, subYears(now, 1))) {
          const key = format(date, 'MMM yy');
          if (dataMap.has(key)) {
            dataMap.get(key)!.revenue += toNumberSafe(inv.summary?.grandTotal);
          }
        }
      }
    });
    return Array.from(dataMap.values());
  }, [invoices]);

  const statusDistribution = useMemo(() => {
    if (!invoices.length) return [];
    const stats: Record<string, number> = {};
    invoices.forEach((inv: Invoice) => {
      const status = inv.status || 'draft';
      stats[status] = (stats[status] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [invoices]);

  // Actions
  const handleCreateDocument = (docType: string) => {
    if (!client) return;
    const q = new URLSearchParams({
      clientId: client.id,
      clientName: client.name,
      clientAddress: client.address || '',
      clientEmail: client.email || '',
    });
    router.push(`/create-${docType}?${q.toString()}`);
  }

  const handleDeleteClient = () => {
    if (!clientRef) return;
    deleteDocumentNonBlocking(clientRef);
    toast({ title: "Client Deleted", description: "Client has been removed successfully." });
    router.push('/dashboard?tab=clients');
  };

  const handleStatusChange = (id: string, collectionName: string, newStatus: DocumentStatus) => {
    if (!firestore || !companyId) return;
    const docRef = doc(firestore, 'companies', companyId, collectionName, id);
    updateDocumentNonBlocking(docRef, { status: newStatus });
    toast({ title: "Status Updated", description: `Document marked as ${newStatus}` });
  };

  const handleEmail = async (id: string, type: 'invoice' | 'estimate' | 'quote') => {
    setIsSendingEmail(id);
    try {
      const { success, message } = await sendDocumentByEmail({ docId: id, docType: type });
      toast({
        title: success ? "Email Sent" : "Email Failed",
        description: message,
        variant: success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending the email.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(null);
    }
  };

  if (isClientLoading || isInvoicesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!client) return <div>Client not found</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="space-y-6 max-w-[1600px] mx-auto pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Dialogs */}
      <ClientFormDialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen} client={client} onSave={() => setIsClientDialogOpen(false)} />
      <HistoryModal isOpen={historyModalState.isOpen} onClose={() => setHistoryModalState({ isOpen: false, auditLog: [] })} auditLog={historyModalState.auditLog} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard?tab=clients')} className="h-9 w-9 rounded-full shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {client.name}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {client.companyName && <span>{client.companyName}</span>}
              {client.email && <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-muted-foreground/50" /> {client.email}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsClientDialogOpen(true)}>
            <Edit className="mr-2 h-3.5 w-3.5" /> Edit Profile
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                <FilePlus2 className="mr-2 h-4 w-4" /> Create New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCreateDocument('invoice')}>Invoice</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateDocument('estimate')}>Estimate</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreateDocument('quote')}>Quote</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Client Info (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 sticky top-24">
              <CardHeader className="text-center pb-2">
                <Avatar className="h-24 w-24 mx-auto mb-2 border-4 border-background shadow-lg">
                  <AvatarImage src={client.avatarUrl} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary">{client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{client.companyName}</p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm mt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a href={`mailto:${client.email}`} className="text-foreground hover:underline truncate">{client.email || 'No email'}</a>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="text-foreground">{client.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="text-foreground whitespace-pre-line">{client.address || 'No address'}</span>
                  </div>
                  {client.website && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Globe className="h-4 w-4 shrink-0" />
                      <a href={client.website} target="_blank" className="text-foreground hover:underline truncate">{client.website}</a>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteCandidate({ id: 'client', collection: 'clients' })}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Stats & Charts & Lists (Span 9) */}
        <div className="lg:col-span-9 space-y-6">

          {/* KPI Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              title="Total Revenue"
              value={`${symbol}${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              colorClass="border-emerald-500/20"
            />
            <KpiCard
              title="Outstanding"
              value={`${symbol}${stats.pending.toLocaleString()}`}
              icon={Clock}
              colorClass="border-amber-500/20"
            />
            <KpiCard
              title="Overdue"
              value={`${symbol}${stats.overdue.toLocaleString()}`}
              icon={FileWarning}
              colorClass="border-rose-500/20"
              subtext="Action required"
            />
          </motion.div>

          {/* Charts Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${symbol}${val / 1000}k`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                        formatter={(value: any) => [`${symbol}${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-1">
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px' }} />
                      <Legend verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Tabs Section for Documents */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b rounded-none p-0 h-auto">
                <TabsTrigger value="invoices" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Invoices</TabsTrigger>
                <TabsTrigger value="estimates" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3">Estimates</TabsTrigger>
              </TabsList>

              <TabsContent value="invoices" className="mt-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Number</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                              No invoices found. Create one to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          invoices.map((inv: Invoice) => (
                            <TableRow key={inv.id} className="hover:bg-muted/50 border-border/50">
                              <TableCell className="font-medium text-xs">{inv.invoiceNumber}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{safeFormat(inv.invoiceDate, 'MMM d, yyyy')}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Badge variant="outline" className={cn(
                                      "cursor-pointer capitalize font-normal",
                                      inv.status === 'paid' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                      inv.status === 'overdue' && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                                      inv.status === 'sent' && "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    )}>
                                      {inv.status}
                                    </Badge>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    {STATUS_OPTIONS.map(status => (
                                      <DropdownMenuItem key={status} onClick={() => handleStatusChange(inv.id, 'invoices', status)} className="capitalize">
                                        {status}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {currencySymbols[inv.currency] || '$'}{toNumberSafe(inv.summary?.grandTotal).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/create-invoice?draftId=${inv.id}`}>Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <div className="w-full cursor-pointer">
                                        <PDFDownloadButton
                                          document={inv}
                                          fileName={`Invoice_${inv.invoiceNumber}.pdf`}
                                        />
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEmail(inv.id, 'invoice')} disabled={isSendingEmail === inv.id} className="cursor-pointer">
                                      {isSendingEmail === inv.id ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Mail className="mr-2 h-3.5 w-3.5" />}
                                      <span className="text-xs">Send Email</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setDeleteCandidate({ id: inv.id, collection: 'invoices' })} className="text-destructive cursor-pointer">
                                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                                      <span className="text-xs">Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="estimates" className="mt-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Number</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {estimates.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                              No estimates found. Create one to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          estimates.map((est: Estimate) => (
                            <TableRow key={est.id} className="hover:bg-muted/50 border-border/50">
                              <TableCell className="font-medium text-xs">{est.estimateNumber}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{safeFormat(est.estimateDate, 'MMM d, yyyy')}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Badge variant="outline" className={cn(
                                      "cursor-pointer capitalize font-normal",
                                      est.status === 'accepted' && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                      est.status === 'rejected' && "bg-rose-500/10 text-rose-500 border-rose-500/20",
                                      est.status === 'sent' && "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    )}>
                                      {est.status}
                                    </Badge>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    {STATUS_OPTIONS.map(status => (
                                      <DropdownMenuItem key={status} onClick={() => handleStatusChange(est.id, 'estimates', status)} className="capitalize">
                                        {status}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                              <TableCell className="text-right text-sm">
                                {currencySymbols[est.currency] || '$'}{toNumberSafe(est.summary?.grandTotal).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link href={`/create-estimate?draftId=${est.id}`}>Edit</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <div className="w-full cursor-pointer">
                                        <PDFDownloadButton
                                          document={est}
                                          fileName={`Estimate_${est.estimateNumber}.pdf`}
                                        />
                                      </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEmail(est.id, 'estimate')} disabled={isSendingEmail === est.id} className="cursor-pointer">
                                      {isSendingEmail === est.id ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Mail className="mr-2 h-3.5 w-3.5" />}
                                      <span className="text-xs">Send Email</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setDeleteCandidate({ id: est.id, collection: 'estimates' })} className="text-destructive">
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Dialog is Reusable */}
      <AlertDialog open={deleteCandidate !== null} onOpenChange={(open) => !open && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected {deleteCandidate?.id === 'client' ? 'client and this data' : 'document'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCandidate?.id === 'client' ? handleDeleteClient : () => { /* Doc delete logic */ }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
