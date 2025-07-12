'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating hints for a substitution cipher puzzle.
 *
 * It takes an encrypted letter and the solved substitution cipher as input, and outputs the decrypted letter.
 *
 * @interface GeneratePuzzleHintInput - The input type for the generatePuzzleHint function.
 * @interface GeneratePuzzleHintOutput - The output type for the generatePuzzleHint function.
 * @function generatePuzzleHint - The function that calls the generatePuzzleHintFlow with the input and returns the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePuzzleHintInputSchema = z.object({
  encryptedLetter: z.string().describe('The single encrypted letter to get a hint for.'),
  solvedCipher: z.record(z.string(), z.string()).describe('The solved substitution cipher as a JSON object. Keys are encrypted letters, values are decrypted letters.'),
});

export type GeneratePuzzleHintInput = z.infer<typeof GeneratePuzzleHintInputSchema>;

const GeneratePuzzleHintOutputSchema = z.object({
  decryptedLetter: z.string().describe('The decrypted letter corresponding to the encrypted letter.'),
});

export type GeneratePuzzleHintOutput = z.infer<typeof GeneratePuzzleHintOutputSchema>;

export async function generatePuzzleHint(input: GeneratePuzzleHintInput): Promise<GeneratePuzzleHintOutput> {
  return generatePuzzleHintFlow(input);
}

const generatePuzzleHintFlow = ai.defineFlow(
  {
    name: 'generatePuzzleHintFlow',
    inputSchema: GeneratePuzzleHintInputSchema,
    outputSchema: GeneratePuzzleHintOutputSchema,
  },
  async input => {
    // For this simple task, we can just look up the answer.
    // An LLM is not needed for this and adds unnecessary complexity and potential for errors.
    const decryptedLetter = input.solvedCipher[input.encryptedLetter];
    if (decryptedLetter) {
        return { decryptedLetter };
    }

    // This should ideally not be reached if the input is always valid.
    throw new Error(`Could not find a decrypted letter for encrypted letter: ${input.encryptedLetter}`);
  }
);
