
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
import { useUserData } from '@/hooks/use-user-data';

export function GameScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const { userData, refreshUserData } = useUserData();
  const { toast } = useToast();
  const playSound = useSound();

  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';
  const level = parseInt(searchParams.get('level') || '1', 10);

  useEffect(() => {
    const currentPuzzle = getPuzzleForLevel(difficulty, level);
    setPuzzle(currentPuzzle);
  }, [difficulty, level]);

  const handleGameComplete = (durationInSeconds: number): number => {
    if (!userData) return 0;

    const key = `completedLevels_${difficulty}`;
    const savedProgress = localStorage.getItem(key);
    let completedLevels: number[] = savedProgress ? JSON.parse(savedProgress) : [];
    
    let totalReward = 0;
    
    if (!completedLevels.includes(level)) {
      completedLevels.push(level);
      localStorage.setItem(key, JSON.stringify(completedLevels));
      
      let reward = 0;
      if (puzzle?.difficulty === 'easy') reward = 15;
      if (puzzle?.difficulty === 'medium') reward = 25;
      if (puzzle?.difficulty === 'hard') reward = 50;
      if (puzzle?.difficulty === 'intermediate') reward = 75;
      if (puzzle?.difficulty === 'advance') reward = 100;
      totalReward = reward;

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

      // Update stats and save everything at once
      const newStats = { ...userData.stats };
      newStats.puzzlesSolved += 1;
      newStats.puzzlesSolvedByDifficulty[difficulty] = (newStats.puzzlesSolvedByDifficulty[difficulty] || 0) + 1;
      if (newStats.fastestSolveTime === null || durationInSeconds < newStats.fastestSolveTime) {
          newStats.fastestSolveTime = Math.round(durationInSeconds);
      }
      
      saveUserData({ 
          coins: userData.coins + totalReward,
          stats: newStats
      });

      if (reward > 0) {
           toast({
              title: 'Level Complete!',
              description: `You earned ${totalReward} coins.`,
          });
      }

      refreshUserData(); // Refresh data for current component
      return totalReward;
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

  if (!userData || !puzzle) {
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
