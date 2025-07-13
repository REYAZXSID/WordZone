
import { PageHeader } from '@/components/page-header';
import { ProfileClientPage } from './profile-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function ProfileLoading() {
    return (
        <div className="mx-auto max-w-lg space-y-6">
            <div className="rounded-lg border bg-card p-6 flex flex-col items-center">
                <Skeleton className="h-28 w-28 rounded-full" />
                <Skeleton className="h-8 w-40 mt-4" />
                <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
            </div>
             <Skeleton className="h-12 w-full" />
        </div>
    )
}

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Profile" />
      <main className="flex-1 p-4 sm:p-6">
         <Suspense fallback={<ProfileLoading />}>
            <ProfileClientPage />
        </Suspense>
      </main>
    </div>
  );
}
