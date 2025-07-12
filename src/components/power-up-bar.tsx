
'use client';

import React from 'react';
import { PowerUpGroup } from './power-up-group';
import type { PowerUpDefinition } from './power-up-group';
import { Lightbulb, Target, Trash2, FileText, TimerOff, Gem, Undo2, Sparkles, Package } from 'lucide-react';

const HINT_POWERUPS: PowerUpDefinition[] = [
  { id: 'reveal_letter', name: 'Reveal Letter', icon: <Lightbulb />, colorClass: 'border-yellow-500/50 text-yellow-500' },
  { id: 'auto_fill', name: 'Auto-Fill Letter', icon: <Target />, colorClass: 'border-blue-500/50 text-blue-500' },
  { id: 'remove_wrong', name: 'Remove Wrong Guesses', icon: <Trash2 />, colorClass: 'border-red-500/50 text-red-500' },
  { id: 'show_word', name: 'Show Word Hint', icon: <FileText />, colorClass: 'border-indigo-500/50 text-indigo-500' },
];

const UTILITY_POWERUPS: PowerUpDefinition[] = [
  { id: 'undo_move', name: 'Undo Last Move', icon: <Undo2 />, colorClass: 'border-gray-500/50 text-gray-500' },
  { id: 'solve_puzzle', name: 'Solve Puzzle', icon: <Sparkles />, colorClass: 'border-purple-500/50 text-purple-500' },
  { id: 'freeze_timer', name: 'Freeze Timer', icon: <TimerOff />, colorClass: 'border-cyan-500/50 text-cyan-500' },
  { id: 'double_coins', name: 'Double Coins', icon: <Gem />, colorClass: 'border-green-500/50 text-green-500' },
  { id: 'hint_pack', name: 'Hint Pack', icon: <Package />, colorClass: 'border-orange-500/50 text-orange-500' },
];


type PowerUpBarProps = {
  inventory: Record<string, number>;
  onUsePowerUp: (powerUpId: string) => void;
  disabled?: boolean;
};

export function PowerUpBar({ inventory, onUsePowerUp, disabled = false }: PowerUpBarProps) {
  const ownedHintPowerUps = HINT_POWERUPS.filter(
    (def) => inventory[def.id] && inventory[def.id] > 0
  );
  
  const ownedUtilityPowerUps = UTILITY_POWERUPS.filter(
    (def) => inventory[def.id] && inventory[def.id] > 0
  );

  const hasAnyPowerUps = ownedHintPowerUps.length > 0 || ownedUtilityPowerUps.length > 0;

  if (!hasAnyPowerUps) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 my-4">
        {ownedHintPowerUps.length > 0 && (
            <PowerUpGroup 
                powerUps={ownedHintPowerUps}
                inventory={inventory}
                onUsePowerUp={onUsePowerUp}
                disabled={disabled}
            />
        )}
        {ownedUtilityPowerUps.length > 0 && (
            <PowerUpGroup 
                powerUps={ownedUtilityPowerUps}
                inventory={inventory}
                onUsePowerUp={onUsePowerUp}
                disabled={disabled}
            />
        )}
    </div>
  );
}
