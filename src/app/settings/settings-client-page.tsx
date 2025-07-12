
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import { Volume2, VolumeX, Languages } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function SettingsClientPage() {
  const [isClient, setIsClient] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    setIsClient(true);
    const savedSound = localStorage.getItem('crypto-sound');
    if (savedSound) {
      setSoundEnabled(JSON.parse(savedSound));
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

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('crypto-lang', lang);
  };
  
  if (!isClient) {
    return (
       <div className="mx-auto max-w-2xl">
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
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-10" />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-6 w-11" />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
