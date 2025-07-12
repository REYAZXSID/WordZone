
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Lightbulb, Target, Trash2, FileText, Undo2, Sparkles, Package, ArrowRight, Eye } from 'lucide-react';
import Link from "next/link";
import React from "react";

const powerUps = [
  { id: 'reveal_letter', name: 'Reveal Letter', description: 'Reveals one correct letter.', icon: <Lightbulb className="h-5 w-5 text-yellow-500" /> },
  { id: 'auto_fill', name: 'Auto-Fill Letter', description: 'Fills all instances of one correct letter.', icon: <Target className="h-5 w-5 text-blue-500" /> },
  { id: 'remove_wrong', name: 'Remove Wrong Guesses', description: 'Removes three of your incorrect guesses.', icon: <Trash2 className="h-5 w-5 text-red-500" /> },
  { id: 'show_word', name: 'Show Word Hint', description: 'Reveals one complete word in the puzzle.', icon: <FileText className="h-5 w-5 text-indigo-500" /> },
  { id: 'undo_move', name: 'Undo Last Move', description: 'Reverts your last letter guess.', icon: <Undo2 className="h-5 w-5 text-gray-500" /> },
  { id: 'solve_puzzle', name: 'Solve Puzzle', description: 'Instantly solves the current puzzle.', icon: <Sparkles className="h-5 w-5 text-purple-500" /> },
  { id: 'hint_pack', name: 'Hint Pack', description: 'Bundle: 3 Reveal Letters + 1 Word Hint.', icon: <Package className="h-5 w-5 text-orange-500" /> },
];

export function HowToPlayClientPage() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Brain className="h-6 w-6" />The Basics</CardTitle>
                    <CardDescription>A cryptogram is a puzzle where a quote is encrypted with a simple substitution cipher. Each letter in the quote is replaced by another letter. Your goal is to figure out the original quote.</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm">For example, if the puzzle shows <code className="font-mono bg-muted p-1 rounded-md">"G"</code> is really <code className="font-mono bg-muted p-1 rounded-md">"A"</code>, then every <code className="font-mono bg-muted p-1 rounded-md">"G"</code> in the encrypted text stands for an <code className="font-mono bg-muted p-1 rounded-md">"A"</code> in the original quote.
                     </p>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger>Step-by-Step Instructions</AccordionTrigger>
                    <AccordionContent>
                        <ol className="list-decimal space-y-2 pl-5">
                            <li><strong>Examine the Puzzle:</strong> Look at the encrypted text. Each number corresponds to a unique encrypted letter.</li>
                            <li><strong>Select a Letter:</strong> Click on a letter in the puzzle you want to solve. It will become highlighted.</li>
                            <li><strong>Make a Guess:</strong> Use the on-screen keyboard to choose the letter you think it decrypts to. Your guess will appear below the encrypted letter.</li>
                            <li><strong>Auto-Fill:</strong> When you guess a letter (e.g., that number 12 is "E"), every instance of number 12 will be filled with "E".</li>
                             <li><strong>Correcting Guesses:</strong> If you change your mind, simply select the letter again and choose a new one.</li>
                            <li><strong>Solve!:</strong> Continue this process until the entire quote is revealed. The puzzle will automatically complete when all letters are correct.</li>
                        </ol>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-2">
                    <AccordionTrigger>Pro Tips for Solving</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Eye className="h-5 w-5 mt-1 text-primary shrink-0" />
                            <div>
                                <h4 className="font-semibold">Look for Patterns</h4>
                                <p className="text-sm text-muted-foreground">Repeated letter combinations are your best friends. For example, a three-letter word that appears often is likely "THE" or "AND".</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                           <Eye className="h-5 w-5 mt-1 text-primary shrink-0" />
                            <div>
                                <h4 className="font-semibold">Start with Small Words</h4>
                                <p className="text-sm text-muted-foreground">One-letter words are almost always "A" or "I". Two-letter words are often "OF", "TO", "IN", "IT", or "IS".</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3">
                           <Eye className="h-5 w-5 mt-1 text-primary shrink-0" />
                            <div>
                                <h4 className="font-semibold">Use Letter Frequency</h4>
                                <p className="text-sm text-muted-foreground">The most common letters in English are E, T, A, O, I, N, S, H, and R. If an encrypted letter appears many times, it's likely one of these.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-3">
                    <AccordionTrigger>Power-Up Explanations</AccordionTrigger>
                    <AccordionContent className="space-y-3">
                        {powerUps.map(powerUp => (
                            <div key={powerUp.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                                <div className="flex h-8 w-8 items-center justify-center shrink-0">
                                    {powerUp.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{powerUp.name}</p>
                                    <p className="text-xs text-muted-foreground">{powerUp.description}</p>
                                </div>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <Card>
                <CardHeader>
                    <CardTitle>Example Puzzle</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">Encrypted Text:</p>
                    <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-muted">
                        <div className="flex flex-col items-center w-8"><span className="text-xs">1</span><span>Q</span></div>
                        <div className="flex flex-col items-center w-8"><span className="text-xs">2</span><span>W</span></div>
                        <div className="w-4"></div>
                        <div className="flex flex-col items-center w-8"><span className="text-xs">3</span><span>E</span></div>
                        <div className="flex flex-col items-center w-8"><span className="text-xs">4</span><span>R</span></div>
                    </div>
                     <p className="text-sm text-muted-foreground mt-4 mb-2">Solution:</p>
                     <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-green-500/10">
                        <div className="flex flex-col items-center w-8"><span className="text-xs">1</span><span>G</span></div>
                        <div className="flex flex-col items-center w-8"><span className="text-xs">2</span><span>O</span></div>
                        <div className="w-4"></div>
                        <div className="flex flex-col items-center w-8"><span className="text-xs">3</span><span>T</span></div>
                        <div className="flex flex-col items-center w-8"><span className="text-xs">4</span><span>O</span></div>
                    </div>
                </CardContent>
            </Card>

            <Button asChild size="lg" className="w-full">
                <Link href="/game?difficulty=easy&level=1">
                    Try a Practice Puzzle
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </div>
    )
}
