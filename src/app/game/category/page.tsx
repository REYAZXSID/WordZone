
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, BarChart3, BarChart4, ChevronRight, TrendingUp, AreaChart } from 'lucide-react';
import type { Difficulty } from '@/lib/puzzles';
import { cn } from '@/lib/utils';

type Category = {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  difficulty: Difficulty;
  colorClass: string;
};

const categories: Category[] = [
  {
    name: 'Easy',
    description: '1-19 letters',
    href: '/game/easy',
    icon: <BarChart className="h-8 w-8 text-green-500" />,
    difficulty: 'easy',
    colorClass: 'hover:bg-green-500/10',
  },
  {
    name: 'Medium',
    description: '20-25 letters',
    href: '/game/medium',
    icon: <BarChart3 className="h-8 w-8 text-yellow-500" />,
    difficulty: 'medium',
    colorClass: 'hover:bg-yellow-500/10',
  },
  {
    name: 'Hard',
    description: '30-35 letters',
    href: '/game/hard',
    icon: <BarChart4 className="h-8 w-8 text-red-500" />,
    difficulty: 'hard',
    colorClass: 'hover:bg-red-500/10',
  },
  {
    name: 'Intermediate',
    description: '30-35 letters, trickier puzzles',
    href: '/game/intermediate',
    icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
    difficulty: 'intermediate',
    colorClass: 'hover:bg-orange-500/10',
  },
   {
    name: 'Advance',
    description: '35-39 letters',
    href: '/game/advance',
    icon: <AreaChart className="h-8 w-8 text-purple-500" />,
    difficulty: 'advance',
    colorClass: 'hover:bg-purple-500/10',
  },
];

export default function CategorySelectionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Select Difficulty" />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-4">
            {categories.map((category) => (
              <Link href={category.href} key={category.name} className="block">
                <Card className={cn(
                  "transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg",
                  category.colorClass
                )}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
