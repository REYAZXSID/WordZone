'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating hints for a substitution cipher puzzle.
 *
 * It takes the encrypted puzzle text and the solved substitution cipher as input, and outputs a hint revealing one correct letter.
 * The hint is formatted as the encrypted letter and its corresponding decrypted letter.
 *
 * @interface GeneratePuzzleHintInput - The input type for the generatePuzzleHint function.
 * @interface GeneratePuzzleHintOutput - The output type for the generatePuzzleHint function.
 * @function generatePuzzleHint - The function that calls the generatePuzzleHintFlow with the input and returns the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePuzzleHintInputSchema = z.object({
  encryptedPuzzle: z.string().describe('The encrypted puzzle text.'),
  solvedCipher: z.record(z.string(), z.string()).describe('The solved substitution cipher as a JSON object. Keys are encrypted letters, values are decrypted letters.'),
});

export type GeneratePuzzleHintInput = z.infer<typeof GeneratePuzzleHintInputSchema>;

const GeneratePuzzleHintOutputSchema = z.object({
  hint: z.string().describe('A hint revealing one correct letter in the substitution cipher, formatted as \'EncryptedLetter: DecryptedLetter\'.'),
});

export type GeneratePuzzleHintOutput = z.infer<typeof GeneratePuzzleHintOutputSchema>;

export async function generatePuzzleHint(input: GeneratePuzzleHintInput): Promise<GeneratePuzzleHintOutput> {
  return generatePuzzleHintFlow(input);
}

const generatePuzzleHintPrompt = ai.definePrompt({
  name: 'generatePuzzleHintPrompt',
  input: {schema: GeneratePuzzleHintInputSchema},
  output: {schema: GeneratePuzzleHintOutputSchema},
  prompt: `You are a puzzle master helping users solve substitution cipher puzzles.

  Given the encrypted puzzle and the solved cipher, provide a hint that reveals one correct letter.
  The hint should be formatted as "EncryptedLetter: DecryptedLetter".

  Encrypted Puzzle: {{{encryptedPuzzle}}}
  Solved Cipher: {{JSON.stringify solvedCipher}}

  HINT:
  `,
});

const generatePuzzleHintFlow = ai.defineFlow(
  {
    name: 'generatePuzzleHintFlow',
    inputSchema: GeneratePuzzleHintInputSchema,
    outputSchema: GeneratePuzzleHintOutputSchema,
  },
  async input => {
    const {output} = await generatePuzzleHintPrompt(input);
    return output!;
  }
);
