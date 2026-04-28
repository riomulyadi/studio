import Link from "next/link";
import { ChefHat } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="p-2 bg-primary group-hover:bg-accent transition-colors rounded-md">
        <ChefHat className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="font-headline text-2xl font-bold text-primary hidden sm:inline-block">
        TasteBook
      </span>
    </Link>
  );
}
