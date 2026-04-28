"use client";

import { useMemo } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { RecipeCard } from '@/components/RecipeCard';
import type { Recipe, RecipeWithImage } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from './ui/button';

interface MyRecipesPageClientProps {
  allRecipes: Recipe[];
  allImages: ImagePlaceholder[];
}

export function MyRecipesPageClient({ allRecipes, allImages }: MyRecipesPageClientProps) {
  const { favorites } = useFavorites();
  
  const favoriteRecipes: RecipeWithImage[] = useMemo(() => {
    return allRecipes
      .filter(recipe => favorites.includes(recipe.slug))
      .map(recipe => ({
        ...recipe,
        image: allImages.find(img => img.id === recipe.imageId),
      }));
  }, [allRecipes, allImages, favorites]);

  if (favoriteRecipes.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <p className="text-xl text-muted-foreground mb-4">Your recipe box is empty.</p>
        <p className="mb-6">Start exploring and save your favorites!</p>
        <Button asChild>
          <Link href="/">Browse Recipes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {favoriteRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
