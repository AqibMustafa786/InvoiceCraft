'use client';

import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUserAuth } from "@/context/auth-provider";
import { hasAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { useCollection } from "@/firebase/firestore/use-collection";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditSettingsPage() {
    const { userProfile, isLoading: authLoading } = useUserAuth();
    const { firestore } = useFirebase();

    const auditQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'audit_logs'), orderBy('timestamp', 'desc'), limit(50));
    }, [firestore]);

    const { data: logs, isLoading: logsLoading } = useCollection(auditQuery);

    if (!authLoading && !hasAccess(userProfile, 'view:settings:audit')) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Audit Logs</h3>
                <p className="text-sm text-muted-foreground">
                    View system activity and security logs.
                </p>
            </div>
            <Separator />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logsLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                </TableRow>
                            ))
                        ) : logs && logs.length > 0 ? (
                            logs.map((log: any) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{log.user?.name || 'Unknown'}</span>
                                            <span className="text-xs text-muted-foreground">{log.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{log.ip || '-'}</TableCell>
                                    <TableCell>{log.timestamp ? format(log.timestamp.toDate(), "PPpp") : '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={log.status === 'Success' ? 'outline' : 'destructive'}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No audit logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
