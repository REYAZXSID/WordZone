import { PageHeader } from '@/components/page-header';
import { LeaderboardClientPage } from './leaderboard-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function LeaderboardLoading() {
    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <div className="flex justify-center">
                <Skeleton className="h-10 w-64 rounded-md" />
            </div>
            <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                         <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>
        </div>
    )
}


export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Leaderboard" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<LeaderboardLoading />}>
            <LeaderboardClientPage />
        </Suspense>
      </main>
    </div>
  );
}
