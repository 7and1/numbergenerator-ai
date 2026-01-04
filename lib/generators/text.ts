/**
 * Text and simulation generators.
 * Generates words, alphabet letters, unicode, ASCII, and simulated data.
 */

import type { GeneratorParams } from "../types";
import { clampInt } from "../core/arrays";
import { randomIntInclusive, setCurrentMode } from "../core/samplers";

const WORD_LISTS = {
  nouns: [
    "time",
    "year",
    "people",
    "way",
    "day",
    "man",
    "woman",
    "child",
    "world",
    "life",
    "hand",
    "part",
    "place",
    "case",
    "week",
    "company",
    "system",
    "program",
    "question",
    "work",
    "government",
    "number",
    "night",
    "point",
    "home",
    "water",
    "room",
    "mother",
    "area",
    "money",
    "story",
    "fact",
    "month",
    "lot",
    "right",
    "study",
    "book",
    "eye",
    "job",
    "word",
    "business",
    "issue",
    "side",
    "kind",
    "head",
    "house",
    "service",
    "friend",
    "father",
    "power",
    "hour",
    "game",
    "line",
    "end",
    "member",
    "law",
    "car",
    "city",
    "community",
    "name",
    "team",
    "minute",
    "idea",
    "kid",
    "body",
    "information",
    "back",
    "parent",
    "face",
    "others",
    "level",
    "office",
    "door",
    "health",
    "person",
    "art",
    "war",
    "history",
    "party",
    "result",
    "change",
    "morning",
    "reason",
    "research",
    "girl",
    "guy",
    "moment",
    "air",
    "teacher",
    "force",
    "education",
  ],
  verbs: [
    "be",
    "have",
    "do",
    "say",
    "go",
    "get",
    "make",
    "know",
    "think",
    "take",
    "see",
    "come",
    "want",
    "look",
    "use",
    "find",
    "give",
    "tell",
    "work",
    "call",
    "try",
    "ask",
    "need",
    "feel",
    "become",
    "leave",
    "put",
    "mean",
    "keep",
    "let",
    "begin",
    "seem",
    "help",
    "talk",
    "turn",
    "start",
    "show",
    "hear",
    "play",
    "run",
    "move",
    "like",
    "live",
    "believe",
    "hold",
    "bring",
    "happen",
    "write",
    "sit",
    "stand",
    "lose",
    "pay",
    "meet",
    "include",
    "continue",
    "set",
    "change",
    "lead",
    "understand",
    "watch",
    "follow",
    "stop",
    "create",
    "speak",
    "read",
    "allow",
    "add",
    "spend",
    "grow",
    "open",
    "walk",
    "win",
    "offer",
    "remember",
    "love",
    "consider",
    "appear",
    "buy",
    "wait",
    "serve",
    "die",
    "send",
    "expect",
    "build",
    "stay",
    "fall",
    "cut",
    "reach",
    "kill",
    "remain",
  ],
  adjectives: [
    "good",
    "new",
    "first",
    "last",
    "long",
    "great",
    "little",
    "own",
    "other",
    "old",
    "right",
    "big",
    "high",
    "different",
    "small",
    "large",
    "next",
    "early",
    "young",
    "important",
    "few",
    "public",
    "bad",
    "same",
    "able",
    "to",
    "of",
    "in",
    "for",
    "on",
    "with",
    "at",
    "from",
    "by",
    "about",
    "as",
    "into",
    "like",
    "through",
    "after",
    "over",
    "between",
    "out",
    "against",
    "during",
    "without",
    "before",
    "under",
    "around",
    "among",
    "white",
    "black",
    "red",
    "blue",
    "green",
    "yellow",
    "hot",
    "cold",
    "warm",
    "cool",
    "fast",
    "slow",
    "hard",
    "soft",
    "easy",
    "difficult",
    "happy",
    "sad",
    "angry",
    "afraid",
    "beautiful",
    "ugly",
    "clean",
    "dirty",
    "rich",
    "poor",
    "full",
    "empty",
    "heavy",
    "light",
    "loud",
    "quiet",
    "sharp",
    "dull",
    "wet",
    "dry",
    "sweet",
    "sour",
    "fresh",
    "stale",
    "strong",
    "weak",
    "brave",
    "cowardly",
    "wise",
    "foolish",
    "kind",
    "cruel",
    "calm",
    "wild",
  ],
};

