import { PageHeader } from '@/components/page-header';
import { InboxClientPage } from './inbox-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function InboxLoading() {
    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                         <Skeleton className="h-10 w-24" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function InboxPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Inbox & Rewards" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<InboxLoading />}>
            <InboxClientPage />
        </Suspense>
      </main>
    </div>
  );
}
