
import { CheckCircle, Eye, Rocket, ShieldCheck, Zap } from 'lucide-react';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';

export default function AboutPage() {
  const whatWeOffer = [
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Free Online Invoice Generator",
      description: "A powerful and intuitive tool to create invoices without any cost."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Professional Templates",
      description: "Choose from a variety of templates to match your brand's professional image."
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Easy Customization",
      description: "Add your logo, business details, taxes, and discounts with ease."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Instant PDF & Sharing",
      description: "Download your invoices as a PDF or share them directly with your clients."
    }
  ];

  const whyChooseUs = [
    {
      title: "No Sign-up Required",
      description: "Get started immediately. No accounts, no passwords, no hassle."
    },
    {
      title: "Fast and Secure",
      description: "Your data is processed securely in your browser and is never stored on our servers."
    },
    {
      title: "Made for You",
      description: "Perfectly tailored for the needs of freelancers and small businesses."
    },
    {
      title: "24/7 Availability",
      description: "Access InvoiceCraft anytime, anywhere, from any device with an internet connection."
    }
  ];


  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>About InvoiceCraft</PageHeaderHeading>
        <PageHeaderDescription>Our goal is to make invoicing simple, professional, and accessible to everyone. We empower businesses to manage their billing with efficiency and style.</PageHeaderDescription>
      </PageHeader>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-card/50 backdrop-blur-sm shadow-lg rounded-lg p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Eye className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold font-headline">Our Vision</h2>
          </div>
          <p className="text-muted-foreground">
            Our vision is to make invoicing simple, professional, and accessible to everyone. We believe that freelancers, startups, and small businesses should not waste time struggling with complicated accounting software.
          </p>
        </div>
        <div className="bg-card/50 backdrop-blur-sm shadow-lg rounded-lg p-8">
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Rocket className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
          </div>
          <p className="text-muted-foreground">
            To provide a free and easy-to-use online invoice generator that helps individuals and businesses save time, get paid faster, and maintain a professional image.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">What We Offer</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whatWeOffer.map(item => (
            <div key={item.title} className="bg-card/50 backdrop-blur-sm shadow-lg rounded-lg p-6 text-center flex flex-col items-center">
              {item.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm flex-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

       <div>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose Us?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map(item => (
             <div key={item.title} className="bg-card/50 backdrop-blur-sm shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
