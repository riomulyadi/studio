"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeFilters } from '@/components/RecipeFilters';
import type { Recipe, RecipeWithImage } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Search } from 'lucide-react';

interface HomePageClientProps {
  allRecipes: Recipe[];
  allImages: ImagePlaceholder[];
}

export function HomePageClient({ allRecipes, allImages }: HomePageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ cuisine: 'all', mealType: 'all' });

  const recipesWithImages: RecipeWithImage[] = useMemo(() => {
    return allRecipes.map(recipe => ({
      ...recipe,
      image: allImages.find(img => img.id === recipe.imageId),
    }));
  }, [allRecipes, allImages]);
  
  const filteredRecipes = useMemo(() => {
    return recipesWithImages.filter(recipe => {
      const searchMatch = searchTerm.trim() === '' ||
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const cuisineMatch = filters.cuisine === 'all' || recipe.cuisine === filters.cuisine;
      const mealTypeMatch = filters.mealType === 'all' || recipe.mealType === filters.mealType;

      return searchMatch && cuisineMatch && mealTypeMatch;
    });
  }, [recipesWithImages, searchTerm, filters]);

  return (
    <>
      <section className="text-center py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
            Find Your Next Favorite Meal
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            Explore a world of flavors with our curated collection of delicious recipes from around the globe.
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by recipe, ingredient..."
              className="w-full text-lg pl-12 h-14 rounded-full shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        <RecipeFilters onFilterChange={setFilters} />
        
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No recipes found. Try adjusting your search or filters!</p>
          </div>
        )}
      </main>
    </>
  );
}
