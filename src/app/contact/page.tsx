import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          Get in Touch
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          Have a question, feedback, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto bg-background/50 backdrop-blur-lg border border-white/20 shadow-lg">
        <CardContent className="p-8">
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
  );
}
