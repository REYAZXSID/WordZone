import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Puzzle, Settings, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Puzzle className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">CryptoPuzzle</CardTitle>
          <CardDescription className="text-lg">
            Your daily dose of cryptographic challenges.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 p-6">
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
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CryptoPuzzle. Sharpen your mind.</p>
      </footer>
    </div>
  );
}
