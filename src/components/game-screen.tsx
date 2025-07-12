
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GameBoard } from '@/components/game-board';
import { getRandomPuzzle } from '@/lib/puzzles';
import type { Puzzle, Difficulty } from '@/lib/puzzles';
import { Skeleton } from '@/components/ui/skeleton';

export function GameScreen() {
  const searchParams = useSearchParams();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const difficulty = (searchParams.get('difficulty') as Difficulty) || undefined;

  useEffect(() => {
    setPuzzle(getRandomPuzzle(difficulty));
  }, [difficulty]);
  
  const handleNewGame = () => {
    setPuzzle(getRandomPuzzle(difficulty));
  }

  if (!puzzle) {
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
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <GameBoard puzzle={puzzle} onNewGame={handleNewGame} />
    </div>
  );
}
