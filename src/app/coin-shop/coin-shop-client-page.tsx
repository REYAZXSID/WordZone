
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Coins, PiggyBank, Sparkles, Gift, Video, UserPlus, ThumbsUp, MessageSquare, Youtube, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSound } from '@/hooks/use-sound';
import { useUserData } from '@/hooks/use-user-data';
import { saveUserData } from '@/lib/user-data';
import { Separator } from '@/components/ui/separator';


type SocialReward = {
  id: 'like' | 'comment' | 'subscribe';
  name: string;
  description: string;
  amount: number;
  icon: React.ReactNode;
  url: string;
  actionText: string;
};

type FreeCoinOption = {
    id: string;
    name: string;
    description: string;
    reward: number;
    icon: React.ReactNode;
    action?: () => void;
    isOneTime?: boolean;
}

const socialRewards: SocialReward[] = [
  { id: 'like', name: 'Like a Video', description: 'Show some love on our latest video.', amount: 100, icon: <ThumbsUp className="h-8 w-8 text-blue-500" />, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', actionText: 'Go to Video' },
  { id: 'comment', name: 'Comment on Video', description: 'Leave a comment on our latest video.', amount: 500, icon: <MessageSquare className="h-8 w-8 text-green-500" />, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', actionText: 'Go to Video' },
  { id: 'subscribe', name: 'Subscribe to Channel', description: 'Join our community for more content.', amount: 1000, icon: <Youtube className="h-8 w-8 text-red-500" />, url: 'https://www.youtube.com/@YouTube', actionText: 'Go to Channel' },
];

export function CoinShopClientPage() {
  const { userData, isClient } = useUserData();
  const [claimedSocial, setClaimedSocial] = useState<string[]>([]);
  const [visitedTasks, setVisitedTasks] = useState<string[]>([]);
  const [claimedOneTime, setClaimedOneTime] = useState<string[]>([]);
  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState('');
  const { toast } = useToast();
  const playSound = useSound();

  useEffect(() => {
    if (isClient) {
        const savedClaimedSocial = JSON.parse(localStorage.getItem('crypto_claimed_social') || '[]');
        setClaimedSocial(savedClaimedSocial);
        const savedVisited = JSON.parse(localStorage.getItem('crypto_visited_tasks') || '[]');
        setVisitedTasks(savedVisited);
        const savedClaimedOneTime = JSON.parse(localStorage.getItem('crypto_claimed_one_time') || '[]');
        setClaimedOneTime(savedClaimedOneTime);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const timer = setInterval(() => {
        const lastClaimedStr = localStorage.getItem('crypto_daily_reward_claimed_at');
        if (lastClaimedStr) {
            const lastClaimed = parseInt(lastClaimedStr, 10);
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;
            const timeSinceClaim = now - lastClaimed;

            if (timeSinceClaim < twentyFourHours) {
                const timeLeft = twentyFourHours - timeSinceClaim;
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                setDailyRewardTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            } else {
                setDailyRewardTimeLeft('');
            }
        }
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);
  
  const handleVisit = (rewardId: string) => {
    if (visitedTasks.includes(rewardId)) return;
    
    const newVisited = [...visitedTasks, rewardId];
    setVisitedTasks(newVisited);
    localStorage.setItem('crypto_visited_tasks', JSON.stringify(newVisited));
  };


  const handleClaimSocial = (reward: SocialReward) => {
    if (!userData || claimedSocial.includes(reward.id)) return;

    const newCoinBalance = userData.coins + reward.amount;
    saveUserData({ coins: newCoinBalance });

    const newClaimed = [...claimedSocial, reward.id];
    setClaimedSocial(newClaimed);
    localStorage.setItem('crypto_claimed_social', JSON.stringify(newClaimed));
    
    playSound('coin');
    toast({
      title: 'Reward Claimed!',
      description: `You got ${reward.amount} coins. Your new balance is ${newCoinBalance}.`,
    });
  };

  const handleFreeCoin = (option: FreeCoinOption) => {
      if (!userData) return;
      
      if (option.id === 'daily_reward') {
          if (dailyRewardTimeLeft) {
              toast({ variant: 'destructive', title: 'Daily reward not ready!', description: `Please wait until the timer runs out.` });
              return;
          }
          localStorage.setItem('crypto_daily_reward_claimed_at', Date.now().toString());
          setDailyRewardTimeLeft('23:59:59'); // Set initial timer display
      }

      if (option.isOneTime && claimedOneTime.includes(option.id)) return;
      
      const newCoinBalance = userData.coins + option.reward;
      saveUserData({ coins: newCoinBalance });

      if (option.isOneTime) {
          const newClaimed = [...claimedOneTime, option.id];
          setClaimedOneTime(newClaimed);
          localStorage.setItem('crypto_claimed_one_time', JSON.stringify(newClaimed));
      }

      playSound('coin');
      toast({
          title: 'Coins Claimed!',
          description: `You received ${option.reward} free coins!`,
      });

      if (option.action) {
          option.action();
      }
  }
  
  const freeCoinOptions: FreeCoinOption[] = [
      { id: 'starter_pack', name: 'Starter Pack', description: 'A one-time gift to get you going!', reward: 250, icon: <Sparkles className="h-8 w-8 text-purple-500" />, isOneTime: true },
      { id: 'watch_ad', name: 'Watch an Ad', description: 'Get a quick coin boost.', reward: 10, icon: <Video className="h-8 w-8 text-rose-500" />, action: () => playSound('reward') },
      { id: 'daily_reward', name: 'Daily Reward', description: 'Claim your free coins for today.', reward: 20, icon: <Gift className="h-8 w-8 text-teal-500" /> },
      { id: 'referral', name: 'Invite a Friend', description: 'Earn a bonus when they join.', reward: 100, icon: <UserPlus className="h-8 w-8 text-cyan-500" /> }
  ]

  if (!isClient || !userData) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="shadow-lg sticky top-16 z-10 bg-background/90 backdrop-blur-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground font-semibold">Your Balance</div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Coins className="h-7 w-7 text-yellow-500" />
            <span>{userData.coins.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
      
       <div>
        <h2 className="text-2xl font-bold text-center mb-1">Get Free Coins</h2>
        <p className="text-muted-foreground text-center mb-6">Complete simple tasks to earn more coins.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {freeCoinOptions.map((option) => {
            const isOneTimeClaimed = option.isOneTime && claimedOneTime.includes(option.id);
            const isDailyRewardOnCooldown = option.id === 'daily_reward' && !!dailyRewardTimeLeft;
            const isDisabled = isOneTimeClaimed || isDailyRewardOnCooldown;

            return (
                 <Card key={option.id} className="flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-lg">
                    <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">{option.icon}</div>
                        <div>
                            <CardTitle>{option.name}</CardTitle>
                            <CardDescription className="text-xs pt-1">{option.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="grow flex items-center justify-center">
                         <p className="text-4xl font-bold text-yellow-500 flex items-center gap-2">
                            <Coins className="h-8 w-8"/> +{option.reward}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full"
                            onClick={() => handleFreeCoin(option)}
                            disabled={isDisabled}
                        >
                            {isOneTimeClaimed ? "Claimed" : 
                            (isDailyRewardOnCooldown ? dailyRewardTimeLeft : "Claim Now")}
                        </Button>
                    </CardFooter>
                 </Card>
            )
          })}
        </div>
      </div>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-bold text-center mb-1">YouTube Rewards</h2>
        <p className="text-muted-foreground text-center mb-6">Support our channel and get rewarded!</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialRewards.map((reward) => {
            const isClaimed = claimedSocial.includes(reward.id);
            const hasVisited = visitedTasks.includes(reward.id);

            return (
                <Card key={reward.id} className="flex flex-col justify-between transition-all">
                    <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">{reward.icon}</div>
                        <div>
                            <CardTitle>{reward.name}</CardTitle>
                            <CardDescription className="text-xs pt-1">{reward.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="grow flex items-center justify-center">
                         <p className="text-4xl font-bold text-yellow-500 flex items-center gap-2">
                            <Coins className="h-8 w-8"/> +{reward.amount}
                        </p>
                    </CardContent>
                    <CardFooter>
                         {isClaimed ? (
                            <Button className="w-full" disabled>Claimed</Button>
                        ) : hasVisited ? (
                            <Button className="w-full" onClick={() => handleClaimSocial(reward)}>
                                Claim Reward
                            </Button>
                        ) : (
                             <Button asChild className="w-full" variant="outline" onClick={() => handleVisit(reward.id)}>
                                <Link href={reward.url} target="_blank" rel="noopener noreferrer">
                                    {reward.actionText}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                             </Button>
                        )}
                    </CardFooter>
                </Card>
            )
          })}
        </div>
      </div>

    </div>
  );
}
