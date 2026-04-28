import { Facebook, Instagram, Twitter } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TasteBook. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
