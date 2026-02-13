
'use client';

import { Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { createStripeCheckoutSession } from "@/ai/flows/stripe-checkout-flow";
import { useToast } from "@/hooks/use-toast";
import { useDoc } from "@/firebase/firestore/use-doc";
import { doc } from "firebase/firestore";
import { useFirebase, useMemoFirebase } from "@/firebase/provider";
import { motion } from 'framer-motion';


const plans = [
  {
    title: "Free",
    price: {
      monthly: "$0",
      yearly: "$0"
    },
    description: "For freelancers and very small service providers starting out.",
    features: [
      { text: "Up to 5 invoices/month", included: true },
      { text: "Up to 3 estimates/month", included: true },
      { text: "PDF Export", included: true },
      { text: "Basic Templates", included: true },
      { text: "Cloud Save (last 5 docs)", included: true },
      { text: "No Quotes or Insurance Docs", included: false },
      { text: "No Custom Branding", included: false },
      { text: "No Emailing", included: false },
    ],
    cta: "Get Started for Free",
    ctaLink: "/signup",
    variant: "default" as "default" | "primary",
  },
  {
    title: "Business",
    price: {
      monthly: "$19.99",
      yearly: "$199.99"
    },
    priceIds: {
      monthly: process.env.STRIPE_PRICE_MONTHLY,
      yearly: process.env.STRIPE_PRICE_YEARLY,
    },
    description: "For contractors, agencies, and freelancers with heavy usage.",
    features: [
      { text: "Unlimited Invoices & Estimates", included: true },
      { text: "Unlimited Quotes & Insurance Docs", included: true },
      { text: "All Professional Templates (20+)", included: true },
      { text: "Custom Branding (Logo & Colors)", included: true },
      { text: "Email PDF to Client", included: true },
      { text: "Reusable Line Item Presets", included: true },
      { text: "Unlimited Cloud Storage", included: true },
      { text: "Remove 'Made with InvoiceCraft' Watermark", included: true },
    ],
    cta: "Choose Business",
    ctaLink: "/signup", // This would later go to /checkout
    variant: "primary" as "default" | "primary",
  },
];

const comparisonFeatures = [
  { feature: "Invoices", free: "5 per month", pro: "Unlimited" },
  { feature: "Estimates", free: "3 per month", pro: "Unlimited" },
  { feature: "Quotes", free: false, pro: true },
  { feature: "Insurance Docs", free: false, pro: true },
  { feature: "Line Item Presets", free: false, pro: true },
  { feature: "Templates", free: "Basic (3)", pro: "All (20+)" },
  { feature: "Custom Branding", free: false, pro: true },
  { feature: "Email PDF to Client", free: false, pro: true },
  { feature: "Remove Watermark", free: false, pro: true },
  { feature: "Cloud Document Storage", free: "5 documents", pro: "Unlimited" },
  { feature: "Analytics", free: false, pro: true },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { firestore } = useFirebase();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userData } = useDoc(userDocRef);
  const companyId = userData?.companyId;

  const handleCheckout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (!user) {
      router.push('/login');
      setIsLoading(false);
      return;
    }

    if (!companyId) {
      toast({ title: "Error", description: "Company ID not found. Please re-login.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await createStripeCheckoutSession({
        userId: user.uid,
        userEmail: user.email || '',
        companyId: companyId,
        plan: billingCycle,
      });

      if ('url' in response && response.url) {
        window.location.href = response.url;
      } else if ('error' in response) {
        throw new Error(response.error);
      } else {
        throw new Error("Could not create a checkout session.");
      }
    } catch (e: any) {
      toast({
        title: "Checkout Failed",
        description: e.message || "An unexpected error occurred during checkout.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Our Pricing Plans</PageHeaderHeading>
        <PageHeaderDescription>
          Choose the plan that's right for your business. Simple, transparent, and built for growth.
        </PageHeaderDescription>
      </PageHeader>

      <div className="flex items-center justify-center space-x-2 mb-10">
        <Label htmlFor="billing-cycle">Monthly</Label>
        <Switch
          id="billing-cycle"
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <Label htmlFor="billing-cycle" className="flex items-center">
          Yearly <span className="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">2 Months Free!</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <motion.div key={plan.title} whileHover={{ y: -8, scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card
              className={`flex flex-col bg-card/50 backdrop-blur-sm shadow-lg h-full ${plan.variant === 'primary' ? 'border-primary border-2 shadow-primary/20' : 'border'}`}
            >
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="flex items-baseline pt-4">
                  <span className="text-4xl font-bold">{plan.title === 'Free' ? plan.price.monthly : plan.price[billingCycle]}</span>
                  {plan.title !== "Free" && <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {feature.included ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-muted-foreground/50" />}
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {plan.title === 'Business' ? (
                  <Button
                    className={`w-full text-lg ${plan.variant === 'primary' ? 'text-white bg-gradient-to-r from-primary to-accent shadow-lg hover:scale-105 transition-transform' : ''}`}
                    onClick={handleCheckout}
                    disabled={isLoading}
                    size="lg"
                  >
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : 'Choose Business'}
                  </Button>
                ) : (
                  <Button asChild className="w-full" variant="outline" size="lg">
                    <Link href={plan.ctaLink}>{plan.cta}</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="my-16 md:my-24">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-10">Feature Comparison</h2>
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Feature</TableHead>
                  <TableHead className="text-center">Free</TableHead>
                  <TableHead className="text-center">Business</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonFeatures.map(item => (
                  <TableRow key={item.feature}>
                    <TableCell className="font-medium">{item.feature}</TableCell>
                    <TableCell className="text-center">
                      {typeof item.free === 'boolean' ? (item.free ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />) : item.free}
                    </TableCell>
                    <TableCell className="text-center">
                      {typeof item.pro === 'boolean' ? (item.pro ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />) : item.pro}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
