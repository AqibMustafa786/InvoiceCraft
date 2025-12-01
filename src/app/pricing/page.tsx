import { Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const plans = [
  {
    title: "Free",
    price: "$0",
    description: "For individuals and hobbyists starting out.",
    features: [
      { text: "Up to 3 invoices/month", included: true },
      { text: "Save as PDF instantly", included: true },
      { text: "Live Invoice Preview", included: true },
      { text: "Dashboard access", included: false },
      { text: "Save draft invoices", included: false },
      { text: "Filter/Search invoices", included: false },
      { text: "Payment status tracking", included: false },
      { text: "Add Logo/Branding", included: false },
      { text: "Multi-user access", included: false },
      { text: "Invoice Analytics & Reports", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    ctaLink: "/create",
    variant: "default" as "default" | "primary",
  },
  {
    title: "Pro",
    price: "$10",
    description: "For freelancers and small businesses who need more power.",
    features: [
      { text: "Unlimited invoices", included: true },
      { text: "Full Dashboard access", included: true },
      { text: "Save, edit, and update invoices", included: true },
      { text: "Filter & search invoices", included: true },
      { text: "Mark invoices as Paid, Sent, or Draft", included: true },
      { text: "Add your logo", included: true },
      { text: "Priority email support", included: true },
      { text: "Multi-user access", included: false },
      { text: "Invoice Analytics & Reports", included: false },
    ],
    cta: "Choose Pro",
    ctaLink: "/signup",
    variant: "primary" as "default" | "primary",
  },
  {
    title: "Business",
    price: "$25",
    description: "For growing businesses and agencies with teams.",
    features: [
      { text: "Everything in Pro Plan", included: true },
      { text: "Multi-user support", included: true },
      { text: "Advanced invoice analytics", included: true },
      { text: "Custom branding & colors", included: true },
      { text: "Priority email + chat support", included: true },
    ],
    cta: "Choose Business",
    ctaLink: "/signup",
    variant: "default" as "default" | "primary",
  },
];

const comparisonFeatures = [
    { feature: "Monthly Invoice Limit", free: "3", pro: "Unlimited", business: "Unlimited" },
    { feature: "Save as PDF", free: true, pro: true, business: true },
    { feature: "Live Invoice Preview", free: true, pro: true, business: true },
    { feature: "Dashboard Access", free: false, pro: true, business: true },
    { feature: "Save Draft Invoices", free: false, pro: true, business: true },
    { feature: "Filter/Search Invoices", free: false, pro: true, business: true },
    { feature: "Payment Status Tracking", free: false, pro: true, business: true },
    { feature: "Add Logo/Branding", free: false, pro: true, business: true },
    { feature: "Multi-User Access", free: false, pro: false, business: true },
    { feature: "Invoice Analytics & Reports", free: false, pro: false, business: true },
    { feature: "Priority Support", free: false, pro: true, business: true },
];


export default function PricingPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>InvoiceCraft Pricing – Simple, Transparent, and Built for Growth</PageHeaderHeading>
        <PageHeaderDescription>
          Great invoicing tools should be affordable for everyone. We offer flexible plans that grow with your business, with no hidden fees.
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.title} 
            className={`flex flex-col bg-card/50 backdrop-blur-sm shadow-lg ${plan.variant === 'primary' ? 'border-primary border-2 shadow-primary/20' : 'border'}`}
          >
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="flex items-baseline pt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== "$0" && <span className="text-muted-foreground">/month</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {feature.included ? <Check className="h-5 w-5 text-primary" /> : <X className="h-5 w-5 text-muted-foreground/50" />}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className={`w-full ${plan.variant === 'primary' ? 'text-white bg-gradient-to-r from-primary to-accent shadow-lg hover:scale-105 transition-transform' : 'variant="outline"'}`}>
                <Link href={plan.ctaLink}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
       <div className="my-16 md:my-24">
         <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-10">Feature Comparison</h2>
         <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-1/3">Feature</TableHead>
                    <TableHead className="text-center">Free</TableHead>
                    <TableHead className="text-center">Pro</TableHead>
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
                         <TableCell className="text-center">
                            {typeof item.business === 'boolean' ? (item.business ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />) : item.business}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
         </Card>
       </div>

       <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">Why Upgrade?</h2>
          <p className="text-muted-foreground md:text-lg">
            Many users start with our Free plan, but quickly realize the benefits of upgrading. Save time by managing all invoices in one dashboard, stay organized by tracking drafts and payments, and look more professional by adding your own branding. Upgrade to grow your business with confidence.
          </p>
       </div>

       <p className="text-xs text-center text-muted-foreground pt-12">(This is a non-functional placeholder page)</p>
    </div>
  );
}
