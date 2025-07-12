import { PageHeader } from '@/components/page-header';
import { AchievementsClientPage } from './achievements-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AchievementsLoading() {
    return (
        <div className="mx-auto max-w-2xl space-y-4">
             <div className="flex justify-center">
                <Skeleton className="h-10 w-64 rounded-md" />
            </div>
            <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-2 w-full" />
                        </div>
                         <Skeleton className="h-8 w-20" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function AchievementsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Achievements" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<AchievementsLoading />}>
            <AchievementsClientPage />
        </Suspense>
      </main>
    </div>
  );
}
