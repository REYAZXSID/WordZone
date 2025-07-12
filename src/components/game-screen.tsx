
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameBoard } from '@/components/game-board';
import { getPuzzleForLevel, getTotalPuzzles } from '@/lib/puzzles';
import type { Puzzle, Difficulty } from '@/lib/puzzles';
import { Skeleton } from '@/components/ui/skeleton';

export function GameScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);

  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';
  const level = parseInt(searchParams.get('level') || '1', 10);

  useEffect(() => {
    setPuzzle(getPuzzleForLevel(difficulty, level));
  }, [difficulty, level]);

  const handleGameComplete = () => {
    // Save progress to local storage
    if (typeof window !== 'undefined') {
      const key = `completedLevels_${difficulty}`;
      const savedProgress = localStorage.getItem(key);
      let completedLevels: number[] = savedProgress ? JSON.parse(savedProgress) : [];
      if (!completedLevels.includes(level)) {
        completedLevels.push(level);
        localStorage.setItem(key, JSON.stringify(completedLevels));
      }
    }
  };

  const handleNextLevel = () => {
    const totalPuzzles = getTotalPuzzles(difficulty);
    if (level < 50) { // 50 total levels
      router.push(`/game?difficulty=${difficulty}&level=${level + 1}`);
    }
  };

  const handlePlayAgain = () => {
    // Re-fetch the same puzzle to reset the board
    setPuzzle(null);
    setTimeout(() => setPuzzle(getPuzzleForLevel(difficulty, level)), 0);
  };

  const handleMainMenu = () => {
    router.push('/');
  }

  if (!puzzle) {
    return (
        <div className="flex flex-col min-h-screen bg-background p-4 items-center justify-center">
            <div className="w-full max-w-4xl space-y-8">
                 <div className="flex flex-wrap justify-center gap-x-1 gap-y-4">
                    {[...Array(25)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-9 rounded-md" />
                    ))}
                 </div>
                 <div className="w-full max-w-sm mx-auto p-2">
                    <div className="grid grid-cols-6 gap-2">
                         {[...Array(26)].map((_, i) => (
                            <Skeleton key={i} className="h-9 w-full rounded-md" />
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <GameBoard
        puzzle={puzzle}
        onGameComplete={handleGameComplete}
        onNextLevel={handleNextLevel}
        onPlayAgain={handlePlayAgain}
        onMainMenu={handleMainMenu}
        level={level}
      />
    </div>
  );
}
