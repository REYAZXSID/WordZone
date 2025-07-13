
import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, User, Trophy, ShoppingCart, Calendar, ListChecks, Star, Package, Coins as CoinsIcon, Flame, Inbox, MessageSquareWarning, Settings } from 'lucide-react';

type MenuItem = {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
   {
    name: 'Profile',
    description: 'View your stats and customize your profile.',
    href: '/profile',
    icon: <User className="h-8 w-8 text-cyan-500" />,
  },
   {
    name: 'Daily Puzzle',
    description: 'Solve the puzzle of the day.',
    href: '/daily',
    icon: <Calendar className="h-8 w-8 text-blue-500" />,
  },
  {
    name: 'Daily Missions',
    description: 'Complete daily tasks for rewards.',
    href: '/missions',
    icon: <ListChecks className="h-8 w-8 text-purple-500" />,
  },
    {
    name: 'Inbox & Rewards',
    description: 'Claim your daily rewards and gifts.',
    href: '/inbox',
    icon: <Inbox className="h-8 w-8 text-rose-500" />,
  },
  {
    name: 'Streak Tracker',
    description: 'Track your daily puzzle streak.',
    href: '/streaks',
    icon: <Flame className="h-8 w-8 text-orange-500" />,
  },
  {
    name: 'Puzzle Packs',
    description: 'Explore themed puzzle collections.',
    href: '/packs',
    icon: <Package className="h-8 w-8 text-indigo-500" />,
  },
  {
    name: 'Achievements',
    description: 'Unlock milestones and earn badges.',
    href: '/achievements',
    icon: <Star className="h-8 w-8 text-yellow-400" />,
  },
   {
    name: 'Power-Up Shop',
    description: 'Purchase hints and helpful items.',
    href: '/shop',
    icon: <ShoppingCart className="h-8 w-8 text-green-500" />,
  },
  {
    name: 'Coin Shop',
    description: 'Get more coins to spend.',
    href: '/coin-shop',
    icon: <CoinsIcon className="h-8 w-8 text-yellow-500" />,
  },
  {
    name: 'Leaderboard',
    description: 'See how you rank against others.',
    href: '/leaderboard',
    icon: <Trophy className="h-8 w-8 text-amber-500" />,
  },
   {
    name: 'Feedback & Report',
    description: 'Send suggestions or report bugs.',
    href: '/feedback',
    icon: <MessageSquareWarning className="h-8 w-8 text-gray-500" />,
  },
  {
    name: 'Settings',
    description: 'Adjust your app preferences.',
    href: '/settings',
    icon: <Settings className="h-8 w-8 text-gray-500" />,
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
