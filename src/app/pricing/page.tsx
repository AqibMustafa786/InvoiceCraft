
import { Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const plans = [
  {
    title: "Free",
    price: "₹0",
    description: "For freelancers and very small service providers starting out.",
    features: [
      { text: "Up to 5 invoices/month", included: true },
      { text: "Up to 3 estimates/month", included: true },
      { text: "PDF Export", included: true },
      { text: "Basic Templates", included: true },
      { text: "Limited Cloud Save (5 docs)", included: true },
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
    price: "$9.99",
    description: "For contractors, agencies, and freelancers with heavy usage.",
    features: [
      { text: "Unlimited Invoices & Estimates", included: true },
      { text: "Unlimited Quotes & Insurance Docs", included: true },
      { text: "All Professional Templates (20+)", included: true },
      { text: "Custom Branding (Logo & Colors)", included: true },
      { text: "Email PDF to Clients", included: true },
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
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Our Pricing Plans</PageHeaderHeading>
        <PageHeaderDescription>
          Choose the plan that's right for your business. Simple, transparent, and built for growth.
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                {plan.price !== "₹0" && <span className="text-muted-foreground">/month</span>}
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
