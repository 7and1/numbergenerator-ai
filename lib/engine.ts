/**
 * Number Generator Engine
 *
 * This file now serves as the main entry point for backward compatibility.
 * The actual implementation has been split into modular files:
 *
 * Core utilities:
 * - lib/core/crypto.ts - Cryptographic random number generation
 * - lib/core/samplers.ts - Random sampling and selection
 * - lib/core/arrays.ts - Array manipulation utilities
 *
 * Generator modules:
 * - lib/generators/range.ts - Range mode
 * - lib/generators/password.ts - Password and PIN modes
 * - lib/generators/lottery.ts - Lottery mode
 * - lib/generators/list.ts - List and shuffle modes
 * - lib/generators/dice.ts - Dice mode
 * - lib/generators/coin.ts - Coin mode
 * - lib/generators/ticket.ts - Ticket draw mode
 * - lib/generators/data.ts - UUID, color, hex, timestamp, coordinates, network
 * - lib/generators/math.ts - Fraction, percentage, prime, Roman numerals
 * - lib/generators/text.ts - Words, alphabet, unicode, ASCII
 * - lib/generators/simulation.ts - Temperature, currency, phone, email, username, date
 *
 * @module engine
 */

// Re-export everything from the new modular structure for backward compatibility
export { generate } from "./generators/index";

// Re-export types
export type { GenerationResult, GeneratorMode, GeneratorParams } from "./types";

// Re-export security-related types and constants for backward compatibility
export type { SecurityMode } from "./core/crypto";
export { SECURE_MODE } from "./core/crypto";
