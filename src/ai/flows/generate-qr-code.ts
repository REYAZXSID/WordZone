'use server';
/**
 * @fileOverview A Genkit flow for generating QR codes.
 *
 * It takes a URL string as input and outputs a data URI for the generated QR code image.
 *
 * @interface GenerateQrCodeInput - The input type for the generateQrCode function.
 * @interface GenerateQrCodeOutput - The output type for the generateQrCode function.
 * @function generateQrCode - The function that calls the generateQrCodeFlow with the input and returns the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import QRCode from 'qrcode';

const GenerateQrCodeInputSchema = z.string().describe('The URL to encode into the QR code.');
export type GenerateQrCodeInput = z.infer<typeof GenerateQrCodeInputSchema>;

const GenerateQrCodeOutputSchema = z.string().describe('The generated QR code as a data URI.');
export type GenerateQrCodeOutput = z.infer<typeof GenerateQrCodeOutputSchema>;


export async function generateQrCode(input: GenerateQrCodeInput): Promise<GenerateQrCodeOutput> {
  return generateQrCodeFlow(input);
}


const generateQrCodeFlow = ai.defineFlow(
  {
    name: 'generateQrCodeFlow',
    inputSchema: GenerateQrCodeInputSchema,
    outputSchema: GenerateQrCodeOutputSchema,
  },
  async (url) => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
        return qrCodeDataUrl;
    } catch (err) {
        console.error('QR code generation failed:', err);
        throw new Error('Failed to generate QR code.');
    }
  }
);
