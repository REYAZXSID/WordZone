
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Coins, Puzzle, Flame, Lightbulb, Pencil, CheckCircle2, Medal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { initialAchievements, type Achievement } from '../achievements/achievements-client-page';
import { cn } from '@/lib/utils';
import Link from 'next/link';


type UserProfile = {
  username: string;
  userId: string;
  avatar: string;
};

type UserStats = {
  puzzlesSolved: number;
  fastestTime: string; // "N/A" or formatted time
  dailyStreak: number;
  hintsUsed: number;
};

const TIER_COLORS = {
  bronze: 'text-orange-600',
  silver: 'text-gray-400',
  gold: 'text-yellow-500',
};

export function ProfileClientPage() {
  const [isClient, setIsClient] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [coins, setCoins] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [completedAchievements, setCompletedAchievements] = useState<Achievement[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsClient(true);
    
    // Profile
    let userProfile = JSON.parse(localStorage.getItem('crypto_user') || 'null');
    if (!userProfile) {
      userProfile = {
        username: 'CryptoPlayer',
        userId: `user_${Math.random().toString(36).substr(2, 9)}`,
        avatar: '' // Will use fallback
      };
      localStorage.setItem('crypto_user', JSON.stringify(userProfile));
    }
    setProfile(userProfile);
    setTempUsername(userProfile.username);

    // Coins
    const savedCoins = localStorage.getItem('crypto_coins');
    setCoins(parseInt(savedCoins || '200', 10));

    // Stats
    const easyCompleted = JSON.parse(localStorage.getItem('completedLevels_easy') || '[]').length;
    const mediumCompleted = JSON.parse(localStorage.getItem('completedLevels_medium') || '[]').length;
    const hardCompleted = JSON.parse(localStorage.getItem('completedLevels_hard') || '[]').length;
    
    const puzzlesSolved = easyCompleted + mediumCompleted + hardCompleted;
    const dailyStreak = parseInt(localStorage.getItem('dailyPuzzleStreak') || '0', 10);
    // Placeholder for now
    const fastestTime = 'N/A';
    const hintsUsed = 0; 
    
    setStats({ puzzlesSolved, fastestTime, dailyStreak, hintsUsed });

    // Achievements
    const unlockedIds = JSON.parse(localStorage.getItem('crypto_unlocked_achievements') || '[]');
    const unlocked = initialAchievements.filter(ach => unlockedIds.includes(ach.id) || ach.currentProgress >= ach.targetProgress);
    setCompletedAchievements(unlocked);


  }, []);

  const handleUsernameSave = () => {
    if (tempUsername.trim().length < 3) {
      toast({
        variant: 'destructive',
        title: 'Invalid Username',
        description: 'Username must be at least 3 characters long.',
      });
      return;
    }
    if (profile) {
      const updatedProfile = { ...profile, username: tempUsername };
      setProfile(updatedProfile);
      localStorage.setItem('crypto_user', JSON.stringify(updatedProfile));
      setIsEditing(false);
      toast({ title: 'Profile Updated!', description: 'Your username has been changed.' });
    }
  };

  const statItems = useMemo(() => stats ? [
    { label: 'Puzzles Solved', value: stats.puzzlesSolved, icon: <Puzzle className="h-5 w-5 text-primary" /> },
    { label: 'Daily Streak', value: `${stats.dailyStreak} Days`, icon: <Flame className="h-5 w-5 text-orange-500" /> },
    { label: 'Fastest Time', value: stats.fastestTime, icon: <Puzzle className="h-5 w-5 text-green-500" /> },
    { label: 'Hints Used', value: stats.hintsUsed, icon: <Lightbulb className="h-5 w-5 text-yellow-500" /> },
  ] : [], [stats]);

  if (!isClient || !profile || !stats) {
    return (
        <div className="mx-auto max-w-md space-y-6">
            <Card className="p-6">
                <CardHeader className="items-center text-center p-0 pb-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-1 pt-4">
                        <Skeleton className="h-7 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="mb-6 rounded-lg border p-4">
                        <div className="flex items-center justify-center gap-2">
                             <Skeleton className="h-8 w-8" />
                             <Skeleton className="h-8 w-24" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-1 p-2 border rounded-lg">
                                <Skeleton className="h-8 w-8 mx-auto mb-2" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                                <Skeleton className="h-6 w-12 mx-auto" />
                            </div>
                        ))}
                    </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 pt-6 p-0">
                         <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-10 w-full" />
                    </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="items-center bg-muted/30 p-6 text-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={profile.avatar} alt={profile.username} />
            <AvatarFallback className="text-4xl">
              {profile.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="pt-4">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="text-center text-2xl font-bold"
                />
              </div>
            ) : (
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span>{profile.username}</span>
                <CheckCircle2 className="h-6 w-6 text-blue-500 fill-blue-100" />
              </CardTitle>
            )}
            <CardDescription className="pt-1">{profile.userId}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6">
            <Button asChild className="w-full mb-6" variant="outline">
                <Link href="/coin-shop">
                    <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-600 dark:text-yellow-400">
                        <Coins className="h-6 w-6" />
                        <span>{coins} Coins</span>
                    </div>
                </Link>
            </Button>

            <div className="grid grid-cols-2 gap-4 text-center">
                {statItems.map(item => (
                    <div key={item.label} className="flex flex-col items-center justify-center rounded-lg border bg-background p-3 space-y-2">
                        {item.icon}
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-lg font-bold">{item.value}</p>
                    </div>
                ))}
            </div>

            {completedAchievements.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-center text-lg font-semibold mb-4">Recent Achievements</h3>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        {completedAchievements.slice(0, 3).map(ach => (
                           <Card key={ach.id} className="p-3 bg-muted/50">
                               <CardContent className="flex flex-col items-center justify-center gap-2 p-0">
                                   <Medal className={cn("h-8 w-8", TIER_COLORS[ach.tier])} />
                                   <p className="text-xs font-semibold leading-tight">{ach.title}</p>
                               </CardContent>
                           </Card>
                        ))}
                    </div>
                </div>
            )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 bg-muted/30 p-4">
          {isEditing ? (
             <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleUsernameSave}>Save</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              <Pencil className="mr-2" /> Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
