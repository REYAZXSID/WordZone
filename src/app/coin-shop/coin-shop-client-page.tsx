
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Coins, PiggyBank, Sparkles, Gift, Video, UserPlus, ThumbsUp, MessageSquare, Youtube, ArrowRight, Copy } from 'lucide-react';
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
    isOneTime?: boolean;
    isAd?: boolean;
    isInvite?: boolean;
    url?: string;
    actionText?: string;
}

const socialRewards: SocialReward[] = [
  { id: 'like', name: 'Like a Video', description: 'Show some love on our latest video.', amount: 100, icon: <ThumbsUp className="h-8 w-8 text-blue-500" />, url: 'https://youtu.be/raZA2iVv2Ek?si=ZggokV1VqX-XdZ0D', actionText: 'Go to Video' },
  { id: 'comment', name: 'Comment on Video', description: 'Leave a comment on our latest video.', amount: 500, icon: <MessageSquare className="h-8 w-8 text-green-500" />, url: 'https://youtu.be/Zmdp1t_u6Bw?si=QMilZOj_tThLqEgg', actionText: 'Go to Video' },
  { id: 'subscribe', name: 'Subscribe to Channel', description: 'Join our community for more content.', amount: 1000, icon: <Youtube className="h-8 w-8 text-red-500" />, url: 'https://www.youtube.com/@shaitaanidastaan', actionText: 'Go to Channel' },
];

