'use client';

import { Suspense } from 'react';
import { GameScreen } from '@/components/game-screen';
import { Skeleton } from '@/components/ui/skeleton';

function GamePageLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-background p-4 items-center justify-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-wrap justify-center gap-x-1 gap-y-4">
          {[...Array(15)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-9 rounded-md" />
          ))}
        </div>
        <div className="w-full max-w-sm mx-auto p-2">
          <div className="grid grid-cols-7 gap-1.5">
            {[...Array(26)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<GamePageLoading />}>
      <GameScreen />
    </Suspense>
  );
}
