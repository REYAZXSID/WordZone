
'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Medal, Puzzle, Star, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSound } from '@/hooks/use-sound';
import { saveUserData, getUserData } from '@/lib/user-data';

export type Achievement = {
  id: string;
  title: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold';
  currentProgress: number;
  targetProgress: number;
  reward: number; // Coins
  icon: React.ReactNode;
};

const TIER_COLORS = {
  bronze: 'text-orange-600 fill-orange-500',
  silver: 'text-gray-400 fill-gray-300',
  gold: 'text-yellow-500 fill-yellow-400',
};

// Mock data for achievements
export const initialAchievements: Achievement[] = [
  {
    id: 'rookie_solver',
    title: 'Rookie Solver',
    description: 'Solve your first puzzle.',
    tier: 'bronze',
    currentProgress: 1,
    targetProgress: 1,
    reward: 10,
    icon: <Puzzle className="h-6 w-6 text-blue-500" />,
  },
  {
    id: 'puzzle_apprentice',
    title: 'Puzzle Apprentice',
    description: 'Solve 10 easy puzzles.',
    tier: 'bronze',
    currentProgress: 8,
    targetProgress: 10,
    reward: 25,
    icon: <Puzzle className="h-6 w-6 text-blue-500" />,
  },
  {
    id: 'medium_master',
    title: 'Medium Master',
    description: 'Solve 25 medium puzzles.',
    tier: 'silver',
    currentProgress: 12,
    targetProgress: 25,
    reward: 100,
    icon: <Puzzle className="h-6 w-6 text-green-500" />,
  },
  {
    id: 'hard_veteran',
    title: 'Hard Veteran',
    description: 'Solve 50 hard puzzles.',
    tier: 'gold',
    currentProgress: 3,
    targetProgress: 50,
    reward: 250,
    icon: <Puzzle className="h-6 w-6 text-red-500" />,
  },
  {
    id: 'streaker',
    title: 'Streaker',
    description: 'Maintain a 7-day streak.',
    tier: 'silver',
    currentProgress: 7,
    targetProgress: 7,
    reward: 75,
    icon: <Star className="h-6 w-6 text-yellow-500" />,
  },
  {
    id: 'quick_thinker',
    title: 'Quick Thinker',
    description: 'Solve any puzzle in under a minute.',
    tier: 'bronze',
    currentProgress: 0,
    targetProgress: 1,
    reward: 30,
    icon: <Clock className="h-6 w-6 text-purple-500" />,
  },
];


export function AchievementsClientPage() {
    const [isClient, setIsClient] = useState(false);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const { toast } = useToast();
    const playSound = useSound();

    useEffect(() => {
        setIsClient(true);
        // Load user data to get unlocked achievements
        const userData = getUserData();
        const savedUnlocked = userData.unlockedAchievements;
        
        // Demo: Check for newly completed achievements and reward coins automatically
        const newlyUnlocked: string[] = [];
        initialAchievements.forEach(ach => {
            if (ach.currentProgress >= ach.targetProgress && !savedUnlocked.includes(ach.id)) {
                newlyUnlocked.push(ach.id);

                // Add coins to balance (auto-claim)
                const currentCoins = parseInt(localStorage.getItem('crypto_coins') || '200', 10);
                const newCoinBalance = currentCoins + ach.reward;
                localStorage.setItem('crypto_coins', newCoinBalance.toString());

                 toast({
                    title: 'Achievement Unlocked!',
                    description: `You earned ${ach.reward} coins for completing "${ach.title}"!`,
                });
                playSound('achievement');
            }
        });

        if (newlyUnlocked.length > 0) {
            const allUnlocked = [...savedUnlocked, ...newlyUnlocked];
            saveUserData({ unlockedAchievements: allUnlocked });
        }
        
        setAchievements(initialAchievements);
    }, [toast, playSound]);
    
    const unlockedAchievements = isClient ? getUserData().unlockedAchievements : [];

    const renderAchievementCard = (achievement: Achievement) => {
        const isCompleted = achievement.currentProgress >= achievement.targetProgress;
        const progress = Math.min((achievement.currentProgress / achievement.targetProgress) * 100, 100);

        return (
            <Card key={achievement.id} className={cn(
                "transition-all duration-300",
                !isCompleted ? "bg-muted/30" : "border-primary/50 bg-primary/10"
            )}>
                <CardContent className="flex items-center gap-4 p-4">
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg bg-background", !isCompleted && "grayscale opacity-50")}>
                        {achievement.icon}
                    </div>
                    <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <div className="flex items-center gap-1 text-sm font-bold">
                                <Medal className={cn("h-5 w-5", TIER_COLORS[achievement.tier])}/>
                                <span className="capitalize">{achievement.tier}</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-2 pt-1">
                            <Progress value={progress} className="h-2 w-full" />
                            <span className="text-xs font-mono text-muted-foreground">
                                {achievement.currentProgress}/{achievement.targetProgress}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center pl-4 w-20">
                        {isCompleted ? (
                             <div className="flex flex-col items-center text-green-500">
                                <CheckCircle2 className="h-8 w-8" />
                                <span className="text-xs font-bold mt-1">Unlocked</span>
                            </div>
                        ) : (
                             <div className="flex flex-col items-center">
                                <span className="font-bold text-lg text-yellow-500">+{achievement.reward}</span>
                                <span className="text-xs text-muted-foreground">Coins</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    };
    
    if (!isClient) return null;

    const inProgress = achievements.filter(a => a.currentProgress < a.targetProgress);
    const completed = achievements.filter(a => a.currentProgress >= a.targetProgress);

    return (
        <div className="mx-auto max-w-2xl">
            <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="all">All ({achievements.length})</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3">
                    {achievements.map(renderAchievementCard)}
                </TabsContent>
                <TabsContent value="in-progress" className="space-y-3">
                    {inProgress.map(renderAchievementCard)}
                </TabsContent>
                <TabsContent value="completed" className="space-y-3">
                    {completed.map(renderAchievementCard)}
                </TabsContent>
            </Tabs>
        </div>
    )
}
