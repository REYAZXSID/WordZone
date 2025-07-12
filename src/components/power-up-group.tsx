
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export type PowerUpDefinition = {
  id: string;
  name: string;
  icon: React.ReactNode;
  colorClass: string;
};

type PowerUpGroupProps = {
  powerUps: PowerUpDefinition[];
  inventory: Record<string, number>;
  onUsePowerUp: (powerUpId: string) => void;
  disabled?: boolean;
};

export function PowerUpGroup({ powerUps, inventory, onUsePowerUp, disabled = false }: PowerUpGroupProps) {
  
  if (powerUps.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="w-auto flex justify-center items-center gap-2 p-2 rounded-full bg-background/50 border shadow-inner backdrop-blur-sm">
        {powerUps.map((powerUp) => (
          <Tooltip key={powerUp.id}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onUsePowerUp(powerUp.id)}
                disabled={disabled}
                className={cn(
                  "relative h-12 w-12 rounded-full border-2 shadow-md transition-transform hover:scale-105",
                  powerUp.colorClass
                )}
              >
                {React.cloneElement(powerUp.icon as React.ReactElement, { className: 'h-6 w-6' })}
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full bg-primary p-0 text-xs font-bold text-primary-foreground"
                >
                  {inventory[powerUp.id]}
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{powerUp.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
