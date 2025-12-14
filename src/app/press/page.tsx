
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";

export default function PressPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
        <PageHeader>
            <PageHeaderHeading>Press & Media</PageHeaderHeading>
            <PageHeaderDescription>
                Welcome to the InvoiceCraft press kit. Here you'll find brand assets, contact information, and other resources for media inquiries.
            </PageHeaderDescription>
        </PageHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                    <CardTitle>Brand Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Download our official logo and other brand assets. Please follow our brand guidelines when using them.
                    </p>
                    <Button asChild>
                        <Link href="#">
                            <Download className="mr-2 h-4 w-4" />
                            Download Asset Kit
                        </Link>
                    </Button>
                </CardContent>
            </Card>
             <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader>
                    <CardTitle>Media Contact</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                       For all press and media inquiries, please contact us at:
                    </p>
                    <a href="mailto:press@invoicecraft.app" className="font-semibold text-primary hover:underline">
                        press@invoicecraft.app
                    </a>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
