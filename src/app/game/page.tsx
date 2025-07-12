'use client';

import { useState } from 'react';
import { GameBoard } from '@/components/game-board';
import { PageHeader } from '@/components/page-header';
import { getRandomPuzzle } from '@/lib/puzzles';
import type { Puzzle } from '@/lib/puzzles';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export default function GamePage() {
  const [puzzle, setPuzzle] = useState(getRandomPuzzle());

  const handleNewGame = () => {
    setPuzzle(getRandomPuzzle());
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <GameBoard puzzle={puzzle} onNewGame={handleNewGame} />
    </div>
  );
}
