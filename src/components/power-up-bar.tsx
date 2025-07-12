
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Lightbulb, Target, Trash2, FileText, TimerOff, Gem, Undo2, Sparkles, Package } from 'lucide-react';

type PowerUpDefinition = {
  id: string;
  name: string;
  icon: React.ReactNode;
  colorClass: string;
};

const POWER_UP_DEFINITIONS: PowerUpDefinition[] = [
  { id: 'reveal_letter', name: 'Reveal Letter', icon: <Lightbulb />, colorClass: 'border-yellow-500/50 text-yellow-500' },
  { id: 'auto_fill', name: 'Auto-Fill Letter', icon: <Target />, colorClass: 'border-blue-500/50 text-blue-500' },
  { id: 'remove_wrong', name: 'Remove Wrong Guesses', icon: <Trash2 />, colorClass: 'border-red-500/50 text-red-500' },
  { id: 'show_word', name: 'Show Word Hint', icon: <FileText />, colorClass: 'border-indigo-500/50 text-indigo-500' },
  { id: 'freeze_timer', name: 'Freeze Timer', icon: <TimerOff />, colorClass: 'border-cyan-500/50 text-cyan-500' },
  { id: 'double_coins', name: 'Double Coins', icon: <Gem />, colorClass: 'border-green-500/50 text-green-500' },
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
  const ownedPowerUps = POWER_UP_DEFINITIONS.filter(
    (def) => inventory[def.id] && inventory[def.id] > 0
  );

  if (ownedPowerUps.length === 0) {
    return null;
  }

  return (
    <div className="w-full p-2 my-4 rounded-full bg-background/50 border shadow-inner backdrop-blur-sm">
      <div className="flex justify-center items-center gap-2">
        {ownedPowerUps.map((powerUp) => (
          <Button
            key={powerUp.id}
            variant="ghost"
            size="icon"
            onClick={() => onUsePowerUp(powerUp.id)}
            disabled={disabled}
            className={cn(
              "relative h-12 w-12 rounded-full border-2 shadow-md transition-transform hover:scale-105",
              powerUp.colorClass
            )}
            title={powerUp.name}
          >
            {React.cloneElement(powerUp.icon as React.ReactElement, { className: 'h-6 w-6' })}
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full bg-primary text-primary-foreground p-0"
            >
              {inventory[powerUp.id]}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
}
