

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Lock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Difficulty } from '@/lib/puzzles';

const TOTAL_LEVELS = 50;

export default function LevelSelectionPage() {
  const params = useParams();
  const difficulty = params.difficulty as Difficulty;
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem(`completedLevels_${difficulty}`);
      if (savedProgress) {
        setCompletedLevels(JSON.parse(savedProgress));
      }
    }
  }, [difficulty]);

  const levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);
  const difficultyTitle = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <PageHeader title={`${difficultyTitle} Levels`} />
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto grid max-w-4xl grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
            {levels.map((level) => (
              <Card key={level} className="h-20 w-20 animate-pulse rounded-full bg-muted" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title={`${difficultyTitle} Levels`} />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto grid max-w-4xl grid-cols-4 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
          {levels.map((level) => {
            const isCompleted = completedLevels.includes(level);
            // Level 1 is always unlocked. Subsequent levels are unlocked if the previous one is completed.
            const isLocked = level > 1 && !completedLevels.includes(level - 1);

            return (
              <Link
                key={level}
                href={isLocked ? '#' : `/game?difficulty=${difficulty}&level=${level}`}
                className={cn(
                  'pointer-events-auto relative',
                  isLocked && 'pointer-events-none'
                )}
                aria-disabled={isLocked}
                tabIndex={isLocked ? -1 : undefined}
              >
                <Card
                  className={cn(
                    'flex h-20 w-20 flex-col items-center justify-center rounded-full transition-all duration-200 group',
                    isLocked
                      ? 'bg-muted text-muted-foreground'
                      : 'hover:scale-105 hover:shadow-lg hover:border-primary/50',
                    isCompleted
                      ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
                      : 'border-border'
                  )}
                >
                  <CardContent className="flex flex-col items-center justify-center p-2 text-center">
                    {isLocked ? (
                      <Lock className="h-8 w-8" />
                    ) : (
                       <span className={cn(
                           "text-3xl font-bold",
                           isCompleted ? "opacity-70" : "text-foreground"
                       )}>
                           {level}
                       </span>
                    )}
                  </CardContent>
                  {isCompleted && !isLocked && (
                       <div className="absolute bottom-4 flex gap-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                        </div>
                    )}
                </Card>
                 {isCompleted && (
                    <div className="absolute -top-1 -right-1 rounded-full bg-green-500 p-1 text-white ring-4 ring-background">
                        <Check className="h-3 w-3" />
                    </div>
                )}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
