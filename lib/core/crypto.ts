/**
 * Cryptographic random number generation utilities.
 * Provides secure random generation with configurable fallback behavior.
 */

/**
 * Security modes for password/PIN generation
 * - SECURE: Requires crypto API, throws error if unavailable
 * - BEST_EFFORT: Falls back to Math.random() if crypto unavailable
 */
export type SecurityMode = "SECURE" | "BEST_EFFORT";

/**
 * Global security mode setting. Set to "SECURE" for password/PIN generation.
 * This prevents insecure fallback to Math.random() for security-sensitive operations.
 */
export const SECURE_MODE: SecurityMode = "SECURE";

/**
 * Get the Web Crypto API instance.
 * Throws an error if crypto is not available.
 * Used for security-sensitive operations like password/PIN generation.
 */
export const getCrypto = (): Crypto => {
  const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
  if (c && typeof c.getRandomValues === "function") return c as Crypto;
  throw new Error(
    "Secure random number generator not available. " +
      "Please use a modern browser with Web Crypto API support.",
  );
};

/**
 * Get crypto with fallback support for non-security-critical operations.
 * Used for modes like 'range', 'lottery', 'list', etc. where predictability
 * is less critical than for passwords and PINs.
 */
export const getCryptoOptional = (): Crypto | undefined => {
  const c = (globalThis as unknown as { crypto?: Crypto }).crypto;
  if (c && typeof c.getRandomValues === "function") return c as Crypto;
  return undefined;
};
