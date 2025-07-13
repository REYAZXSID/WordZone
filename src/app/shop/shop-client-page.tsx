
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
    Coins, 
    Lightbulb, 
    Target, 
    Trash2, 
    FileText, 
    Undo2, 
    Sparkles, 
    Package,
    Clapperboard,
    PiggyBank,
    Gift
} from 'lucide-react';
import { useSound } from '@/hooks/use-sound';
import { Separator } from '@/components/ui/separator';

type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  type: 'powerup' | 'coinpack';
  amount?: number; // for coin packs
};

const shopItems: ShopItem[] = [
  // Power-ups
  { id: 'reveal_letter', name: 'Reveal Letter', description: 'Reveals one correct letter.', cost: 20, icon: <Lightbulb className="h-6 w-6 text-yellow-500" />, type: 'powerup' },
  { id: 'auto_fill', name: 'Auto-Fill Letter', description: 'Fills all instances of one correct letter.', cost: 50, icon: <Target className="h-6 w-6 text-blue-500" />, type: 'powerup' },
  { id: 'remove_wrong', name: 'Remove Wrong Guesses', description: 'Removes three of your incorrect guesses.', cost: 30, icon: <Trash2 className="h-6 w-6 text-red-500" />, type: 'powerup' },
  { id: 'show_word', name: 'Show Word Hint', description: 'Reveals one complete word in the puzzle.', cost: 60, icon: <FileText className="h-6 w-6 text-indigo-500" />, type: 'powerup' },
  { id: 'undo_move', name: 'Undo Last Move', description: 'Reverts your last letter guess.', cost: 10, icon: <Undo2 className="h-6 w-6 text-gray-500" />, type: 'powerup' },
  { id: 'solve_puzzle', name: 'Solve Puzzle', description: 'Instantly solves the current puzzle.', cost: 150, icon: <Sparkles className="h-6 w-6 text-purple-500" />, type: 'powerup' },
  { id: 'hint_pack', name: 'Hint Pack', description: 'Bundle: 3 Reveal Letters + 1 Word Hint.', cost: 100, icon: <Package className="h-6 w-6 text-orange-500" />, type: 'powerup' },
  
  // Free Coins
  { id: 'ad_reward', name: 'Watch Ad', description: 'Watch an ad for a coin reward.', cost: 0, amount: 50, icon: <Clapperboard className="h-6 w-6 text-rose-500" />, type: 'coinpack' },
  { id: 'daily_reward', name: 'Daily Reward', description: 'Claim your free coins for today.', cost: 0, amount: 25, icon: <Gift className="h-6 w-6 text-teal-500" />, type: 'coinpack' },

  // Coin Packs (for future implementation, now they are free for demo)
  { id: 'pack_100', name: 'Handful of Coins', description: 'A small boost to your balance.', cost: 0, amount: 100, icon: <PiggyBank className="h-6 w-6 text-green-500" />, type: 'coinpack' },
  { id: 'pack_500', name: 'Bag of Coins', description: 'A medium-sized coin pack.', cost: 0, amount: 500, icon: <PiggyBank className="h-6 w-6 text-blue-500" />, type: 'coinpack' },
  { id: 'pack_1000', name: 'Chest of Coins', description: 'A large coin pack for the dedicated solver.', cost: 0, amount: 1000, icon: <PiggyBank className="h-6 w-6 text-purple-500" />, type: 'coinpack' },

];

const powerUps = shopItems.filter(item => item.type === 'powerup');
const coinPacks = shopItems.filter(item => item.type === 'coinpack');

export function ShopClientPage() {
  const [isClient, setIsClient] = useState(false);
  const [coins, setCoins] = useState(200);
  const { toast } = useToast();
  const playSound = useSound();

  const updateCoinBalance = useCallback(() => {
    const savedCoins = localStorage.getItem('crypto_coins');
    if (savedCoins) {
      setCoins(parseInt(savedCoins, 10));
    } else {
      localStorage.setItem('crypto_coins', '200');
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    updateCoinBalance();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'crypto_coins') {
        updateCoinBalance();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateCoinBalance]);

  const handlePurchase = (item: ShopItem) => {
    if (coins < item.cost) {
      playSound('error');
      toast({
        variant: 'destructive',
        title: 'Insufficient Coins',
        description: `You need ${item.cost - coins} more coins to buy ${item.name}.`,
      });
      return;
    }

    const newCoinBalance = coins - item.cost + (item.type === 'coinpack' ? item.amount || 0 : 0);
    setCoins(newCoinBalance);
    localStorage.setItem('crypto_coins', newCoinBalance.toString());

    if (item.type === 'powerup') {
        const inventory = JSON.parse(localStorage.getItem('crypto_powerups') || '{}');
        inventory[item.id] = (inventory[item.id] || 0) + 1;
        localStorage.setItem('crypto_powerups', JSON.stringify(inventory));
        playSound('purchase');
        toast({ title: 'Purchase Successful!', description: `You bought ${item.name}.` });
    } else {
        playSound('coin');
        toast({ title: 'Coins Added!', description: `You received ${item.amount} coins.` });
    }
  };

  if (!isClient) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="shadow-lg sticky top-16 z-10 bg-background/90 backdrop-blur-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="text-lg text-muted-foreground font-semibold">Your Balance</div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Coins className="h-7 w-7 text-yellow-500" />
            <span>{coins.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-center mb-4">Power-Ups</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {powerUps.map((powerUp) => (
            <Card key={powerUp.id} className="flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl">
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      {powerUp.icon}
                  </div>
                  <div>
                      <CardTitle className="text-lg">{powerUp.name}</CardTitle>
                      <CardDescription className="text-xs pt-1">{powerUp.description}</CardDescription>
                  </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 font-bold text-lg text-primary">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  {powerUp.cost}
                </div>
                <Button onClick={() => handlePurchase(powerUp)} disabled={coins < powerUp.cost}>
                  Buy
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-bold text-center mb-4">Get More Coins</h2>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coinPacks.map((pack) => (
            <Card key={pack.id} className="flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl">
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                      {pack.icon}
                  </div>
                  <div>
                      <CardTitle className="text-lg">{pack.name}</CardTitle>
                      <CardDescription className="text-xs pt-1">{pack.description}</CardDescription>
                  </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 font-bold text-lg text-primary">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  +{pack.amount}
                </div>
                <Button onClick={() => handlePurchase(pack)} disabled={coins < pack.cost}>
                  {pack.cost > 0 ? `Buy for ${pack.cost}` : 'Get Free'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
