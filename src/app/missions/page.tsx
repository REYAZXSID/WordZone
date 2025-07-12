
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Coins, Puzzle, Flame, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Mission = {
  id: string;
  title: string;
  icon: React.ReactNode;
  currentProgress: number;
  targetProgress: number;
  reward: number;
};

// Mock data for daily missions
const initialMissions: Mission[] = [
  {
    id: 'solve_3_easy',
    title: 'Solve 3 Easy Puzzles',
    icon: <Puzzle className="h-6 w-6 text-green-500" />,
    currentProgress: 2, // Pre-set progress
    targetProgress: 3,
    reward: 25,
  },
  {
    id: 'complete_daily',
    title: 'Complete the Daily Puzzle',
    icon: <Flame className="h-6 w-6 text-orange-500" />,
    currentProgress: 1, // Pre-set as complete
    targetProgress: 1,
    reward: 50,
  },
  {
    id: 'use_5_hints',
    title: 'Use 5 Hints',
    icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
    currentProgress: 5, // Pre-set as complete
    targetProgress: 5,
    reward: 15,
  },
  {
    id: 'solve_hard_timed',
    title: 'Solve a Hard Puzzle in under 5 minutes',
    icon: <Puzzle className="h-6 w-6 text-red-500" />,
    currentProgress: 0,
    targetProgress: 1,
    reward: 100,
  },
];

export default function MissionsPage() {
  const [isClient, setIsClient] = useState(false);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [claimedMissions, setClaimedMissions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    
    // Load claimed missions from localStorage
    const savedClaimed = JSON.parse(localStorage.getItem('crypto_claimed_missions') || '[]');
    setClaimedMissions(savedClaimed);
    // For demo, we just use the initial set. In a real app, you'd fetch/generate daily missions.
    setMissions(initialMissions);

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
  }, []);
  
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
            const isComplete = mission.currentProgress >= mission.targetProgress;
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
                          <Progress value={(mission.currentProgress / mission.targetProgress) * 100} className="h-2 w-full sm:w-48" />
                          <span className="text-xs text-muted-foreground">{mission.currentProgress}/{mission.targetProgress}</span>
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
