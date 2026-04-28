import { getRecipes } from '@/lib/data';
import { HomePageClient } from '@/components/HomePageClient';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const recipes = getRecipes();
  const images = PlaceHolderImages;

  return <HomePageClient allRecipes={recipes} allImages={images} />;
}
