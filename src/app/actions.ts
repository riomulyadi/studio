// @ts-nocheck
'use server';

import {
  aiIngredientSwap,
  AiIngredientSwapInput,
} from '@/ai/flows/ai-ingredient-swap';

export async function getIngredientSwaps(input: AiIngredientSwapInput) {
  try {
    const result = await aiIngredientSwap(input);
    if (!result || !result.substitutions) {
        return { success: false, error: 'AI could not generate suggestions for this request.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      error: `Failed to get suggestions. ${errorMessage}`,
    };
  }
}
