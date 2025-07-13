
'use client';

import React from 'react';
import { PowerUpGroup } from './power-up-group';
import type { PowerUpDefinition } from './power-up-group';
import { Lightbulb, Target, Trash2, FileText, Undo2, Sparkles, Package } from 'lucide-react';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const POWERUPS: PowerUpDefinition[] = [
  { id: 'reveal_letter', name: 'Reveal Letter', icon: <Lightbulb />, colorClass: 'border-yellow-500/50 text-yellow-500' },
  { id: 'auto_fill', name: 'Auto-Fill Letter', icon: <Target />, colorClass: 'border-blue-500/50 text-blue-500' },
  { id: 'remove_wrong', name: 'Remove Wrong Guesses', icon: <Trash2 />, colorClass: 'border-red-500/50 text-red-500' },
  { id: 'show_word', name: 'Show Word Hint', icon: <FileText />, colorClass: 'border-indigo-500/50 text-indigo-500' },
  { id: 'undo_move', name: 'Undo Last Move', icon: <Undo2 />, colorClass: 'border-gray-500/50 text-gray-500' },
  { id: 'solve_puzzle', name: 'Solve Puzzle', icon: <Sparkles />, colorClass: 'border-purple-500/50 text-purple-500' },
  { id: 'hint_pack', name: 'Hint Pack', icon: <Package />, colorClass: 'border-orange-500/50 text-orange-500' },
];


type PowerUpBarProps = {
  inventory: Record<string, number>;
  onUsePowerUp: (powerUpId: string) => void;
  disabled?: boolean;
};

export function PowerUpBar({ inventory, onUsePowerUp, disabled = false }: PowerUpBarProps) {
  const ownedPowerUps = POWERUPS.filter(
    (def) => inventory[def.id] && inventory[def.id] > 0
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2 my-4">
        {ownedPowerUps.length > 0 ? (
            <PowerUpGroup 
                powerUps={ownedPowerUps}
                inventory={inventory}
                onUsePowerUp={onUsePowerUp}
                disabled={disabled}
            />
        ) : (
             <div className="text-center p-4 rounded-lg bg-muted/50 w-full max-w-sm">
                <p className="text-sm text-muted-foreground mb-3">You have no power-ups.</p>
                <Button asChild>
                    <Link href="/shop">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Go to Shop
                    </Link>
                </Button>
            </div>
        )}
    </div>
  );
}
