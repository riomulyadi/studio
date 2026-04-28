'use server';
/**
 * @fileOverview An AI agent that suggests creative recipe ideas based on available ingredients.
 *
 * - generateRecipeIdeas - A function that handles the recipe idea generation process.
 * - RecipeIdeaGeneratorInput - The input type for the generateRecipeIdeas function.
 * - RecipeIdeaGeneratorOutput - The return type for the generateRecipeIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecipeIdeaGeneratorInputSchema = z.object({
  ingredients: z
    .array(z.string())
    .describe('A comma-separated list of ingredients currently available in the pantry.'),
});
export type RecipeIdeaGeneratorInput = z.infer<typeof RecipeIdeaGeneratorInputSchema>;

const RecipeIdeaGeneratorOutputSchema = z.object({
  recipes: z
    .array(
      z.object({
        name: z.string().describe('The name of the recipe.'),
        description: z
          .string()
          .describe('A brief and appealing description of the recipe.'),
        suggestedIngredients: z
          .array(z.string())
          .describe(
            'A list of key ingredients required for the recipe. These should primarily come from the provided input ingredients, but you can add one or two common pantry staples (e.g., salt, oil) if necessary, keeping it minimal and realistic.'
          ),
      })
    )
    .describe('A list of creative recipe ideas based on the provided ingredients.'),
});
export type RecipeIdeaGeneratorOutput = z.infer<typeof RecipeIdeaGeneratorOutputSchema>;

export async function generateRecipeIdeas(
  input: RecipeIdeaGeneratorInput
): Promise<RecipeIdeaGeneratorOutput> {
  return recipeIdeaGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recipeIdeaGeneratorPrompt',
  input: { schema: RecipeIdeaGeneratorInputSchema },
  output: { schema: RecipeIdeaGeneratorOutputSchema },
  prompt: `You are a highly creative and experienced chef, specializing in crafting delicious and innovative recipes using limited ingredients.

Your task is to suggest 3-5 unique recipe ideas based on the following list of available ingredients:

Ingredients: {{{ingredients}}}

For each recipe, provide:
1. A creative and appealing name.
2. A brief, enticing description.
3. A list of key ingredients needed from the provided list, plus any absolute essential common pantry staples (like salt, pepper, oil) if crucial, but prioritize using only the given ingredients.

Ensure the suggestions are practical and inspiring.`,
});

const recipeIdeaGeneratorFlow = ai.defineFlow(
  {
    name: 'recipeIdeaGeneratorFlow',
    inputSchema: RecipeIdeaGeneratorInputSchema,
    outputSchema: RecipeIdeaGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
