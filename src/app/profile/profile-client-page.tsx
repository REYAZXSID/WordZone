
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Coins, Puzzle, Flame, Lightbulb, LogOut, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

type UserProfile = {
  username: string;
  email: string;
  avatar: string;
};

type UserStats = {
  puzzlesSolved: number;
  fastestTime: string;
  dailyStreak: number;
  hintsUsed: number;
  coins: number;
};

export function ProfileClientPage() {
  const [isClient, setIsClient] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in.
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setProfile(userData);

          // For demo, we still use some local storage stats
          const easyCompleted = JSON.parse(localStorage.getItem(`completedLevels_easy_${user.uid}`) || '[]').length;
          const mediumCompleted = JSON.parse(localStorage.getItem(`completedLevels_medium_${user.uid}`) || '[]').length;
          const hardCompleted = JSON.parse(localStorage.getItem(`completedLevels_hard_${user.uid}`) || '[]').length;

          setStats({
            puzzlesSolved: easyCompleted + mediumCompleted + hardCompleted,
            dailyStreak: parseInt(localStorage.getItem(`dailyPuzzleStreak_${user.uid}`) || '0', 10),
            fastestTime: 'N/A', // Placeholder
            hintsUsed: 0, // Placeholder
            coins: parseInt(localStorage.getItem(`crypto_coins_${user.uid}`) || '200', 10),
          });
        } else {
          // This case might happen if Firestore doc creation failed during signup
          toast({ variant: 'destructive', title: 'Error', description: 'Could not find user profile.' });
          router.push('/login');
        }
      } else {
        // User is signed out.
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, toast]);
  
  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({ title: 'Logged Out', description: 'You have been successfully signed out.'});
        router.push('/login');
    } catch (error) {
        toast({ variant: 'destructive', title: 'Logout Failed', description: 'Could not log you out. Please try again.'})
    }
  }


  if (isLoading || !isClient) {
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
                    </CardFooter>
            </Card>
        </div>
    )
  }

  if (!profile || !stats) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>Could not load profile. Please try logging in again.</p>
        </div>
    )
  }

  const statItems = [
    { label: 'Puzzles Solved', value: stats.puzzlesSolved, icon: <Puzzle className="h-5 w-5 text-primary" /> },
    { label: 'Daily Streak', value: `${stats.dailyStreak} Days`, icon: <Flame className="h-5 w-5 text-orange-500" /> },
    { label: 'Fastest Time', value: stats.fastestTime, icon: <Puzzle className="h-5 w-5 text-green-500" /> },
    { label: 'Hints Used', value: stats.hintsUsed, icon: <Lightbulb className="h-5 w-5 text-yellow-500" /> },
  ];

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
            <CardTitle className="text-2xl">{profile.username}</CardTitle>
            <CardDescription className="pt-1">{profile.email}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6">
            <Button asChild className="w-full mb-6" variant="outline">
                <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    <Coins className="h-6 w-6" />
                    <span>{stats.coins} Coins</span>
                </div>
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
        </CardContent>

        <CardFooter className="flex flex-col gap-2 bg-muted/30 p-4">
            <Button onClick={handleLogout} variant="ghost" className="w-full">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
