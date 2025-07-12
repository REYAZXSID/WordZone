import { Button } from '@/components/ui/button';
import { Puzzle, Settings, Calendar, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="absolute top-4 right-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/menu">
            <MoreVertical className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-grow flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Puzzle className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">CryptoPuzzle</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your daily dose of cryptographic challenges.
        </p>
      </div>

      <div className="flex flex-col space-y-4 p-6">
        <Button asChild size="lg" className="h-14 text-lg">
          <Link href="/game/category">
            <Puzzle className="mr-2 h-5 w-5" />
            Start Game
          </Link>
        </Button>
        <Button asChild size="lg" className="h-14 text-lg" variant="secondary">
          <Link href="/daily">
            <Calendar className="mr-2 h-5 w-5" />
            Daily Puzzle
          </Link>
        </Button>
        <Button asChild size="lg" className="h-14 text-lg" variant="ghost">
          <Link href="/settings">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Link>
        </Button>
      </div>

      <footer className="pb-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CryptoPuzzle. Sharpen your mind.</p>
      </footer>
    </div>
  );
}
