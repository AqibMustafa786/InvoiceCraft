
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function BillingCancelPage() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="w-full max-w-md text-center bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                        <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-headline">Payment Canceled</CardTitle>
                    <CardDescription>Your checkout process was canceled. No payment was taken. You can try again anytime from the pricing page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full" variant="outline">
                        <Link href="/pricing">
                            Back to Pricing
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

    