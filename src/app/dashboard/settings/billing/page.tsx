'use client';

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useUserAuth } from "@/context/auth-provider";
import { hasAccess } from "@/lib/permissions";
import { redirect } from "next/navigation";
import { Check, CreditCard } from "lucide-react";

export default function BillingSettingsPage() {
    const { userProfile, isLoading } = useUserAuth();

    if (!isLoading && !hasAccess(userProfile, 'view:settings:billing')) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Billing & Plans</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your subscription and billing information.
                </p>
            </div>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>You are currently on the <strong>Pro Plan</strong>.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                        <div className="text-sm text-muted-foreground">Next billing date: <strong>March 1, 2026</strong></div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Manage Subscription</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Update your payment details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4 rounded-md border p-4">
                            <CreditCard className="h-6 w-6" />
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">Visa ending in 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/28</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Update Payment Method</Button>
                    </CardFooter>
                </Card>
            </div>

            <Separator />

            <div>
                <h4 className="text-lg font-medium mb-4">Billing History</h4>
                <div className="rounded-md border">
                    <div className="grid grid-cols-4 border-b p-4 font-medium">
                        <div>Date</div>
                        <div>Amount</div>
                        <div>Status</div>
                        <div className="text-right">Invoice</div>
                    </div>
                    <div className="grid grid-cols-4 p-4 text-sm">
                        <div>Feb 1, 2026</div>
                        <div>$29.00</div>
                        <div className="flex items-center"><Check className="mr-1 h-3 w-3 text-green-500" /> Paid</div>
                        <div className="text-right"><Button variant="link" className="h-auto p-0">Download</Button></div>
                    </div>
                    <div className="grid grid-cols-4 border-t p-4 text-sm">
                        <div>Jan 1, 2026</div>
                        <div>$29.00</div>
                        <div className="flex items-center"><Check className="mr-1 h-3 w-3 text-green-500" /> Paid</div>
                        <div className="text-right"><Button variant="link" className="h-auto p-0">Download</Button></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
