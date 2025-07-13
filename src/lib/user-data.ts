
import type { Difficulty } from './puzzles';

export type UserData = {
    userId: string;
    username: string;
    avatar: string;
    coins: number;
    stats: {
        puzzlesSolved: number;
        puzzlesSolvedByDifficulty: Record<Difficulty, number>;
        fastestSolveTime: number | null;
        dailyStreak: number;
        bestStreak: number;
        hintsUsed: number;
    };
    unlockedAchievements: string[];
    // Add other fields as needed
};

// Helper to generate a simple unique ID
const generateId = () => {
    return `user_${Math.random().toString(36).substr(2, 9)}`;
}

const defaultStats = {
    puzzlesSolved: 0,
    puzzlesSolvedByDifficulty: { easy: 0, medium: 0, hard: 0, intermediate: 0, advance: 0 },
    fastestSolveTime: null,
    dailyStreak: 0,
    bestStreak: 0,
    hintsUsed: 0,
};

// Get user data from localStorage
export const getUserData = (): UserData => {
    if (typeof window === 'undefined') {
        // Return default data for SSR
        return {
            userId: 'xxxxxxxx',
            username: 'Player',
            avatar: 'https://files.catbox.moe/peii94.png',
            coins: 0,
            stats: defaultStats,
            unlockedAchievements: [],
        };
    }

    const data = localStorage.getItem('crypto_user_data');
    if (data) {
        const parsedData = JSON.parse(data);
        // Ensure nested structure exists
        if (!parsedData.stats) {
            parsedData.stats = defaultStats;
        }
         // Deep merge stats to ensure new properties are added
        parsedData.stats = { ...defaultStats, ...parsedData.stats };
        if (!parsedData.stats.puzzlesSolvedByDifficulty) {
            parsedData.stats.puzzlesSolvedByDifficulty = defaultStats.puzzlesSolvedByDifficulty;
        } else {
             parsedData.stats.puzzlesSolvedByDifficulty = { ...defaultStats.puzzlesSolvedByDifficulty, ...parsedData.stats.puzzlesSolvedByDifficulty };
        }

        if (parsedData.stats.bestStreak === undefined) {
             parsedData.stats.bestStreak = parsedData.stats.dailyStreak;
        }
         if (!parsedData.avatar) {
            parsedData.avatar = 'https://files.catbox.moe/peii94.png';
        }
        return parsedData;
    }

    // Create default data for a new user
    const defaultData: UserData = {
        userId: generateId(),
        username: 'Player123',
        avatar: 'https://files.catbox.moe/peii94.png',
        coins: 200,
        stats: defaultStats,
        unlockedAchievements: [],
    };
    localStorage.setItem('crypto_user_data', JSON.stringify(defaultData));
    return defaultData;
};

// Save partial user data to localStorage
export const saveUserData = (dataToSave: Partial<UserData>) => {
    if (typeof window === 'undefined') return;

    const currentData = getUserData();
    const newData = { ...currentData, ...dataToSave };
    localStorage.setItem('crypto_user_data', JSON.stringify(newData));
    // Manually trigger storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_user_data', newValue: JSON.stringify(newData) }));
};

// Update user stats
export const updateUserStat = (stat: keyof UserData['stats'], value: number, difficulty?: Difficulty) => {
    if (typeof window === 'undefined') return;

    const currentData = getUserData();
    const newStats = { ...currentData.stats };

    if (stat === 'fastestSolveTime') {
        if (newStats.fastestSolveTime === null || value < newStats.fastestSolveTime) {
            newStats.fastestSolveTime = value;
        }
    } else if (stat === 'puzzlesSolved') {
        newStats.puzzlesSolved += value;
        if (difficulty) {
             newStats.puzzlesSolvedByDifficulty[difficulty] = (newStats.puzzlesSolvedByDifficulty[difficulty] || 0) + value;
        }
    } else if (stat === 'dailyStreak') {
        newStats.dailyStreak = value;
        if (newStats.dailyStreak > newStats.bestStreak) {
            newStats.bestStreak = newStats.dailyStreak;
        }
    } else if (stat === 'bestStreak') {
        if (value > newStats.bestStreak) {
            newStats.bestStreak = value;
        }
    } else if (stat === 'hintsUsed') {
        newStats.hintsUsed += value;
    }
    
    saveUserData({ stats: newStats });
}

// Reset all user data
export const resetUserData = () => {
     if (typeof window === 'undefined') return;
     Object.keys(localStorage).forEach(key => {
        if (key.startsWith('crypto_') || key.startsWith('completedLevels_')) {
            localStorage.removeItem(key);
        }
    });
    // Dispatch event to notify other tabs/components of the reset
    window.dispatchEvent(new StorageEvent('storage', { key: 'crypto_user_data' }));
}
