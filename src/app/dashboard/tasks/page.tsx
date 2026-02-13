
'use client';

import { KanbanBoard } from '@/components/dashboard/kanban-board';
import { useUserAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function TasksPage() {
    const { userProfile, isLoading } = useUserAuth();

    if (isLoading) {
        return (
            <div className="h-full space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex gap-6 h-[500px]">
                    <Skeleton className="flex-1 h-full rounded-2xl" />
                    <Skeleton className="flex-1 h-full rounded-2xl" />
                    <Skeleton className="flex-1 h-full rounded-2xl" />
                </div>
            </div>
        )
    }

    if (!userProfile?.companyId) {
        return <div className="text-center p-10">Please join or create a company to view tasks.</div>;
    }

    return (
        <div className="h-[calc(100vh-100px)]">
            <KanbanBoard companyId={userProfile.companyId} />
        </div>
    );
}
