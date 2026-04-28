import type { ImagePlaceholder } from './placeholder-images';

export type Ingredient = {
  name: string;
  quantity: string;
};

export type Recipe = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cuisine: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack';
  dietaryRestrictions: ('Vegetarian' | 'Vegan' | 'Gluten-Free')[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  imageId: string; // from placeholder-images.json
  nutritionalInfo: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
};

export type RecipeWithImage = Recipe & {
  image: ImagePlaceholder | undefined;
}
