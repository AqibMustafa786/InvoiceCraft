import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          Choose the Right Plan for You
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          Simple, transparent pricing. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>For individuals and hobbyists starting out.</CardDescription>
            <div className="flex items-baseline pt-4">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Up to 5 invoices/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Basic invoice customization</span>
              </li>
               <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Community support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/create">Get Started</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Basic Plan */}
        <Card className="border-primary flex flex-col shadow-lg">
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>For freelancers and small businesses.</CardDescription>
            <div className="flex items-baseline pt-4">
              <span className="text-4xl font-bold">$10</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Unlimited invoices</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Advanced customization</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Save unlimited clients</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span>Email support</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/signup">Choose Basic</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>For growing businesses and agencies.</CardDescription>
             <div className="flex items-baseline pt-4">
              <span className="text-4xl font-bold">$25</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>All Basic features</span>
                </li>
                 <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Payment integrations (Stripe, PayPal)</span>
                </li>
                 <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Recurring invoices</span>
                </li>
                 <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span>Priority support</span>
                </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full" variant="outline">
              <Link href="/signup">Choose Premium</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
       <p className="text-xs text-center text-muted-foreground pt-12">(This is a non-functional placeholder page)</p>
    </div>
  );
}
