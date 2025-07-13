
'use client';

import { GameBoard } from '@/components/game-board';
import { getDailyPuzzle } from '@/lib/puzzles';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, Calendar, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { updateUserStat, getUserData } from '@/lib/user-data';
import { addDays, isSameDay, startOfDay } from 'date-fns';

const puzzle = getDailyPuzzle();

export default function DailyPage() {
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    
    const userData = getUserData();
    setStreak(userData.stats.dailyStreak);

    const lastCompletionStr = localStorage.getItem('crypto_daily_completed_date');
    if (lastCompletionStr) {
        setIsCompletedToday(isSameDay(new Date(lastCompletionStr), new Date()));
    }

    // Timer logic
    const timerInterval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [isClient]);

  const handleGameComplete = () => {
    const today = new Date();
    
    if (isCompletedToday) {
        return 0; // Already completed today
    }

    const userData = getUserData();
    let currentStreak = userData.stats.dailyStreak;
    
    const lastWinDateStr = localStorage.getItem('lastWinDate');
    const lastWinDate = lastWinDateStr ? new Date(lastWinDateStr) : null;
    const yesterday = addDays(today, -1);

    if (lastWinDate && isSameDay(lastWinDate, yesterday)) {
        currentStreak++; // Continue streak
    } else {
        currentStreak = 1; // Start new or reset streak
    }
    
    updateUserStat('dailyStreak', currentStreak);
    setStreak(currentStreak);
    
    localStorage.setItem('lastWinDate', today.toDateString());
    localStorage.setItem('crypto_daily_completed_date', today.toDateString());

    const savedDatesStr = localStorage.getItem('crypto_completed_dates') || '[]';
    const savedDates = JSON.parse(savedDatesStr);
    savedDates.push(today.toISOString());
    localStorage.setItem('crypto_completed_dates', JSON.stringify(savedDates));

    const coins = parseInt(localStorage.getItem('crypto_coins') || '200', 10);
    const reward = 40; // Daily puzzle reward
    const newCoinBalance = coins + reward;
    localStorage.setItem('crypto_coins', newCoinBalance.toString());
    
    toast({
      title: 'Daily Puzzle Complete!',
      description: `You earned ${reward} coins! Your streak is now ${currentStreak} days.`,
    });
    
    setIsCompletedToday(true);
    return reward;
  };
  
  const handleMainMenu = () => {
    router.push('/game/category');
  };
  
  const handlePlayAgain = () => {
    // For daily puzzle, this can just reload the page or reset state
    window.location.reload();
  }

  const renderStats = () => {
    if (!isClient) {
      return (
        <>
          <Skeleton className="h-20 w-40" />
          <Skeleton className="h-20 w-40" />
        </>
      );
    }
    return (
      <>
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <Flame className="h-7 w-7 text-orange-500" />
            <div>
              <div className="font-bold text-lg">{streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-3">
            <Calendar className="h-7 w-7 text-primary" />
            <div>
              <div className="font-bold text-lg tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-muted-foreground">Next Puzzle In</div>
            </div>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-between items-center p-4">
        {renderStats()}
      </div>
      <GameBoard 
        puzzle={puzzle} 
        onGameComplete={handleGameComplete} 
        isDailyChallenge={true}
        onMainMenu={handleMainMenu}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}
