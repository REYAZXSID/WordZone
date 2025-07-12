'use client';

import { GameBoard } from '@/components/game-board';
import { PageHeader } from '@/components/page-header';
import { getDailyPuzzle } from '@/lib/puzzles';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Calendar } from 'lucide-react';

const puzzle = getDailyPuzzle();

export default function DailyPage() {
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Streak logic
    const storedStreak = localStorage.getItem('dailyPuzzleStreak');
    const lastWinDate = localStorage.getItem('lastWinDate');
    const today = new Date().toDateString();
    
    if (storedStreak) {
      if (lastWinDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastWinDate !== yesterday.toDateString()) {
          // Streak is broken
          setStreak(0);
          localStorage.setItem('dailyPuzzleStreak', '0');
        } else {
          setStreak(parseInt(storedStreak, 10));
        }
      } else {
         setStreak(parseInt(storedStreak, 10));
      }
    }

    // Timer logic
    const timerInterval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const handleGameComplete = () => {
    const lastWinDate = localStorage.getItem('lastWinDate');
    const today = new Date().toDateString();

    if (lastWinDate !== today) {
      setStreak(prev => {
          const newStreak = prev + 1;
          localStorage.setItem('dailyPuzzleStreak', newStreak.toString());
          localStorage.setItem('lastWinDate', today);
          return newStreak;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Daily Puzzle" />
      <main>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 p-4 md:flex-row md:justify-center md:p-6">
          <Card className="w-full md:w-auto">
            <CardContent className="flex items-center gap-4 p-4">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <div className="font-bold text-xl">{streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full md:w-auto">
            <CardContent className="flex items-center gap-4 p-4">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                 <div className="font-bold text-xl tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}:
                    {String(timeLeft.minutes).padStart(2, '0')}:
                    {String(timeLeft.seconds).padStart(2, '0')}
                 </div>
                 <div className="text-sm text-muted-foreground">Next Puzzle In</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <GameBoard puzzle={puzzle} onGameComplete={handleGameComplete} />
      </main>
    </div>
  );
}
