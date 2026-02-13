

'use client';

import { useMemo } from 'react';
import { useUserAuth } from '@/context/auth-provider';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, ArrowLeft, Building, User, Hash, Briefcase, Badge as BadgeIcon } from 'lucide-react';
import { useFirebase, useMemoFirebase } from '@/firebase/provider';
import { toDateSafe } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { hasAccess } from '@/lib/permissions';

export default function EmployeeDetailPage() {
  const { firestore } = useFirebase();
  const { userProfile } = useUserAuth();
  const params = useParams();
  const router = useRouter();
  const { userId } = params;

  const companyId = userProfile?.companyId;

  const userRef = useMemoFirebase(() => {
    if (!firestore || !companyId || !userId) return null;
    return doc(firestore, 'companies', companyId, 'users', userId as string);
  }, [firestore, companyId, userId]);

  const { data: rawUser, isLoading: isUserLoading } = useDoc<any>(userRef);

  const employee = useMemo(() => {
    if (!rawUser) return null;

    // Privacy Check: Non-admins can only view their own profile
    if (!hasAccess(userProfile, 'manage:employees') && userId !== userProfile?.uid) {
      return null; // This will trigger the "Employee Not Found" UI or we can customize it
    }

    const processed = { ...rawUser };
    processed.createdAt = toDateSafe(processed.createdAt);
    return processed;
  }, [rawUser, userProfile, userId]);

  if (isUserLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-1 h-64" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Employee Not Found</h2>
        <p className="text-muted-foreground">The requested employee could not be found.</p>
        <Button onClick={() => router.push('/dashboard?tab=users')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Button variant="outline" size="sm" onClick={() => router.push('/dashboard?tab=users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg h-full">
            <CardHeader className="flex flex-col items-center gap-4 text-center p-6">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={employee.avatarUrl || ''} alt={employee.name} />
                <AvatarFallback className="text-3xl">{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{employee.name}</CardTitle>
                <CardDescription className="text-sm">{employee.position || 'Employee'}</CardDescription>
              </div>
              <Badge variant={employee.status === 'active' ? 'success' : 'secondary'} className="capitalize">{employee.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm p-6 pt-0">
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-start gap-3"><Mail className="h-4 w-4 text-muted-foreground mt-0.5" /><a href={`mailto:${employee.email}`} className="hover:underline">{employee.email}</a></div>
                <div className="flex items-start gap-3"><Phone className="h-4 w-4 text-muted-foreground mt-0.5" /><span>{employee.phone || 'Not provided'}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3"><User className="h-4 w-4 text-muted-foreground" /><div><p className="text-muted-foreground text-xs">Name</p><p>{employee.name}</p></div></div>
              <div className="flex items-center gap-3"><Briefcase className="h-4 w-4 text-muted-foreground" /><div><p className="text-muted-foreground text-xs">Position</p><p>{employee.position || '-'}</p></div></div>
              <div className="flex items-center gap-3"><BadgeIcon className="h-4 w-4 text-muted-foreground" /><div><p className="text-muted-foreground text-xs">Designation</p><p>{employee.designation || '-'}</p></div></div>
              <div className="flex items-center gap-3"><Hash className="h-4 w-4 text-muted-foreground" /><div><p className="text-muted-foreground text-xs">Role</p><p className="capitalize">{employee.role}</p></div></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
