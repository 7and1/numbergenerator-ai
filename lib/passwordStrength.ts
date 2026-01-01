/**
 * Password Strength Calculator
 *
 * Calculates password strength using entropy-based scoring with penalties for
 * common patterns and repeated characters. Based on NIST SP 800-63B guidelines
 * and modern password cracking estimates.
 *
 * @see https://pages.nist.gov/800-63-3/sp800-63b.html#sec5
 */

/**
 * Strength level enum
 */
export enum StrengthLevel {
  VERY_WEAK = 0,
  WEAK = 1,
  FAIR = 2,
  GOOD = 3,
  STRONG = 4,
  VERY_STRONG = 5,
}

/**
 * Common password patterns that reduce strength
 */
const COMMON_PATTERNS = [
  /123456/,
  /12345678/,
  /123456789/,
  /1234/,
  /password/i,
  /qwerty/i,
  /abc123/i,
  /letmein/i,
  /admin/i,
  /welcome/i,
  /monkey/i,
  /dragon/i,
  /111111/,
  /000000/,
  /222222/,
  /333333/,
  /aaaaaaaa/,
  /bbbbbbbb/,
  /cccccccc/,
  /abcdefgh/,
  /abcd1234/,
];

/**
 * Keyboard adjacency patterns (rows, diagonals)
 */
const KEYBOARD_PATTERNS = [
  /qwerty/i,
  /asdfgh/i,
  /zxcvb/i,
  /qwertyuiop/i,
  /asdfghjkl/i,
  /zxcvbnm/i,
  /1qaz/i,
  /2wsx/i,
  /3edc/i,
];

/**
 * Repeated character patterns
 */
const REPEATED_PATTERN = /(.)\1{2,}/;

/**
 * Calculate character pool size based on character types present
 */
function calculatePoolSize(password: string): number {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigits = /\d/.test(password);
  const hasSymbols = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password);
  const hasSpaces = /\s/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigits) poolSize += 10;
  if (hasSymbols) poolSize += 32;
  if (hasSpaces) poolSize += 1;

  // Count unique special characters not in standard sets
  const uniqueChars = new Set(password.split(""));
  const standardSet = new Set([
    ..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    ..."!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~ ",
  ]);
  const extraChars = [...uniqueChars].filter((c) => !standardSet.has(c));
  poolSize += extraChars.length;

  return Math.max(poolSize, uniqueChars.size);
}

/**
 * Calculate entropy bits using the formula: entropy = length * log2(pool_size)
 */
function calculateEntropyBits(password: string, poolSize: number): number {
  if (password.length === 0 || poolSize <= 1) return 0;
  return password.length * Math.log2(poolSize);
}

/**
 * Calculate character variety bonus (0-10 points)
 */
function calculateVarietyBonus(password: string): number {
  let bonus = 0;
  const uniqueChars = new Set(password.split(""));

  // Unique character ratio bonus (max 3 points)
  const uniqueRatio = uniqueChars.size / password.length;
  bonus += Math.round(uniqueRatio * 3);

  // Check for repeated characters penalty within variety bonus
  // If password has low actual variety (mostly same char), reduce bonus
  const maxRepeat = Math.max(
    ...password.split("").map((c) => {
      const matches = password.match(
        new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      );
      return matches ? matches.length : 1;
    }),
  );
  if (maxRepeat > password.length * 0.5) {
    bonus -= 2; // Significant penalty for passwords that are mostly one character
  }

  // Character type variety bonus (max 4 points)
  if (/[a-z]/.test(password)) bonus += 1;
  if (/[A-Z]/.test(password)) bonus += 1;
  if (/\d/.test(password)) bonus += 1;
  if (/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\s]/.test(password)) bonus += 1;

  // Mixed case bonus (1 point)
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) bonus += 1;

  // Number and symbol mix bonus (1 point)
  if (
    /\d/.test(password) &&
    /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~\s]/.test(password)
  )
    bonus += 1;

  return Math.max(0, Math.min(bonus, 10));
}

/**
 * Calculate penalty for common patterns (0-30 points)
 */
function calculatePatternPenalty(password: string): number {
  let penalty = 0;

  // Check common password patterns
  for (const pattern of COMMON_PATTERNS) {
    if (pattern.test(password)) {
      penalty += 15;
      break;
    }
  }

  // Check keyboard patterns
  for (const pattern of KEYBOARD_PATTERNS) {
    if (pattern.test(password)) {
      penalty += 10;
      break;
    }
  }

  // Repeated characters penalty
  const repeatedMatches = password.match(REPEATED_PATTERN);
  if (repeatedMatches) {
    penalty += repeatedMatches.length * 3;
  }

  // Sequential characters (abc, 123, etc.)
  const sequentialPattern =
    /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
  if (sequentialPattern.test(password)) {
    penalty += 10;
  }

  return Math.min(penalty, 30);
}

