
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
    Clapperboard
} from 'lucide-react';
import { useSound } from '@/hooks/use-sound';

type PowerUp = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
};

const powerUps: PowerUp[] = [
  { id: 'reveal_letter', name: 'Reveal Letter', description: 'Reveals one correct letter.', cost: 20, icon: <Lightbulb className="h-6 w-6 text-yellow-500" /> },
  { id: 'auto_fill', name: 'Auto-Fill Letter', description: 'Fills all instances of one correct letter.', cost: 50, icon: <Target className="h-6 w-6 text-blue-500" /> },
  { id: 'remove_wrong', name: 'Remove Wrong Guesses', description: 'Removes three of your incorrect guesses.', cost: 30, icon: <Trash2 className="h-6 w-6 text-red-500" /> },
  { id: 'show_word', name: 'Show Word Hint', description: 'Reveals one complete word in the puzzle.', cost: 60, icon: <FileText className="h-6 w-6 text-indigo-500" /> },
  { id: 'undo_move', name: 'Undo Last Move', description: 'Reverts your last letter guess.', cost: 10, icon: <Undo2 className="h-6 w-6 text-gray-500" /> },
  { id: 'solve_puzzle', name: 'Solve Puzzle', description: 'Instantly solves the current puzzle.', cost: 150, icon: <Sparkles className="h-6 w-6 text-purple-500" /> },
  { id: 'hint_pack', name: 'Hint Pack', description: 'Bundle: 3 Reveal Letters + 1 Word Hint.', cost: 120, icon: <Package className="h-6 w-6 text-orange-500" /> },
];

export function ShopClientPage() {
  const [isClient, setIsClient] = useState(false);
  const [coins, setCoins] = useState(200); // Default starting coins
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

  const handlePurchase = (powerUp: PowerUp) => {
    if (coins >= powerUp.cost) {
      const newCoinBalance = coins - powerUp.cost;
      setCoins(newCoinBalance);
      localStorage.setItem('crypto_coins', newCoinBalance.toString());

      // Logic to add power-up to inventory
      const inventory = JSON.parse(localStorage.getItem('crypto_powerups') || '{}');
      inventory[powerUp.id] = (inventory[powerUp.id] || 0) + 1;
      localStorage.setItem('crypto_powerups', JSON.stringify(inventory));
      
      playSound('purchase');
      toast({
        title: 'Purchase Successful!',
        description: `You bought ${powerUp.name}.`,
      });
    } else {
      playSound('error');
      toast({
        variant: 'destructive',
        title: 'Insufficient Coins',
        description: `You need ${powerUp.cost - coins} more coins to buy ${powerUp.name}.`,
      });
    }
  };
  
  const handleAdReward = () => {
    const newCoinBalance = coins + 50;
    setCoins(newCoinBalance);
    localStorage.setItem('crypto_coins', newCoinBalance.toString());
     playSound('reward');
     toast({
        title: 'Coins Rewarded!',
        description: `You received 50 free coins.`,
      });
  }

  if (!isClient) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="mb-6 shadow-lg">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between p-4">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <Coins className="h-8 w-8 text-yellow-500" />
            <div>
              <div className="text-sm text-muted-foreground">Your Balance</div>
              <div className="text-2xl font-bold">{coins} Coins</div>
            </div>
          </div>
          <Button onClick={handleAdReward} size="lg">
              <Clapperboard className="mr-2 h-5 w-5" />
              Watch Ad for 50 Coins
          </Button>
        </CardContent>
      </Card>

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
              <Button
                onClick={() => handlePurchase(powerUp)}
                disabled={coins < powerUp.cost}
              >
                Buy
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
