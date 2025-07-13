
import { PageHeader } from '@/components/page-header';
import { CoinShopClientPage } from './coin-shop-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function CoinShopLoading() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
                <Skeleton className="h-8 w-32" />
            </div>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                       </div>
                       <Skeleton className="h-10 w-28 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    )
}


export default function CoinShopPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Coin Shop" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<CoinShopLoading />}>
            <CoinShopClientPage />
        </Suspense>
      </main>
    </div>
  );
}
