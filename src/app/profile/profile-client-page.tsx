
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Coins, Puzzle, Flame, Lightbulb, Pencil, LogOut, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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

export function ProfileClientPage() {
  const [isClient, setIsClient] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [coins, setCoins] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
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

  const handleResetProgress = () => {
    // Clear all app-related localStorage
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('crypto_') || key.startsWith('completedLevels_') || key.startsWith('dailyPuzzle')) {
            localStorage.removeItem(key);
        }
    });
    // Can't use router here, so we reload to reset state
    window.location.reload(); 
    toast({ title: "Progress Reset", description: "Your game data has been cleared." });
  }

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
              <CardTitle className="text-2xl">{profile.username}</CardTitle>
            )}
            <CardDescription className="pt-1">{profile.userId}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6">
            <div className="mb-6 rounded-lg border-2 border-yellow-400/50 bg-yellow-400/10 p-3">
                <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    <Coins className="h-6 w-6" />
                    <span>{coins} Coins</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
                {statItems.map(item => (
                    <div key={item.label} className="flex flex-col items-center justify-center rounded-lg border bg-background p-3 space-y-2">
                        {item.icon}
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-lg font-bold">{item.value}</p>
                    </div>
                ))}
            </div>
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

          <AlertDialog>
             <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2" /> Reset Progress
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all
                    your puzzle progress, stats, and power-ups.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetProgress}>
                    Yes, reset everything
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button variant="ghost" className="w-full">
            <LogOut className="mr-2" /> Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
