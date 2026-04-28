import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RecipeWithImage } from '@/lib/types';
import { Clock } from 'lucide-react';

interface RecipeCardProps {
  recipe: RecipeWithImage;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Link href={`/recipes/${recipe.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-0 shadow-md">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {recipe.image ? (
              <Image
                src={recipe.image.imageUrl}
                alt={recipe.title}
                data-ai-hint={recipe.image.imageHint}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-secondary"></div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2">{recipe.cuisine}</Badge>
          <CardTitle className="font-headline text-xl leading-tight text-primary group-hover:text-accent transition-colors">
            {recipe.title}
          </CardTitle>
          <div className="mt-3 flex items-center text-sm text-muted-foreground">
             <Clock className="h-4 w-4 mr-1.5" />
             <span>{totalTime} min</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
