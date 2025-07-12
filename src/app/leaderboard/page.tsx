import { PageHeader } from '@/components/page-header';

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Leaderboard" />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold">Coming Soon</h2>
          <p className="text-muted-foreground">This page is under construction.</p>
        </div>
      </main>
    </div>
  );
}
