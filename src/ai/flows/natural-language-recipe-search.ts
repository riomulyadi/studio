'use server';
/**
 * @fileOverview A Genkit flow for parsing natural language recipe search queries into structured criteria.
 *
 * - searchRecipesByNaturalLanguage - A function that handles the natural language recipe search process.
 * - NaturalLanguageRecipeSearchInput - The input type for the searchRecipesByNaturalLanguage function.
 * - NaturalLanguageRecipeSearchOutput - The return type for the searchRecipesByNaturalLanguage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NaturalLanguageRecipeSearchInputSchema = z
  .string()
  .describe('The natural language query for recipe search.');
export type NaturalLanguageRecipeSearchInput = z.infer<typeof NaturalLanguageRecipeSearchInputSchema>;

const NaturalLanguageRecipeSearchOutputSchema = z.object({
  keywords: z.array(z.string()).optional().describe('Keywords extracted from the query, e.g., "chicken", "pasta", "quick".'),
  cuisine: z.array(z.string()).optional().describe('Cuisine types, e.g., "Italian", "Mexican", "Thai".'),
  mealType: z.array(z.string()).optional().describe('Meal types, e.g., "breakfast", "lunch", "dinner", "dessert", "snack".'),
  dietaryRestrictions: z.array(z.string()).optional().describe('Dietary restrictions or preferences, e.g., "vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free".'),
  prepTimeMinutes: z.object({
    min: z.number().optional().describe('Minimum preparation time in minutes.'),
    max: z.number().optional().describe('Maximum preparation time in minutes.'),
  }).optional().describe('Range for preparation time in minutes.'),
  cookTimeMinutes: z.object({
    min: z.number().optional().describe('Minimum cooking time in minutes.'),
    max: z.number().optional().describe('Maximum cooking time in minutes.'),
  }).optional().describe('Range for cooking time in minutes.'),
  totalTimeMinutes: z.object({
    min: z.number().optional().describe('Minimum total time (prep + cook) in minutes.'),
    max: z.number().optional().describe('Maximum total time (prep + cook) in minutes.'),
  }).optional().describe('Range for total time (prep + cook) in minutes.'),
  ingredientsToInclude: z.array(z.string()).optional().describe('Specific ingredients that must be included, e.g., "chicken breast", "broccoli".'),
  ingredientsToExclude: z.array(z.string()).optional().describe('Specific ingredients that must be excluded, e.g., "nuts", "shellfish".'),
  spiceLevel: z.enum(['mild', 'medium', 'hot', 'any']).optional().describe('Desired spice level.'),
  dishType: z.array(z.string()).optional().describe('Specific types of dishes, e.g., "soup", "salad", "stew", "bake".'),
  servings: z.object({
    min: z.number().optional().describe('Minimum number of servings.'),
    max: z.number().optional().describe('Maximum number of servings.'),
  }).optional().describe('Range for number of servings.'),
}).describe('Structured recipe search criteria extracted from a natural language query.');
export type NaturalLanguageRecipeSearchOutput = z.infer<typeof NaturalLanguageRecipeSearchOutputSchema>;

export async function searchRecipesByNaturalLanguage(input: NaturalLanguageRecipeSearchInput): Promise<NaturalLanguageRecipeSearchOutput> {
  return naturalLanguageRecipeSearchFlow(input);
}

const naturalLanguageRecipeSearchPrompt = ai.definePrompt({
  name: 'naturalLanguageRecipeSearchPrompt',
  input: { schema: NaturalLanguageRecipeSearchInputSchema },
  output: { schema: NaturalLanguageRecipeSearchOutputSchema },
  prompt: `You are an expert recipe search assistant. Your task is to parse a natural language recipe search query and extract structured search criteria in JSON format.

Here are the fields you should consider and how to populate them:
- `keywords`: General keywords or themes. Example: "quick", "healthy", "comfort food".
- `cuisine`: Specific cuisine types. Example: "Italian", "Mexican", "Thai".
- `mealType`: Meal categories. Example: "breakfast", "lunch", "dinner", "dessert", "snack".
- `dietaryRestrictions`: Dietary needs or preferences. Example: "vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free".
- `prepTimeMinutes`: An object with `min` and/or `max` representing the range for preparation time in minutes.
- `cookTimeMinutes`: An object with `min` and/or `max` representing the range for cooking time in minutes.
- `totalTimeMinutes`: An object with `min` and/or `max` representing the range for total time (prep + cook) in minutes.
- `ingredientsToInclude`: A list of ingredients that must be present in the recipe. Example: "chicken breast", "broccoli".
- `ingredientsToExclude`: A list of ingredients that must NOT be present in the recipe. Example: "peanuts", "shrimp".
- `spiceLevel`: The desired spice level, can be 'mild', 'medium', 'hot', or 'any'. Default to 'any' if not specified.
- `dishType`: Specific types of dishes. Example: "soup", "salad", "casserole", "stir-fry".
- `servings`: An object with `min` and/or `max` representing the range for the number of servings.

If a piece of information is not explicitly mentioned or clearly implied, you should omit that field from the JSON output. Always aim for precise extraction. Do not hallucinate or make assumptions beyond what is stated in the query.

Query: "{{{input}}}"
`,
});

const naturalLanguageRecipeSearchFlow = ai.defineFlow(
  {
    name: 'naturalLanguageRecipeSearchFlow',
    inputSchema: NaturalLanguageRecipeSearchInputSchema,
    outputSchema: NaturalLanguageRecipeSearchOutputSchema,
  },
  async (input) => {
    const { output } = await naturalLanguageRecipeSearchPrompt(input);
    return output!;
  },
);
