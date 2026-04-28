'use server';
/**
 * @fileOverview An AI agent for suggesting ingredient substitutions or variations for recipes.
 *
 * - aiIngredientSwap - A function that handles the ingredient substitution process.
 * - AiIngredientSwapInput - The input type for the aiIngredientSwap function.
 * - AiIngredientSwapOutput - The return type for the aiIngredientSwap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiIngredientSwapInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  ingredients: z
    .array(z.string())
    .describe('A list of ingredients for the recipe.'),
  instructions: z
    .array(z.string())
    .optional()
    .describe('Optional step-by-step instructions for the recipe.'),
  userRequest: z
    .string()
    .describe(
      'The user\'s request for substitutions or variations, e.g., dietary needs, available pantry items, or preferences.'
    ),
});
export type AiIngredientSwapInput = z.infer<typeof AiIngredientSwapInputSchema>;

const AiIngredientSwapOutputSchema = z.object({
  substitutions: z
    .array(
      z.object({
        originalIngredient: z.string().describe('The original ingredient.'),
        suggestedSubstitute: z.string().describe('The suggested substitute.'),
        reason: z
          .string()
          .describe('The reason for the substitution (e.g., dietary, availability).'),
      })
    )
    .describe('A list of suggested ingredient substitutions.'),
  notes: z
    .string()
    .optional()
    .describe('Any additional notes or tips for the modified recipe.'),
});
export type AiIngredientSwapOutput = z.infer<typeof AiIngredientSwapOutputSchema>;

export async function aiIngredientSwap(
  input: AiIngredientSwapInput
): Promise<AiIngredientSwapOutput> {
  return aiIngredientSwapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiIngredientSwapPrompt',
  input: {schema: AiIngredientSwapInputSchema},
  output: {schema: AiIngredientSwapOutputSchema},
  prompt: `You are an expert culinary assistant specializing in ingredient substitutions and recipe variations.
Your task is to suggest ingredient substitutions or variations for a given recipe based on the user's specific needs or preferences.

Here is the recipe information:
Recipe Name: {{{recipeName}}}
Ingredients:
{{#each ingredients}}- {{{this}}}
{{/each}}

{{#if instructions}}
Instructions:
{{#each instructions}}- {{{this}}}
{{/each}}
{{/if}}

User's Request: {{{userRequest}}}

Based on the recipe and the user's request, provide a list of substitutions and the reason for each. If no substitutions are needed or possible given the request, return an empty array for substitutions.
Also, provide any general notes or tips for the modified recipe.
`,
});

const aiIngredientSwapFlow = ai.defineFlow(
  {
    name: 'aiIngredientSwapFlow',
    inputSchema: AiIngredientSwapInputSchema,
    outputSchema: AiIngredientSwapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
