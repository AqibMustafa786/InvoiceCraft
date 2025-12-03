
'use client';

import {
  BarChart,
  BookUser,
  Bot,
  Brush,
  CheckCircle,
  Cloud,
  Edit,
  FileDown,
  Filter,
  Palette,
  Send,
  Share2,
  ShieldCheck,
  Smartphone,
  Users,
  Wrench,
} from 'lucide-react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const featureCategories = [
  {
    category: 'Advanced Document Creation',
    features: [
      {
        icon: <Brush className="h-8 w-8 text-primary" />,
        name: 'Multiple Document Types',
        description:
          'Generate not just invoices, but also professional estimates, quotes, and insurance claim documents tailored to your needs.',
      },
      {
        icon: <Palette className="h-8 w-8 text-primary" />,
        name: 'Deep Customization',
        description:
          "Personalize documents with your logo, brand colors, and choice of professional templates and fonts to match your business's identity.",
      },
      {
        icon: <Wrench className="h-8 w-8 text-primary" />,
        name: 'Industry-Specific Fields',
        description:
          'Create detailed estimates for various industries like construction, IT, HVAC, and more, using specialized data fields.',
      },
    ],
  },
  {
    category: 'Cloud-Powered Dashboard & Management',
    features: [
      {
        icon: <Users className="h-8 w-8 text-primary" />,
        name: 'User Authentication',
        description: 'Sign up and log in to securely access your private dashboard and manage all your documents in one place.',
      },
      {
        icon: <Cloud className="h-8 w-8 text-primary" />,
        name: 'Firestore-Backed Storage',
        description: 'All your invoices, estimates, and quotes are saved securely in the cloud with Firestore, accessible from anywhere.',
      },
      {
        icon: <Filter className="h-8 w-8 text-primary" />,
        name: 'Advanced Filtering & Search',
        description: 'Quickly find any document in your dashboard by client, status, amount, or date range with powerful filtering tools.',
      },
      {
        icon: <Edit className="h-8 w-8 text-primary" />,
        name: 'Real-Time Status Tracking',
        description:
          'Manage your workflow by tracking document statuses like Draft, Sent, Paid, Accepted, or Rejected.',
      },
    ],
  },
  {
    category: 'Collaboration & Workflow Automation',
    features: [
      {
        icon: <Send className="h-8 w-8 text-primary" />,
        name: 'AI-Powered Emailing',
        description: 'Email estimates or quotes directly to clients as PDF attachments, powered by Genkit AI flows.',
      },
      {
        icon: <Share2 className="h-8 w-8 text-primary" />,
        name: 'Shareable Public Links',
        description: 'Generate unique, public URLs for your estimates and quotes to easily share them with clients for viewing and approval.',
      },
      {
        icon: <BookUser className="h-8 w-8 text-primary" />,
        name: 'Online Document Acceptance',
        description: 'Allow clients to accept estimates and quotes directly online with a legally binding digital signature.',
      },
      {
        icon: <FileDown className="h-8 w-8 text-primary" />,
        name: 'Instant PDF Generation',
        description: 'Download print-ready PDF versions of any document directly from your browser or have them generated on the server.',
      },
    ],
  },
   {
    category: "General & Quality-of-Life",
    features: [
      { icon: <Bot className="h-8 w-8 text-primary" />, name: 'AI Integration', description: "Leverage Genkit AI for intelligent features like automated PDF generation for emails." },
      { icon: <ShieldCheck className="h-8 w-8 text-primary" />, name: 'Secure & Private', description: "Built with Firebase, ensuring robust security and authentication for your data." },
      { icon: <Smartphone className="h-8 w-8 text-primary" />, name: 'Fully Responsive', description: "Create and manage documents seamlessly on any device, from desktop to mobile." },
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    },
  }),
};

export default function FeaturesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Features That Power Your Business</PageHeaderHeading>
        <PageHeaderDescription>
          InvoiceCraft is packed with powerful, intuitive features designed to save you time, make you look professional, and help you get paid faster.
        </PageHeaderDescription>
      </PageHeader>

      <div className="space-y-16">
        {featureCategories.map((category) => (
          <motion.div
            key={category.category}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.2 }}
            className="bg-card/50 backdrop-blur-sm shadow-lg rounded-lg p-8"
          >
            <h2 className="text-3xl font-bold font-headline mb-8 text-center">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.features.map((feature, index) => (
                <motion.div key={feature.name} custom={index} variants={cardVariants}>
                  <Card className="flex flex-col text-center items-center p-6 bg-card/50 backdrop-blur-sm shadow-lg h-full">
                    <CardHeader className="p-0 items-center">
                      {feature.icon}
                      <CardTitle className="mt-4 text-xl">{feature.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-2 flex-1">
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
