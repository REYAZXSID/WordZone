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

const generatePuzzleHintPrompt = ai.definePrompt({
  name: 'generatePuzzleHintPrompt',
  input: {schema: GeneratePuzzleHintInputSchema},
  output: {schema: GeneratePuzzleHintOutputSchema},
  prompt: `You are a puzzle master helping users solve substitution cipher puzzles.

  Given an encrypted letter and the solved cipher, provide the decrypted letter.
  
  Encrypted Letter: {{{encryptedLetter}}}
  Solved Cipher: {{JSON.stringify solvedCipher}}

  Provide only the decrypted letter as the output.
  `,
});

const generatePuzzleHintFlow = ai.defineFlow(
  {
    name: 'generatePuzzleHintFlow',
    inputSchema: GeneratePuzzleHintInputSchema,
    outputSchema: GeneratePuzzleHintOutputSchema,
  },
  async input => {
    // For this simple task, we can just look up the answer.
    // An LLM would be useful for more complex hints, like "This letter often appears at the end of words."
    const decryptedLetter = input.solvedCipher[input.encryptedLetter];
    if (decryptedLetter) {
        return { decryptedLetter };
    }

    // Fallback to LLM if lookup fails for some reason
    const {output} = await generatePuzzleHintPrompt(input);
    return output!;
  }
);
