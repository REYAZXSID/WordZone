
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Coins, PiggyBank, Sparkles, Gift, Video, UserPlus, ThumbsUp, MessageSquare, Youtube, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSound } from '@/hooks/use-sound';
import { useUserData } from '@/hooks/use-user-data';
import { saveUserData } from '@/lib/user-data';


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
    action: () => void;
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
  const { toast } = useToast();
  const playSound = useSound();

  useEffect(() => {
    if (isClient) {
        const savedClaimed = JSON.parse(localStorage.getItem('crypto_claimed_social') || '[]');
        setClaimedSocial(savedClaimed);
        const savedVisited = JSON.parse(localStorage.getItem('crypto_visited_tasks') || '[]');
        setVisitedTasks(savedVisited);
    }
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
      
      const newCoinBalance = userData.coins + option.reward;
      saveUserData({ coins: newCoinBalance });
      playSound('coin');
      toast({
          title: 'Coins Claimed!',
          description: `You received ${option.reward} free coins!`,
      });
      option.action();
  }
  
  const freeCoinOptions: FreeCoinOption[] = [
      { id: 'watch_ad', name: 'Watch an Ad', description: 'Get a quick coin boost.', reward: 10, icon: <Video className="h-8 w-8 text-rose-500" />, action: () => playSound('reward') },
      { id: 'daily_reward', name: 'Daily Reward', description: 'Claim your free coins for today.', reward: 20, icon: <Gift className="h-8 w-8 text-teal-500" />, action: () => {} },
      { id: 'referral', name: 'Invite a Friend', description: 'Earn a bonus when they join.', reward: 100, icon: <UserPlus className="h-8 w-8 text-cyan-500" />, action: () => {} }
  ]

  if (!isClient || !userData) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
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
        <h2 className="text-2xl font-bold text-center mb-4">YouTube Rewards</h2>
        <div className="space-y-3">
          {socialRewards.map((reward) => {
            const isClaimed = claimedSocial.includes(reward.id);
            const hasVisited = visitedTasks.includes(reward.id);

            return (
                <Card key={reward.id} className="transition-all">
                <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">{reward.icon}</div>
                    <div>
                        <p className="font-semibold">{reward.name}</p>
                        <p className="text-lg font-bold text-primary">{reward.amount.toLocaleString()} Coins</p>
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isClaimed ? (
                            <Button size="sm" disabled>Claimed</Button>
                        ) : hasVisited ? (
                            <Button size="sm" onClick={() => handleClaimSocial(reward)}>
                                Claim
                            </Button>
                        ) : (
                             <Button asChild size="sm" variant="outline" onClick={() => handleVisit(reward.id)}>
                                <Link href={reward.url} target="_blank" rel="noopener noreferrer">
                                    {reward.actionText}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                             </Button>
                        )}
                    </div>
                </CardContent>
                </Card>
            )
          })}
        </div>
      </div>
      
       <div>
        <h2 className="text-2xl font-bold text-center mb-4">Get Free Coins</h2>
        <div className="space-y-3">
          {freeCoinOptions.map((option) => (
            <Card key={option.id} className="transition-all hover:scale-[1.02] hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">{option.icon}</div>
                  <div>
                    <p className="font-semibold">{option.name}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                 <Button variant="outline" onClick={() => handleFreeCoin(option)}>
                    Claim +{option.reward}
                    <Coins className="ml-2 h-4 w-4 text-yellow-500" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
