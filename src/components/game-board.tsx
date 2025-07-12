'use client';

import type { Puzzle } from '@/lib/puzzles';
import { invertCipher, getCipherLetterToNumberMap } from '@/lib/puzzles';
import { generatePuzzleHint } from '@/ai/flows/generate-puzzle-hint';
import React, { useState, useTransition, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Lightbulb, RotateCcw, CheckCircle } from 'lucide-react';
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

  const solvedCipher = useMemo(() => invertCipher(puzzle.cipher), [puzzle.cipher]);
  const letterToNumberMap = useMemo(() => getCipherLetterToNumberMap(puzzle.text), [puzzle.text]);

  const giveInitialHint = useCallback(() => {
    const allEncryptedLetters = Object.keys(solvedCipher);
    if (allEncryptedLetters.length > 0) {
      const randomEncryptedLetter = allEncryptedLetters[Math.floor(Math.random() * allEncryptedLetters.length)];
      const decryptedLetter = solvedCipher[randomEncryptedLetter];
      setUserGuesses({ [randomEncryptedLetter]: decryptedLetter });
    }
  }, [solvedCipher]);

  useEffect(() => {
    // Give one hint when a new puzzle loads
    giveInitialHint();
  }, [puzzle.id, giveInitialHint]);

  const checkSolution = useCallback(() => {
    if (isComplete) return;
    const allEncryptedChars = Object.keys(letterToNumberMap);
    const solved = allEncryptedChars.every(char => userGuesses[char] === solvedCipher[char]);
    
    if (solved) {
      setIsComplete(true);
      setShowWinDialog(true);
      onGameComplete?.();
    }
  }, [userGuesses, onGameComplete, solvedCipher, letterToNumberMap, isComplete]);

  useEffect(() => {
    // Only check if all letters have a guess
    if (Object.keys(userGuesses).length === Object.keys(letterToNumberMap).length) {
      checkSolution();
    }
  }, [userGuesses, checkSolution, letterToNumberMap]);

  const handleLetterSelect = (letter: string) => {
    if (isComplete) return;
    setSelectedLetter(letter);
  };

  const handleKeyboardInput = (guess: string) => {
    if (!selectedLetter || isComplete) return;
    
    const newGuesses = {...userGuesses};
    
    // Clear previous use of this letter if any
    for (const key in newGuesses) {
        if (newGuesses[key] === guess) {
            delete newGuesses[key];
        }
    }

    newGuesses[selectedLetter] = guess;
    setUserGuesses(newGuesses);
  };

  const handleHint = () => {
    if (isComplete) return;
    
    const unsolvedLetters = Object.keys(solvedCipher).filter(
      (encrypted) => !userGuesses[encrypted] || userGuesses[encrypted] !== solvedCipher[encrypted]
    );

    if (unsolvedLetters.length === 0) {
      toast({ title: 'Puzzle Solved!', description: 'No more hints needed.' });
      return;
    }

    const encrypted = unsolvedLetters[Math.floor(Math.random() * unsolvedLetters.length)];

    startTransition(async () => {
      try {
        const result = await generatePuzzleHint({
          encryptedLetter: encrypted,
          solvedCipher: solvedCipher,
        });
        const decrypted = result.decryptedLetter;
        
        const newGuesses = {...userGuesses};
        // Clear previous assignment of this decrypted letter
        for (const key in newGuesses) {
            if (newGuesses[key] === decrypted) {
                delete newGuesses[key];
            }
        }
        newGuesses[encrypted] = decrypted;
        setUserGuesses(newGuesses);

        toast({
          title: 'Hint Revealed!',
          description: `The number '${letterToNumberMap[encrypted]}' is the letter '${decrypted}'.`,
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
    setSelectedLetter(null);
    setIsComplete(false);
    giveInitialHint(); // Reset to initial state with one hint
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
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-4">
            {puzzle.text.split('').map((char, index) => {
              if (ALPHABET.includes(char)) {
                return (
                  <div
                    key={`${char}-${index}`}
                    onClick={() => handleLetterSelect(char)}
                    className={cn(
                      "flex h-16 w-12 cursor-pointer flex-col items-center justify-center rounded-md border-2 bg-card font-mono text-xl transition-all",
                      selectedLetter === char ? "border-primary shadow-lg" : "border-input",
                      userGuesses[char] && letterIsCorrect(char) ? 'bg-green-500/20' : '',
                       isComplete && letterIsCorrect(char) ? 'correct-guess-animation' : ''
                    )}
                  >
                    <div className="text-muted-foreground text-sm">{letterToNumberMap[char]}</div>
                    <div className="text-2xl font-bold text-foreground">
                      {userGuesses[char] || ''}
                    </div>
                  </div>
                );
              }
              if (char === ' ') {
                 return <div key={`space-${index}`} className="w-4 flex-shrink-0" />;
              }
              return (
                 <div key={`char-${index}`} className="flex h-16 w-8 items-end justify-center pb-1 text-2xl font-bold">
                    {char}
                 </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
           <div className="text-sm text-muted-foreground">Click a box above, then a letter below to guess.</div>
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
                <CheckCircle className="h-8 w-8 text-green-500" />
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