const ALL_WORDS = [
  ...WORD_LISTS.nouns,
  ...WORD_LISTS.verbs,
  ...WORD_LISTS.adjectives,
];

export function generateWords(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("words");
  const resultsCount = clampInt(params.count, 1, 10_000, 1);
  const wordsPerResult = clampInt(params.word_count, 1, 1000, 10);
  const wordType = params.word_type ?? "all";

  const wordList =
    wordType === "nouns"
      ? WORD_LISTS.nouns
      : wordType === "verbs"
        ? WORD_LISTS.verbs
        : wordType === "adjectives"
          ? WORD_LISTS.adjectives
          : ALL_WORDS;

  const values = Array.from({ length: resultsCount }, () => {
    const words = Array.from({ length: wordsPerResult }, () => {
      const idx = randomIntInclusive(0, wordList.length - 1);
      return wordList[idx]!;
    });
    return words.join(" ");
  });
  const meta = {
    count: resultsCount,
    wordsPerResult,
    type: wordType,
    totalWords: wordList.length,
  };
  return { values, meta };
}

export function generateAlphabet(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("alphabet");
  const count = clampInt(params.count, 1, 10_000, 10);
  const letterCase = params.alphabet_case ?? "mixed";
  const vowelsOnly = Boolean(params.alphabet_vowels_only);

  const vowels = "AEIOU";
  const consonants = "BCDFGHJKLMNPQRSTVWXYZ";

  const generateLetter = (): string => {
    const source = vowelsOnly ? vowels : consonants + vowels;
    const letter = source[randomIntInclusive(0, source.length - 1)]!;

    switch (letterCase) {
      case "upper":
        return letter.toUpperCase();
      case "lower":
        return letter.toLowerCase();
      case "mixed":
        return randomIntInclusive(0, 1) === 0
          ? letter.toUpperCase()
          : letter.toLowerCase();
    }
  };

  const values = Array.from({ length: count }, generateLetter);
  const meta = { case: letterCase, vowelsOnly };
  return { values, meta };
}

export function generateUnicode(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("unicode");
  const count = clampInt(params.count, 1, 10_000, 10);
  const charsPerResult = clampInt(params.unicode_count, 1, 100, 1);
  const range = params.unicode_range ?? "basic";

  const ranges: Record<string, Array<[number, number]>> = {
    basic: [[0x0020, 0x007e]],
    latin: [
      [0x0020, 0x007e],
      [0x00a0, 0x00ff],
      [0x0100, 0x017f],
    ],
    emoji: [[0x1f300, 0x1f9ff]],
    symbols: [
      [0x2000, 0x206f],
      [0x2100, 0x214f],
      [0x2190, 0x21ff],
    ],
    all: [[0x0020, 0xffff]],
  };

  const selectedRanges = ranges[range] || ranges.basic;

  const getRandomChar = (): string => {
    const randomRange =
      selectedRanges[randomIntInclusive(0, selectedRanges.length - 1)]!;
    const [min, max] = randomRange;
    const codePoint = randomIntInclusive(min, max);
    return String.fromCodePoint(codePoint);
  };

  const values = Array.from({ length: count }, () => {
    let result = "";
    for (let i = 0; i < charsPerResult; i++) {
      result += getRandomChar();
    }
    return result;
  });
  const meta = { range, charsPerResult };
  return { values, meta };
}

export function generateASCII(params: GeneratorParams): {
  values: string[];
  meta: Record<string, unknown>;
} {
  setCurrentMode("ascii");
  const count = clampInt(params.count, 1, 10_000, 10);
  const charsPerResult = clampInt(params.ascii_count, 1, 1000, 10);
  const printableOnly = params.ascii_printable !== false;

  const min = printableOnly ? 32 : 0;
  const max = printableOnly ? 126 : 255;

  const values = Array.from({ length: count }, () => {
    let result = "";
    for (let i = 0; i < charsPerResult; i++) {
      result += String.fromCharCode(randomIntInclusive(min, max));
    }
    return result;
  });
  const meta = { printableOnly, charsPerResult };
  return { values, meta };
}
