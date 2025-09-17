import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          Join Our Team
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground">
          We're building the future of invoicing and are looking for passionate people to join our mission. At InvoiceCraft, you'll have the chance to make a real impact.
        </p>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-10">Current Openings</h2>
        {jobOpenings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobOpenings.map((job) => (
              <Card key={job.title} className="bg-background/50 backdrop-blur-lg border border-white/20 shadow-lg">
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
          <div className="text-center text-muted-foreground bg-background/50 backdrop-blur-lg border-dashed border-2 border-white/20 rounded-xl p-12">
            <p className="text-lg">There are no open positions at the moment.</p>
            <p>Please check back later or send us a speculative application!</p>
          </div>
        )}
      </div>
    </div>
  );
}
