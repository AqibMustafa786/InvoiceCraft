
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LifeBuoy, BookOpen, MessageSquare } from "lucide-react";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

const helpSections = [
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Getting Started Guide",
    description: "Learn the basics of creating your first invoice, adding items, and customizing your template.",
    href: "#"
  },
  {
    icon: <LifeBuoy className="h-10 w-10 text-primary" />,
    title: "FAQs",
    description: "Find quick answers to the most common questions about InvoiceCraft and its features.",
    href: "/faq"
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Contact Support",
    description: "Can't find what you're looking for? Get in touch with our support team directly.",
    href: "/contact"
  }
];

export default function HelpPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Help Center</PageHeaderHeading>
        <PageHeaderDescription>
          Welcome to the InvoiceCraft Help Center. We're here to assist you with any questions or issues you may have.
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {helpSections.map((section) => (
          <Link href={section.href} key={section.title}>
            <Card className="h-full bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col items-center text-center p-6">
              <div className="mb-4">
                {section.icon}
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl">{section.title}</CardTitle>
              </CardHeader>
              <CardDescription className="mt-2 flex-1">
                {section.description}
              </CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
