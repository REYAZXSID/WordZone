
'use client';

import Link from 'next/link';
import { ChevronLeft, Coins, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type PageHeaderProps = {
  title: string;
  actions?: React.ReactNode;
  coins?: number;
  lives?: number;
  isClient?: boolean;
};

export function PageHeader({ title, actions, coins, lives, isClient }: PageHeaderProps) {
  const pathname = usePathname();
  const backLink = pathname.includes('/game/[difficulty]') ? '/game/category' : pathname.startsWith('/game') ? '/game/category' : '/';

  const isLevelTitle = title.startsWith('Level ');
  const [titleText, titleNumber] = isLevelTitle ? title.split(' ') : [title, null];

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center border-b bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex w-1/3 justify-start items-center gap-4">
         <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href={backLink}>
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
         {isLevelTitle ? (
           <div className="flex flex-col items-start justify-center text-left leading-none">
              <span className="text-sm font-medium text-muted-foreground">{titleText}</span>
              <span className="text-2xl font-bold">{titleNumber}</span>
           </div>
        ) : (
             <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                {title}
            </h1>
        )}
      </div>

      <div className="flex w-1/3 items-center justify-center gap-4">
        {lives !== undefined && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "h-5 w-5 transition-all",
                  i < lives ? "text-red-500 fill-red-500 neon-heart" : "text-muted-foreground/50"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex w-1/3 items-center justify-end gap-2">
        {coins !== undefined && (
             isClient ? (
                <Card>
                    <CardContent className="flex items-center gap-2 p-2">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <span className="font-bold text-lg">{coins}</span>
                    </CardContent>
                </Card>
            ) : (
                <Skeleton className="h-10 w-24" />
            )
        )}
        {actions}
      </div>
    </header>
  );
}
