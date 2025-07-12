
'use client';

import type { Puzzle } from '@/lib/puzzles';
import { invertCipher, getCipherLetterToNumberMap } from '@/lib/puzzles';
import { generatePuzzleHint } from '@/ai/flows/generate-puzzle-hint';
import React, { useState, useTransition, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Lightbulb, RotateCcw, CheckCircle, RefreshCw } from 'lucide-react';
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
  onGameComplete?: () => void;
  onNewGame?: () => void;
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function GameBoard({ puzzle, onGameComplete, onNewGame }: GameBoardProps) {
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
    const numberOfHints = Math.min(3, shuffledLetters.length);
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

  const usedLetters = Object.values(userGuesses);

  const renderHeaderActions = () => (
     <>
        <ThemeToggle />
        <Button onClick={handleHint} disabled={isPending || isComplete} variant="ghost" size="icon">
          <Lightbulb className="h-5 w-5" />
          <span className="sr-only">Hint</span>
        </Button>
        <Button onClick={resetGame} variant="ghost" size="icon">
          <RotateCcw className="h-5 w-5" />
          <span className="sr-only">Reset</span>
        </Button>
      </>
  );

  return (
    <>
      <PageHeader title="Decode the Quote" actions={renderHeaderActions()} />
      <main className="flex-1 flex flex-col items-center p-4 gap-4 md:p-6">
        <div className="flex-1 w-full max-w-4xl flex flex-col items-center">
          <div className="w-full text-center mb-4">
             <p className="text-sm text-muted-foreground">By {puzzle.author}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-1">
            {puzzle.text.split('').map((char, index) => {
              if (ALPHABET.includes(char)) {
                return (
                  <div
                    key={`${char}-${index}`}
                    onClick={() => handleLetterSelect(char)}
                    className={cn(
                      "flex h-16 w-12 cursor-pointer flex-col items-center justify-between rounded-md bg-card font-mono text-xl transition-all border-2",
                      selectedLetter === char ? "border-primary shadow-lg scale-105" : "border-input",
                      animateCorrect === char ? 'correct-guess-animation' : ''
                    )}
                  >
                    <div className="text-muted-foreground text-sm pt-1">{letterToNumberMap[char]}</div>
                    <div className="text-2xl font-bold text-foreground pb-1">
                      {userGuesses[char] || ''}
                    </div>
                  </div>
                );
              }
              if (char === ' ') {
                 return <div key={`space-${index}`} className="w-4 h-16" />;
              }
              return (
                 <div key={`char-${index}`} className="flex h-16 w-8 items-end justify-center pb-2 text-2xl font-bold">
                    {char}
                 </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-xl p-2 rounded-lg bg-card/50">
           <div className="grid grid-cols-7 gap-1 md:grid-cols-13 md:gap-2 justify-center">
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
        </div>
      </main>

      {isClient && (
        <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-2xl">
                <CheckCircle className="h-8 w-8 text-green-500" />
                Congratulations!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-md py-4">
                <div>
                  <p>You've successfully decoded the quote:</p>
                  <blockquote className="mt-2 border-l-2 border-primary pl-4 italic">
                    "{puzzle.quote}"
                  </blockquote>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               {onNewGame && (
                <Button variant="secondary" onClick={() => { setShowWinDialog(false); onNewGame(); }}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  New Puzzle
                </Button>
              )}
              <AlertDialogAction onClick={() => setShowWinDialog(false)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
