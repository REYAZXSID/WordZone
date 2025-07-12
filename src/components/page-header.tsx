'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PageHeaderProps = {
  title: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center border-b bg-background/80 px-4 backdrop-blur-sm">
      <Button asChild variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
        <Link href="/">
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back to Home</span>
        </Link>
      </Button>
      <h1 className="flex-1 text-center text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h1>
      <div className="flex-shrink-0 w-auto flex items-center gap-2">
        {actions}
      </div>
    </header>
  );
}
