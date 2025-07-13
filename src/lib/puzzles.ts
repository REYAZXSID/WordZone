
export type Puzzle = {
  id: number;
  text: string;
  quote: string;
  author: string;
  cipher: Record<string, string>; // Decrypted -> Encrypted
  difficulty: Difficulty;
};

export type Difficulty = 'easy' | 'medium' | 'hard' | 'intermediate' | 'advance';

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
    // Easy (1-19 letters)
    { quote: "GO TO HELL", author: "UNKNOWN" },
    { quote: "BE YOURSELF", author: "OSCAR WILDE" },
    { quote: "I AM LEGEND", author: "RICHARD MATHESON"},
    { quote: "JUST DO IT", author: "NIKE"},
    { quote: "TIME IS MONEY", author: "BENJAMIN FRANKLIN" },
    { quote: "NEVER GIVE UP", author: "WINSTON CHURCHILL" },
    { quote: "I HAVE A DREAM", author: "MARTIN LUTHER KING" },
    { quote: "THINK DIFFERENT", author: "APPLE" },
    { quote: "SEIZE THE DAY", author: "HORACE"},
    { quote: "TO BE OR NOT TO BE", author: "SHAKESPEARE"},
    { quote: "LIVE AND LET LIVE", author: "PROVERB"},
    { quote: "LESS IS MORE", author: "MIES VAN DER ROHE"},
    { quote: "ACTIONS SPEAK LOUDER", author: "PROVERB"},
    { quote: "DREAM BIG", author: "UNKNOWN"},
    { quote: "CARPE DIEM", author: "HORACE"},
    { quote: "FOLLOW YOUR HEART", author: "UNKNOWN"},
    { quote: "KEEP IT SIMPLE", author: "KELLY JOHNSON"},
    { quote: "STAY STRONG", author: "DEMI LOVATO"},
    { quote: "DO IT NOW", author: "UNKNOWN"},
    { quote: "NO PAIN NO GAIN", author: "PROVERB"},

    // Medium (20-25 letters)
    { quote: "KNOWLEDGE IS POWER", author: "FRANCIS BACON" },
    { quote: "SIMPLICITY IS THE KEY", author: "BRUCE LEE"},
    { quote: "LEARNING NEVER ENDS", author: "UNKNOWN" },
    { quote: "THE FUTURE IS NOW", author: "UNKNOWN"},
    { quote: "STRIVE FOR GREATNESS", author: "LEBRON JAMES"},
    { quote: "NEVER LOOK BACK", author: "PROVERB"},
    { quote: "TURN WOUNDS INTO WISDOM", author: "OPRAH WINFREY" },
    { quote: "CHASE THE VISION", author: "TONY HSIEH" },
    { quote: "LOVE CONQUERS ALL", author: "VIRGIL" },
    { quote: "THE BEST IS YET TO COME", author: "FRANK SINATRA" },
    
    // This range will be split between hard, intermediate, and advance
    // Hard (30-35 letters)
    { quote: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG", author: "PANGRAM" },
    { quote: "HAVE NO FEAR OF PERFECTION", author: "SALVADOR DALI"},
    { quote: "IN THE MIDDLE OF DIFFICULTY LIES OPPORTUNITY", author: "ALBERT EINSTEIN"},
    { quote: "THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT", author: "ALAN KAY"},
    { quote: "LIFE IS WHAT HAPPENS WHEN YOU'RE BUSY MAKING OTHER PLANS", author: "JOHN LENNON" },

    // Intermediate (30-35 letters, trickier)
    { quote: "EVERY MOMENT IS A FRESH BEGINNING", author: "T.S. ELIOT"},
    { quote: "THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF", author: "FRANKLIN D ROOSEVELT" },
    { quote: "ASK NOT WHAT YOUR COUNTRY CAN DO FOR YOU", author: "JOHN F KENNEDY"},
    { quote: "A JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP", author: "LAO TZU"},
    { quote: "THE PURPOSE OF OUR LIVES IS TO BE HAPPY", author: "DALAI LAMA"},

    // Advance (30-35 letters) - These were previously longer
    { quote: "STAY HUNGRY STAY FOOLISH", author: "STEVE JOBS" },
    { quote: "LOVE FOR ALL HATRED FOR NONE", author: "KHALIFATUL MASIH III" },
    { quote: "THAT'S ONE SMALL STEP FOR A MAN ONE GIANT LEAP", author: "NEIL ARMSTRONG" }, // Shortened
    { quote: "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO", author: "STEVE JOBS"},
    { quote: "WHETHER YOU THINK YOU CAN OR YOU CAN'T YOU'RE RIGHT", author: "HENRY FORD" }, // Shortened
];