/**
 * Calculate length bonus (0-15 points)
 */
function calculateLengthBonus(length: number): number {
  if (length < 8) return 0;
  if (length < 12) return 3;
  if (length < 16) return 7;
  if (length < 20) return 10;
  return 15;
}

/**
 * Estimate time to crack based on entropy bits
 * Assumes a powerful cracking setup (100 billion guesses/second)
 */
function estimateCrackTime(entropyBits: number): {
  time: string;
  seconds: number;
} {
  // Assumptions based on 2024 cracking hardware capabilities
  const GUESSES_PER_SECOND = 100_000_000_000; // 100 billion/sec for GPU/ASIC rigs
  const guesses = Math.pow(2, entropyBits);
  const seconds = guesses / GUESSES_PER_SECOND;

  if (seconds < 1) {
    return { time: "Instantly", seconds: 0 };
  }
  if (seconds < 60) {
    return { time: `${Math.round(seconds)} seconds`, seconds };
  }
  if (seconds < 3600) {
    const mins = Math.round(seconds / 60);
    return { time: `${mins} minute${mins > 1 ? "s" : ""}`, seconds };
  }
  if (seconds < 86400) {
    const hours = Math.round(seconds / 3600);
    return { time: `${hours} hour${hours > 1 ? "s" : ""}`, seconds };
  }
  if (seconds < 31536000) {
    const days = Math.round(seconds / 86400);
    return { time: `${days} day${days > 1 ? "s" : ""}`, seconds };
  }
  if (seconds < 31536000 * 100) {
    const years = Math.round(seconds / 31536000);
    return { time: `${years} year${years > 1 ? "s" : ""}`, seconds };
  }
  if (seconds < 31536000 * 1000000) {
    const millennia = Math.round(seconds / 31536000 / 1000);
    return { time: `${millennia} millennia`, seconds };
  }
  return { time: "Forever", seconds };
}

/**
 * Check NIST SP 800-63B guidelines compliance
 */
function checkNistCompliance(password: string): {
  compliant: boolean;
  requirements: {
    minLength: boolean;
    maxLength: boolean;
    noRequired: boolean; // NIST says no composition rules
  };
} {
  return {
    compliant: password.length >= 8 && password.length <= 64,
    requirements: {
      minLength: password.length >= 8,
      maxLength: password.length <= 64,
      noRequired: true, // NIST 800-63B no longer requires character types
    },
  };
}

/**
 * Password requirements checklist
 */
function checkRequirements(password: string): {
  minLength: boolean;
  hasLower: boolean;
  hasUpper: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  met: number;
  total: number;
} {
  const minLength = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password);

  const met = [minLength, hasLower, hasUpper, hasDigit, hasSymbol].filter(
    Boolean,
  ).length;

  return {
    minLength,
    hasLower,
    hasUpper,
    hasDigit,
    hasSymbol,
    met,
    total: 5,
  };
}

/**
 * Full password strength analysis result
 */
export interface PasswordStrengthResult {
  score: number; // 0-100
  level: StrengthLevel;
  label: string;
  color: string;
  entropyBits: number;
  crackTime: {
    time: string;
    seconds: number;
  };
  requirements: ReturnType<typeof checkRequirements>;
  nistCompliant: boolean;
  feedback: string[];
  poolSize: number;
}

/**
 * Get strength level properties
 */
function getStrengthLevelProps(level: StrengthLevel): {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
} {
  switch (level) {
    case StrengthLevel.VERY_WEAK:
      return {
        label: "Very Weak",
        color: "#ef4444",
        bgClass: "bg-red-500",
        textClass: "text-red-500",
      };
    case StrengthLevel.WEAK:
      return {
        label: "Weak",
        color: "#f97316",
        bgClass: "bg-orange-500",
        textClass: "text-orange-500",
      };
    case StrengthLevel.FAIR:
      return {
        label: "Fair",
        color: "#eab308",
        bgClass: "bg-yellow-500",
        textClass: "text-yellow-500",
      };
    case StrengthLevel.GOOD:
      return {
        label: "Good",
        color: "#84cc16",
        bgClass: "bg-lime-500",
        textClass: "text-lime-500",
      };
    case StrengthLevel.STRONG:
      return {
        label: "Strong",
        color: "#22c55e",
        bgClass: "bg-green-500",
        textClass: "text-green-500",
      };
    case StrengthLevel.VERY_STRONG:
      return {
        label: "Very Strong",
        color: "#3b82f6",
        bgClass: "bg-blue-500",
        textClass: "text-blue-500",
      };
    default:
      return {
        label: "Unknown",
        color: "#6b7280",
        bgClass: "bg-gray-500",
        textClass: "text-gray-500",
      };
  }
}

