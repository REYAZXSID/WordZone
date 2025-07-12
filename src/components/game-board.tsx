
'use client';

import type { Puzzle } from '@/lib/puzzles';
import { invertCipher, getCipherLetterToNumberMap } from '@/lib/puzzles';
import { generatePuzzleHint } from '@/ai/flows/generate-puzzle-hint';
import React, { useState, useTransition, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Lightbulb, PartyPopper, ArrowRight, Home, RefreshCw, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PageHeader } from './page-header';
import { ThemeToggle } from './theme-toggle';
import { useSound } from '@/hooks/use-sound';
import { PowerUpBar } from './power-up-bar';

type GameBoardProps = {
  puzzle: Puzzle;
  level?: number;
  isDailyChallenge?: boolean;
  onGameComplete?: (durationInSeconds: number) => number; // Returns coins earned
  onNextLevel?: () => void;
  onPlayAgain?: () => void;
  onMainMenu?: () => void;
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function GameBoard({ puzzle, level, isDailyChallenge = false, onGameComplete, onNextLevel, onPlayAgain, onMainMenu }: GameBoardProps) {
  const [userGuesses, setUserGuesses] = useState<Record<string, string>>({});
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [animateCorrect, setAnimateCorrect] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [coins, setCoins] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const playSound = useSound();
  const [powerUpInventory, setPowerUpInventory] = useState<Record<string, number>>({});

  const updateCoins = useCallback(() => {
    const savedCoins = localStorage.getItem('crypto_coins');
    setCoins(parseInt(savedCoins || '200', 10));
  }, []);

  const updatePowerUpInventory = useCallback(() => {
     const inventory = JSON.parse(localStorage.getItem('crypto_powerups') || '{}');
     setPowerUpInventory(inventory);
  }, []);

  useEffect(() => {
    setIsClient(true);
    updateCoins();
    updatePowerUpInventory();
    
    // Listen for storage changes to keep coins in sync across tabs/components
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'crypto_coins') {
            updateCoins();
        }
        if (e.key === 'crypto_powerups') {
            updatePowerUpInventory();
        }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updateCoins, updatePowerUpInventory]);


  const solvedCipher = useMemo(() => invertCipher(puzzle.cipher), [puzzle.cipher]);
  const letterToNumberMap = useMemo(() => getCipherLetterToNumberMap(puzzle.text), [puzzle.text]);
  const puzzleEncryptedLetters = useMemo(() => Object.keys(letterToNumberMap).filter(l => puzzle.text.includes(l)), [letterToNumberMap, puzzle.text]);

  const resetGame = useCallback((isInitialLoad = false) => {
    setUserGuesses({});
    setSelectedLetter(null);
    setIsComplete(false);
    if (isInitialLoad) {
      setStartTime(Date.now());
    }
    
    const shuffledLetters = [...puzzleEncryptedLetters].sort(() => 0.5 - Math.random());
    
    let numberOfHints = 0;
    if (!isDailyChallenge) {
        switch(puzzle.difficulty) {
            case 'easy':
                numberOfHints = 4;
                break;
            case 'medium':
                numberOfHints = 3;
                break;
            case 'hard':
                numberOfHints = 2;
                break;
        }
    }
    
    const newGuesses: Record<string, string> = {};
    const hintsToApply = Math.min(numberOfHints, shuffledLetters.length);
    
    for(let i = 0; i < hintsToApply; i++) {
      const encryptedLetter = shuffledLetters[i];
      const decryptedLetter = solvedCipher[encryptedLetter];
      if (decryptedLetter) {
        newGuesses[encryptedLetter] = decryptedLetter;
      }
    }
    setUserGuesses(newGuesses);
    if (!isInitialLoad) {
        playSound('swoosh');
    }
  }, [puzzleEncryptedLetters, solvedCipher, isDailyChallenge, playSound, puzzle.difficulty]);

  useEffect(() => {
    resetGame(true);
    setShowWinDialog(false);
  }, [puzzle.id, resetGame]);

  const handleGameCompletion = useCallback(() => {
    if (isComplete || !startTime) return;

    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;

    let totalReward = 0;
    if (onGameComplete) {
      totalReward = onGameComplete(durationInSeconds);
    }
    
    setCoins(prevCoins => prevCoins + totalReward);
    setCoinsEarned(totalReward);
    setIsComplete(true);
    setShowWinDialog(true);
    playSound('victory');
    
  }, [isComplete, onGameComplete, startTime, playSound]);

  const checkSolution = useCallback(() => {
    const solved = puzzleEncryptedLetters.every(char => userGuesses[char] === solvedCipher[char]);
    if (solved) {
      handleGameCompletion();
    }
  }, [userGuesses, solvedCipher, puzzleEncryptedLetters, handleGameCompletion]);

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
      playSound('correct');
    } else {
      playSound('error');
    }

    setSelectedLetter(null);
  };
  
  const handleUsePowerUp = (powerUpId: string) => {
     const inventory = JSON.parse(localStorage.getItem('crypto_powerups') || '{}');
     if (!inventory[powerUpId] || inventory[powerUpId] <= 0) return;

     let success = false;
     let toastTitle = '';
     let toastDescription = '';

     if (powerUpId === 'reveal_letter' || powerUpId === 'auto_fill') {
        const unsolvedLetters = puzzleEncryptedLetters.filter(
          (encrypted) => !userGuesses[encrypted] || userGuesses[encrypted] !== solvedCipher[encrypted]
        );
        if (unsolvedLetters.length > 0) {
            const encrypted = unsolvedLetters[Math.floor(Math.random() * unsolvedLetters.length)];
            const decrypted = solvedCipher[encrypted];
            
            const newGuesses = {...userGuesses};
            for (const key in newGuesses) {
                if (newGuesses[key] === decrypted) delete newGuesses[key];
            }
            newGuesses[encrypted] = decrypted;
            setUserGuesses(newGuesses);
            
            success = true;
            toastTitle = 'Letter Revealed!';
            toastDescription = `The letter '${decrypted}' has been placed.`;
        }
     } else if (powerUpId === 'remove_wrong') {
        const wrongGuesses = Object.entries(userGuesses).filter(([enc, dec]) => solvedCipher[enc] !== dec);
        if (wrongGuesses.length > 0) {
            const newGuesses = { ...userGuesses };
            for (let i = 0; i < Math.min(3, wrongGuesses.length); i++) {
                delete newGuesses[wrongGuesses[i][0]];
            }
            setUserGuesses(newGuesses);
            success = true;
            toastTitle = 'Wrong Guesses Removed!';
            toastDescription = `Up to 3 incorrect guesses cleared.`;
        }
     }
     
     if (success) {
        inventory[powerUpId] -= 1;
        localStorage.setItem('crypto_powerups', JSON.stringify(inventory));
        updatePowerUpInventory();
        playSound('powerup');
        toast({ title: toastTitle, description: toastDescription });
     } else {
        playSound('error');
        toast({ variant: 'destructive', title: 'Cannot Use Power-Up', description: 'No eligible letters to apply this power-up.' });
     }
  }


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
        playSound('powerup');
        toast({
          title: 'Hint Revealed!',
          description: `The number '${letterToNumberMap[encrypted]}' is the letter '${decrypted}'.`,
        });
      } catch (error) {
        console.error("Hint error:", error);
        playSound('error');
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
    </div>
  );


  const usedLetters = Object.values(userGuesses);

  return (
    <>
      <PageHeader
        title={isDailyChallenge ? 'Daily Puzzle' : `Level ${level}`}
        actions={renderHeaderActions()}
        coins={coins}
        isClient={isClient}
      />
      <main className="flex flex-1 flex-col items-center justify-between p-4 md:p-6">
        <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start pt-4">
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

        <div className="w-full max-w-2xl mx-auto space-y-4">
            <PowerUpBar
                inventory={powerUpInventory}
                onUsePowerUp={handleUsePowerUp}
                disabled={isComplete}
            />

            <div className="w-full max-w-sm mx-auto p-2 pb-4 rounded-lg">
               <div className="grid grid-cols-7 gap-1.5 justify-items-center">
                {ALPHABET.map((letter) => (
                  <Button
                    key={letter}
                    variant={usedLetters.includes(letter) ? 'outline' : 'default'}
                    size="sm"
                    className="h-10 w-full p-0 text-sm font-bold"
                    onClick={() => handleKeyboardInput(letter)}
                    disabled={!selectedLetter || (usedLetters.includes(letter) && userGuesses[selectedLetter] !== letter) || isComplete}
                  >
                    {letter}
                  </Button>
                ))}
              </div>
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
                  {isDailyChallenge ? 'Challenge Complete!' : 'Level Complete!'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-4 text-card-foreground dark:text-card-foreground">
                    {coinsEarned > 0 && (
                      <div className="flex items-center justify-center gap-2 text-lg font-semibold text-yellow-500">
                        <Coins className="h-6 w-6" />
                        <span>+{coinsEarned} Coins Earned!</span>
                      </div>
                    )}
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
                {!isDailyChallenge && (
                  <Button 
                    onClick={() => { if(onNextLevel) onNextLevel(); }}
                    disabled={level && level >= 50}
                  >
                    Next Level
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