const puzzleKeys = [
    "QWERTYUIOPASDFGHJKLZXCVBNM", "ZXCVBNMASDFGHJKLPOIUYTREWQ",
    "PLMOKNIJBUHVYGCTFXRDZESWAQ", "ASDFGHJKLQWERTYUIOPZXCVBNM",
    "POIUYTREWQLKJHGFDSAMNBVCXZ", "MNBVCXZASDFGHJKLPOIUYTREWQ",
    "QAZWSXEDCRFVTGBYHNUJMIKOLP", "LKJHGFDSAPOIUYTREWQMNBVCXZ",
    "AZSXDCFVGBHNJMKLIUYTREWQPO", "YTREWQPOIUASDFGHJKLMNBVCXZ",
    "QWERTZUIOPASDFGHJKLYXCVBNM", "YXCVBNMASDFGHJKLQWERTZUIOP",
    "ZAQWSXCDERFVBGTYHNMJUIKLOP", "PMLKONIJBGUHVYFCXDRZESWAQT",
    "BCDEFGHIJKLMNOPQRSTUVWXYZA", "DEFGHIJKLMNOPQRSTUVWXYZABC",
    "VFRSWCXDEQAZBGTYHNMJUIKLOP", "HGFDSAPOIUYTREWQMNBVCXZLKJ",
    "OKMIJNUHBYGVTFCRDXESZWAQPL", "BVCXZLKJHGFDSAPOIUYTREWQMN",
    "CRFVTGBYHNUJMIKOLPWSXEDQAZ", "TREWQPOIUYASDFGHJKLMNBVCXZ",
    "FGHJKLQWERTYUIOPZXCVBNMADS", "TREWQLKJHGFDSAMNBVCXZOPIUY",
    "VCXZASDFGHJKLPOIUYTREWQMNB", "EDCRFVTGBYHNUJMIKOLPWSXQAZ",
    "HGFDSAPOIUYTREWQMNBVCXZLKJ", "TGBYHNUJMIKOLPWSXEDCRFVQAZ",
    "SWCXDEQAZBGTYHNMJUIKLOPVFR", "UJMNCDEQAZBGTYHIKOLPVFRSWX"
];

// This counter helps distribute puzzles in the 30-35 letter range
let longPuzzleCounter = 0;

const getDifficulty = (quote: string): Difficulty => {
    const length = quote.replace(/[^A-Z]/g, '').length;
    if (length <= 19) return 'easy';
    if (length >= 20 && length <= 25) return 'medium';
    if (length >= 30 && length <= 35) {
        // Distribute puzzles in this range across hard, intermediate, and advance
        const categoryIndex = longPuzzleCounter % 3;
        longPuzzleCounter++;
        if (categoryIndex === 0) return 'hard';
        if (categoryIndex === 1) return 'intermediate';
        return 'advance';
    }

    // Fallback for any quotes that might be outside the defined ranges
    // This part is less likely to be hit now with the adjusted quotes
    if (length > 35) return 'advance'; // Catch any remaining long quotes
    if (length > 25) return 'hard';
    return 'easy';
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
const intermediatePuzzles = puzzles.filter(p => p.difficulty === 'intermediate');
const advancePuzzles = puzzles.filter(p => p.difficulty === 'advance');

const getPuzzlePool = (difficulty: Difficulty): Puzzle[] => {
    switch (difficulty) {
        case 'easy':
            return easyPuzzles;
        case 'medium':
            return mediumPuzzles;
        case 'hard':
            return hardPuzzles;
        case 'intermediate':
            return intermediatePuzzles;
        case 'advance':
            return advancePuzzles;
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
  
  // Use a puzzle from the full list to ensure variety
  const puzzleIndex = dayOfYear % puzzles.length;
  const puzzle = puzzles[puzzleIndex];
  
  // To ensure the daily puzzle is unique and doesn't just repeat a level,
  // we re-encrypt it with a key based on the day of the year.
  const dailyKeyIndex = dayOfYear % puzzleKeys.length;
  const dailyCipher = createCipher(puzzleKeys[dailyKeyIndex]);
  
  return { 
    ...puzzle, 
    id: 10000 + dayOfYear, // Unique ID for daily puzzles
    difficulty: 'medium', // Keep daily challenge consistent
    cipher: dailyCipher,
    text: encrypt(puzzle.quote, dailyCipher)
  };
};


export const getTotalPuzzles = (difficulty: Difficulty): number => {
    return 50;
}

export const getPuzzleForLevel = (difficulty: Difficulty, level: number): Puzzle | undefined => {
    if (level <= 0 || level > 50) {
        return undefined;
    }

    const puzzlePool = getPuzzlePool(difficulty);
    const totalPuzzlesInPool = puzzlePool.length;

    if (totalPuzzlesInPool === 0) {
        return undefined; // No puzzles for this difficulty
    }
    
    // This calculation ensures each of the 50 levels gets a unique puzzle if possible,
    // and wraps around in a more distributed way if there are fewer than 50 puzzles.
    const poolIndex = (level - 1) % totalPuzzlesInPool;
    const basePuzzle = puzzlePool[poolIndex];

    // To make each of the 50 levels feel unique even if base quotes are reused,
    // we use a different cipher key for each level. This key is based on the level and difficulty.
    const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard', 'intermediate', 'advance'];
    const difficultyIndex = difficultyOrder.indexOf(difficulty);
    const keyIndex = (level - 1 + difficultyIndex * 50) % puzzleKeys.length;
    const newCipher = createCipher(puzzleKeys[keyIndex]);
    
    const uniqueLevelId = (difficultyIndex * 1000) + level;

    return {
        ...basePuzzle,
        id: uniqueLevelId,
        cipher: newCipher,
        text: encrypt(basePuzzle.quote, newCipher),
    };
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
