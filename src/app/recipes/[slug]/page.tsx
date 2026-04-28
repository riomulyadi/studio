import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getRecipeBySlug } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Soup, WheatOff, Vegan, Leaf } from 'lucide-react';
import { IngredientSwap } from '@/components/IngredientSwap';
import { FavoriteButton } from '@/components/FavoriteButton';

export default function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = getRecipeBySlug(params.slug);

  if (!recipe) {
    notFound();
  }

  const image = PlaceHolderImages.find((img) => img.id === recipe.imageId);
  const totalTime = recipe.prepTime + recipe.cookTime;

  const dietIcons = {
    'Vegetarian': <Leaf className="inline-block mr-1 h-4 w-4" />,
    'Vegan': <Vegan className="inline-block mr-1 h-4 w-4" />,
    'Gluten-Free': <WheatOff className="inline-block mr-1 h-4 w-4" />,
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-1/2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
            {image && (
              <Image
                src={image.imageUrl}
                alt={recipe.title}
                data-ai-hint={image.imageHint}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute top-4 right-4">
              <FavoriteButton slug={recipe.slug} />
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{recipe.cuisine}</Badge>
            <Badge variant="secondary">{recipe.mealType}</Badge>
            {recipe.dietaryRestrictions.map(diet => (
              <Badge key={diet} variant="outline" className="flex items-center">
                 {dietIcons[diet]}
                 {diet}
              </Badge>
            ))}
          </div>

          <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">{recipe.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{recipe.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center mb-8 p-4 bg-secondary/50 rounded-lg">
            <div>
              <Clock className="mx-auto h-6 w-6 text-primary mb-1" />
              <p className="font-bold">Prep Time</p>
              <p className="text-muted-foreground">{recipe.prepTime} min</p>
            </div>
            <div>
              <Clock className="mx-auto h-6 w-6 text-primary mb-1" />
              <p className="font-bold">Cook Time</p>
              <p className="text-muted-foreground">{recipe.cookTime} min</p>
            </div>
            <div>
              <Users className="mx-auto h-6 w-6 text-primary mb-1" />
              <p className="font-bold">Servings</p>
              <p className="text-muted-foreground">{recipe.servings}</p>
            </div>
          </div>
           <IngredientSwap recipe={recipe} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="md:col-span-1">
          <h2 className="font-headline text-3xl font-bold text-primary mb-4">Ingredients</h2>
          <ul className="space-y-2 text-lg">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2">&#8226;</span>
                <span><strong>{ingredient.quantity}</strong> {ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="font-headline text-3xl font-bold text-primary mb-4">Instructions</h2>
          <ol className="space-y-6 text-lg list-decimal list-inside marker:text-primary marker:font-bold">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="pl-2 leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      </div>
       <div className="mt-12 p-6 bg-secondary/50 rounded-lg">
          <h3 className="font-headline text-2xl font-bold text-primary mb-4">Nutritional Information</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="font-bold">Calories</p>
              <p className="text-muted-foreground">{recipe.nutritionalInfo.calories}</p>
            </div>
            <div>
              <p className="font-bold">Protein</p>
              <p className="text-muted-foreground">{recipe.nutritionalInfo.protein}</p>
            </div>
             <div>
              <p className="font-bold">Carbs</p>
              <p className="text-muted-foreground">{recipe.nutritionalInfo.carbs}</p>
            </div>
             <div>
              <p className="font-bold">Fat</p>
              <p className="text-muted-foreground">{recipe.nutritionalInfo.fat}</p>
            </div>
          </div>
       </div>
    </article>
  );
}
