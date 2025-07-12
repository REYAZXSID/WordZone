import { GameBoard } from '@/components/game-board';
import { PageHeader } from '@/components/page-header';
import { getRandomPuzzle } from '@/lib/puzzles';

export default function GamePage() {
  const puzzle = getRandomPuzzle();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="Random Puzzle" />
      <main>
        <GameBoard puzzle={puzzle} />
      </main>
    </div>
  );
}
