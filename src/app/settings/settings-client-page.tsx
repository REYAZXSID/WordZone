
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import { Volume2, VolumeX, Languages, Bell, BellOff, Trash2, LogOut, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function SettingsClientPage() {
  const [isClient, setIsClient] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('en');
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const savedSound = localStorage.getItem('crypto-sound');
    if (savedSound) {
      setSoundEnabled(JSON.parse(savedSound));
    }
    const savedNotifications = localStorage.getItem('crypto-notifications');
     if (savedNotifications) {
      setNotificationsEnabled(JSON.parse(savedNotifications));
    }
    const savedLang = localStorage.getItem('crypto-lang');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('crypto-sound', JSON.stringify(enabled));
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem('crypto-notifications', JSON.stringify(enabled));
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('crypto-lang', lang);
  };
  
  const handleResetProgress = () => {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('crypto_') || key.startsWith('completedLevels_') || key.startsWith('dailyPuzzle')) {
            localStorage.removeItem(key);
        }
    });
    window.location.reload(); 
    toast({ title: "Progress Reset", description: "Your game data has been cleared." });
  }
  
  if (!isClient) {
    return (
       <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
             <Skeleton className="h-8 w-32" />
             <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-10 w-24" />
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your CryptoPuzzle experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="theme" className="text-base">Appearance</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light, dark, and neon modes.
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-3">
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              <div className="space-y-0.5">
                <Label htmlFor="sound" className="text-base">Sound Effects</Label>
                 <p className="text-sm text-muted-foreground">
                  Enable or disable in-game sounds.
                </p>
              </div>
            </div>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={handleSoundToggle}
            />
          </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-3">
                {notificationsEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-base">Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                    Enable or disable push notifications.
                    </p>
                </div>
                </div>
                <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationsToggle}
                />
            </div>


          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center space-x-3">
               <Languages className="h-5 w-5" />
               <div className="space-y-0.5">
                <Label htmlFor="language" className="text-base">Language</Label>
                 <p className="text-sm text-muted-foreground">
                  Choose your preferred language.
                </p>
              </div>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account and data.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start p-4 h-auto">
                        <Trash2 className="mr-3 h-5 w-5" /> 
                        <div className="text-left">
                            <div className="font-semibold">Reset Progress</div>
                            <div className="font-normal text-xs opacity-80">Permanently delete all your game data.</div>
                        </div>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all
                        your puzzle progress, stats, and power-ups.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetProgress}>
                        Yes, reset everything
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            
            <Button asChild variant="outline" className="w-full justify-start p-4 h-auto">
                <Link href="#">
                    <FileText className="mr-3 h-5 w-5" /> 
                    <div className="text-left">
                        <div className="font-semibold">Privacy Policy</div>
                        <div className="font-normal text-xs opacity-80">Read our privacy policy.</div>
                    </div>
                </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start p-4 h-auto">
                <Link href="#">
                     <FileText className="mr-3 h-5 w-5" /> 
                    <div className="text-left">
                        <div className="font-semibold">Terms of Service</div>
                        <div className="font-normal text-xs opacity-80">Read our terms of service.</div>
                    </div>
                </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <LogOut className="mr-3 h-5 w-5" /> 
                <div className="text-left">
                    <div className="font-semibold">Log Out</div>
                    <div className="font-normal text-xs opacity-80">Sign out of your account.</div>
                </div>
            </Button>
        </CardContent>
      </Card>

    </div>
  );
}
