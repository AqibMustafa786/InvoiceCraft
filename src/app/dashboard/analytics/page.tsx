'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUserAuth } from '@/context/auth-provider';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase'; // Use provider hook
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Invoice, Client } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Area, AreaChart, Bar, BarChart, Pie, PieChart, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  DollarSign, Clock, AlertTriangle, Users, ArrowLeft, Lock,
  TrendingUp, TrendingDown, Wallet, Activity, Calendar
} from 'lucide-react';
import { format, subYears, eachMonthOfInterval, startOfYear, isAfter, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toDateSafe, toNumberSafe, cn } from '@/lib/utils';
import { UpgradeModal } from '@/components/upgrade-modal';

// --- Constants ---
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const STATUS_COLORS: Record<string, string> = {
  paid: '#22c55e', // green-500
  sent: '#3b82f6', // blue-500
  overdue: '#ef4444', // red-500
  draft: '#94a3b8', // slate-400
  pending: '#f59e0b', // amber-500
};

const currencySymbols: { [key: string]: string } = {
  USD: '$', EUR: '€', GBP: '£', JPY: '¥', PKR: 'Rs ',
};

// --- Helper Components ---

function KpiCard({ title, value, subtext, icon: Icon, trend, trendValue, colorClass }: any) {
  return (
    <Card className={cn(
      "relative overflow-hidden border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:border-primary/20 group",
      colorClass
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="h-16 w-16" />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium px-2 py-1 rounded-full",
              trend === 'up' ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
            )}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1 tracking-tight">{value}</h3>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { userProfile } = useUserAuth();
  const { firestore } = useFirebase();
  const [isMounted, setIsMounted] = useState(false);
  const [revenueRange, setRevenueRange] = useState<'monthly' | 'yearly'>('monthly');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const router = useRouter();

  const isFreePlan = userProfile?.plan === 'free';
  const companyId = userProfile?.companyId;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- Queries ---
  // Fetch all invoices (client-side filtering for simplicity on small datasets)
  const invoicesQuery = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return query(collection(firestore, 'companies', companyId, 'invoices'), orderBy('createdAt', 'desc'));
  }, [firestore, companyId]);

  const clientsQuery = useMemoFirebase(() => {
    if (!firestore || !companyId) return null;
    return query(collection(firestore, 'companies', companyId, 'clients'));
  }, [firestore, companyId]);

  const { data: invoices, isLoading: isLoadingInvoices } = useCollection<Invoice>(invoicesQuery);
  const { data: clients, isLoading: isLoadingClients } = useCollection<Client>(clientsQuery);

  const symbol = '$'; // Simplified symbol logic, default USD

  // --- Data Processing (Memoized) ---
  const validInvoices = useMemo(() => invoices?.filter(i => i.client && i.client.name) || [], [invoices]);

  const metrics = useMemo(() => {
    if (!validInvoices.length) return null;

    const paidInvoices = validInvoices.filter(i => i.status === 'paid');
    const totalRevenue = paidInvoices.reduce((acc, i) => acc + toNumberSafe(i.summary?.grandTotal), 0);
    const outstanding = validInvoices
      .filter(i => i.status === 'sent' || i.status === 'partially-paid')
      .reduce((acc, i) => acc + (toNumberSafe(i.summary?.grandTotal) - toNumberSafe(i.amountPaid)), 0);
    const overdue = validInvoices
      .filter(i => i.status === 'overdue')
      .reduce((acc, i) => acc + (toNumberSafe(i.summary?.grandTotal) - toNumberSafe(i.amountPaid)), 0);

    // Avg Invoice Value
    const avgValue = paidInvoices.length > 0 ? totalRevenue / paidInvoices.length : 0;

    // Growth Calculation (Current Month vs Last Month)
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const currentMonthRevenue = paidInvoices
      .filter(i => {
        const date = toDateSafe(i.invoiceDate);
        return date && isAfter(date, currentMonthStart);
      })
      .reduce((acc, i) => acc + toNumberSafe(i.summary?.grandTotal), 0);

    const lastMonthRevenue = paidInvoices
      .filter(i => {
        const date = toDateSafe(i.invoiceDate);
        return date && isWithinInterval(date, { start: lastMonthStart, end: lastMonthEnd });
      })
      .reduce((acc, i) => acc + toNumberSafe(i.summary?.grandTotal), 0);

    let growth = 0;
    if (lastMonthRevenue > 0) {
      growth = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      growth = 100; // 0 to something is 100% growth effectively
    }

    return {
      totalRevenue,
      outstanding,
      overdue,
      avgValue,
      paidCount: paidInvoices.length,
      growth: growth.toFixed(1),
      currentMonthRevenue,
      totalCount: validInvoices.length,
    };
  }, [validInvoices]);

  const revenueChartData = useMemo(() => {
    if (!validInvoices.length) return [];

    // Similar usage to original but simplified for Area Chart
    const now = new Date();
    const startDate = revenueRange === 'yearly' ? startOfYear(now) : subYears(now, 1);
    const interval = revenueRange === 'yearly' ? eachMonthOfInterval({ start: startDate, end: now }) : eachMonthOfInterval({ start: startDate, end: now });

    // Map to array of { name: 'Jan', revenue: 0, invoices: 0 }
    const dataMap = new Map(interval.map(d => {
      const key = revenueRange === 'yearly' ? format(d, 'MMM') : format(d, 'MMM yy');
      return [key, { name: key, revenue: 0, date: d }];
    }));

    validInvoices.forEach(inv => {
      if (inv.status === 'paid' && inv.invoiceDate) {
        const date = toDateSafe(inv.invoiceDate);
        if (date && isAfter(date, startDate)) {
          const key = revenueRange === 'yearly' ? format(date, 'MMM') : format(date, 'MMM yy');
          if (dataMap.has(key)) {
            dataMap.get(key)!.revenue += toNumberSafe(inv.summary.grandTotal);
          }
        }
      }
    });

    return Array.from(dataMap.values());
  }, [validInvoices, revenueRange]);

  const statusDistribution = useMemo(() => {
    if (!validInvoices.length) return [];

    const stats: Record<string, number> = {};
    validInvoices.forEach(inv => {
      const status = inv.status || 'draft';
      stats[status] = (stats[status] || 0) + 1;
    });

    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [validInvoices]);

  const topClients = useMemo(() => {
    if (!validInvoices.length) return [];
    const clientMap: Record<string, number> = {};

    validInvoices.filter(i => i.status === 'paid').forEach(inv => {
      const name = inv.client?.name || 'Unknown';
      clientMap[name] = (clientMap[name] || 0) + toNumberSafe(inv.summary.grandTotal);
    });

    return Object.entries(clientMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [validInvoices]);

  // --- Loading State ---
  if (isLoadingInvoices || isLoadingClients) {
    return (
      <div className="space-y-6 p-4 md:p-8 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="space-y-6 max-w-[1600px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        featureName="Pro Analytics"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Analytics Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your financial performance and business growth.
          </p>
        </div>

        <Tabs defaultValue="monthly" onValueChange={(v) => setRevenueRange(v as any)} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Last 12 Months</TabsTrigger>
            <TabsTrigger value="yearly">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
          <KpiCard
            title="Total Revenue"
            value={`${symbol}${toNumberSafe(metrics?.totalRevenue).toLocaleString()}`}
            subtext="Lifetime paid invoices"
            icon={Wallet}
            trend={parseFloat(metrics?.growth || '0') >= 0 ? "up" : "down"}
            trendValue={`${Math.abs(parseFloat(metrics?.growth || '0'))}% vs last month`}
            colorClass="border-primary/20"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KpiCard
            title="Avg. Invoice Value"
            value={`${symbol}${toNumberSafe(metrics?.avgValue).toFixed(2)}`}
            subtext="Across all paid invoices"
            icon={Activity}
            colorClass="border-blue-500/20"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KpiCard
            title="Outstanding"
            value={`${symbol}${toNumberSafe(metrics?.outstanding).toLocaleString()}`}
            subtext="Sent & partially paid"
            icon={Clock}
            colorClass="border-amber-500/20"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <KpiCard
            title="Overdue"
            value={`${symbol}${toNumberSafe(metrics?.overdue).toLocaleString()}`}
            subtext="Require immediate attention"
            icon={AlertTriangle}
            colorClass="border-red-500/20"
          />
        </motion.div>
      </div>

      {/* Charts Section - Dense Grid */}
      <div className="grid gap-4 lg:grid-cols-12 md:grid-cols-1">

        {/* Main Revenue Chart (Span 8) */}
        <motion.div variants={itemVariants} className="lg:col-span-8 md:col-span-1">
          <Card className="h-full border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Income over time</CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
              <ResponsiveContainer width="100%" height={350}>
                {isMounted ? (
                  <AreaChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tickMargin={10} fontSize={12} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${symbol}${value / 1000}k`} fontSize={12} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: any) => [`${symbol}${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                  </AreaChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Loading chart...</div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Breakdown (Span 4) */}
        <motion.div variants={itemVariants} className="lg:col-span-4 md:col-span-1">
          <Card className="h-full border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Invoice Status</CardTitle>
              <CardDescription>Distribution by count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                {isMounted ? (
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Loading chart...</div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-1">

        {/* Top Clients */}
        <motion.div variants={itemVariants}>
          <Card className="h-full border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Top Revenue Sources</CardTitle>
              <CardDescription>Highest paying clients</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {isMounted ? (
                  <BarChart data={topClients} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.1} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'currentColor', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                      formatter={(value: any) => [`${symbol}${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Loading chart...</div>
                )}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Transactions Table */}
        <motion.div variants={itemVariants}>
          <Card className="h-full border-border/50 bg-background/60 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest invoice updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href="/dashboard?tab=invoices" className="text-xs">View All</a>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-[150px]">Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validInvoices.slice(0, 5).map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-muted/50 border-border/50">
                      <TableCell className="font-medium text-sm truncate max-w-[150px]">
                        {invoice.client?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize text-[10px] px-1.5 py-0.5 border-0",
                            invoice.status === 'paid' ? "bg-emerald-500/10 text-emerald-500" :
                              invoice.status === 'overdue' ? "bg-rose-500/10 text-rose-500" :
                                "bg-slate-500/10 text-slate-500"
                          )}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {symbol}{toNumberSafe(invoice.summary.grandTotal).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {isFreePlan && (
        <div className="relative mt-8 p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Unlock Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">Get deeper insights, custom reports, and export capabilities.</p>
              </div>
            </div>
            <Button onClick={() => setIsUpgradeModalOpen(true)}>Upgrade for $15/mo</Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
