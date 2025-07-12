import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, BarChart3, BarChart4, ChevronRight } from 'lucide-react';

const categories = [
  {
    name: 'Easy',
    description: '1-15 letters',
    href: '/game?difficulty=easy',
    icon: <BarChart className="h-8 w-8 text-green-500" />,
  },
  {
    name: 'Medium',
    description: '16-20 letters',
    href: '/game?difficulty=medium',
    icon: <BarChart3 className="h-8 w-8 text-yellow-500" />,
  },
  {
    name: 'Hard',
    description: '21+ letters',
    href: '/game?difficulty=hard',
    icon: <BarChart4 className="h-8 w-8 text-red-500" />,
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
                <Card className="transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
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
