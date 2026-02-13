'use client';

import { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useUserAuth } from "@/context/auth-provider";
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, doc, deleteDoc } from 'firebase/firestore';
import { hasAccess, getPermissionsSummary, Role } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Plus, MoreHorizontal, Loader2, UserPlus, ShieldCheck } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { InviteUserDialog } from '@/components/dashboard/invite-user-dialog';
import { useToast } from '@/hooks/use-toast';

export default function UsersSettingsPage() {
    const { userProfile, isLoading: isAuthLoading } = useUserAuth();
    const { firestore } = useFirebase();
    const { toast } = useToast();
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const companyId = userProfile?.companyId;

    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !companyId) return null;
        return query(collection(firestore, 'companies', companyId, 'users'));
    }, [firestore, companyId]);

    const { data: employees, isLoading: isLoadingUsers, refetch } = useCollection<any>(usersQuery);

    if (!isAuthLoading && !hasAccess(userProfile, 'view:employees')) {
        redirect('/dashboard');
    }

    const handleDelete = async (employeeId: string) => {
        if (!firestore || !companyId) return;

        if (!hasAccess(userProfile, 'manage:employees')) {
            toast({ title: "Action Denied", description: "You do not have permission to manage employees.", variant: "destructive" });
            return;
        }

        if (employeeId === userProfile?.uid) {
            toast({ title: "Action Denied", description: "You cannot remove yourself from the workspace.", variant: "destructive" });
            return;
        }

        try {
            await deleteDoc(doc(firestore, 'companies', companyId, 'users', employeeId));
            toast({ title: "Employee Removed", description: "The employee record has been deleted." });
            refetch();
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    const isLoading = isAuthLoading || isLoadingUsers;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Employees & Roles</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your team members and their workspace permissions.
                    </p>
                </div>
                {hasAccess(userProfile, 'manage:employees') && (
                    <Button onClick={() => { setEditingUser(null); setIsInviteOpen(true); }} className="rounded-full shadow-lg">
                        <UserPlus className="mr-2 h-4 w-4" /> Add Employee
                    </Button>
                )}
            </div>
            <Separator />

            <div className="rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-semibold text-primary">Name</TableHead>
                            <TableHead className="font-semibold text-primary">Role</TableHead>
                            <TableHead className="font-semibold text-primary hidden lg:table-cell">Permissions Summary</TableHead>
                            <TableHead className="font-semibold text-primary">Status</TableHead>
                            <TableHead className="text-right font-semibold text-primary">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-32">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading team records...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : employees && employees.length > 0 ? employees.map((employee) => (
                            <TableRow key={employee.uid || employee.id} className="group hover:bg-primary/5 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{employee.name}</span>
                                        <span className="text-xs text-muted-foreground">{employee.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="capitalize border-primary/20 bg-primary/5 text-primary">
                                        {employee.role}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell max-w-xs">
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                                        <ShieldCheck className="h-3.5 w-3.5 mt-0.5 text-primary/60 shrink-0" />
                                        {getPermissionsSummary(employee.role as Role)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={employee.status === 'active' ? 'success' : 'secondary'} className="rounded-full">
                                        {employee.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            {hasAccess(userProfile, 'manage:employees') && (
                                                <>
                                                    <DropdownMenuItem onClick={() => { setEditingUser(employee); setIsInviteOpen(true); }}>
                                                        Edit Permissions
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:bg-destructive/10"
                                                        onClick={() => handleDelete(employee.uid || employee.id)}
                                                    >
                                                        Remove Employee
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                                    No employees found in this workspace.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <InviteUserDialog
                open={isInviteOpen}
                onOpenChange={setIsInviteOpen}
                user={editingUser}
                onUserInvited={refetch}
            />
        </div>
    );
}
