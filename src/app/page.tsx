
'use client';

import { Button } from '@/components/ui/button';
import { Menu, ArrowRight, BookOpen, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState, useEffect } from 'react';
import { useUserData } from '@/hooks/use-user-data';

export default function Home() {
  const { userData } = useUserData();
  const [avatar, setAvatar] = useState('https://files.catbox.moe/peii94.png');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (userData && userData.avatar) {
      setAvatar(userData.avatar);
    }
  }, [userData]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background overflow-hidden">
      
      {/* Theme-specific background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {/* Default and Dark/Neon Glow */}
        <div className="dark:block neon:block classic-mystery:hidden hacker-green:hidden playful-light:hidden zen-minimal:hidden retro-arcade:hidden hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/30 rounded-full filter blur-3xl opacity-50 glow-effect-1"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/30 rounded-full filter blur-3xl opacity-50 glow-effect-2"></div>
        </div>

        {/* Pink Blossom Bubbles */}
        <div className="pink-blossom:block hidden">
          {isMounted && Array.from({ length: 15 }).map((_, i) => {
            const style = {
              left: `${Math.random() * 100}vw`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            };
            return <div key={i} className="bubble" style={style} />;
          })}
        </div>
        
        {/* Retro Arcade Scanlines */}
        <div className="retro-arcade:block hidden scanline-overlay"></div>
      </div>
      
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-end z-10 gap-2">
        <ThemeToggle />
        <Button asChild variant="ghost" size="icon">
          <Link href="/menu">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 items-center justify-center z-0">
        <div className="flex flex-col items-center text-center p-6">
          <div className="mx-auto mb-6 p-1 rounded-full bg-gradient-to-br from-primary via-accent to-yellow-400 float-rotate-animation">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm">
                <Image src="https://files.catbox.moe/romunz.png" alt="WordZone Logo" width={64} height={64} />
            </div>
          </div>
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="animated-gradient-text">WordZone</span>
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
          </div>
        </div>
      </main>

      <footer className="w-full p-6 z-10">
        <div className="mx-auto max-w-lg">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div 
                className="mt-6 flex items-center justify-center gap-4 group"
            >
                <Image 
                    src="https://files.catbox.moe/ljdyx0.png"
                    data-ai-hint="portrait man"
                    alt="Sid"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-primary/50 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-semibold text-foreground/80 transition-colors duration-300 group-hover:text-primary">
                    Credit | S!dVerse.
                </span>
            </div>
        </div>
      </footer>
    </div>
  );
}
