'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

type PageHeaderProps = {
  title: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, actions }: PageHeaderProps) {
  const pathname = usePathname();
  const backLink = pathname.includes('/game') ? '/game/category' : '/';

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center border-b bg-background/80 px-4 backdrop-blur-sm">
      <Button asChild variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
        <Link href={backLink}>
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Link>
      </Button>
      <h1 className="flex-1 text-center text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h1>
      <div className="flex w-10 flex-shrink-0 items-center justify-end gap-2 sm:w-auto">
        {actions}
      </div>
    </header>
  );
}
