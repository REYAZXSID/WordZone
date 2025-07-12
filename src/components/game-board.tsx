
'use client';

import type { Puzzle } from '@/lib/puzzles';
import { invertCipher, getCipherLetterToNumberMap } from '@/lib/puzzles';
import { generatePuzzleHint } from '@/ai/flows/generate-puzzle-hint';
import React, { useState, useTransition, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Lightbulb, RotateCcw, CheckCircle, RefreshCw, PartyPopper, ArrowRight, Home } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { PageHeader } from './page-header';
import { ThemeToggle } from './theme-toggle';

type GameBoardProps = {
  puzzle: Puzzle;
  level: number;
  onGameComplete?: () => void;
  onNextLevel?: () => void;
  onPlayAgain?: () => void;
  onMainMenu?: () => void;
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function GameBoard({ puzzle, level, onGameComplete, onNextLevel, onPlayAgain, onMainMenu }: GameBoardProps) {
  const [userGuesses, setUserGuesses] = useState<Record<string, string>>({});
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [animateCorrect, setAnimateCorrect] = useState<string | null>(null);

  useEffect(() => setIsClient(true), []);

  const solvedCipher = useMemo(() => invertCipher(puzzle.cipher), [puzzle.cipher]);
  const letterToNumberMap = useMemo(() => getCipherLetterToNumberMap(puzzle.text), [puzzle.text]);
  const puzzleEncryptedLetters = useMemo(() => Object.keys(letterToNumberMap).filter(l => puzzle.text.includes(l)), [letterToNumberMap, puzzle.text]);

  const resetGame = useCallback(() => {
    setUserGuesses({});
    setSelectedLetter(null);
    setIsComplete(false);
    
    const shuffledLetters = [...puzzleEncryptedLetters].sort(() => 0.5 - Math.random());
    const numberOfHints = Math.min(1, shuffledLetters.length);
    const newGuesses: Record<string, string> = {};
    
    for(let i = 0; i < numberOfHints; i++) {
      const encryptedLetter = shuffledLetters[i];
      const decryptedLetter = solvedCipher[encryptedLetter];
      if (decryptedLetter) {
        newGuesses[encryptedLetter] = decryptedLetter;
      }
    }
    setUserGuesses(newGuesses);
  }, [puzzleEncryptedLetters, solvedCipher]);

  useEffect(() => {
    resetGame();
    setShowWinDialog(false);
  }, [puzzle.id, resetGame]);

  const checkSolution = useCallback(() => {
    if (isComplete) return;
    const solved = puzzleEncryptedLetters.every(char => userGuesses[char] === solvedCipher[char]);
    
    if (solved) {
      setIsComplete(true);
      setShowWinDialog(true);
      onGameComplete?.();
    }
  }, [userGuesses, onGameComplete, solvedCipher, puzzleEncryptedLetters, isComplete]);

  useEffect(() => {
    if (Object.keys(userGuesses).length >= puzzleEncryptedLetters.length) {
      checkSolution();
    }
  }, [userGuesses, checkSolution, puzzleEncryptedLetters]);


  const handleLetterSelect = (letter: string) => {
    if (isComplete) return;
    setSelectedLetter(letter);
  };

  const handleKeyboardInput = (guess: string) => {
    if (!selectedLetter || isComplete) return;
    
    const newGuesses = {...userGuesses};
    
    // If the guessed letter is already used for another encrypted letter, clear the old one
    for (const key in newGuesses) {
        if (newGuesses[key] === guess) {
            delete newGuesses[key];
        }
    }

    newGuesses[selectedLetter] = guess;
    setUserGuesses(newGuesses);

    if (newGuesses[selectedLetter] === solvedCipher[selectedLetter]) {
      setAnimateCorrect(selectedLetter);
      setTimeout(() => setAnimateCorrect(null), 500);
    }

    setSelectedLetter(null);
  };

  const handleHint = () => {
    if (isComplete) return;
    
    const unsolvedLetters = puzzleEncryptedLetters.filter(
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
        console.error("Hint error:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not generate a hint at this time.',
        });
      }
    });
  };
  
  const renderHeaderActions = () => (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Button onClick={handleHint} disabled={isPending || isComplete} variant="ghost" size="icon">
        <Lightbulb className="h-5 w-5" />
        <span className="sr-only">Hint</span>
      </Button>
      <Button onClick={resetGame} variant="ghost" size="icon">
        <RotateCcw className="h-5 w-5" />
        <span className="sr-only">Reset</span>
      </Button>
    </div>
  );


  const usedLetters = Object.values(userGuesses);

  return (
    <>
      <PageHeader title={`Level ${level}`} actions={renderHeaderActions()} />
      <main className="flex flex-1 flex-col items-center p-4 md:p-6 justify-between">
        <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center">
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-4">
            {puzzle.text.split('').map((char, index) => {
              if (ALPHABET.includes(char)) {
                return (
                  <div
                    key={`${char}-${index}`}
                    onClick={() => handleLetterSelect(char)}
                    className={cn(
                      "flex h-12 w-9 cursor-pointer flex-col items-center justify-between rounded-md bg-card font-mono text-xl transition-all border-2",
                      selectedLetter === char ? "border-primary shadow-lg scale-105" : "border-input",
                      userGuesses[char] && solvedCipher[char] === userGuesses[char] ? "bg-green-500/10 border-green-500/50" : "",
                      animateCorrect === char ? 'correct-guess-animation' : ''
                    )}
                  >
                    <div className="text-muted-foreground text-xs pt-1">{letterToNumberMap[char]}</div>
                    <div className="text-lg font-bold text-foreground pb-1">
                      {userGuesses[char] || ''}
                    </div>
                  </div>
                );
              }
              if (char === ' ') {
                 return <div key={`space-${index}`} className="w-4" />;
              }
              // Render non-alphabetic characters like punctuation directly
              return (
                  <div key={`punct-${index}`} className="flex h-12 w-5 items-end justify-center pb-1 text-xl font-bold">
                    {char}
                  </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto p-2 pb-4 rounded-lg">
           <div className="grid grid-cols-6 gap-2 justify-items-center">
            {ALPHABET.map((letter) => (
              <Button
                key={letter}
                variant={usedLetters.includes(letter) ? 'outline' : 'default'}
                size="sm"
                className="h-9 w-full p-0 text-sm font-bold"
                onClick={() => handleKeyboardInput(letter)}
                disabled={!selectedLetter || (usedLetters.includes(letter) && userGuesses[selectedLetter] !== letter) || isComplete}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>
      </main>

      {isClient && (
        <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader className="items-center text-center space-y-4">
               <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 animate-pulse-success">
                  <PartyPopper className="h-12 w-12 text-green-500" />
              </div>
              <div className="space-y-2">
                <AlertDialogTitle className="text-3xl font-bold">
                  Level Complete!
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-4 text-card-foreground dark:text-card-foreground">
                    <p>You've successfully decoded the quote:</p>
                    <blockquote className="border-l-4 border-primary bg-muted/50 p-4 rounded-r-lg italic">
                      "{puzzle.quote}"
                       <p className="text-right text-sm text-muted-foreground/80 not-italic mt-2">
                          &mdash; {puzzle.author}
                        </p>
                    </blockquote>
                  </div>
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mt-4">
                <Button variant="outline" onClick={() => { if(onPlayAgain) onPlayAgain(); }}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
                 <Button variant="secondary" onClick={() => { if(onMainMenu) onMainMenu(); }}>
                  <Home className="mr-2 h-4 w-4" />
                  Main Menu
                </Button>
                <Button 
                  onClick={() => { if(onNextLevel) onNextLevel(); }}
                  disabled={level >= 50}
                >
                  Next Level
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
