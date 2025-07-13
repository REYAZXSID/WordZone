
import { PageHeader } from '@/components/page-header';
import { ShopClientPage } from './shop-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function ShopLoading() {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-10 w-40 rounded-md" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                         <div className="flex items-center justify-between pt-2">
                             <Skeleton className="h-6 w-20" />
                             <Skeleton className="h-10 w-24 rounded-md" />
                         </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ShopPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Shop" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<ShopLoading />}>
            <ShopClientPage />
        </Suspense>
      </main>
    </div>
  );
}
