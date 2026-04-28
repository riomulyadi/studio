import { MyRecipesPageClient } from "@/components/MyRecipesPageClient";
import { getRecipes } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function MyRecipesPage() {
  const recipes = getRecipes();
  const images = PlaceHolderImages;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">My Recipe Box</h1>
      <p className="text-muted-foreground text-lg mb-8">Your collection of saved culinary treasures.</p>
      <MyRecipesPageClient allRecipes={recipes} allImages={images} />
    </div>
  );
}
