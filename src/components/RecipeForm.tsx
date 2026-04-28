"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const recipeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  cuisine: z.string().min(2, 'Cuisine is required.'),
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']),
  prepTime: z.coerce.number().min(0, 'Prep time cannot be negative.'),
  cookTime: z.coerce.number().min(0, 'Cook time cannot be negative.'),
  servings: z.coerce.number().min(1, 'Servings must be at least 1.'),
  ingredients: z.array(z.object({
    quantity: z.string().min(1, 'Quantity is required.'),
    name: z.string().min(2, 'Ingredient name is required.'),
  })).min(1, 'At least one ingredient is required.'),
  instructions: z.array(z.object({
    step: z.string().min(5, 'Instruction step is too short.'),
  })).min(1, 'At least one instruction step is required.'),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

export function RecipeForm() {
  const { toast } = useToast();
  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      description: '',
      cuisine: '',
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      ingredients: [{ quantity: '', name: '' }],
      instructions: [{ step: '' }],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const { fields: instructionFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    control: form.control,
    name: "instructions",
  });

  function onSubmit(data: RecipeFormValues) {
    console.log(data);
    toast({
      title: "Recipe Submitted!",
      description: "Thank you for sharing your delicious recipe with the community.",
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Title</FormLabel>
                  <FormControl><Input placeholder="e.g., Classic Lasagna" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="A short, enticing description of your dish." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine</FormLabel>
                      <FormControl><Input placeholder="e.g., Italian" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mealType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a meal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Breakfast">Breakfast</SelectItem>
                          <SelectItem value="Lunch">Lunch</SelectItem>
                          <SelectItem value="Dinner">Dinner</SelectItem>
                           <SelectItem value="Dessert">Dessert</SelectItem>
                          <SelectItem value="Snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <FormField
                  control={form.control}
                  name="prepTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prep Time (min)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 15" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cookTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cook Time (min)</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 30" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Ingredients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ingredientFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name={`ingredients.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel className={index !== 0 ? 'sr-only' : ''}>Quantity</FormLabel>
                      <FormControl><Input placeholder="e.g., 1 cup" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name={`ingredients.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-grow-[2]">
                       <FormLabel className={index !== 0 ? 'sr-only' : ''}>Name</FormLabel>
                      <FormControl><Input placeholder="e.g., All-purpose flour" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)} disabled={ingredientFields.length === 1}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            ))}
             <Button type="button" variant="outline" size="sm" onClick={() => appendIngredient({ quantity: '', name: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
            </Button>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {instructionFields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                 <span className="font-bold text-primary text-lg pt-2">{index + 1}.</span>
                 <FormField
                  control={form.control}
                  name={`instructions.${index}.step`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl><Textarea placeholder="Describe this step..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(index)} disabled={instructionFields.length === 1}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            ))}
             <Button type="button" variant="outline" size="sm" onClick={() => appendInstruction({ step: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Step
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full">Submit Recipe</Button>
      </form>
    </Form>
  );
}
