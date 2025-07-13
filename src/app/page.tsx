
'use client';

import { Button } from '@/components/ui/button';
import { Menu, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import { useState, useEffect } from 'react';
import { getUserData } from '@/lib/user-data';

export default function Home() {
  const [avatar, setAvatar] = useState('https://placehold.co/100x100.png');

  useEffect(() => {
    // This runs on the client, after the component mounts
    const userData = getUserData();
    if (userData && userData.avatar) {
      setAvatar(userData.avatar);
    }
    
    const handleStorageChange = () => {
        const updatedUserData = getUserData();
        if (updatedUserData && updatedUserData.avatar) {
            setAvatar(updatedUserData.avatar);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
          {Array.from({ length: 15 }).map((_, i) => {
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
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary float-rotate-animation">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="animated-gradient-text">Cryptify</span>
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
            <a 
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-4 group"
            >
                <Image 
                    src={avatar}
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
