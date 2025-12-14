
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import Link from "next/link";

const jobOpenings = [
  {
    title: "Senior Frontend Engineer",
    location: "Remote",
    department: "Engineering",
  },
  {
    title: "Product Designer",
    location: "Remote",
    department: "Design",
  },
    {
    title: "Marketing Lead",
    location: "Remote",
    department: "Marketing",
  },
];

export default function CareersPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <PageHeader>
        <PageHeaderHeading>Join Our Team</PageHeaderHeading>
        <PageHeaderDescription>
          We're building the future of invoicing and are looking for passionate people to join our mission. At InvoiceCraft, you'll have the chance to make a real impact.
        </PageHeaderDescription>
      </PageHeader>

      <div>
        <h2 className="text-3xl font-bold text-center mb-10">Current Openings</h2>
        {jobOpenings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobOpenings.map((job) => (
              <Card key={job.title} className="bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-shadow">
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>{job.department} &middot; {job.location}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="#">Apply Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground bg-card/50 backdrop-blur-sm border-dashed border-2 rounded-lg p-12">
            <p className="text-lg">There are no open positions at the moment.</p>
            <p>Please check back later or send us a speculative application!</p>
          </div>
        )}
      </div>
    </div>
  );
}
