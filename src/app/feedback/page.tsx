import { PageHeader } from '@/components/page-header';
import { FeedbackClientPage } from './feedback-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function FeedbackLoading() {
    return (
        <div className="mx-auto max-w-2xl space-y-4">
             <div className="flex justify-center">
                <Skeleton className="h-10 w-64 rounded-md" />
            </div>
            <div className="space-y-4 rounded-lg border p-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-20 w-full" />
                </div>
                 <Skeleton className="h-12 w-full rounded-md" />
            </div>
        </div>
    )
}

export default function FeedbackPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Feedback & Reports" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<FeedbackLoading />}>
            <FeedbackClientPage />
        </Suspense>
      </main>
    </div>
  );
}
