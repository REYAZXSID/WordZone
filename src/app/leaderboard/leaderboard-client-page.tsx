
'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Medal, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';


type LeaderboardEntry = {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  isCurrentUser?: boolean;
};

// Mock data generator
const generateMockData = (count: number): Omit<LeaderboardEntry, 'isCurrentUser'>[] => {
  const users = [
    "Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Jamie", "Skyler", "Quinn", "Parker",
    "Blake", "Drew", "Cameron", "Rowan", "Hayden", "Avery", "Dakota", "Reese", "Peyton", "Jesse"
  ];
  return Array.from({ length: count }, (_, i) => ({
    rank: i + 1,
    username: `${users[i % users.length]}${Math.floor(Math.random() * 100)}`,
    avatar: `https://i.pravatar.cc/150?u=${i}`,
    score: 10000 - (i * (150 + Math.floor(Math.random() * 100))),
  }));
};

const mockAllTime = generateMockData(50);

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500 fill-yellow-400" />;
  if (rank === 2) return <Trophy className="h-6 w-6 text-gray-400 fill-gray-300" />;
  if (rank === 3) return <Trophy className="h-6 w-6 text-orange-600 fill-orange-500" />;
  return <span className="w-6 text-center text-sm font-bold text-muted-foreground">{rank}</span>;
};


export function LeaderboardClientPage() {
  const [isClient, setIsClient] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; } | null>(null);

  useEffect(() => {
    setIsClient(true);
    const userProfile = JSON.parse(localStorage.getItem('crypto_user') || 'null');
    if (userProfile) {
      setCurrentUser(userProfile);
    }
  }, []);

  const leaderboardDataWithUser = mockAllTime.map(entry => ({
    ...entry,
    isCurrentUser: entry.username === currentUser?.username,
  }));
  
  // If current user is not in top 50, add them at a lower rank for demonstration
  if (currentUser && !leaderboardDataWithUser.some(e => e.isCurrentUser)) {
    leaderboardDataWithUser.push({
        rank: 231,
        username: currentUser.username,
        avatar: '', // will fallback
        score: parseInt(localStorage.getItem('crypto_coins') || '200') + (JSON.parse(localStorage.getItem('completedLevels_easy') || '[]').length * 100),
        isCurrentUser: true
    })
  }

  if (!isClient) {
    return (
        <div className="mx-auto max-w-2xl space-y-4">
            <div className="flex justify-center">
                <Skeleton className="h-10 w-64 rounded-md" />
            </div>
            <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                         <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>
        </div>
    )
  }

  const renderLeaderboard = (data: LeaderboardEntry[]) => (
    <div className="space-y-3">
      {data.map((entry) => (
        <Card
          key={entry.rank}
          className={cn(
            'flex items-center gap-4 p-3 transition-all duration-200',
            entry.isCurrentUser && 'border-primary ring-2 ring-primary bg-primary/10'
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center">
            <RankIcon rank={entry.rank} />
          </div>
          <Avatar className="h-10 w-10 border-2 border-muted">
            <AvatarImage src={entry.avatar} alt={entry.username} />
            <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{entry.username}</p>
            <p className="text-sm text-muted-foreground">{entry.score.toLocaleString()} pts</p>
          </div>
          {entry.isCurrentUser && (
            <span className="text-xs font-bold text-primary">YOU</span>
          )}
        </Card>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <Tabs defaultValue="all-time" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="all-time">All Time</TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
          {renderLeaderboard(leaderboardDataWithUser.slice(0, 15).sort(() => Math.random() - 0.5).map((u, i) => ({...u, rank: i+1})))}
        </TabsContent>
        <TabsContent value="weekly" className="mt-4">
          {renderLeaderboard(leaderboardDataWithUser.slice(0, 30).sort(() => Math.random() - 0.5).map((u, i) => ({...u, rank: i+1})))}
        </TabsContent>
        <TabsContent value="all-time" className="mt-4">
          {renderLeaderboard(leaderboardDataWithUser)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
