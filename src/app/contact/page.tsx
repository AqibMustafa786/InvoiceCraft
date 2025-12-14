
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Clock, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";

export default function ContactPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
       <PageHeader>
        <PageHeaderHeading>Get in Touch</PageHeaderHeading>
        <PageHeaderDescription>Have a question, suggestion, or feedback? I’d love to hear from you!</PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 max-w-6xl mx-auto">
        
        {/* Contact Form */}
        <div className="lg:col-span-2">
            <Card className="h-full bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                    <CardDescription>Use the form below to submit your issues, feature requests, or general queries.</CardDescription>
                </CardHeader>
                <CardContent>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="name@example.com" />
                    </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Feedback on..." />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message here..." className="min-h-[150px]" />
                    </div>
                    <Button type="submit" className="w-full">Send Message</Button>
                </form>
                <p className="text-xs text-center text-muted-foreground pt-4">(This is a non-functional placeholder page)</p>
                </CardContent>
            </Card>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-8">
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <a href="mailto:aqib2k1@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">aqib2k1@gmail.com</a>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Available</h3>
                            <p className="text-muted-foreground">Monday–Saturday, 9 AM – 6 PM</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

             <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                    <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button asChild variant="outline" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Link href="#" aria-label="Twitter" rel="noopener noreferrer" target="_blank">
                            <Twitter className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="text-muted-foreground hover:text-foreground">
                         <Link href="#" aria-label="GitHub" rel="noopener noreferrer" target="_blank">
                            <Github className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Link href="#" aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>

      </div>

    </div>
  );
}
