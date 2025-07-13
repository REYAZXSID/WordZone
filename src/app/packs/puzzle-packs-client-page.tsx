
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lock, Film, BookOpen, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type PuzzlePack = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  totalPuzzles: number;
  completedPuzzles: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isLocked: boolean;
  isNew?: boolean;
};

// Mock data for puzzle packs
export const initialPuzzlePacks: PuzzlePack[] = [
  {
    id: 'movie_quotes',
    title: 'Movie Quotes',
    description: 'Iconic lines from the silver screen.',
    icon: <Film className="h-6 w-6 text-red-500" />,
    totalPuzzles: 10,
    completedPuzzles: 4,
    difficulty: 'Medium',
    isLocked: false,
    isNew: true,
  },
  {
    id: 'love_quotes',
    title: 'Love Quotes',
    description: 'A collection of romantic and heartfelt sayings.',
    icon: <Quote className="h-6 w-6 text-pink-500" />,
    totalPuzzles: 15,
    completedPuzzles: 7,
    difficulty: 'Easy',
    isLocked: false,
  },
  {
    id: 'famous_proverbs',
    title: 'Famous Proverbs',
    description: 'Timeless wisdom from around the world.',
    icon: <BookOpen className="h-6 w-6 text-amber-600" />,
    totalPuzzles: 20,
    completedPuzzles: 0,
    difficulty: 'Hard',
    isLocked: true,
  },
];


export function PuzzlePacksClientPage() {
    const [isClient, setIsClient] = useState(false);
    const [packs, setPacks] = useState<PuzzlePack[]>([]);

    useEffect(() => {
        setIsClient(true);
        // In a real app, you would fetch user progress here.
        // For now, we'll just use the mock data.
        setPacks(initialPuzzlePacks);
    }, []);

    const renderPackCard = (pack: PuzzlePack) => {
        const progress = (pack.completedPuzzles / pack.totalPuzzles) * 100;

        const cardContent = (
            <Card className={cn(
                "transition-all duration-300 w-full",
                pack.isLocked ? "bg-muted/40" : "hover:scale-[1.02] hover:shadow-lg",
            )}>
                <CardContent className="flex flex-col gap-3 p-4">
                    <div className="flex items-start justify-between">
                         <div className="flex items-center gap-3">
                            <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg bg-background", pack.isLocked && "grayscale opacity-60")}>
                                {pack.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{pack.title}</h3>
                                <p className="text-xs text-muted-foreground">{pack.description}</p>
                            </div>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                             {pack.isLocked ? (
                                <Badge variant="destructive" className="items-center gap-1"><Lock className="h-3 w-3" /> Locked</Badge>
                             ) : pack.isNew ? (
                                 <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">New</Badge>
                             ) : (
                                <Badge variant="secondary">{pack.difficulty}</Badge>
                             )}
                         </div>
                    </div>
                    {!pack.isLocked && (
                        <div className="flex items-center gap-3 pt-1">
                            <Progress value={progress} className="h-2 w-full" />
                            <span className="text-xs font-mono text-muted-foreground">
                                {pack.completedPuzzles}/{pack.totalPuzzles}
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>
        );

        if (pack.isLocked) {
            return <div key={pack.id}>{cardContent}</div>;
        }

        return (
            <Link href={`/packs/${pack.id}`} key={pack.id} className="block">
                {cardContent}
            </Link>
        )
    };
    
    if (!isClient) return null; // Or return loading skeleton

    return (
        <div className="mx-auto max-w-2xl">
            <div className="space-y-4">
                {packs.map(renderPackCard)}
            </div>
        </div>
    )
}
