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

const auditLogs = [
    {
        id: "1",
        action: "User Login",
        user: "Aqib Mustafa",
        ip: "192.168.1.1",
        date: new Date(),
        status: "Success",
    },
    {
        id: "2",
        action: "Settings Updated",
        user: "Aqib Mustafa",
        ip: "192.168.1.1",
        date: new Date(),
        status: "Success",
    },
    {
        id: "3",
        action: "Invoice Created",
        user: "John Doe",
        ip: "10.0.0.5",
        date: new Date(Date.now() - 86400000), // 1 day ago
        status: "Success",
    },
    {
        id: "4",
        action: "Failed Login Attempt",
        user: "Unknown",
        ip: "45.32.11.2",
        date: new Date(Date.now() - 172800000), // 2 days ago
        status: "Failed",
    },
]

export default function AuditSettingsPage() {
    const { userProfile, isLoading } = useUserAuth();

    if (!isLoading && !hasAccess(userProfile, 'view:settings:audit')) {
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
                        {auditLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell className="font-medium">{log.action}</TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                                <TableCell>{format(log.date, "PPpp")}</TableCell>
                                <TableCell>
                                    <Badge variant={log.status === 'Success' ? 'outline' : 'destructive'}>
                                        {log.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
