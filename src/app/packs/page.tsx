import { PageHeader } from '@/components/page-header';
import { PuzzlePacksClientPage } from './puzzle-packs-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function PuzzlePacksLoading() {
    return (
        <div className="mx-auto max-w-2xl space-y-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center gap-4 pt-2">
                        <Skeleton className="h-2 w-full" />
                        <Skeleton className="h-4 w-12" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function PuzzlePacksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Puzzle Packs" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<PuzzlePacksLoading />}>
            <PuzzlePacksClientPage />
        </Suspense>
      </main>
    </div>
  );
}
