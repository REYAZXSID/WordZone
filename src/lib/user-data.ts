
export type UserData = {
    userId: string;
    username: string;
    avatar: string;
    coins: number;
    stats: {
        puzzlesSolved: number;
        fastestSolveTime: number | null;
        dailyStreak: number;
        hintsUsed: number;
    };
    unlockedAchievements: string[];
    // Add other fields as needed
};

// Helper to generate a simple unique ID
const generateId = () => {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
}

// Get user data from localStorage
export const getUserData = (): UserData => {
    if (typeof window === 'undefined') {
        // Return default data for SSR
        return {
            userId: 'xxxxxxxx',
            username: 'Player',
            avatar: 'https://placehold.co/112x112.png',
            coins: 0,
            stats: { puzzlesSolved: 0, fastestSolveTime: null, dailyStreak: 0, hintsUsed: 0 },
            unlockedAchievements: [],
        };
    }

    const data = localStorage.getItem('crypto_user_data');
    if (data) {
        return JSON.parse(data);
    }

    // Create default data for a new user
    const defaultData: UserData = {
        userId: generateId(),
        username: 'Player123',
        avatar: 'https://placehold.co/112x112.png',
        coins: 200,
        stats: { puzzlesSolved: 0, fastestSolveTime: null, dailyStreak: 0, hintsUsed: 0 },
        unlockedAchievements: [],
    };
    localStorage.setItem('crypto_user_data', JSON.stringify(defaultData));
    localStorage.setItem('crypto_coins', '200'); // Sync coins
    return defaultData;
};

// Save partial user data to localStorage
export const saveUserData = (dataToSave: Partial<UserData>) => {
    if (typeof window === 'undefined') return;

    const currentData = getUserData();
    const newData = { ...currentData, ...dataToSave };
    localStorage.setItem('crypto_user_data', JSON.stringify(newData));
};

// Update user stats
export const updateUserStat = (stat: keyof UserData['stats'], value: number) => {
    if (typeof window === 'undefined') return;

    const currentData = getUserData();
    const newStats = { ...currentData.stats };

    if (stat === 'fastestSolveTime') {
        if (newStats.fastestSolveTime === null || value < newStats.fastestSolveTime) {
            newStats.fastestSolveTime = value;
        }
    } else {
        (newStats[stat] as number) += value;
    }
    
    saveUserData({ stats: newStats });
}

// Reset all user data
export const resetUserData = () => {
     if (typeof window === 'undefined') return;
     Object.keys(localStorage).forEach(key => {
        if (key.startsWith('crypto_') || key.startsWith('completedLevels_') || key.startsWith('dailyPuzzle')) {
            localStorage.removeItem(key);
        }
    });
}
