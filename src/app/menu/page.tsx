import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, User, Trophy, ShoppingCart } from 'lucide-react';

type MenuItem = {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  {
    name: 'Profile',
    description: 'View your stats and progress.',
    href: '/profile',
    icon: <User className="h-8 w-8 text-primary" />,
  },
  {
    name: 'Leaderboard',
    description: 'See how you rank against others.',
    href: '/leaderboard',
    icon: <Trophy className="h-8 w-8 text-yellow-500" />,
  },
  {
    name: 'Shop',
    description: 'Purchase new themes and hints.',
    href: '/shop',
    icon: <ShoppingCart className="h-8 w-8 text-green-500" />,
  },
];

export default function MenuPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Menu" />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Link href={item.href} key={item.name} className="block">
                <Card className="transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
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
