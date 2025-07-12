'use client';

import type { Puzzle } from '@/lib/puzzles';
import { invertCipher } from '@/lib/puzzles';
import { generatePuzzleHint } from '@/ai/flows/generate-puzzle-hint';
import React, { useState, useTransition, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type GameBoardProps = {
  puzzle: Puzzle;
  onGameComplete?: () => void;
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function GameBoard({ puzzle, onGameComplete }: GameBoardProps) {
  const [userGuesses, setUserGuesses] = useState<Record<string, string>>({});
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);

  useEffect(() => setIsClient(true), []);

  const solvedCipher = invertCipher(puzzle.cipher);

  const checkSolution = useCallback(() => {
    const solvedText = puzzle.text.split('').map(char => userGuesses[char] || ' ').join('');
    if (solvedText === puzzle.quote) {
      setIsComplete(true);
      setShowWinDialog(true);
      onGameComplete?.();
    }
  }, [puzzle.text, puzzle.quote, userGuesses, onGameComplete]);

  useEffect(() => {
    if (Object.keys(userGuesses).length > 0) {
      checkSolution();
    }
  }, [userGuesses, checkSolution]);

  const handleLetterSelect = (letter: string) => {
    if (isComplete) return;
    setSelectedLetter(letter);
  };

  const handleKeyboardInput = (guess: string) => {
    if (!selectedLetter || isComplete) return;
    setUserGuesses((prev) => ({
      ...prev,
      [selectedLetter]: guess,
    }));
  };

  const handleHint = () => {
    if (isComplete) return;
    startTransition(async () => {
      try {
        const result = await generatePuzzleHint({
          encryptedPuzzle: puzzle.text,
          solvedCipher: solvedCipher,
        });
        const [encrypted, decrypted] = result.hint.split(': ');
        setUserGuesses((prev) => ({ ...prev, [encrypted]: decrypted }));
        toast({
          title: 'Hint Revealed!',
          description: `The letter '${encrypted}' is '${decrypted}'.`,
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not generate a hint at this time.',
        });
      }
    });
  };

  const handleReset = () => {
    setUserGuesses({});
    setSelectedLetter(null);
    setIsComplete(false);
  };

  const usedLetters = Object.values(userGuesses);
  const letterIsCorrect = (letter: string) => {
    return userGuesses[letter] === solvedCipher[letter];
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 md:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-xl md:text-2xl">Decode the Quote</CardTitle>
          <CardDescription className="text-center">
            By {puzzle.author}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-2">
            {puzzle.text.split('').map((char, index) => {
              if (ALPHABET.includes(char)) {
                return (
                  <div
                    key={`${char}-${index}`}
                    onClick={() => handleLetterSelect(char)}
                    className={cn(
                      "flex h-16 w-12 cursor-pointer flex-col items-center justify-center rounded-md border-2 bg-card font-mono text-xl transition-all",
                      selectedLetter === char ? "border-primary shadow-lg" : "border-input",
                      userGuesses[char] && letterIsCorrect(char) ? 'bg-accent/30' : '',
                       isComplete && letterIsCorrect(char) ? 'correct-guess-animation' : ''
                    )}
                  >
                    <div className="text-muted-foreground">{char}</div>
                    <div className="text-2xl font-bold text-foreground">
                      {userGuesses[char] || ''}
                    </div>
                  </div>
                );
              }
              return (
                <div key={`space-${index}`} className="w-4 flex-shrink-0" />
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <div className="grid grid-cols-7 gap-2 md:grid-cols-13 md:gap-2">
            {ALPHABET.map((letter) => (
              <Button
                key={letter}
                variant={usedLetters.includes(letter) ? 'outline' : 'default'}
                size="sm"
                className="h-10 w-10 p-0 text-lg md:h-12 md:w-12"
                onClick={() => handleKeyboardInput(letter)}
                disabled={!selectedLetter || usedLetters.includes(letter) || isComplete}
              >
                {letter}
              </Button>
            ))}
          </div>
          <div className="flex w-full justify-center gap-4 pt-4">
            <Button onClick={handleHint} disabled={isPending || isComplete} variant="secondary">
              <Lightbulb className="mr-2 h-4 w-4" />
              {isPending ? 'Getting Hint...' : 'Hint'}
            </Button>
            <Button onClick={handleReset} variant="destructive">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardFooter>
      </Card>
      {isClient && (
        <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle className="h-8 w-8 text-accent-foreground" />
                Congratulations!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-md py-4">
                You've successfully decoded the quote:
                <blockquote className="mt-2 border-l-2 border-primary pl-4 italic">
                  "{puzzle.quote}"
                </blockquote>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowWinDialog(false)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
