
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Coins, UserPlus, Star, CheckCircle, MailCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useSound } from '@/hooks/use-sound';
import { useUserData } from '@/hooks/use-user-data';


type Reward = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    amount: number;
    status: 'pending' | 'claimed';
    date: Date;
};

// Mock data for rewards
const initialRewards: Reward[] = [
    {
        id: 'daily_login_1',
        title: 'Daily Login Bonus',
        description: 'Thanks for playing today!',
        icon: <Gift className="h-6 w-6 text-teal-500" />,
        amount: 20,
        status: 'pending',
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
        id: 'achievement_rookie',
        title: 'Achievement: Rookie Solver',
        description: 'You solved your first puzzle.',
        icon: <Star className="h-6 w-6 text-yellow-500" />,
        amount: 10,
        status: 'pending',
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
        id: 'referral_1',
        title: 'Referral Bonus',
        description: 'Your friend, Alex, joined!',
        icon: <UserPlus className="h-6 w-6 text-cyan-500" />,
        amount: 100,
        status: 'claimed',
        date: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
    {
        id: 'daily_login_2',
        title: 'Daily Login Bonus',
        description: 'Thanks for playing!',
        icon: <Gift className="h-6 w-6 text-teal-500" />,
        amount: 20,
        status: 'claimed',
        date: new Date(new Date().setDate(new Date().getDate() - 4)),
    }
];

export function InboxClientPage() {
    const { userData, isClient } = useUserData();
    const [rewards, setRewards] = useState<Reward[]>([]);
    const { toast } = useToast();
    const playSound = useSound();

    useEffect(() => {
        if (isClient) {
            // Load rewards from localStorage or use initial for demo
            const savedRewards = JSON.parse(localStorage.getItem('crypto_rewards') || 'null');
            if (savedRewards) {
                // Need to convert date strings back to Date objects
                const parsedRewards = savedRewards.map((r: Reward) => ({ ...r, date: new Date(r.date) }));
                setRewards(parsedRewards);
            } else {
                setRewards(initialRewards);
            }
        }
    }, [isClient]);

    const updateRewards = (newRewards: Reward[]) => {
        setRewards(newRewards);
        localStorage.setItem('crypto_rewards', JSON.stringify(newRewards));
    };

    const handleClaim = (rewardId: string) => {
        const rewardToClaim = rewards.find(r => r.id === rewardId);
        if (!rewardToClaim || rewardToClaim.status === 'claimed' || !userData) return;

        // Update coin balance
        const currentCoins = userData.coins;
        const newCoinBalance = currentCoins + rewardToClaim.amount;
        localStorage.setItem('crypto_coins', newCoinBalance.toString());

        // Update reward status
        const newRewards = rewards.map(r =>
            r.id === rewardId ? { ...r, status: 'claimed' as 'claimed' } : r
        );
        updateRewards(newRewards);

        playSound('coin');
        toast({
            title: 'Reward Claimed!',
            description: `You received ${rewardToClaim.amount} coins!`,
        });
        
        window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_coins' }));
        window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_rewards' }));
    };

    const handleClaimAll = () => {
        if (!userData) return;

        const pendingRewards = rewards.filter(r => r.status === 'pending');
        if (pendingRewards.length === 0) {
            toast({
                title: 'No rewards to claim',
                description: 'You have already claimed all available rewards.',
            });
            return;
        }

        let totalClaimedAmount = 0;
        const newRewards = rewards.map(r => {
            if (r.status === 'pending') {
                totalClaimedAmount += r.amount;
                return { ...r, status: 'claimed' as 'claimed' };
            }
            return r;
        });
        
        // Update coin balance
        const currentCoins = userData.coins;
        const newCoinBalance = currentCoins + totalClaimedAmount;
        localStorage.setItem('crypto_coins', newCoinBalance.toString());

        updateRewards(newRewards);
        playSound('coin');
        toast({
            title: 'All Rewards Claimed!',
            description: `You received a total of ${totalClaimedAmount} coins!`,
        });
        
        window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_coins' }));
        window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_rewards' }));
    };
    
    if (!isClient) return null;

    const pendingCount = rewards.filter(r => r.status === 'pending').length;

    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <Card>
                <CardContent className="flex items-center justify-between p-4">
                    <h2 className="text-lg font-semibold">
                        You have {pendingCount} pending reward{pendingCount === 1 ? '' : 's'}.
                    </h2>
                    <Button onClick={handleClaimAll} disabled={pendingCount === 0}>
                        <MailCheck className="mr-2 h-4 w-4" />
                        Claim All
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-3">
                {rewards.sort((a,b) => b.date.getTime() - a.date.getTime()).map((reward) => (
                    <Card key={reward.id} className={cn(
                        "transition-all",
                        reward.status === 'claimed' && "bg-muted/50 opacity-70"
                    )}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background">
                                    {reward.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{reward.title}</h3>
                                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                                     <p className="text-xs text-muted-foreground pt-1">{formatDistanceToNow(reward.date, { addSuffix: true })}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-2 pl-2">
                               {reward.status === 'pending' ? (
                                    <>
                                        <div className="flex items-center text-lg font-bold text-yellow-500">
                                            <Coins className="mr-1.5 h-5 w-5" /> +{reward.amount}
                                        </div>
                                        <Button size="sm" onClick={() => handleClaim(reward.id)} className="animate-pulse-success">
                                            Claim
                                        </Button>
                                    </>
                               ) : (
                                   <Badge variant="secondary" className="gap-1.5 py-1 px-3">
                                        <CheckCircle className="h-4 w-4 text-green-500" /> Claimed
                                   </Badge>
                               )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