export function CoinShopClientPage() {
  const { userData, isClient } = useUserData();
  const [claimedSocial, setClaimedSocial] = useState<string[]>([]);
  const [visitedTasks, setVisitedTasks] = useState<string[]>([]);
  const [claimedOneTime, setClaimedOneTime] = useState<string[]>([]);
  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState('');
  const [adRewardTimeLeft, setAdRewardTimeLeft] = useState('');
  const [inviteFile, setInviteFile] = useState<File | null>(null);

  const { toast } = useToast();
  const playSound = useSound();

  const INVITE_URL = 'https://example.com/wordzone.apk';
  const ICON_URL = 'https://files.catbox.moe/romunz.png';
  const SHARE_MESSAGE = "Sharpen your mind with WordZone! Decode quotes, unlock achievements, and climb the leaderboard.";

  useEffect(() => {
    if (isClient) {
        // Pre-fetch the icon for sharing
        fetch(ICON_URL)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'icon.png', { type: 'image/png' });
                setInviteFile(file);
            })
            .catch(err => console.error("Could not fetch invite icon:", err));

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
        // Daily Reward Timer
        const lastClaimedStr = localStorage.getItem('crypto_daily_reward_claimed_at');
        if (lastClaimedStr) {
            const lastClaimed = parseInt(lastClaimedStr, 10);
            const now = Date.now();
            const cooldown = 24 * 60 * 60 * 1000;
            const timeSinceClaim = now - lastClaimed;

            if (timeSinceClaim < cooldown) {
                const timeLeft = cooldown - timeSinceClaim;
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                setDailyRewardTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            } else {
                setDailyRewardTimeLeft('');
            }
        }
        
        // Ad Reward Timer
        const lastAdClaimedStr = localStorage.getItem('crypto_ad_reward_claimed_at');
        if (lastAdClaimedStr) {
            const lastClaimed = parseInt(lastAdClaimedStr, 10);
            const now = Date.now();
            const cooldown = 60 * 60 * 1000; // 1 hour
            const timeSinceClaim = now - lastClaimed;

            if (timeSinceClaim < cooldown) {
                const timeLeft = cooldown - timeSinceClaim;
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                setAdRewardTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            } else {
                setAdRewardTimeLeft('');
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

  const handleRewardClaim = (reward: number, id: string, isOneTime: boolean) => {
      if (!userData) return;
      if (isOneTime && claimedOneTime.includes(id)) return;

      const newCoinBalance = userData.coins + reward;
      saveUserData({ coins: newCoinBalance });

      if (isOneTime) {
          const newClaimed = [...claimedOneTime, id];
          setClaimedOneTime(newClaimed);
          localStorage.setItem('crypto_claimed_one_time', JSON.stringify(newClaimed));
      }

      playSound('coin');
      toast({
          title: 'Coins Claimed!',
          description: `You received ${reward} free coins!`,
      });
  }

  const handleFreeCoin = (option: FreeCoinOption) => {
      if (option.id === 'daily_reward') {
          if (dailyRewardTimeLeft) {
              toast({ variant: 'destructive', title: 'Daily reward not ready!', description: `Please wait until the timer runs out.` });
              return;
          }
          localStorage.setItem('crypto_daily_reward_claimed_at', Date.now().toString());
          setDailyRewardTimeLeft('23:59:59');
      }
      
      if (option.id === 'watch_ad') {
          if (adRewardTimeLeft) {
              toast({ variant: 'destructive', title: 'Ad reward not ready!', description: `Please wait until the timer runs out.` });
              return;
          }
          localStorage.setItem('crypto_ad_reward_claimed_at', Date.now().toString());
          setAdRewardTimeLeft('59:59');
      }
      
      if (option.isInvite) {
        handleInvite();
      } else {
        handleRewardClaim(option.reward, option.id, !!option.isOneTime);
      }
  }

  const handleInvite = async () => {
    const shareData = {
        title: 'WordZone',
        text: `${SHARE_MESSAGE} Download at: ${INVITE_URL}`,
        url: INVITE_URL,
    };
    
    try {
        if (navigator.share) {
            // Try sharing with the file if available and supported
            if (inviteFile && navigator.canShare && navigator.canShare({ files: [inviteFile] })) {
                await navigator.share({ ...shareData, files: [inviteFile] });
            } else {
                // Fallback to sharing text and URL
                await navigator.share(shareData);
            }
            toast({ title: "Thanks for sharing!", description: "Your friends will thank you." });
            handleRewardClaim(100, 'referral', false); // Reward on successful share
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(shareData.text);
            toast({ title: "Link Copied!", description: "Invite link copied to clipboard." });
            handleRewardClaim(100, 'referral', false); // Reward on copy
        }
    } catch (err) {
        console.error('Could not share:', err);
        // Don't show an error if the user cancelled the share dialog
        if ((err as Error).name !== 'AbortError') {
             toast({ variant: 'destructive', title: "Share Failed", description: "Could not share the invite." });
        }
    }
  };
  
  const freeCoinOptions: FreeCoinOption[] = [
      { id: 'starter_pack', name: 'Starter Pack', description: 'A one-time gift to get you going!', reward: 250, icon: <Sparkles className="h-8 w-8 text-purple-500" />, isOneTime: true },
      { id: 'watch_ad', name: 'Watch an Ad', description: 'Get a quick coin boost.', reward: 25, icon: <Video className="h-8 w-8 text-rose-500" />, isAd: true, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', actionText: 'Watch Video' },
      { id: 'daily_reward', name: 'Daily Reward', description: 'Claim your free coins for today.', reward: 20, icon: <Gift className="h-8 w-8 text-teal-500" /> },
      { id: 'referral', name: 'Invite a Friend', description: 'Earn a bonus when they join.', reward: 100, icon: <UserPlus className="h-8 w-8 text-cyan-500" />, isInvite: true }
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
            const isAdRewardOnCooldown = option.id === 'watch_ad' && !!adRewardTimeLeft;
            const hasVisitedAd = option.isAd && visitedTasks.includes(option.id);

            const getButtonContent = () => {
              if (isOneTimeClaimed) return "Claimed";
              if (isDailyRewardOnCooldown) return dailyRewardTimeLeft;
              if (isAdRewardOnCooldown) return adRewardTimeLeft;
              if (option.isAd && !hasVisitedAd) return option.actionText;
              if (option.isInvite) return "Invite";
              return "Claim Now";
            }
            
            const isDisabled = isOneTimeClaimed || isDailyRewardOnCooldown || isAdRewardOnCooldown;
            const buttonContent = getButtonContent();

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
                       {option.isAd && !hasVisitedAd ? (
                            <Button asChild className="w-full" variant="outline" onClick={() => handleVisit(option.id)}>
                                <Link href={option.url!} target="_blank" rel="noopener noreferrer">
                                    {option.actionText}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                       ) : (
                         <Button 
                            className="w-full"
                            onClick={() => handleFreeCoin(option)}
                            disabled={isDisabled}
                         >
                            {buttonContent}
                         </Button>
                       )}
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
