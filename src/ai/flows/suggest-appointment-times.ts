'use server';
/**
 * @fileOverview Provides appointment time suggestions based on barber availability and appointment popularity.
 *
 * - suggestAppointmentTimes - A function that suggests available appointment times.
 * - SuggestAppointmentTimesInput - The input type for the suggestAppointmentTimes function.
 * - SuggestAppointmentTimesOutput - The return type for the suggestAppointmentTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAppointmentTimesInputSchema = z.object({
  barberId: z.string().describe('The ID of the barber.'),
  serviceType: z.string().describe('The type of service requested (e.g., haircut, shave).'),
  preferredDay: z.string().describe('The preferred day for the appointment (YYYY-MM-DD).'),
});
export type SuggestAppointmentTimesInput = z.infer<typeof SuggestAppointmentTimesInputSchema>;

const SuggestAppointmentTimesOutputSchema = z.object({
  suggestedTimes: z.array(
    z.object({
      time: z.string().describe('Suggested appointment time (HH:mm).'),
      popularityScore:
        z.number()
          .describe('A score indicating the popularity of this time slot.'),
    })
  ).describe('An array of suggested appointment times.'),
});
export type SuggestAppointmentTimesOutput = z.infer<typeof SuggestAppointmentTimesOutputSchema>;

export async function suggestAppointmentTimes(input: SuggestAppointmentTimesInput): Promise<SuggestAppointmentTimesOutput> {
  return suggestAppointmentTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAppointmentTimesPrompt',
  input: {schema: SuggestAppointmentTimesInputSchema},
  output: {schema: SuggestAppointmentTimesOutputSchema},
  prompt: `You are an AI assistant helping to suggest appointment times for Torelli e Anchar Barbershop.\n\n  Given the following information, suggest 3 available appointment times for the customer.\n  Consider barber availability and the popularity of time slots.\n\n  Barber ID: {{{barberId}}}\n  Service Type: {{{serviceType}}}\n  Preferred Day: {{{preferredDay}}}\n\n  Format the output as a JSON array of objects with 'time' and 'popularityScore' fields. The popularity score should be on a scale of 0 to 1, with 1 being the most popular.\n  `, safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_ONLY_HIGH',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_LOW_AND_ABOVE',
    },
  ],
});

const suggestAppointmentTimesFlow = ai.defineFlow(
  {
    name: 'suggestAppointmentTimesFlow',
    inputSchema: SuggestAppointmentTimesInputSchema,
    outputSchema: SuggestAppointmentTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
