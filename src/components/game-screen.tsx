
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameBoard } from '@/components/game-board';
import { getPuzzleForLevel } from '@/lib/puzzles';
import type { Puzzle, Difficulty } from '@/lib/puzzles';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useSound } from '@/hooks/use-sound';
import { updateUserStat, saveUserData, getUserData } from '@/lib/user-data';

export function GameScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const playSound = useSound();

  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';
  const level = parseInt(searchParams.get('level') || '1', 10);

  useEffect(() => {
    setIsClient(true);
    const currentPuzzle = getPuzzleForLevel(difficulty, level);
    setPuzzle(currentPuzzle);
  }, [difficulty, level]);

  const handleGameComplete = (durationInSeconds: number): number => {
    // Save progress to local storage
    if (typeof window !== 'undefined') {
      const key = `completedLevels_${difficulty}`;
      const savedProgress = localStorage.getItem(key);
      let completedLevels: number[] = savedProgress ? JSON.parse(savedProgress) : [];
      
      if (!completedLevels.includes(level)) {
        completedLevels.push(level);
        localStorage.setItem(key, JSON.stringify(completedLevels));
        
        // Update stats
        updateUserStat('puzzlesSolved', 1, difficulty);
        updateUserStat('fastestSolveTime', Math.round(durationInSeconds));
        
        let reward = 0;
        if (puzzle?.difficulty === 'easy') reward = 15;
        if (puzzle?.difficulty === 'medium') reward = 25;
        if (puzzle?.difficulty === 'hard') reward = 50;
        if (puzzle?.difficulty === 'intermediate') reward = 75;
        if (puzzle?.difficulty === 'advance') reward = 100;

        let totalReward = reward;

        // Add time bonus
        if (durationInSeconds <= 60) {
            const timeBonus = 5;
            totalReward += timeBonus;
            playSound('coin');
            toast({
                title: 'Speed Bonus!',
                description: `Solved in under a minute! +${timeBonus} coins.`,
            });
        }
        
        const currentData = getUserData();
        saveUserData({ coins: currentData.coins + totalReward });

        if (reward > 0) {
             toast({
                title: 'Level Complete!',
                description: `You earned ${totalReward} coins.`,
            });
        }
        
        return totalReward;
      }
    }
    return 0; // No reward if already completed
  };

  const handleNextLevel = () => {
    if (level < 50) { // 50 total levels
      router.push(`/game?difficulty=${difficulty}&level=${level + 1}`);
    } else {
        toast({ title: "Congratulations!", description: `You have completed all levels for ${difficulty} difficulty.`});
        router.push('/game/category');
    }
  };

  const handlePlayAgain = () => {
    // Re-fetch the same puzzle to reset the board
    setPuzzle(null);
    setTimeout(() => {
        const currentPuzzle = getPuzzleForLevel(difficulty, level);
        setPuzzle(currentPuzzle);
    }, 0);
  };

  const handleMainMenu = () => {
    router.push('/game/category');
  }

  if (!isClient || !puzzle) {
    return (
        <div className="flex flex-col min-h-screen bg-background p-4 items-center justify-center">
            <div className="w-full max-w-4xl space-y-8">
                 <div className="flex flex-wrap justify-center gap-x-1 gap-y-4">
                    {[...Array(25)].map((_, i) => (
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
