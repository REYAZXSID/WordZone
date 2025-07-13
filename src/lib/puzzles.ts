
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
    // Easy (<= 19 letters)
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

    // Medium (20-29 letters)
    { quote: "KNOWLEDGE IS POWER", author: "FRANCIS BACON" },
    { quote: "SIMPLICITY IS THE KEY", author: "BRUCE LEE"},
    { quote: "LEARNING NEVER ENDS", author: "UNKNOWN" },
    { quote: "STAY HUNGRY STAY FOOLISH", author: "STEVE JOBS" },
    { quote: "LOVE FOR ALL HATRED FOR NONE", author: "KHALIFATUL MASIH III" },
    { quote: "HAVE NO FEAR OF PERFECTION", author: "SALVADOR DALI"},
    { quote: "THE FUTURE IS NOW", author: "UNKNOWN"},
    { quote: "STRIVE FOR GREATNESS", author: "LEBRON JAMES"},
    { quote: "NEVER LOOK BACK", author: "PROVERB"},
    { quote: "EVERY MOMENT IS A FRESH BEGINNING", author: "T.S. ELIOT"},

    // Hard (30-39 letters)
    { quote: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG", author: "PANGRAM" },
    { quote: "THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF", author: "FRANKLIN D ROOSEVELT" },
    { quote: "ASK NOT WHAT YOUR COUNTRY CAN DO FOR YOU", author: "JOHN F KENNEDY"},
    { quote: "IN THE MIDDLE OF DIFFICULTY LIES OPPORTUNITY", author: "ALBERT EINSTEIN"},
    { quote: "A JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP", author: "LAO TZU"},
    { quote: "THE BEST WAY TO PREDICT THE FUTURE IS TO INVENT IT", author: "ALAN KAY"},
    
    // Intermediate (40-49 letters)
    { quote: "THAT'S ONE SMALL STEP FOR A MAN ONE GIANT LEAP FOR MANKIND", author: "NEIL ARMSTRONG" },
    { quote: "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO", author: "STEVE JOBS"},
    { quote: "SUCCESS IS NOT FINAL, FAILURE IS NOT FATAL: IT IS THE COURAGE TO CONTINUE THAT COUNTS", author: "WINSTON CHURCHILL"},
    { quote: "THE PURPOSE OF OUR LIVES IS TO BE HAPPY", author: "DALAI LAMA"},

    // Advance (50+)
    { quote: "TWO ROADS DIVERGED IN A WOOD AND I TOOK THE ONE LESS TRAVELED BY", author: "ROBERT FROST" },
    { quote: "THE GREATEST GLORY IN LIVING LIES NOT IN NEVER FALLING BUT IN RISING EVERY TIME WE FALL", author: "NELSON MANDELA"},
    { quote: "WHETHER YOU THINK YOU CAN OR YOU THINK YOU CAN'T YOU'RE RIGHT", author: "HENRY FORD" },
    { quote: "YOU MISS ONE HUNDRED PERCENT OF THE SHOTS YOU DON'T TAKE", author: "WAYNE GRETZKY"},
    { quote: "TO BE YOURSELF IN A WORLD THAT IS CONSTANTLY TRYING TO MAKE YOU SOMETHING ELSE IS THE GREATEST ACCOMPLISHMENT", author: "RALPH WALDO EMERSON"},
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
    "CRFVTGBYHNUJMIKOLPWSXEDQAZ", "TREWQPOIUYASDFGHJKLMNBVCXZ"
]

const getDifficulty = (quote: string): Difficulty => {
    const length = quote.replace(/[^A-Z]/g, '').length;
    if (length < 20) return 'easy';
    if (length >= 20 && length <= 29) return 'medium';
    if (length >= 30 && length <= 39) return 'hard';
    if (length >= 40 && length <= 49) return 'intermediate';
    return 'advance';
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
            return easyPuzzles.length > 0 ? easyPuzzles : puzzles;
        case 'medium':
            return mediumPuzzles.length > 0 ? mediumPuzzles : puzzles;
        case 'hard':
            return hardPuzzles.length > 0 ? hardPuzzles : puzzles;
        case 'intermediate':
            return intermediatePuzzles.length > 0 ? intermediatePuzzles : puzzles;
        case 'advance':
            return advancePuzzles.length > 0 ? advancePuzzles : puzzles;
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
    // Each category has 50 levels now.
    return 50;
}

export const getPuzzleForLevel = (difficulty: Difficulty, level: number): Puzzle => {
    const difficultyOrder: Difficulty[] = ['easy', 'medium', 'hard', 'intermediate', 'advance'];
    const difficultyIndex = difficultyOrder.indexOf(difficulty);

    const puzzlePool = getPuzzlePool(difficulty);
    if (puzzlePool.length === 0) {
        // Fallback to all puzzles if a category is empty
        const fallbackIndex = (level - 1) % puzzles.length;
        return puzzles[fallbackIndex];
    }
    
    // Create a deterministic but unique index for each level/difficulty combination
    const uniqueIndex = (level - 1 + (difficultyIndex * 50)) % puzzles.length;

    // To ensure variety within a category, we'll use the unique index to pick from the main puzzle list,
    // then find a puzzle that matches the desired difficulty. This is a simple way to get variety
    // without complex mapping, but it may not always provide a puzzle of the exact difficulty
    // if the main pool is not perfectly balanced. For this implementation, we will cycle within the
    // specific difficulty pool to ensure difficulty is respected.
    
    const categoryIndex = (level - 1) % puzzlePool.length;
    
    // We create a new puzzle object to ensure the ID is unique for the level
    const basePuzzle = puzzlePool[categoryIndex];
    const newId = (difficultyIndex * 1000) + level;
    
    // Re-encrypt with a different key to ensure the puzzle itself is unique
    const keyIndex = (newId) % puzzleKeys.length;
    const newCipher = createCipher(puzzleKeys[keyIndex]);
    
    return {
        ...basePuzzle,
        id: newId,
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
