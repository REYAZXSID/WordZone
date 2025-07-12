
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Lock } from 'lucide-react';
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
        <PageHeader title={`Select Level - ${difficultyTitle}`} />
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto grid max-w-4xl grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {levels.map((level) => (
              <Card key={level} className="h-20 w-full animate-pulse bg-muted" />
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
        <div className="mx-auto grid max-w-4xl grid-cols-5 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {levels.map((level) => {
            const isCompleted = completedLevels.includes(level);
            // In a real scenario, you might want to unlock levels sequentially
            const isLocked = false; 

            return (
              <Link
                key={level}
                href={isLocked ? '#' : `/game?difficulty=${difficulty}&level=${level}`}
                className={cn(
                  'pointer-events-auto',
                  isLocked && 'pointer-events-none'
                )}
                aria-disabled={isLocked}
                tabIndex={isLocked ? -1 : undefined}
              >
                <Card
                  className={cn(
                    'relative flex h-20 w-full flex-col items-center justify-center overflow-hidden transition-all duration-200 group',
                    isLocked
                      ? 'bg-muted text-muted-foreground'
                      : 'hover:scale-105 hover:shadow-lg hover:border-primary/50',
                    isCompleted
                      ? 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
                      : 'border-border'
                  )}
                >
                  {isCompleted && (
                    <div className="absolute top-1 right-1 rounded-full bg-green-500 p-1 text-white">
                        <Check className="h-3 w-3" />
                    </div>
                  )}
                  <CardContent className="flex flex-col items-center justify-center p-2 text-center">
                    {isLocked ? (
                      <Lock className="h-6 w-6" />
                    ) : (
                       <span className={cn(
                           "text-2xl font-bold",
                           isCompleted ? "opacity-70" : "text-foreground"
                       )}>
                           {level}
                       </span>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
