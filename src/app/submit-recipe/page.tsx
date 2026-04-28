import { RecipeForm } from "@/components/RecipeForm";

export default function SubmitRecipePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Share Your Creation</h1>
        <p className="text-muted-foreground text-lg mt-2">Contribute your favorite recipe to the TasteBook community.</p>
      </div>
      <RecipeForm />
    </div>
  );
}
