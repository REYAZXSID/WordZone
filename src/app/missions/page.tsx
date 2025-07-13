
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Coins, Puzzle, Flame, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/use-sound';
import { getUserData } from '@/lib/user-data';
import { isSameDay } from 'date-fns';

type Mission = {
  id: string;
  title: string;
  icon: React.ReactNode;
  reward: number;
  targetProgress: number;
  getProgress: (userData: ReturnType<typeof getUserData>, dailyCompleted: boolean) => number;
};

const initialMissions: Mission[] = [
  {
    id: 'solve_3_easy',
    title: 'Solve 3 Easy Puzzles',
    icon: <Puzzle className="h-6 w-6 text-green-500" />,
    reward: 25,
    targetProgress: 3,
    getProgress: (userData) => userData.stats.puzzlesSolvedByDifficulty.easy,
  },
  {
    id: 'complete_daily',
    title: 'Complete the Daily Puzzle',
    icon: <Flame className="h-6 w-6 text-orange-500" />,
    reward: 50,
    targetProgress: 1,
    getProgress: (_, dailyCompleted) => (dailyCompleted ? 1 : 0),
  },
  {
    id: 'use_5_hints',
    title: 'Use 5 Hints',
    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
    reward: 15,
    targetProgress: 5,
    getProgress: (userData) => userData.stats.hintsUsed,
  },
];

export default function MissionsPage() {
  const [isClient, setIsClient] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [claimedMissions, setClaimedMissions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { toast } = useToast();
  const playSound = useSound();
  const [userData, setUserDataState] = useState(getUserData());
  const [isDailyCompleted, setIsDailyCompleted] = useState(false);

  const refreshData = useCallback(() => {
    const data = getUserData();
    setUserDataState(data);
    
    const lastCompletionStr = localStorage.getItem('crypto_daily_completed_date');
    setIsDailyCompleted(lastCompletionStr ? isSameDay(new Date(lastCompletionStr), new Date()) : false);

    const savedClaimed = JSON.parse(localStorage.getItem('crypto_claimed_missions') || '[]');
    setClaimedMissions(savedClaimed);
  }, []);

  useEffect(() => {
    setIsClient(true);
    refreshData();
    setMissions(initialMissions);

    const handleStorageChange = () => {
        refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    
    const timerInterval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      if (diff <= 0) { // If it's a new day
        localStorage.removeItem('crypto_claimed_missions');
        setClaimedMissions([]);
        refreshData();
      }

      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => {
        clearInterval(timerInterval);
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshData]);
  
  const handleClaimReward = (mission: Mission) => {
    if (claimedMissions.includes(mission.id)) return;

    // Add coins to balance
    const currentCoins = parseInt(localStorage.getItem('crypto_coins') || '200', 10);
    const newCoinBalance = currentCoins + mission.reward;
    localStorage.setItem('crypto_coins', newCoinBalance.toString());

    // Mark as claimed
    const newClaimed = [...claimedMissions, mission.id];
    setClaimedMissions(newClaimed);
    localStorage.setItem('crypto_claimed_missions', JSON.stringify(newClaimed));
    
    playSound('mission');
    toast({
      title: 'Reward Claimed!',
      description: `You earned ${mission.reward} coins!`,
    });
  };

  const renderTimer = () => {
    if (!isClient) return "Loading...";
    return `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Daily Missions" />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl space-y-4">
            <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle>New Missions In: {renderTimer()}</CardTitle>
                    <CardDescription>Complete missions to earn valuable coins and power-ups!</CardDescription>
                </CardHeader>
            </Card>

          {missions.map((mission) => {
            const currentProgress = mission.getProgress(userData, isDailyCompleted);
            const isComplete = currentProgress >= mission.targetProgress;
            const isClaimed = claimedMissions.includes(mission.id);
            const canClaim = isComplete && !isClaimed;

            return (
              <Card key={mission.id} className={cn(canClaim && "border-primary ring-2 ring-primary")}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      {mission.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{mission.title}</h3>
                      <div className="flex items-center gap-2">
                          <Progress value={(currentProgress / mission.targetProgress) * 100} className="h-2 w-full sm:w-48" />
                          <span className="text-xs text-muted-foreground">{Math.min(currentProgress, mission.targetProgress)}/{mission.targetProgress}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 pl-4 text-center">
                      <div className="flex items-center font-bold text-yellow-500">
                          <Coins className="h-5 w-5 mr-1" />
                          {mission.reward}
                      </div>
                      <Button 
                          size="sm" 
                          disabled={!canClaim}
                          onClick={() => handleClaimReward(mission)}
                          className={cn(canClaim && "animate-pulse-success")}
                      >
                        {isClaimed ? (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Claimed
                            </>
                        ) : "Claim"}
                      </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  );
}
