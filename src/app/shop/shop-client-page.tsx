
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
    Package
} from 'lucide-react';
import { useSound } from '@/hooks/use-sound';
import { Separator } from '@/components/ui/separator';
import { useUserData } from '@/hooks/use-user-data';
import { saveUserData } from '@/lib/user-data';
import Link from 'next/link';

type ShopItem = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  isBundle?: boolean;
};

const shopItems: ShopItem[] = [
  // Power-ups
  { id: 'reveal_letter', name: 'Reveal Letter', description: 'Reveals one correct letter.', cost: 20, icon: <Lightbulb className="h-6 w-6 text-yellow-500" /> },
  { id: 'auto_fill', name: 'Auto-Fill Letter', description: 'Fills all instances of one correct letter.', cost: 50, icon: <Target className="h-6 w-6 text-blue-500" /> },
  { id: 'remove_wrong', name: 'Remove Wrong Guesses', description: 'Removes three of your incorrect guesses.', cost: 30, icon: <Trash2 className="h-6 w-6 text-red-500" /> },
  { id: 'show_word', name: 'Show Word Hint', description: 'Reveals one complete word in the puzzle.', cost: 60, icon: <FileText className="h-6 w-6 text-indigo-500" /> },
  { id: 'undo_move', name: 'Undo Last Move', description: 'Reverts your last letter guess.', cost: 10, icon: <Undo2 className="h-6 w-6 text-gray-500" /> },
  { id: 'solve_puzzle', name: 'Solve Puzzle', description: 'Instantly solves the current puzzle.', cost: 150, icon: <Sparkles className="h-6 w-6 text-purple-500" /> },
  { id: 'hint_pack', name: 'Hint Pack', description: 'Bundle: 3 Reveal Letters + 1 Word Hint.', cost: 100, icon: <Package className="h-6 w-6 text-orange-500" />, isBundle: true },
];

export function ShopClientPage() {
  const { userData, isClient, refreshUserData } = useUserData();
  const { toast } = useToast();
  const playSound = useSound();

  const handlePurchase = (item: ShopItem) => {
    if (!userData) return;

    if (item.cost > 0 && userData.coins < item.cost) {
      playSound('error');
      toast({
        variant: 'destructive',
        title: 'Insufficient Coins',
        description: `You need ${item.cost - userData.coins} more coins to buy ${item.name}.`,
      });
      return;
    }

    const newCoinBalance = userData.coins - item.cost;
    
    const inventory = JSON.parse(localStorage.getItem('crypto_powerups') || '{}');

    if (item.isBundle && item.id === 'hint_pack') {
      inventory['reveal_letter'] = (inventory['reveal_letter'] || 0) + 3;
      inventory['show_word'] = (inventory['show_word'] || 0) + 1;
      toast({ title: 'Pack Purchased!', description: `Added 3 Reveal Letter and 1 Show Word hints.` });
    } else {
      inventory[item.id] = (inventory[item.id] || 0) + 1;
      toast({ title: 'Purchase Successful!', description: `You bought ${item.name}.` });
    }
    
    localStorage.setItem('crypto_powerups', JSON.stringify(inventory));
    saveUserData({ coins: newCoinBalance });
    refreshUserData();

    playSound('purchase');
    window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_powerups' }));
  };

  if (!isClient || !userData) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="shadow-lg sticky top-16 z-10 bg-background/90 backdrop-blur-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="text-lg text-muted-foreground font-semibold">Your Balance</div>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Coins className="h-7 w-7 text-yellow-500" />
            <span>{userData.coins.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-center mb-4">Power-Ups & Bundles</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shopItems.map((powerUp) => (
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
                <Button onClick={() => handlePurchase(powerUp)} disabled={userData.coins < powerUp.cost}>
                  Buy
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Separator />

      <div>
        <h2 className="text-2xl font-bold text-center mb-4">Need More Coins?</h2>
         <div className="flex justify-center">
             <Button asChild size="lg">
                <Link href="/coin-shop">
                    Go to Coin Shop
                    <Coins className="ml-2 h-5 w-5" />
                </Link>
             </Button>
        </div>
      </div>

    </div>
  );
}
