
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameBoard } from '@/components/game-board';
import { getPuzzleForLevel, getTotalPuzzles } from '@/lib/puzzles';
import type { Puzzle, Difficulty } from '@/lib/puzzles';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GameScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [coins, setCoins] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';
  const level = parseInt(searchParams.get('level') || '1', 10);

  useEffect(() => {
    setIsClient(true);
    const currentPuzzle = getPuzzleForLevel(difficulty, level);
    setPuzzle(currentPuzzle);
    
    if (typeof window !== 'undefined') {
      const savedCoins = localStorage.getItem('crypto_coins');
      setCoins(parseInt(savedCoins || '200', 10));

      const handleStorageChange = () => {
        const updatedCoins = localStorage.getItem('crypto_coins');
        setCoins(parseInt(updatedCoins || '0', 10));
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [difficulty, level]);

  const handleGameComplete = (): number => {
    // Save progress to local storage
    if (typeof window !== 'undefined') {
      const key = `completedLevels_${difficulty}`;
      const savedProgress = localStorage.getItem(key);
      let completedLevels: number[] = savedProgress ? JSON.parse(savedProgress) : [];
      
      if (!completedLevels.includes(level)) {
        completedLevels.push(level);
        localStorage.setItem(key, JSON.stringify(completedLevels));
        
        let reward = 0;
        if (puzzle?.difficulty === 'easy') reward = 15;
        if (puzzle?.difficulty === 'medium') reward = 25;
        if (puzzle?.difficulty === 'hard') reward = 50;

        const currentCoins = parseInt(localStorage.getItem('crypto_coins') || '200', 10);
        const newCoinBalance = currentCoins + reward;
        localStorage.setItem('crypto_coins', newCoinBalance.toString());
        setCoins(newCoinBalance);
        
        // This toast is a fallback, main toast comes from bonus check
        if (reward > 0) {
            toast({
                title: 'Level Complete!',
                description: `You earned ${reward} coins.`,
            });
        }
        return reward;
      }
    }
    return 0; // No reward if already completed
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
    setTimeout(() => {
        const currentPuzzle = getPuzzleForLevel(difficulty, level);
        setPuzzle(currentPuzzle);
    }, 0);
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
      <div className="sticky top-16 z-10 flex justify-end p-2 bg-background/80 backdrop-blur-sm">
        {isClient ? (
            <Card>
                <CardContent className="flex items-center gap-2 p-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-lg">{coins}</span>
                </CardContent>
            </Card>
        ) : (
            <Skeleton className="h-10 w-24" />
        )}
      </div>
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
