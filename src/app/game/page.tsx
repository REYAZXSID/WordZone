'use client';

import { Suspense } from 'react';
import { GameScreen } from '@/components/game-screen';

export default function GamePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen flex-col items-center justify-center bg-background"><p>Loading puzzle...</p></div>}>
      <GameScreen />
    </Suspense>
  );
}
