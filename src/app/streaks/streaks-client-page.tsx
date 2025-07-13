
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Flame, Star, Coins, CheckCircle2 } from 'lucide-react';
import { addDays, format, isSameDay, startOfDay, differenceInCalendarDays } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/use-sound';
import { getUserData, saveUserData } from '@/lib/user-data';
import { useUserData } from '@/hooks/use-user-data';


type StreakMilestone = {
    days: number;
    reward: number;
    title: string;
};

const streakMilestones: StreakMilestone[] = [
    { days: 3, reward: 10, title: "3-Day Streak" },
    { days: 7, reward: 25, title: "7-Day Streak" },
    { days: 14, reward: 50, title: "14-Day Streak" },
];

const calculateStreaks = (dates: Date[]) => {
    if (dates.length === 0) return { current: 0, best: 0 };
    
    const sortedDates = dates.map(d => startOfDay(d)).sort((a,b) => a.getTime() - b.getTime());
    const uniqueDates = sortedDates.filter((date, index, self) => 
        index === self.findIndex(d => isSameDay(d, date))
    );

    let currentStreak = 0;
    let bestStreak = 0;
    
    if (uniqueDates.length > 0) {
        // Check if the most recent date is today or yesterday to count the current streak
        const today = startOfDay(new Date());
        const lastDate = uniqueDates[uniqueDates.length - 1];
        if (isSameDay(lastDate, today) || isSameDay(lastDate, addDays(today, -1))) {
            currentStreak = 1;
            for (let i = uniqueDates.length - 1; i > 0; i--) {
                const diff = differenceInCalendarDays(uniqueDates[i], uniqueDates[i-1]);
                if (diff === 1) {
                    currentStreak++;
                } else {
                    break;
                }
            }
        }
    }
    
    // Calculate best streak
    if (uniqueDates.length > 0) {
        bestStreak = 1;
        let tempStreak = 1;
        for (let i = 1; i < uniqueDates.length; i++) {
             const diff = differenceInCalendarDays(uniqueDates[i], uniqueDates[i-1]);
             if (diff === 1) {
                 tempStreak++;
             } else {
                 if (tempStreak > bestStreak) {
                    bestStreak = tempStreak;
                 }
                 tempStreak = 1;
             }
        }
        if (tempStreak > bestStreak) {
            bestStreak = tempStreak;
        }
    }

    return { current: currentStreak, best: bestStreak };
};


export function StreaksClientPage() {
    const { userData } = useUserData();
    const [isClient, setIsClient] = useState(false);
    const [completedDates, setCompletedDates] = useState<Date[]>([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [claimedMilestones, setClaimedMilestones] = useState<number[]>([]);
    const { toast } = useToast();
    const playSound = useSound();

    const loadData = useCallback(() => {
        if (typeof window !== 'undefined') {
            const storedDatesStr = localStorage.getItem('crypto_completed_dates') || '[]';
            const dates: Date[] = JSON.parse(storedDatesStr).map((d: string) => new Date(d));
            setCompletedDates(dates);

            const { current, best } = calculateStreaks(dates);
            setCurrentStreak(current);

            const currentUserData = getUserData();
            const savedBest = currentUserData.stats.bestStreak;
            const newBest = Math.max(best, savedBest);
            setBestStreak(newBest);
            
            if (newBest > savedBest || current !== currentUserData.stats.dailyStreak) {
                 saveUserData({ stats: { ...currentUserData.stats, dailyStreak: current, bestStreak: newBest } });
            }

            const storedClaimed = JSON.parse(localStorage.getItem('crypto_claimed_streaks') || '[]');
            setClaimedMilestones(storedClaimed);
        }
    }, []);

    useEffect(() => {
        setIsClient(true);
        loadData();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'crypto_completed_dates' || e.key === 'crypto_claimed_streaks') {
                loadData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [loadData]);

    const handleClaimMilestone = (milestone: StreakMilestone) => {
        if (!userData || currentStreak < milestone.days || claimedMilestones.includes(milestone.days)) return;

        const newCoinBalance = userData.coins + milestone.reward;
        saveUserData({ coins: newCoinBalance });
        localStorage.setItem('crypto_coins', newCoinBalance.toString());
        window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_coins' }));


        const newClaimed = [...claimedMilestones, milestone.days];
        setClaimedMilestones(newClaimed);
        localStorage.setItem('crypto_claimed_streaks', JSON.stringify(newClaimed));
        
        playSound('coin');
        toast({
            title: 'Reward Claimed!',
            description: `You earned ${milestone.reward} coins for your ${milestone.days}-day streak!`,
        });
    };

    if (!isClient) return null;

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                        <Flame className="h-5 w-5 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentStreak} Days</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
                        <Star className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bestStreak} Days</div>
                        <p className="text-xs text-muted-foreground">Your personal record</p>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardContent className="p-2 sm:p-4">
                    <Calendar
                        mode="multiple"
                        selected={completedDates}
                        ISOWeek
                        className="w-full"
                         modifiers={{
                            completed: completedDates,
                        }}
                        modifiersStyles={{
                            completed: {
                                color: 'hsl(var(--primary-foreground))',
                                backgroundColor: 'hsl(var(--primary))',
                                borderRadius: '50%'
                            },
                        }}
                    />
                </CardContent>
            </Card>

            <div>
                <h3 className="text-xl font-bold text-center mb-4">Streak Rewards</h3>
                <div className="space-y-3">
                    {streakMilestones.map((milestone) => {
                        const isComplete = currentStreak >= milestone.days;
                        const isClaimed = claimedMilestones.includes(milestone.days);
                        const canClaim = isComplete && !isClaimed;
                        
                        return (
                            <Card key={milestone.days} className={cn(canClaim && "border-primary ring-2 ring-primary")}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                            <Flame className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{milestone.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Progress value={(currentStreak / milestone.days) * 100} className="h-2 w-32" />
                                                <span className="text-xs text-muted-foreground">{Math.min(currentStreak, milestone.days)}/{milestone.days}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 pl-2">
                                        <div className="flex items-center text-lg font-bold text-yellow-500">
                                            <Coins className="mr-1.5 h-5 w-5" /> +{milestone.reward}
                                        </div>
                                        <Button 
                                            size="sm"
                                            disabled={!canClaim}
                                            onClick={() => handleClaimMilestone(milestone)}
                                            className={cn(canClaim && "animate-pulse-success")}
                                        >
                                            {isClaimed ? <><CheckCircle2 className="mr-2 h-4 w-4"/>Claimed</> : "Claim"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
