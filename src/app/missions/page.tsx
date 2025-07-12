import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Coins, Puzzle, Flame } from 'lucide-react';

const missions = [
  {
    title: 'Solve 3 Easy Puzzles',
    icon: <Puzzle className="h-6 w-6 text-green-500" />,
    currentProgress: 1,
    targetProgress: 3,
    reward: 25,
    claimed: false,
  },
  {
    title: 'Complete the Daily Puzzle',
    icon: <Flame className="h-6 w-6 text-orange-500" />,
    currentProgress: 0,
    targetProgress: 1,
    reward: 50,
    claimed: false,
  },
  {
    title: 'Use 5 Hints',
    icon: <Coins className="h-6 w-6 text-yellow-500" />,
    currentProgress: 2,
    targetProgress: 5,
    reward: 15,
    claimed: true,
  },
  {
    title: 'Solve a Hard Puzzle in under 5 minutes',
    icon: <Puzzle className="h-6 w-6 text-red-500" />,
    currentProgress: 0,
    targetProgress: 1,
    reward: 100,
    claimed: false,
  },
];

export default function MissionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PageHeader title="Daily Missions" />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-2xl space-y-4">
            <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle>New Missions in 12h 45m</CardTitle>
                    <CardDescription>Complete missions to earn valuable coins and power-ups!</CardDescription>
                </CardHeader>
            </Card>

          {missions.map((mission, index) => (
            <Card key={index}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                    {mission.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold">{mission.title}</h3>
                    <div className="flex items-center gap-2">
                        <Progress value={(mission.currentProgress / mission.targetProgress) * 100} className="h-2 w-full sm:w-48" />
                        <span className="text-xs text-muted-foreground">{mission.currentProgress}/{mission.targetProgress}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2 pl-4">
                    <div className="flex items-center font-bold text-yellow-500">
                        <Coins className="h-5 w-5 mr-1" />
                        {mission.reward}
                    </div>
                    <Button 
                        size="sm" 
                        disabled={mission.currentProgress < mission.targetProgress || mission.claimed}
                    >
                        {mission.claimed ? 'Claimed' : 'Claim'}
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
