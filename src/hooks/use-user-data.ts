
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
            if (e.key === 'crypto_user_data' || e.key === 'crypto_coins') {
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
