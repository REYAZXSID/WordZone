
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserData, UserData } from '@/lib/user-data';

export const useUserData = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isClient, setIsClient] = useState(false);

    const refreshUserData = useCallback(() => {
        const data = getUserData();
        setUserData(data);
    }, []);

    useEffect(() => {
        setIsClient(true);
        refreshUserData();

        const handleStorageChange = (e: StorageEvent) => {
            // We only care about the main user data object now
            if (e.key === 'crypto_user_data') {
                refreshUserData();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [refreshUserData]);

    return { userData, isClient, refreshUserData };
};
