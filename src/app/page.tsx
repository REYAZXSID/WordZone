
import { Button } from '@/components/ui/button';
import { Menu, ArrowRight, Settings, BookOpen, User, Puzzle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/30 rounded-full filter blur-3xl opacity-50 glow-effect-1"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/30 rounded-full filter blur-3xl opacity-50 glow-effect-2"></div>
      </div>
      
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-end z-10 gap-2">
         <Button asChild variant="ghost" size="icon">
          <Link href="/login">
            <User className="h-6 w-6" />
            <span className="sr-only">Login</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon">
          <Link href="/menu">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 items-center justify-center z-0">
        <div className="flex flex-col items-center text-center p-6">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary breathing-icon-animation">
            <Puzzle className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            CryptoPuzzle
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Sharpen your mind with daily cryptographic challenges. Decode quotes, unlock achievements, and climb the leaderboard.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
             <Button asChild size="lg" className="h-14 text-lg">
              <Link href="/game/category">
                Start Game
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="h-14 text-lg" variant="outline">
              <Link href="/how-to-play">
                <BookOpen className="mr-2 h-5 w-5" />
                How to Play
              </Link>
            </Button>
            <Button asChild size="lg" className="h-14 text-lg" variant="outline">
              <Link href="/settings">
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="w-full p-6 z-10">
        <div className="mx-auto max-w-lg">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <a 
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-4 group"
            >
                <Image 
                    src="https://placehold.co/100x100.png"
                    data-ai-hint="portrait man"
                    alt="Sid"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-primary/50 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-semibold text-foreground/80 transition-colors duration-300 group-hover:text-primary">
                    Built by Sid
                </span>
            </a>
        </div>
      </footer>
    </div>
  );
}