/**
 * Generate feedback based on password analysis
 */
function generateFeedback(
  password: string,
  entropyBits: number,
  requirements: ReturnType<typeof checkRequirements>,
  patternPenalty: number,
): string[] {
  const feedback: string[] = [];

  if (password.length === 0) {
    return ["Enter a password to see its strength."];
  }

  if (password.length < 8) {
    feedback.push("Use at least 8 characters for better security.");
  }

  if (!requirements.hasLower) {
    feedback.push("Add lowercase letters (a-z).");
  }

  if (!requirements.hasUpper) {
    feedback.push("Add uppercase letters (A-Z).");
  }

  if (!requirements.hasDigit) {
    feedback.push("Add numbers (0-9).");
  }

  if (!requirements.hasSymbol) {
    feedback.push("Add special characters (!@#$%...).");
  }

  if (patternPenalty > 0) {
    feedback.push("Avoid common patterns and repeated characters.");
  }

  if (entropyBits < 40) {
    feedback.push("This password can be cracked quickly.");
  } else if (entropyBits >= 80 && requirements.met === 5) {
    feedback.push("Great password! Very hard to crack.");
  }

  return feedback.length > 0 ? feedback : ["Looking good!"];
}

/**
 * Main function to calculate password strength
 *
 * @param password - The password to analyze
 * @returns Complete strength analysis
 */
export function calculatePasswordStrength(
  password: string,
): PasswordStrengthResult {
  // Handle empty password
  if (!password || password.length === 0) {
    return {
      score: 0,
      level: StrengthLevel.VERY_WEAK,
      label: "Very Weak",
      color: "#ef4444",
      entropyBits: 0,
      crackTime: { time: "Instantly", seconds: 0 },
      requirements: checkRequirements(""),
      nistCompliant: false,
      feedback: ["Enter a password to see its strength."],
      poolSize: 0,
    };
  }

  // Calculate components
  const poolSize = calculatePoolSize(password);
  const entropyBits = calculateEntropyBits(password, poolSize);
  const varietyBonus = calculateVarietyBonus(password);
  const lengthBonus = calculateLengthBonus(password.length);
  const patternPenalty = calculatePatternPenalty(password);

  // Calculate base score from entropy (0-60 points)
  // 80 bits = 60 points (excellent), 0 bits = 0 points
  const entropyScore = Math.min(60, Math.max(0, (entropyBits / 80) * 60));

  // Calculate final score (0-100)
  let score = Math.round(
    entropyScore + varietyBonus + lengthBonus - patternPenalty,
  );
  score = Math.max(0, Math.min(100, score));

  // Determine strength level
  let level: StrengthLevel;
  if (score < 20) level = StrengthLevel.VERY_WEAK;
  else if (score < 40) level = StrengthLevel.WEAK;
  else if (score < 55) level = StrengthLevel.FAIR;
  else if (score < 70) level = StrengthLevel.GOOD;
  else if (score < 85) level = StrengthLevel.STRONG;
  else level = StrengthLevel.VERY_STRONG;

  const levelProps = getStrengthLevelProps(level);
  const requirements = checkRequirements(password);
  const nistCompliance = checkNistCompliance(password);
  const crackTime = estimateCrackTime(entropyBits);
  const feedback = generateFeedback(
    password,
    entropyBits,
    requirements,
    patternPenalty,
  );

  return {
    score,
    level,
    label: levelProps.label,
    color: levelProps.color,
    entropyBits: Math.round(entropyBits * 10) / 10,
    crackTime,
    requirements,
    nistCompliant: nistCompliance.compliant,
    feedback,
    poolSize,
  };
}

/**
 * Quick strength check (returns score only)
 */
export function getPasswordScore(password: string): number {
  return calculatePasswordStrength(password).score;
}

/**
 * Get strength level for a given score
 */
export function getStrengthLevel(score: number): StrengthLevel {
  if (score < 20) return StrengthLevel.VERY_WEAK;
  if (score < 40) return StrengthLevel.WEAK;
  if (score < 55) return StrengthLevel.FAIR;
  if (score < 70) return StrengthLevel.GOOD;
  if (score < 85) return StrengthLevel.STRONG;
  return StrengthLevel.VERY_STRONG;
}
