export type Puzzle = {
  id: number;
  text: string;
  quote: string;
  author: string;
  cipher: Record<string, string>; // Decrypted -> Encrypted
};

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
        quote: "BE KIND WHENEVER POSSIBLE",
        author: "DALAI LAMA"
    },
    {
        quote: "DREAM AS IF YOU WILL LIVE FOREVER",
        author: "JAMES DEAN"
    },
    {
        quote: "SIMPLICITY IS THE ULTIMATE SOPHISTICATION",
        author: "LEONARDO DA VINCI"
    },
    {
        quote: "WHATEVER YOU ARE BE A GOOD ONE",
        author: "ABRAHAM LINCOLN"
    },
    {
        quote: "LIVE THE LIFE YOU HAVE IMAGINED",
        author: "HENRY DAVID THOREAU"
    },
    {
        quote: "THE JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP",
        author: "LAO TZU"
    },
    {
        quote: "KNOWLEDGE IS POWER",
        author: "FRANCIS BACON"
    }
];


const puzzleKeys = [
    "QWERTYUIOPASDFGHJKLZXCVBNM",
    "ZXCVBNMASDFGHJKLPOIUYTREWQ",
    "PLMOKNIJBUHVYGCTFXRDZESWAQ",
    "ASDFGHJKLQWERTYUIOPZXCVBNM",
    "POIUYTREWQLKJHGFDSAMNBVCXZ",
    "MNBVCXZASDFGHJKLPOIUYTREWQ",
    "QAZWSXEDCRFVTGBYHNUJMIKOLP"
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


export const getDailyPuzzle = (): Puzzle => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return puzzles[dayOfYear % puzzles.length];
};

export const getRandomPuzzle = (): Puzzle => {
    return puzzles[Math.floor(Math.random() * puzzles.length)];
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
