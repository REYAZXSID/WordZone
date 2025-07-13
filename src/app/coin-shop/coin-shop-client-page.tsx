
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Coins, PiggyBank, Sparkles, Gift, Video, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSound } from '@/hooks/use-sound';
import { useUserData } from '@/hooks/use-user-data';


type CoinPack = {
  id: string;
  name: string;
  amount: number;
  price: string;
  icon: React.ReactNode;
  isBestValue?: boolean;
};

type FreeCoinOption = {
    id: string;
    name: string;
    description: string;
    reward: number;
    icon: React.ReactNode;
    action: () => void;
}

const coinPacks: CoinPack[] = [
  { id: 'pack_100', name: 'Handful of Coins', amount: 100, price: '$0.99', icon: <PiggyBank className="h-8 w-8 text-green-500" /> },
  { id: 'pack_500', name: 'Bag of Coins', amount: 500, price: '$3.99', icon: <PiggyBank className="h-8 w-8 text-blue-500" />, isBestValue: true },
  { id: 'pack_1000', name: 'Chest of Coins', amount: 1000, price: '$6.99', icon: <PiggyBank className="h-8 w-8 text-purple-500" /> },
];

export function CoinShopClientPage() {
  const { userData, isClient } = useUserData();
  const { toast } = useToast();
  const playSound = useSound();

  const handlePurchase = (pack: CoinPack) => {
    if (!userData) return;

    const newCoinBalance = userData.coins + pack.amount;
    localStorage.setItem('crypto_coins', newCoinBalance.toString());
    window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_coins' }));
    playSound('coin');
    
    toast({
      title: 'Purchase Successful!',
      description: `You got ${pack.amount} coins. Your new balance is ${newCoinBalance}.`,
    });
  };

  const handleFreeCoin = (option: FreeCoinOption) => {
      if (!userData) return;
      
      const newCoinBalance = userData.coins + option.reward;
      localStorage.setItem('crypto_coins', newCoinBalance.toString());
      window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_coins' }));
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
        <h2 className="text-2xl font-bold text-center mb-4">Buy Coins</h2>
        <div className="space-y-3">
          {coinPacks.map((pack) => (
            <Card key={pack.id} className={cn("transition-all relative", pack.isBestValue && "border-primary ring-2 ring-primary")}>
               {pack.isBestValue && (
                    <div className="absolute -top-3 right-4">
                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1">
                            <Sparkles className="h-4 w-4" /> Best Value
                        </Badge>
                    </div>
               )}
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">{pack.icon}</div>
                  <div>
                    <p className="font-semibold">{pack.name}</p>
                    <p className="text-lg font-bold text-primary">{pack.amount.toLocaleString()} Coins</p>
                  </div>
                </div>
                <Button size="lg" onClick={() => handlePurchase(pack)}>
                  {pack.price}
                </Button>
              </CardContent>
            </Card>
          ))}
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
