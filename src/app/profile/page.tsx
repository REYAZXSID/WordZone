import { PageHeader } from '@/components/page-header';
import { ProfileClientPage } from './profile-client-page';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


function ProfileLoading() {
    return (
        <div className="mx-auto max-w-md space-y-6">
            <Card className="p-6">
                <CardHeader className="items-center text-center p-0 pb-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-1 pt-4">
                        <Skeleton className="h-7 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="mb-6 rounded-lg border p-4">
                        <div className="flex items-center justify-center gap-2">
                             <Skeleton className="h-8 w-8" />
                             <Skeleton className="h-8 w-24" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-1">
                                <Skeleton className="h-6 w-12 mx-auto" />
                                <Skeleton className="h-4 w-24 mx-auto" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
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

// Dummy Card components for Skeleton structure
const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>
const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>
const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => <div className={className}>{children}</div>
