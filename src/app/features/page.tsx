import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const featureCategories = [
  {
    category: "Invoice Creation & Customization",
    features: [
      { icon: <CheckCircle className="h-8 w-8 text-primary" />, name: "Instant Invoice Generation", description: "Create professional invoices in seconds with an easy-to-use form." },
      { icon: <CheckCircle className="h-8 w-8 text-primary" />, name: "Live Real-time Preview", description: "See changes to your invoice instantly as you type." },
      { icon: <CheckCircle className="h-8 w-8 text-primary" />, name: "Multiple Professional Templates", description: "Choose from a selection of templates like Default, Modern, Elegant, and USA-specific." },
      { icon: <CheckCircle className="h-8 w-8 text-primary" />, name: "Custom Company Logo", description: "Upload your brand's logo for a personalized, professional look." },
      { icon: <CheckCircle className="h-8 w-8 text-primary" />, name: "Custom Accent Colors", description: "Tailor the invoice's color scheme to match your brand identity." },
      { icon: <CheckCircle className="h-8 w-8 text-primary" />, name: "Save as PDF", description: "Easily download and share print-ready PDF invoices with your clients." },
    ],
  },
  {
    category: "Financials & Item Management",
    features: [
      { name: "Flexible Item Management", description: "Add, remove, and even bulk-add line items to speed up creation." },
      { name: "Automatic Calculations", description: "Subtotals, taxes, and discounts are calculated for you, reducing errors." },
      { name: "Multi-Currency Support", description: "Bill clients in their local currency with support for USD, EUR, GBP, JPY, and PKR." },
      { name: "Shipping Cost & Amount Paid", description: "Include additional costs like shipping and track partial payments." },
    ],
  },
  {
    category: "Productivity & Management (Locally Saved)",
    features: [
      { name: "Save Invoice Drafts", description: "Save your work locally in your browser and pick up where you left off." },
      { name: "Invoice Dashboard", description: "A central place to view, manage, and track all your saved invoices." },
      { name: "Advanced Filtering & Search", description: "Quickly find any invoice by client name, status, amount, or date range." },
      { name: "Payment Status Tracking", description: "Mark invoices as Draft, Sent, Paid, or Overdue to manage your cash flow." },
    ],
  },
  {
    category: "Localization & Accessibility",
    features: [
      { name: "Multi-Language Support", description: "Generate invoices in English, Spanish, French, German, Arabic, and Chinese." },
      { name: "Light & Dark Mode", description: "Work comfortably at any time of day with automatic theme switching." },
      { name: "Fully Responsive Design", description: "Create and manage invoices on any device, from desktop to mobile." },
    ],
  }
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Features That Power Your Business</PageHeaderHeading>
        <PageHeaderDescription>
          InvoiceCraft is packed with powerful, intuitive features designed to save you time, make you look professional, and help you get paid faster.
        </PageHeaderDescription>
      </PageHeader>

      <div className="space-y-12">
        {featureCategories.map((category) => (
          <div key={category.category} className="bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg rounded-lg p-8">
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.features.map((feature) => (
                 <Card key={feature.name} className="flex flex-col text-center items-center p-6 bg-card/50 backdrop-blur-lg border border-border/30 shadow-lg">
                    <CardHeader className="p-0 items-center">
                        {(feature as any).icon || <CheckCircle className="h-8 w-8 text-primary" />}
                        <CardTitle className="mt-4">{feature.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-2 flex-1">
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
