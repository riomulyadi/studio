import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function Header() {
  const navItems = [
    { name: "Browse Recipes", href: "/" },
    { name: "My Recipe Box", href: "/my-recipes" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/submit-recipe">
              <PlusCircle className="mr-2 h-5 w-5" />
              Submit Recipe
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
