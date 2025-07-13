
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OfflineModal() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-xl border bg-background p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 animate-pulse-offline">
          <WifiOff className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">You're Offline</h1>
        <p className="mt-2 text-muted-foreground">
          Please check your internet connection and try again.
        </p>
        <div className="mt-8">
          <Button onClick={handleRetry} size="lg" className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground/80">
          <Server className="h-3 w-3" />
          <p>Server is under maintenance<span className="animated-ellipsis"></span></p>
        </div>
      </div>
    </div>
  );
}
