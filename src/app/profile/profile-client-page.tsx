
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { saveUserData, resetUserData, UserData } from '@/lib/user-data';
import { initialAchievements, Achievement } from '../achievements/achievements-client-page';
import { Flame, Star, Coins, CheckCircle2, BadgeCheck, Pen, Trash2, Gauge, Lightbulb, Badge as BadgeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useUserData } from '@/hooks/use-user-data';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const TIER_ICONS = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
};

const TIER_COLORS = {
  bronze: 'text-orange-600',
  silver: 'text-gray-400',
  gold: 'text-yellow-500',
};

const MALE_AVATAR = 'https://files.catbox.moe/peii94.png';
const FEMALE_AVATAR = 'https://files.catbox.moe/cy43s8.png';

export function ProfileClientPage() {
    const { userData, isClient, refreshUserData } = useUserData();
    const [tempUsername, setTempUsername] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        if (userData) {
            setTempUsername(userData.username);
            setSelectedAvatar(userData.avatar);
        }
    }, [userData]);

    const handleProfileSave = () => {
        if (tempUsername.trim().length < 3) {
            toast({ variant: 'destructive', title: 'Invalid Username', description: 'Username must be at least 3 characters long.' });
            return;
        }
        saveUserData({ username: tempUsername, avatar: selectedAvatar });
        refreshUserData(); // Force a refresh of user data after saving
        toast({ title: 'Profile Saved!', description: 'Your profile has been updated.' });
    };

    const handleResetProgress = () => {
        resetUserData();
        window.location.href = '/'; 
    };

    const unlockedAchievements = useMemo(() => {
        if (!userData) return [];
        return initialAchievements
            .filter(ach => userData.unlockedAchievements.includes(ach.id))
            .sort((a,b) => {
                const aTier = a.tier === 'gold' ? 3 : a.tier === 'silver' ? 2 : 1;
                const bTier = b.tier === 'gold' ? 3 : b.tier === 'silver' ? 2 : 1;
                return bTier - aTier;
            });
    }, [userData]);
    
    if (!isClient || !userData) {
        return null; // Let the Suspense fallback handle loading
    }

    return (
        <div className="mx-auto max-w-lg space-y-6">
            <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <Image
                            src={userData.avatar}
                            data-ai-hint="avatar user"
                            alt="User Avatar"
                            width={112}
                            height={112}
                            className="rounded-full border-4 border-primary/50 object-cover"
                        />
                        <div className="absolute bottom-0 right-0 rounded-full bg-blue-500 p-1.5 text-white ring-4 ring-background">
                            <BadgeCheck className="h-5 w-5" />
                        </div>
                    </div>
                    
                     <Dialog>
                        <div className="flex items-center gap-2">
                             <h1 className="text-3xl font-bold">{userData.username}</h1>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Pen className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                        </div>
                         <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                                <DialogDescription>
                                    Change your username or avatar. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        value={tempUsername}
                                        onChange={(e) => setTempUsername(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="space-y-2">
                                     <Label>Avatar</Label>
                                      <RadioGroup defaultValue={selectedAvatar} onValueChange={setSelectedAvatar} className="flex gap-4">
                                        <Label htmlFor="male-avatar" className="flex flex-col items-center gap-2 cursor-pointer rounded-md border-2 border-transparent p-2 aria-checked:border-primary">
                                          <Image src={MALE_AVATAR} alt="Male Avatar" width={80} height={80} className="rounded-full" />
                                          <div className="flex items-center gap-2">
                                            <RadioGroupItem value={MALE_AVATAR} id="male-avatar" />
                                            <span>Male</span>
                                          </div>
                                        </Label>
                                        <Label htmlFor="female-avatar" className="flex flex-col items-center gap-2 cursor-pointer rounded-md border-2 border-transparent p-2 aria-checked:border-primary">
                                           <Image src={FEMALE_AVATAR} alt="Female Avatar" width={80} height={80} className="rounded-full" />
                                          <div className="flex items-center gap-2">
                                            <RadioGroupItem value={FEMALE_AVATAR} id="female-avatar" />
                                            <span>Female</span>
                                          </div>
                                        </Label>
                                      </RadioGroup>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button onClick={handleProfileSave}>Save changes</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    
                    <p className="text-sm font-mono text-muted-foreground mt-1">
                        UID: {userData.userId}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Coins className="h-6 w-6 text-yellow-500" /> Coin Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{userData.coins.toLocaleString()}</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Puzzle Stats</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-center">
                    <div className="rounded-lg bg-muted p-3">
                        <Gauge className="mx-auto h-7 w-7 text-primary mb-1" />
                        <p className="text-2xl font-bold">{userData.stats.puzzlesSolved}</p>
                        <p className="text-xs text-muted-foreground">Puzzles Solved</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                        <Flame className="mx-auto h-7 w-7 text-orange-500 mb-1" />
                        <p className="text-2xl font-bold">{userData.stats.dailyStreak}</p>
                        <p className="text-xs text-muted-foreground">Daily Streak</p>
                    </div>
                     <div className="rounded-lg bg-muted p-3">
                        <Lightbulb className="mx-auto h-7 w-7 text-yellow-500 mb-1" />
                        <p className="text-2xl font-bold">{userData.stats.hintsUsed}</p>
                        <p className="text-xs text-muted-foreground">Hints Used</p>
                    </div>
                     <div className="rounded-lg bg-muted p-3">
                        <Star className="mx-auto h-7 w-7 text-yellow-400 mb-1" />
                        <p className="text-2xl font-bold">{userData.stats.fastestSolveTime ? `${userData.stats.fastestSolveTime}s` : 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">Fastest Time</p>
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BadgeIcon className="h-6 w-6 text-green-500" /> Claimed Achievements
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    {unlockedAchievements.length > 0 ? (
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {unlockedAchievements.map((ach) => (
                                <div key={ach.id} className="flex items-center gap-4 rounded-md bg-muted/50 p-3">
                                    <div className="text-3xl">{TIER_ICONS[ach.tier]}</div>
                                    <div>
                                        <p className={cn("font-semibold", TIER_COLORS[ach.tier])}>{ach.title}</p>
                                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            No achievements unlocked yet. Keep playing!
                        </p>
                    )}
                </CardContent>
            </Card>
            
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2 h-4 w-4" /> Reset Progress
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all
                        your puzzle progress, coins, and stats.
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
        </div>
    );
}
