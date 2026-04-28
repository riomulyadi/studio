"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';

export function FavoriteButton({ slug }: { slug: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [favorited, setFavorited] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFavorited(isFavorite(slug));
  }, [isFavorite, slug]);
  
  const handleFavoriteClick = () => {
    toggleFavorite(slug);
    const newFavoritedState = !favorited;
    setFavorited(newFavoritedState);
    toast({
      title: newFavoritedState ? "Added to favorites!" : "Removed from favorites.",
      description: newFavoritedState ? "You can find it in your recipe box." : "It's no longer in your recipe box.",
    });
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className="rounded-full h-12 w-12 shadow-lg"
      onClick={handleFavoriteClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-6 w-6 transition-colors ${favorited ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
    </Button>
  );
}
