export type Puzzle = {
  id: number;
  text: string;
  quote: string;
  author: string;
  cipher: Record<string, string>; // Decrypted -> Encrypted
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
      if (cipher[char]) {
        return cipher[char];
      }
      return char;
    })
    .join("");
};

const puzzleData: Omit<Puzzle, 'text' | 'cipher' | 'id'>[] = [
    {
        quote: "GO TO HELL", // 10
        author: "UNKNOWN"
    },
    {
        quote: "BE YOURSELF", // 11
        author: "OSCAR WILDE"
    },
    {
        quote: "TIME IS MONEY", // 13
        author: "BENJAMIN FRANKLIN"
    },
    {
        quote: "NEVER GIVE UP", // 13
        author: "WINSTON CHURCHILL"
    },
    {
        quote: "I HAVE A DREAM", // 14
        author: "MARTIN LUTHER KING"
    },
    {
        quote: "THINK DIFFERENT", // 15
        author: "APPLE"
    },
    {
        quote: "KNOWLEDGE IS POWER", // 18
        author: "FRANCIS BACON"
    },
    {
        quote: "LEARNING NEVER ENDS", // 20
        author: "UNKNOWN"
    },
    {
        quote: "STAY HUNGRY STAY FOOLISH", // 26 > 20, but we need some hard ones.
        author: "STEVE JOBS"
    },
    {
        quote: "LOVE FOR ALL HATRED FOR NONE", // 29 > 20
        author: "KHALIFATUL MASIH III"
    }
];


const puzzleKeys = [
    "QWERTYUIOPASDFGHJKLZXCVBNM",
    "ZXCVBNMASDFGHJKLPOIUYTREWQ",
    "PLMOKNIJBUHVYGCTFXRDZESWAQ",
    "ASDFGHJKLQWERTYUIOPZXCVBNM",
    "POIUYTREWQLKJHGFDSAMNBVCXZ",
    "MNBVCXZASDFGHJKLPOIUYTREWQ",
    "QAZWSXEDCRFVTGBYHNUJMIKOLP",
    "LKJHGFDSAPOIUYTREWQMNBVCXZ",
    "AZSXDCFVGBHNJMKLIUYTREWQPO",
    "YTREWQPOIUASDFGHJKLMNBVCXZ"
]

export const puzzles: Puzzle[] = puzzleData.map((p, index) => {
    const cipher = createCipher(puzzleKeys[index % puzzleKeys.length]);
    return {
        ...p,
        id: index + 1,
        cipher,
        text: encrypt(p.quote, cipher)
    }
});

const easyPuzzles = puzzles.filter(p => p.quote.length <= 10);
const mediumPuzzles = puzzles.filter(p => p.quote.length > 10 && p.quote.length <= 15);
const hardPuzzles = puzzles.filter(p => p.quote.length > 15);


export const getDailyPuzzle = (): Puzzle => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return puzzles[dayOfYear % puzzles.length];
};

export const getRandomPuzzle = (difficulty?: Difficulty): Puzzle => {
    let puzzlePool: Puzzle[];

    switch (difficulty) {
        case 'easy':
            puzzlePool = easyPuzzles.length > 0 ? easyPuzzles : puzzles;
            break;
        case 'medium':
            puzzlePool = mediumPuzzles.length > 0 ? mediumPuzzles : puzzles;
            break;
        case 'hard':
            puzzlePool = hardPuzzles.length > 0 ? hardPuzzles : puzzles;
            break;
        default:
            puzzlePool = puzzles;
    }
    
    return puzzlePool[Math.floor(Math.random() * puzzlePool.length)];
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
