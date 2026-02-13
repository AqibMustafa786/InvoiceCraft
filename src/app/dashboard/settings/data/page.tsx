'use client';

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUserAuth } from "@/context/auth-provider";
import { hasAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Download, Upload, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function DataSettingsPage() {
    const { userProfile, isLoading } = useUserAuth();

    if (!isLoading && !hasAccess(userProfile, 'view:settings:data')) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Data Management</h3>
                <p className="text-sm text-muted-foreground">
                    Import, export, and manage your data.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Download className="mr-2 h-5 w-5" /> Export Data</CardTitle>
                        <CardDescription>Download a copy of your data in CSV or JSON format.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-2">
                            <Button variant="outline">Export as CSV</Button>
                            <Button variant="outline">Export as JSON</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Upload className="mr-2 h-5 w-5" /> Import Data</CardTitle>
                        <CardDescription>Import data from other applications (CSV only).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline">Select File to Import</Button>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            <div className="rounded-md border border-destructive/50 p-4">
                <h4 className="text-lg font-medium text-destructive mb-2 flex items-center"><Trash2 className="mr-2 h-5 w-5" /> Delete Workspace</h4>
                <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your workspace, there is no going back. Please be certain.
                </p>
                <Button variant="destructive">Delete Workspace</Button>
            </div>
        </div>
    );
}
