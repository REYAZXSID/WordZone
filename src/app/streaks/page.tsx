import { PageHeader } from '@/components/page-header';
import { StreaksClientPage } from './streaks-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function StreaksLoading() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <div className="space-y-4">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
            </div>
        </div>
    )
}

export default function StreaksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Streak Tracker" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<StreaksLoading />}>
            <StreaksClientPage />
        </Suspense>
      </main>
    </div>
  );
}
