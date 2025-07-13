
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChartHorizontal, BarChart2, PieChart, LineChart, AreaChart, ChevronRight, Flame } from 'lucide-react';
import type { Difficulty } from '@/lib/puzzles';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type Category = {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  difficulty: Difficulty;
  colorClass: string;
  isHot?: boolean;
  glowClass?: string;
};

const categories: Category[] = [
  {
    name: 'Easy',
    description: '1-19 letters',
    href: '/game/easy',
    icon: <BarChartHorizontal className="h-8 w-8 text-green-500" />,
    difficulty: 'easy',
    colorClass: 'hover:bg-green-500/10',
  },
  {
    name: 'Medium',
    description: '20-25 letters',
    href: '/game/medium',
    icon: <BarChart2 className="h-8 w-8 text-yellow-500" />,
    difficulty: 'medium',
    colorClass: 'hover:bg-yellow-500/10',
  },
  {
    name: 'Hard',
    description: '30-35 letters',
    href: '/game/hard',
    icon: <PieChart className="h-8 w-8 text-red-500" />,
    difficulty: 'hard',
    colorClass: 'hover:bg-red-500/10',
  },
  {
    name: 'Intermediate',
    description: '30-35 letters, trickier puzzles',
    href: '/game/intermediate',
    icon: <LineChart className="h-8 w-8 text-orange-500" />,
    difficulty: 'intermediate',
    colorClass: 'hover:bg-orange-500/10',
    isHot: true,
    glowClass: 'card-glow-intermediate',
  },
   {
    name: 'Advance',
    description: '30-35 letters, more tricky and puzzle',
    href: '/game/advance',
    icon: <AreaChart className="h-8 w-8 text-purple-500" />,
    difficulty: 'advance',
    colorClass: 'hover:bg-purple-500/10',
    isHot: true,
    glowClass: 'card-glow-advance',
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
              <Link href={category.href} key={category.name} className="block group">
                <Card className={cn(
                  "transform transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-lg relative",
                  category.colorClass,
                  category.glowClass
                )}>
                  {category.isHot && (
                    <Badge variant="destructive" className="absolute -top-2 -right-2 shadow-lg z-10">HOT</Badge>
                  )}
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
