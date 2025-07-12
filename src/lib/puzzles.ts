
export type Puzzle = {
  id: number;
  text: string;
  quote: string;
  author: string;
  cipher: Record<string, string>; // Decrypted -> Encrypted
  difficulty: Difficulty;
};

export type Difficulty = 'easy' | 'medium' | 'hard';

// Helper to create a cipher from a key string
const createCipher = (key: string): Record<string, string> => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (key.length !== 26) throw new Error("Key must be 26 characters long");
  const cipher: Record<string, string> = {};
  for (let i = 0; i < 26; i++) {
    cipher[alphabet[i]] = key[i];
  }
  return cipher;
};


// Helper to encrypt a text with a cipher
const encrypt = (text: string, cipher: Record<string, string>): string => {
  return text
    .toUpperCase()
    .split("")
    .map((char) => {
      // Preserve spaces and punctuation
      if (cipher[char]) {
        return cipher[char];
      }
      return char;
    })
    .join("");
};

const puzzleData: Omit<Puzzle, 'text' | 'cipher' | 'id' | 'difficulty'>[] = [
    // Easy (<= 15 letters)
    { quote: "GO TO HELL", author: "UNKNOWN" },
    { quote: "BE YOURSELF", author: "OSCAR WILDE" },
    { quote: "I AM LEGEND", author: "RICHARD MATHESON"},
    { quote: "JUST DO IT", author: "NIKE"},
    { quote: "TIME IS MONEY", author: "BENJAMIN FRANKLIN" },
    { quote: "NEVER GIVE UP", author: "WINSTON CHURCHILL" },
    { quote: "I HAVE A DREAM", author: "MARTIN LUTHER KING" },
    { quote: "THINK DIFFERENT", author: "APPLE" },
    
    // Medium (16-20 letters)
    { quote: "KNOWLEDGE IS POWER", author: "FRANCIS BACON" },
    { quote: "SIMPLICITY IS THE KEY", author: "BRUCE LEE"},
    { quote: "LEARNING NEVER ENDS", author: "UNKNOWN" },

    // Hard (21+ letters)
    { quote: "STAY HUNGRY STAY FOOLISH", author: "STEVE JOBS" },
    { quote: "LOVE FOR ALL HATRED FOR NONE", author: "KHALIFATUL MASIH III" },
    { quote: "THE GREATEST GLORY IS NOT IN NEVER FALLING BUT IN RISING EVERY TIME WE FALL", author: "CONFUCIUS"},
];


const puzzleKeys = [
    "QWERTYUIOPASDFGHJKLZXCVBNM", "ZXCVBNMASDFGHJKLPOIUYTREWQ",
    "PLMOKNIJBUHVYGCTFXRDZESWAQ", "ASDFGHJKLQWERTYUIOPZXCVBNM",
    "POIUYTREWQLKJHGFDSAMNBVCXZ", "MNBVCXZASDFGHJKLPOIUYTREWQ",
    "QAZWSXEDCRFVTGBYHNUJMIKOLP", "LKJHGFDSAPOIUYTREWQMNBVCXZ",
    "AZSXDCFVGBHNJMKLIUYTREWQPO", "YTREWQPOIUASDFGHJKLMNBVCXZ",
    "QWERTZUIOPASDFGHJKLYXCVBNM", "YXCVBNMASDFGHJKLQWERTZUIOP",
    "ZAQWSXCDERFVBGTYHNMJUIKLOP", "PMLKONIJBGUHVYFCXDRZESWAQT"
]

const getDifficulty = (quote: string): Difficulty => {
    const length = quote.replace(/[^A-Z]/g, '').length;
    if (length <= 15) return 'easy';
    if (length <= 20) return 'medium';
    return 'hard';
}

export const puzzles: Puzzle[] = puzzleData.map((p, index) => {
    const cipher = createCipher(puzzleKeys[index % puzzleKeys.length]);
    return {
        ...p,
        id: index + 1,
        cipher,
        text: encrypt(p.quote, cipher),
        difficulty: getDifficulty(p.quote)
    }
});

const easyPuzzles = puzzles.filter(p => p.difficulty === 'easy');
const mediumPuzzles = puzzles.filter(p => p.difficulty === 'medium');
const hardPuzzles = puzzles.filter(p => p.difficulty === 'hard');

const getPuzzlePool = (difficulty: Difficulty): Puzzle[] => {
    switch (difficulty) {
        case 'easy':
            return easyPuzzles.length > 0 ? easyPuzzles : puzzles;
        case 'medium':
            return mediumPuzzles.length > 0 ? mediumPuzzles : puzzles;
        case 'hard':
            return hardPuzzles.length > 0 ? hardPuzzles : puzzles;
        default:
            return puzzles;
    }
}

export const getDailyPuzzle = (): Puzzle => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const puzzle = puzzles[dayOfYear % puzzles.length];
  // Force daily puzzle to be medium difficulty for reward consistency
  return { ...puzzle, difficulty: 'medium' };
};

export const getTotalPuzzles = (difficulty: Difficulty): number => {
    return getPuzzlePool(difficulty).length;
}

export const getPuzzleForLevel = (difficulty: Difficulty, level: number): Puzzle => {
    const puzzlePool = getPuzzlePool(difficulty);
    // level is 1-based, array is 0-based
    const index = (level - 1) % puzzlePool.length;
    return puzzlePool[index];
}

export const invertCipher = (cipher: Record<string, string>): Record<string, string> => {
  return Object.entries(cipher).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);
};

export const getCipherLetterToNumberMap = (encryptedText: string): Record<string, number> => {
    const uniqueLetters = [...new Set(encryptedText.split('').filter(c => /[A-Z]/.test(c)))].sort();
    const map: Record<string, number> = {};
    uniqueLetters.forEach((letter, index) => {
        map[letter] = index + 1;
    });
    return map;
}
