
'use client';

import type { Puzzle } from '@/lib/puzzles';
import { invertCipher, getCipherLetterToNumberMap } from '@/lib/puzzles';
import { generatePuzzleHint } from '@/ai/flows/generate-puzzle-hint';
import React, { useState, useTransition, useEffect, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Lightbulb, PartyPopper, ArrowRight, Home, RefreshCw, Coins, ShoppingCart, Settings, Heart, Frown } from 'lucide-react';
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
import { useSound } from '@/hooks/use-sound';
import { PowerUpBar } from './power-up-bar';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';
import { useUserData } from '@/hooks/use-user-data';


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
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const { toast } = useToast();
  const [isComplete, setIsComplete] = useState(false);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [animateCorrect, setAnimateCorrect] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const playSound = useSound();
  const { userData, isClient } = useUserData();
  const [powerUpInventory, setPowerUpInventory] = useState<Record<string, number>>({});
  const [lives, setLives] = useState(3);
  const [errorLetter, setErrorLetter] = useState<string | null>(null);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  const updatePowerUpInventory = useCallback(() => {
     const inventory = JSON.parse(localStorage.getItem('crypto_powerups') || '{}');
     setPowerUpInventory(inventory);
  }, []);

  useEffect(() => {
    updatePowerUpInventory();
    
    // Listen for storage changes to keep power-ups in sync
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'crypto_powerups') {
            updatePowerUpInventory();
        }
    }
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [updatePowerUpInventory]);


  const solvedCipher = useMemo(() => invertCipher(puzzle.cipher), [puzzle.cipher]);
  const letterToNumberMap = useMemo(() => getCipherLetterToNumberMap(puzzle.text), [puzzle.text]);
  const puzzleEncryptedLetters = useMemo(() => Object.keys(letterToNumberMap).filter(l => puzzle.text.includes(l)), [letterToNumberMap, puzzle.text]);

  const resetGame = useCallback((isInitialLoad = false) => {
    setUserGuesses({});
    setHistory([]);
    setSelectedLetter(null);
    setIsComplete(false);
    setLives(3);
    setShowGameOverDialog(false);

    if (isInitialLoad) {
      setStartTime(Date.now());
    }
    
    const shuffledLetters = [...puzzleEncryptedLetters].sort(() => 0.5 - Math.random());
    
    let numberOfHints = 0;
    if (!isDailyChallenge) {
        switch(puzzle.difficulty) {
            case 'easy':
                numberOfHints = 5;
                break;
            case 'medium':
                numberOfHints = 4;
                break;
            case 'hard':
                numberOfHints = 3;
                break;
            case 'intermediate':
                numberOfHints = 2;
                break;
            case 'advance':
                numberOfHints = 1;
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
    setHistory([newGuesses]);
    if (!isInitialLoad) {
        playSound('swoosh');
    }
  }, [puzzleEncryptedLetters, solvedCipher, isDailyChallenge, playSound, puzzle.difficulty]);

  useEffect(() => {
    resetGame(true);
    setShowWinDialog(false);
  }, [puzzle.id, resetGame]);

  useEffect(() => {
      if (lives <= 0 && !isComplete) {
          setShowGameOverDialog(true);
      }
  }, [lives, isComplete]);

  const handleGameCompletion = useCallback(() => {
    if (isComplete || !startTime) return;

    const endTime = Date.now();
    const durationInSeconds = (endTime - startTime) / 1000;

    let totalReward = 0;
    if (onGameComplete) {
      totalReward = onGameComplete(durationInSeconds);
    }
    
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
    if (isComplete || showGameOverDialog) return;
    setSelectedLetter(letter);
  };
  
  const updateGuesses = (newGuesses: Record<string, string>) => {
      setUserGuesses(newGuesses);
      setHistory(prev => [...prev, newGuesses]);
  }

  const handleKeyboardInput = (guess: string) => {
    if (!selectedLetter || isComplete || showGameOverDialog) return;
    
    const isCorrectGuess = solvedCipher[selectedLetter] === guess;

    if (isCorrectGuess) {
      const newGuesses = {...userGuesses};
      for (const key in newGuesses) {
          if (newGuesses[key] === guess) {
              delete newGuesses[key];
          }
      }
      newGuesses[selectedLetter] = guess;
      updateGuesses(newGuesses);
      setAnimateCorrect(selectedLetter);
      setTimeout(() => setAnimateCorrect(null), 500);
      playSound('correct');
    } else {
      setLives(prev => Math.max(0, prev - 1));
      setErrorLetter(selectedLetter);
      setTimeout(() => setErrorLetter(null), 500);
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
     let newGuesses = { ...userGuesses };

     if (powerUpId === 'reveal_letter' || powerUpId === 'auto_fill') {
        const unsolvedLetters = puzzleEncryptedLetters.filter(
          (encrypted) => userGuesses[encrypted] !== solvedCipher[encrypted]
        );
        if (unsolvedLetters.length > 0) {
            const encrypted = unsolvedLetters[Math.floor(Math.random() * unsolvedLetters.length)];
            const decrypted = solvedCipher[encrypted];
            
            for (const key in newGuesses) {
                if (newGuesses[key] === decrypted) delete newGuesses[key];
            }
            newGuesses[encrypted] = decrypted;
            updateGuesses(newGuesses);
            
            success = true;
            toastTitle = 'Letter Revealed!';
            toastDescription = `The letter '${decrypted}' has been placed.`;
        }
     } else if (powerUpId === 'remove_wrong') {
        const wrongGuesses = Object.entries(userGuesses).filter(([enc, dec]) => solvedCipher[enc] !== dec);
        if (wrongGuesses.length > 0) {
            const toRemove = wrongGuesses.slice(0, 3);
            toRemove.forEach(([enc]) => {
                delete newGuesses[enc];
            });
            updateGuesses(newGuesses);
            success = true;
            toastTitle = 'Wrong Guesses Removed!';
            toastDescription = `Up to 3 incorrect guesses cleared.`;
        }
     } else if (powerUpId === 'show_word') {
        const unsolvedWords = puzzle.text.split(' ').filter(word => {
            return word.split('').some(char => ALPHABET.includes(char) && userGuesses[char] !== solvedCipher[char]);
        });
        if (unsolvedWords.length > 0) {
            const wordToShow = unsolvedWords[Math.floor(Math.random() * unsolvedWords.length)];
            wordToShow.split('').forEach(char => {
                if (ALPHABET.includes(char)) {
                    newGuesses[char] = solvedCipher[char];
                }
            });
            updateGuesses(newGuesses);
            success = true;
            toastTitle = 'Word Revealed!';
            toastDescription = `A word has been filled in for you.`;
        }
     } else if (powerUpId === 'solve_puzzle') {
        const solvedGuesses: Record<string, string> = {};
        puzzleEncryptedLetters.forEach(char => {
            solvedGuesses[char] = solvedCipher[char];
        });
        updateGuesses(solvedGuesses);
        success = true;
        toastTitle = 'Puzzle Solved!';
        toastDescription = 'The puzzle has been completed for you.';
     } else if (powerUpId === 'undo_move') {
        if (history.length > 1) {
            const prevHistory = history.slice(0, -1);
            const lastState = prevHistory[prevHistory.length - 1];
            setHistory(prevHistory);
            setUserGuesses(lastState); // Don't use updateGuesses to avoid adding to history again
            success = true;
            toastTitle = 'Undo Successful';
            toastDescription = 'Your last move has been reverted.';
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
        toast({ variant: 'destructive', title: 'Cannot Use Power-Up', description: 'No eligible letters or actions for this power-up.' });
     }
  }

  const usedLetters = Object.values(userGuesses);

  return (
    <>
      <PageHeader
        title={isDailyChallenge ? 'Daily Puzzle' : `Level ${level}`}
        coins={userData?.coins}
        lives={lives}
        isClient={isClient}
      />
      <main className="flex flex-1 flex-col items-center justify-between p-4 md:p-6">
        <div className="w-full max-w-4xl flex-grow flex flex-col items-center justify-start pt-4">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4">
            {puzzle.text.split(' ').map((word, wordIndex) => (
              <div key={wordIndex} className="flex gap-x-1">
                {word.split('').map((char, charIndex) => {
                  if (ALPHABET.includes(char)) {
                    const isCorrect = userGuesses[char] && solvedCipher[char] === userGuesses[char];
                    return (
                      <div
                        key={`${char}-${wordIndex}-${charIndex}`}
                        onClick={() => handleLetterSelect(char)}
                        className={cn(
                          "flex h-12 w-9 cursor-pointer flex-col items-center justify-between rounded-md bg-card font-mono text-xl transition-all border-2",
                          selectedLetter === char ? "border-primary shadow-lg scale-105" : "border-input",
                          userGuesses[char] && !isCorrect ? "border-destructive" : "",
                          isCorrect ? "bg-green-500/10 border-green-500/50" : "",
                          errorLetter === char ? 'shake-error' : '',
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
                  // Render non-alphabetic characters like punctuation directly
                  return (
                      <div key={`punct-${wordIndex}-${charIndex}`} className="flex h-12 w-5 items-end justify-center pb-1 text-xl font-bold">
                        {char}
                      </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto space-y-4">
            <PowerUpBar
                inventory={powerUpInventory}
                onUsePowerUp={handleUsePowerUp}
                disabled={isComplete || showGameOverDialog}
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
                    disabled={!selectedLetter || (usedLetters.includes(letter) && userGuesses[selectedLetter] !== letter) || isComplete || showGameOverDialog}
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </div>
        </div>
      </main>

      {isClient && (
        <>
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
              <AlertDialogFooter className="flex flex-col gap-2 w-full mt-4">
                  <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => { if(onPlayAgain) { resetGame(); onPlayAgain(); } }}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Play Again
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
                  </div>
                   <Button variant="secondary" onClick={() => { if(onMainMenu) onMainMenu(); }} className="w-full">
                    <Home className="mr-2 h-4 w-4" />
                    Main Menu
                  </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={showGameOverDialog} onOpenChange={setShowGameOverDialog}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader className="items-center text-center space-y-4">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20 animate-pulse">
                        <Frown className="h-12 w-12 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <AlertDialogTitle className="text-3xl font-bold">Game Over</AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                            You've run out of lives. Better luck next time!
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-col gap-2 w-full mt-4">
                    <Button variant="outline" onClick={() => { resetGame(); playSound('swoosh'); }}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Play Again
                    </Button>
                    <Button variant="secondary" onClick={() => { if (onMainMenu) onMainMenu(); }}>
                        <Home className="mr-2 h-4 w-4" />
                        Main Menu
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
      )}
    </>
  );
}
