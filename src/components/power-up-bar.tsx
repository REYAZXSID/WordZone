
'use client';

import React from 'react';
import { PowerUpGroup } from './power-up-group';
import type { PowerUpDefinition } from './power-up-group';
import { Lightbulb, Target, Trash2, FileText, Undo2, Sparkles, Package } from 'lucide-react';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Difficulty } from '@/lib/puzzles';

const POWERUPS: (PowerUpDefinition & { allowedDifficulties: Difficulty[] })[] = [
  { id: 'reveal_letter', name: 'Reveal Letter', icon: <Lightbulb />, colorClass: 'border-yellow-500/50 text-yellow-500', allowedDifficulties: ['easy', 'medium', 'hard', 'intermediate', 'advance'] },
  { id: 'undo_move', name: 'Undo Last Move', icon: <Undo2 />, colorClass: 'border-gray-500/50 text-gray-500', allowedDifficulties: ['easy', 'medium', 'hard', 'intermediate', 'advance'] },
  { id: 'remove_wrong', name: 'Remove Wrong Guesses', icon: <Trash2 />, colorClass: 'border-red-500/50 text-red-500', allowedDifficulties: ['hard', 'intermediate', 'advance'] },
  { id: 'auto_fill', name: 'Auto-Fill Letter', icon: <Target />, colorClass: 'border-blue-500/50 text-blue-500', allowedDifficulties: ['hard', 'intermediate', 'advance'] },
  { id: 'show_word', name: 'Show Word Hint', icon: <FileText />, colorClass: 'border-indigo-500/50 text-indigo-500', allowedDifficulties: ['intermediate', 'advance'] },
  { id: 'solve_puzzle', name: 'Solve Puzzle', icon: <Sparkles />, colorClass: 'border-purple-500/50 text-purple-500', allowedDifficulties: ['intermediate', 'advance'] },
  { id: 'hint_pack', name: 'Hint Pack', icon: <Package />, colorClass: 'border-orange-500/50 text-orange-500', allowedDifficulties: ['easy', 'medium', 'hard', 'intermediate', 'advance'] },
];


type PowerUpBarProps = {
  inventory: Record<string, number>;
  onUsePowerUp: (powerUpId: string) => void;
  disabled?: boolean;
  difficulty: Difficulty;
};

export function PowerUpBar({ inventory, onUsePowerUp, disabled = false, difficulty }: PowerUpBarProps) {
  const availablePowerups = POWERUPS.filter(p => p.allowedDifficulties.includes(difficulty));
  
  const ownedPowerUps = availablePowerups.filter(
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
                <p className="text-sm text-muted-foreground mb-3">You have no power-ups for this difficulty.</p>
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
