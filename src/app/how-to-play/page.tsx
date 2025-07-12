
import { PageHeader } from '@/components/page-header';
import { HowToPlayClientPage } from './how-to-play-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function HowToPlayLoading() {
    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <div className="space-y-4 rounded-lg border p-6">
                 <Skeleton className="h-8 w-1/2" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
            </div>
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        </div>
    )
}

export default function HowToPlayPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="How to Play" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<HowToPlayLoading />}>
            <HowToPlayClientPage />
        </Suspense>
      </main>
    </div>
  );
}
