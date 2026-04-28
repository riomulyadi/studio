"use client";

import { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getIngredientSwaps } from '@/app/actions';
import type { Recipe } from '@/lib/types';
import type { AiIngredientSwapOutput } from '@/ai/flows/ai-ingredient-swap';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';

interface IngredientSwapProps {
  recipe: Recipe;
}

export function IngredientSwap({ recipe }: IngredientSwapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRequest, setUserRequest] = useState('');
  const [result, setResult] = useState<AiIngredientSwapOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!userRequest.trim()) {
      toast({
        title: 'Request is empty',
        description: 'Please tell the AI what you want to change.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const input = {
      recipeName: recipe.title,
      ingredients: recipe.ingredients.map(i => `${i.quantity} ${i.name}`),
      instructions: recipe.instructions,
      userRequest: userRequest,
    };

    const response = await getIngredientSwaps(input);
    setIsLoading(false);

    if (response.success && response.data) {
      if (response.data.substitutions.length === 0) {
        toast({
          title: "No substitutions suggested",
          description: "The AI couldn't find any swaps for your request, or none were needed."
        });
      }
      setResult(response.data);
    } else {
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <BrainCircuit className="mr-2 h-4 w-4" />
          AI Ingredient Swap
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary">
            AI Ingredient Swap
          </DialogTitle>
          <DialogDescription>
            Need to make a change? Let our AI suggest substitutions based on your dietary needs or pantry items.
          </DialogDescription>
        </DialogHeader>
        
        {!result ? (
          <div className="grid gap-4 py-4">
            <Textarea
              id="userRequest"
              placeholder="e.g., 'Make it vegan', 'I'm out of butter', 'What can I use instead of cilantro?'"
              value={userRequest}
              onChange={(e) => setUserRequest(e.target.value)}
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <h3 className="font-bold mb-2">Original Request:</h3>
            <p className="italic text-muted-foreground mb-4">"{userRequest}"</p>
            
            {result.substitutions.length > 0 && (
              <>
                <h3 className="font-bold mb-2">Suggested Swaps:</h3>
                <Accordion type="single" collapsible className="w-full">
                  {result.substitutions.map((sub, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                           <span>{sub.originalIngredient}</span> <ArrowRight className="h-4 w-4 text-primary" /> <span>{sub.suggestedSubstitute}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <strong>Reason:</strong> {sub.reason}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            )}

            {result.notes && (
                <div className="mt-4">
                    <h3 className="font-bold mb-2">Notes from the AI Chef:</h3>
                    <p className="text-sm bg-secondary/50 p-3 rounded-md">{result.notes}</p>
                </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!result ? (
            <Button type="button" onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Thinking...' : 'Get Suggestions'}
            </Button>
          ) : (
             <Button type="button" onClick={() => { setResult(null); setUserRequest(''); }} className="w-full sm:w-auto">
              Try Another Swap
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
