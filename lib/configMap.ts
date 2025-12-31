import type { ToolConfig } from "./types";

export const CONFIG_MAP: Record<string, ToolConfig> = {
  // === Template Shells (Worker will inject real SEO/config) ===
  "template-range": {
    slug: "template-range",
    title: "Random Number Generator",
    seo_title: "Random Number Generator",
    description: "Generate a random number in any range.",
    mode: "range",
    params: {
      min: 1,
      max: 100,
      count: 1,
      step: 1,
      precision: 0,
      unique: false,
      sort: null,
    },
    ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
  },

  // ============================================================
  // HIGH PRIORITY SEO TOOLS (Priority: 1.0)
  // ============================================================

  // === 1. Random Number Generator (High Search Volume) ===
  "1-10": {
    slug: "1-10",
    title: "Random Number 1-10",
    seo_title: "Random Number Generator 1-10 - Pick a Number Between 1 and 10",
    description:
      "Generate a truly random number between 1 and 10 instantly. Perfect for quick decisions, games, and giveaways. Free, secure, with no ads.",
    mode: "range",
    params: { min: 1, max: 10, count: 1 },
    ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
    keywords: [
      "random number 1-10",
      "number generator 1-10",
      "pick a number 1 to 10",
      "random number picker",
    ],
    priority: 1.0,
    category: "random-numbers",
    faq: [
      {
        question: "How do I generate a random number between 1 and 10?",
        answer:
          "Simply click the 'Generate' button and our tool will use cryptographically secure random generation to pick a number between 1 and 10 instantly.",
      },
      {
        question: "Is this random number generator fair?",
        answer:
          "Yes! We use Web Crypto API (CSPRNG) which provides cryptographically strong random values, ensuring true randomness for fair outcomes.",
      },
      {
        question: "Can I generate multiple numbers at once?",
        answer:
          "Use our advanced random number generator to generate multiple numbers between 1 and 10 with options for unique values and sorting.",
      },
    ],
    how_to: [
      "Click the 'Generate' button to get a random number from 1-10",
      "The number appears instantly with a smooth animation",
      "Use the result for games, decisions, or any random selection",
    ],
    features: [
      "Cryptographically secure random generation",
      "Instant results",
      "Works offline",
      "No signup required",
    ],
  },
  "1-100": {
    slug: "1-100",
    title: "Random Number 1-100",
    seo_title:
      "Random Number Generator 1-100 - Pick a Number Between 1 and 100",
    description:
      "Generate a random number between 1 and 100. Fast, secure, and fair random number picker for games, contests, and decisions. No registration required.",
    mode: "range",
    params: { min: 1, max: 100, count: 1 },
    ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
    keywords: [
      "random number 1-100",
      "number generator 1-100",
      "pick a number 1 to 100",
      "random number picker 1 100",
    ],
    priority: 1.0,
    category: "random-numbers",
    faq: [
      {
        question: "How do I pick a random number from 1 to 100?",
        answer:
          "Click the generate button and instantly receive a fair random number between 1 and 100 using our secure random number generator.",
      },
      {
        question: "Is this generator suitable for contests and giveaways?",
        answer:
          "Absolutely! Our tool uses cryptographically secure random number generation, making it perfect for fair contests, raffles, and giveaways.",
      },
    ],
    how_to: [
      "Click 'Generate' for an instant random number 1-100",
      "Use for contests, games, or decision making",
    ],
    features: [
      "One-click generation",
      "Secure CSPRNG",
      "Mobile friendly",
      "No tracking",
    ],
  },
  "1-1000": {
    slug: "1-1000",
    title: "Random Number 1-1000",
    seo_title: "Random Number Generator 1-1000 - Generate Numbers 1 to 1000",
    description:
      "Generate a random number between 1 and 1000. Secure, fast, and fair random number generator perfect for large range selections, contests, and statistical sampling.",
    mode: "range",
    params: { min: 1, max: 1000, count: 1 },
    ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
    keywords: [
      "random number 1-1000",
      "number generator 1-1000",
      "random number picker",
      "generate number 1 to 1000",
    ],
    priority: 1.0,
    category: "random-numbers",
    faq: [
      {
        question: "How does the 1-1000 random number generator work?",
        answer:
          "Our tool uses the Web Crypto API to generate a cryptographically secure random integer between 1 and 1000, ensuring fair and unpredictable results.",
      },
      {
        question: "Can I generate multiple unique numbers from 1 to 1000?",
        answer:
          "Yes! Use our advanced random number generator to create multiple unique numbers from any range, including 1-1000.",
      },
    ],
    how_to: [
      "Click generate for a random number 1-1000",
      "Adjust range if needed",
      "Copy or use the result",
    ],
    features: [
      "Large range support",
      "Cryptographically secure",
      "Instant results",
    ],
  },
  "1-10000": {
    slug: "1-10000",
    title: "Random Number 1-10000",
    seo_title:
      "Random Number Generator 1-10000 - Pick a Number from 1 to 10,000",
    description:
      "Generate a random number between 1 and 10,000. Secure random number generator for large-scale selections, ID generation, and statistical purposes.",
    mode: "range",
    params: { min: 1, max: 10000, count: 1 },
    ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
    keywords: [
      "random number 1-10000",
      "number generator 1-10000",
      "random number 10000",
      "pick number 1 to 10000",
    ],
    priority: 1.0,
    category: "random-numbers",
    faq: [
      {
        question: "Can I generate truly random numbers up to 10,000?",
        answer:
          "Yes! Our generator supports ranges up to 10,000 and beyond using cryptographically secure random number generation.",
      },
    ],
    how_to: [
      "Set your range (default 1-10000)",
      "Click generate",
      "Get your random number",
    ],
    features: [
      "Extended range support",
      "Secure random generation",
      "Fast results",
    ],
  },
  "0-99": {
    slug: "0-99",
    title: "Random Number 0-99",
    seo_title: "Random Number Generator 0-99 - Generate Numbers from 0 to 99",
    description:
      "Generate a random number between 0 and 99. Perfect for percentage calculations, two-digit selections, and games requiring zero-based indexing.",
    mode: "range",
    params: { min: 0, max: 99, count: 1 },
    ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
    keywords: [
      "random number 0-99",
      "number generator 0-99",
      "random number 0 to 99",
      "two digit random number",
    ],
    priority: 1.0,
    category: "random-numbers",
    faq: [
      {
        question: "Why use a 0-99 range instead of 1-100?",
        answer:
          "The 0-99 range is useful for percentage calculations (00-99%), zero-based indexing in programming, and games where zero matters.",
      },
    ],
    how_to: [
      "Click generate for a number 0-99",
      "Use for percentages or zero-based games",
    ],
    features: ["Zero-inclusive range", "Quick generation", "No ads"],
  },
  "1-20": {
    slug: "1-20",
    title: "Random Number 1-20",
    seo_title: "Random Number Generator 1-20 - Pick a Number Between 1 and 20",
    description:
      "Generate a random number between 1 and 20. Ideal for board games, classroom activities, and quick random selections. Fast, secure, and free.",
    mode: "range",
    params: { min: 1, max: 20, count: 1 },
    ui: { show_inputs: true, result_type: "text", button_text: "Generate" },
    keywords: [
      "random number 1-20",
      "number generator 1-20",
      "pick number 1 to 20",
      "random 1-20 spinner",
    ],
    priority: 1.0,
    category: "random-numbers",
    faq: [
      {
        question: "What can I use a 1-20 random number generator for?",
        answer:
          "Perfect for board games with d20 dice, classroom activities, picking volunteers, and any situation requiring a random number from 1-20.",
      },
    ],
    how_to: ["Click generate for a number 1-20", "Use for games or activities"],
    features: ["Game-friendly range", "Instant results", "Secure random"],
  },
  "range-advanced": {
    slug: "range-advanced",
    title: "Random Numbers (Advanced)",
    seo_title:
      "Advanced Random Number Generator - Bulk, Unique, Sorted, Decimal",
    description:
      "Generate multiple random numbers with advanced options: unique values, sorting, decimal precision, custom step, and bulk generation. The ultimate random number tool.",
    mode: "range",
    params: {
      min: 1,
      max: 100,
      count: 20,
      unique: false,
      sort: null,
      step: 1,
      precision: 0,
    },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Numbers",
    },
    keywords: [
      "random number generator",
      "multiple random numbers",
      "unique random numbers",
      "sorted random numbers",
      "decimal random numbers",
    ],
    priority: 1.0,
    category: "random-numbers",
    faq: [
      {
        question: "Can I generate multiple random numbers at once?",
        answer:
          "Yes! Set the count parameter to generate up to 1000 random numbers in a single click.",
      },
      {
        question: "How do I generate unique random numbers?",
        answer:
          "Enable the 'Unique' option to ensure no duplicate numbers are generated. Great for lottery-style draws.",
      },
      {
        question: "Can I get decimal numbers?",
        answer:
          "Set the precision parameter to control decimal places. For example, precision=2 gives numbers like 12.34, 56.78.",
      },
    ],
    how_to: [
      "Set your min and max range",
      "Choose how many numbers to generate",
      "Toggle unique values to avoid duplicates",
      "Enable sorting if needed",
      "Set precision for decimal numbers",
      "Click generate for your results",
    ],
    features: [
      "Bulk generation (up to 1000)",
      "Unique/sorted options",
      "Decimal precision",
      "Custom step values",
      "Copy all results",
    ],
  },

  // === 2. Password & PIN Generators (High Search Volume) ===
  "password-strong": {
    slug: "password-strong",
    title: "Strong Password Generator",
    seo_title:
      "Strong Password Generator - Secure 16 Character Random Password",
    description:
      "Generate a strong, secure 16-character password with random letters, numbers, and symbols. Cryptographically secure password generation. No storage or tracking.",
    mode: "password",
    params: { length: 16, charset: "strong", grouping: true },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Password",
      icon: "Lock",
    },
    keywords: [
      "strong password generator",
      "secure password",
      "random password",
      "16 character password",
      "password creator",
    ],
    priority: 1.0,
    category: "passwords-pins",
    faq: [
      {
        question: "How strong are the generated passwords?",
        answer:
          "Each password is generated using cryptographically secure random number generation (CSPRNG), providing maximum entropy for security.",
      },
      {
        question: "Are my passwords stored or logged?",
        answer:
          "No! All password generation happens locally in your browser. We never store, transmit, or log any passwords.",
      },
      {
        question: "What makes a password strong?",
        answer:
          "Strong passwords use a mix of uppercase letters, lowercase letters, numbers, and symbols. Our 16-character passwords provide 128+ bits of entropy.",
      },
    ],
    how_to: [
      "Click 'Generate Password' to create a secure 16-character password",
      "Copy the password using the copy button",
      "Store it securely in a password manager",
    ],
    features: [
      "16-character default length",
      "Mixed case, numbers, symbols",
      "CSPRNG security",
      "Grouped format (xxxx-xxxx-xxxx-xxxx)",
      "No storage or tracking",
    ],
  },
  "password-12": {
    slug: "password-12",
    title: "12 Character Password Generator",
    seo_title: "12 Character Password Generator - Secure Random Password",
    description:
      "Generate a secure 12-character random password. Balanced security and memorability with letters, numbers, and symbols. Client-side generation only.",
    mode: "password",
    params: { length: 12, charset: "strong", grouping: false },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Password",
      icon: "Lock",
    },
    keywords: [
      "12 character password",
      "password generator 12 chars",
      "random password 12",
      "secure password generator",
    ],
    priority: 1.0,
    category: "passwords-pins",
    faq: [
      {
        question: "Is a 12-character password secure enough?",
        answer:
          "A 12-character random password with mixed case, numbers, and symbols provides approximately 75 bits of entropy, which is very secure against brute force attacks.",
      },
    ],
    how_to: [
      "Click generate for a 12-char password",
      "Copy and store securely",
    ],
    features: [
      "12 character length",
      "Full character set",
      "Secure generation",
    ],
  },
  "password-20": {
    slug: "password-20",
    title: "20 Character Password Generator",
    seo_title: "20 Character Password Generator - Ultra Secure Random Password",
    description:
      "Generate an ultra-secure 20-character random password. Maximum strength password generation with letters, numbers, and symbols. Best practice for high-security accounts.",
    mode: "password",
    params: { length: 20, charset: "strong", grouping: true },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Password",
      icon: "Lock",
    },
    keywords: [
      "20 character password",
      "ultra secure password",
      "strong password generator",
      "random password 20 chars",
    ],
    priority: 1.0,
    category: "passwords-pins",
    faq: [
      {
        question: "Why use a 20-character password?",
        answer:
          "20-character passwords provide approximately 130 bits of entropy, making them virtually uncrackable by brute force. Recommended for high-security accounts.",
      },
    ],
    how_to: [
      "Click generate for a 20-char password",
      "Use for critical accounts",
    ],
    features: ["20 character length", "Maximum security", "Grouped display"],
  },
  "pin-4": {
    slug: "pin-4",
    title: "4-Digit PIN Generator",
    seo_title: "4-Digit PIN Generator - Random 4 Number PIN Code",
    description:
      "Generate a secure random 4-digit PIN code (0000-9999). Perfect for phone locks, ATM PINs, and security codes. Uses cryptographically secure generation.",
    mode: "digit",
    params: { length: 4, pad_zero: true },
    ui: {
      show_inputs: false,
      result_type: "card",
      button_text: "Generate PIN",
      icon: "Hash",
    },
    keywords: [
      "4 digit pin generator",
      "random pin 4 digit",
      "pin code generator",
      "4 number pin",
      "random atm pin",
    ],
    priority: 1.0,
    category: "passwords-pins",
    faq: [
      {
        question: "How do I generate a random 4-digit PIN?",
        answer:
          "Click the 'Generate PIN' button to instantly get a random 4-digit number from 0000 to 9999 using secure random generation.",
      },
      {
        question: "Are these PINs secure?",
        answer:
          "Yes! Each PIN is generated using cryptographically secure random number generation, ensuring unpredictable results.",
      },
      {
        question: "Can I use this for my phone or ATM PIN?",
        answer:
          "Yes, but remember: never share your PIN and avoid common sequences like 1234 or 0000 for actual security.",
      },
    ],
    how_to: [
      "Click 'Generate PIN' for a random 4-digit code",
      "Memorize or store securely",
      "Regenerate if desired",
    ],
    features: [
      "4-digit format (0000-9999)",
      "Secure CSPRNG",
      "Leading zeros included",
      "Instant generation",
    ],
  },
  "pin-6": {
    slug: "pin-6",
    title: "6-Digit PIN Generator",
    seo_title: "6-Digit PIN Generator - Random 6 Number PIN Code",
    description:
      "Generate a secure random 6-digit PIN code. Ideal for banking apps, two-factor authentication, and enhanced security. 1 million possible combinations.",
    mode: "digit",
    params: { length: 6, pad_zero: true },
    ui: {
      show_inputs: false,
      result_type: "card",
      button_text: "Generate PIN",
      icon: "Hash",
    },
    keywords: [
      "6 digit pin generator",
      "random pin 6 digit",
      "6 number pin",
      "banking pin generator",
      "2fa pin",
    ],
    priority: 1.0,
    category: "passwords-pins",
    faq: [
      {
        question: "Why use a 6-digit PIN instead of 4-digit?",
        answer:
          "6-digit PINs have 1 million possible combinations (000000-999999) compared to 10,000 for 4-digit PINs, making them significantly more secure.",
      },
    ],
    how_to: [
      "Click 'Generate PIN' for a 6-digit code",
      "Use for 2FA or banking apps",
    ],
    features: [
      "6-digit format (000000-999999)",
      "Enhanced security",
      "Leading zeros included",
    ],
  },
  "pin-8": {
    slug: "pin-8",
    title: "8-Digit PIN Generator",
    seo_title: "8-Digit PIN Generator - Random 8 Number PIN Code",
    description:
      "Generate a secure random 8-digit PIN code. Maximum security PIN generation with 100 million possible combinations. Perfect for high-security applications.",
    mode: "digit",
    params: { length: 8, pad_zero: true },
    ui: {
      show_inputs: false,
      result_type: "card",
      button_text: "Generate PIN",
      icon: "Hash",
    },
    keywords: [
      "8 digit pin generator",
      "random pin 8 digit",
      "8 number pin",
      "long pin generator",
      "secure pin code",
    ],
    priority: 1.0,
    category: "passwords-pins",
    faq: [
      {
        question: "How secure is an 8-digit PIN?",
        answer:
          "An 8-digit PIN has 100 million possible combinations, making it extremely secure against brute force attacks for most applications.",
      },
    ],
    how_to: [
      "Click 'Generate PIN' for an 8-digit code",
      "Use for high-security needs",
    ],
    features: [
      "8-digit format (00000000-99999999)",
      "100M combinations",
      "Maximum PIN security",
    ],
  },
  "pin-10": {
    slug: "pin-10",
    title: "10-Digit PIN Generator",
    seo_title: "10-Digit PIN Generator - Random 10 Number PIN Code",
    description:
      "Generate a secure random 10-digit PIN code. Extended format for specialized security needs. 10 billion possible combinations with cryptographically secure generation.",
    mode: "digit",
    params: { length: 10, pad_zero: true },
    ui: {
      show_inputs: false,
      result_type: "card",
      button_text: "Generate PIN",
      icon: "Hash",
    },
    keywords: [
      "10 digit pin generator",
      "random pin 10 digit",
      "10 number pin",
      "long pin code",
      "extended pin",
    ],
    priority: 1.0,
    category: "passwords-pins",
    faq: [
      {
        question: "What are 10-digit PINs used for?",
        answer:
          "10-digit PINs are used for enhanced security systems, corporate access codes, and specialized authentication requiring extended PIN formats.",
      },
    ],
    how_to: [
      "Click 'Generate PIN' for a 10-digit code",
      "Use for specialized security",
    ],
    features: ["10-digit format", "10 billion combinations", "CSPRNG security"],
  },
  "password-pro": {
    slug: "password-pro",
    title: "Password Generator Pro",
    seo_title: "Password Generator Pro - Batch Passwords with Custom Options",
    description:
      "Generate multiple strong passwords with advanced options: exclude ambiguous characters, ensure each character type, custom length, and more. The ultimate password tool for power users.",
    mode: "password",
    params: {
      length: 16,
      count: 10,
      grouping: true,
      include_lower: true,
      include_upper: true,
      include_digits: true,
      include_symbols: true,
      exclude_ambiguous: true,
      ensure_each: true,
      exclude_chars: "",
    },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate 10 Passwords",
      icon: "Lock",
    },
    keywords: [
      "password generator pro",
      "batch password generator",
      "custom password options",
      "multiple passwords",
      "advanced password tool",
    ],
    priority: 0.9,
    category: "passwords-pins",
    faq: [
      {
        question: "Can I generate multiple passwords at once?",
        answer:
          "Yes! Password Pro can generate up to 50 passwords in a single batch, perfect for setting up multiple accounts.",
      },
      {
        question: "What does 'exclude ambiguous characters' mean?",
        answer:
          "This option removes characters that look similar (like 0/O, 1/l/I) to prevent confusion when reading or typing passwords.",
      },
    ],
    how_to: [
      "Set password length",
      "Choose how many to generate",
      "Customize character options",
      "Click generate for batch passwords",
    ],
    features: [
      "Batch generation (up to 50)",
      "Exclude ambiguous chars",
      "Ensure each character type",
      "Custom exclusions",
    ],
  },

  // ============================================================
  // MEDIUM PRIORITY SEO TOOLS (Priority: 0.7-0.9)
  // ============================================================

  // === 3. Lottery Generators ===
  "lottery-powerball": {
    slug: "lottery-powerball",
    title: "Powerball Number Generator",
    seo_title: "Powerball Number Generator - Random US Powerball Number Picker",
    description:
      "Generate random US Powerball numbers: 5 main numbers (1-69) plus 1 Powerball (1-26). Quick pick for Powerball drawings with fair, secure random generation.",
    mode: "lottery",
    params: {
      pool_a: { min: 1, max: 69, pick: 5 },
      pool_b: { min: 1, max: 26, pick: 1 },
    },
    ui: {
      show_inputs: false,
      result_type: "bubble",
      button_text: "Pick Lucky Numbers",
      icon: "Ticket",
    },
    keywords: [
      "powerball generator",
      "powerball numbers",
      "powerball quick pick",
      "random powerball",
      "lottery number generator",
    ],
    priority: 0.8,
    category: "lottery",
    faq: [
      {
        question: "How does the Powerball number generator work?",
        answer:
          "Our tool generates 5 unique random numbers from 1-69 (white balls) and 1 number from 1-26 (red Powerball), matching official Powerball format.",
      },
      {
        question: "Can I use these numbers for official Powerball entries?",
        answer:
          "Yes! These numbers follow the official Powerball format and can be used to fill out official tickets. Remember to play responsibly.",
      },
    ],
    how_to: [
      "Click 'Pick Lucky Numbers' for Powerball numbers",
      "Use the numbers to fill your ticket",
    ],
    features: [
      "Official Powerball format",
      "Unique main numbers",
      "Separate Powerball",
      "Bubble display",
    ],
  },

  // === 4. Dice Rollers ===
  "dice-d6": {
    slug: "dice-d6",
    title: "Roll a Die (D6)",
    seo_title: "Online Dice Roller - Roll a 6-Sided Die (D6)",
    description:
      "Roll a standard 6-sided die online. Fair, secure dice rolling for board games, tabletop gaming, and decision making. No physical dice needed.",
    mode: "list",
    params: { items: ["1", "2", "3", "4", "5", "6"] },
    ui: {
      show_inputs: false,
      result_type: "card",
      button_text: "Roll Dice",
      icon: "Box",
    },
    keywords: [
      "roll a die",
      "online dice roller",
      "d6 dice",
      "virtual dice",
      "6 sided dice",
    ],
    priority: 0.8,
    category: "dice",
    faq: [
      {
        question: "Is the online dice roller fair?",
        answer:
          "Yes! We use cryptographically secure random generation to ensure each roll is completely fair and unpredictable.",
      },
      {
        question: "Can I roll multiple dice at once?",
        answer:
          "For multiple dice, use our advanced dice roller which supports multiple rolls, different die types, and modifiers.",
      },
    ],
    how_to: ["Click 'Roll Dice' to roll a D6", "See your result instantly"],
    features: ["Single D6 roll", "Secure random", "Large display"],
  },
  "dice-roller": {
    slug: "dice-roller",
    title: "Dice Roller (D4-D20 + Custom)",
    seo_title: "Online Dice Roller - Multiple Dice, D4, D6, D8, D10, D12, D20",
    description:
      "Roll any dice combination online: D4, D6, D8, D10, D12, D20, or custom dice. Support for multiple rolls, advantage/disadvantage, and modifiers. Perfect for D&D and tabletop games.",
    mode: "dice",
    params: {
      dice_sides: 6,
      dice_rolls: 1,
      dice_adv: "none",
      dice_modifier: 0,
    },
    ui: {
      show_inputs: true,
      result_type: "card",
      button_text: "Roll Dice",
      icon: "Box",
    },
    keywords: [
      "dice roller",
      "dnd dice",
      "d20 roller",
      "online dice",
      "rpg dice",
      "tabletop dice",
      "dice roll simulator",
    ],
    priority: 0.9,
    category: "dice",
    faq: [
      {
        question: "What dice types can I roll?",
        answer:
          "You can roll D4, D6, D8, D10, D12, D20, or any custom number of sides. Perfect for D&D, Pathfinder, and other tabletop games.",
      },
      {
        question: "What is advantage/disadvantage?",
        answer:
          "Advantage rolls 2 dice and takes the higher. Disadvantage rolls 2 and takes the lower. These are common mechanics in D&D 5th Edition.",
      },
      {
        question: "Can I add modifiers to rolls?",
        answer:
          "Yes! Set a modifier to add or subtract from your total. For example, a +2 strength modifier would be added to your roll.",
      },
    ],
    how_to: [
      "Select dice type (D4, D6, D8, D10, D12, D20, or custom)",
      "Choose number of rolls",
      "Optional: Add advantage/disadvantage",
      "Optional: Set a modifier",
      "Click 'Roll Dice'",
    ],
    features: [
      "All standard RPG dice",
      "Multiple rolls",
      "Advantage/disadvantage",
      "Modifiers",
      "Sum display",
    ],
  },

  // === 5. Coin Flippers ===
  "coin-flip": {
    slug: "coin-flip",
    title: "Flip a Coin",
    seo_title: "Flip a Coin Online - Heads or Tails Generator",
    description:
      "Flip a coin online for instant heads or tails. Perfect for decisions, games, and settling disputes. Fair, secure coin flipping with no physical coin needed.",
    mode: "list",
    params: { items: ["HEADS", "TAILS"] },
    ui: {
      show_inputs: false,
      result_type: "text",
      button_text: "Flip Coin",
      icon: "Circle",
    },
    keywords: [
      "flip a coin",
      "coin flip",
      "heads or tails",
      "coin toss",
      "virtual coin flip",
    ],
    priority: 0.8,
    category: "coins",
    faq: [
      {
        question: "Is the online coin flip fair?",
        answer:
          "Absolutely! Each flip uses cryptographically secure random generation, ensuring exactly 50/50 probability for heads and tails.",
      },
      {
        question: "Can I flip multiple coins at once?",
        answer:
          "Use our coin flip simulator to flip multiple coins and track statistics like streaks and total counts.",
      },
    ],
    how_to: ["Click 'Flip Coin' for heads or tails", "Use for quick decisions"],
    features: ["Single coin flip", "50/50 probability", "Instant result"],
  },
  "coin-flip-pro": {
    slug: "coin-flip-pro",
    title: "Flip a Coin (Stats)",
    seo_title: "Coin Flip Simulator - Multiple Flips with Statistics",
    description:
      "Flip multiple coins and track statistics. See heads/tails counts, percentages, and longest streaks. Perfect for probability experiments and decision making.",
    mode: "coin",
    params: { coin_flips: 10, coin_labels: ["HEADS", "TAILS"] },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Flip Coins",
      icon: "Circle",
    },
    keywords: [
      "coin flip simulator",
      "multiple coin flips",
      "coin flip statistics",
      "coin streak",
      "probability coin flip",
    ],
    priority: 0.7,
    category: "coins",
    faq: [
      {
        question: "How does the streak tracking work?",
        answer:
          "The simulator tracks consecutive heads or tails results, showing you the longest streak for each outcome in your session.",
      },
      {
        question: "Can I flip more than 10 coins?",
        answer:
          "Yes! Adjust the number of flips from 1 to 1000 to experiment with probability and see how results converge toward 50/50.",
      },
    ],
    how_to: [
      "Set number of flips",
      "Click 'Flip Coins'",
      "View statistics and streaks",
    ],
    features: [
      "Multiple flips at once",
      "Streak tracking",
      "Statistics display",
      "Percentage breakdown",
    ],
  },

  // === 6. List Tools ===
  "list-picker": {
    slug: "list-picker",
    title: "Random List Picker",
    seo_title: "Random List Picker - Draw Winners from Your List",
    description:
      "Paste a list and randomly pick winners. Pick 1 or multiple items with options for unique selection. Perfect for contests, giveaways, and random name picking.",
    mode: "list",
    params: {
      items_text: "Alice\nBob\nCharlie\nDavid\nEve",
      items: ["Alice", "Bob", "Charlie", "David", "Eve"],
      count: 1,
      unique: true,
    },
    ui: { show_inputs: true, result_type: "text", button_text: "Pick" },
    keywords: [
      "random list picker",
      "random name picker",
      "draw from list",
      "pick random item",
      "random winner generator",
    ],
    priority: 0.8,
    category: "list-tools",
    faq: [
      {
        question: "How do I use the list picker?",
        answer:
          "Paste your list (one item per line), choose how many to pick, and click Pick. Optionally enable 'Unique' to avoid picking the same item twice.",
      },
      {
        question: "What's the maximum list size?",
        answer:
          "You can paste up to 10,000 items. Perfect for large contests or drawings.",
      },
    ],
    how_to: [
      "Paste your list (one item per line)",
      "Set how many to pick",
      "Toggle unique selection if needed",
      "Click 'Pick' for random selection",
    ],
    features: [
      "Paste any list",
      "Pick 1 or multiple",
      "Unique option",
      "No list size limit",
    ],
  },
  "shuffle-list": {
    slug: "shuffle-list",
    title: "Shuffle List",
    seo_title: "Shuffle List - Randomize List Order Online",
    description:
      "Paste a list and shuffle it into random order. Great for creating teams, seating arrangements, random playlists, and fair group assignments. Optional group size output.",
    mode: "shuffle",
    params: {
      items_text: "Alice\nBob\nCharlie\nDavid\nEve",
      items: ["Alice", "Bob", "Charlie", "David", "Eve"],
      group_size: 0,
    },
    ui: { show_inputs: true, result_type: "text", button_text: "Shuffle" },
    keywords: [
      "shuffle list",
      "randomize list",
      "random order",
      "list randomizer",
      "shuffle names",
    ],
    priority: 0.7,
    category: "list-tools",
    faq: [
      {
        question: "How does list shuffling work?",
        answer:
          "Our tool uses the Fisher-Yates shuffle algorithm with cryptographically secure random numbers for truly fair shuffling.",
      },
      {
        question: "Can I create groups from a shuffled list?",
        answer:
          "Yes! Set a group size to output your shuffled list in groups. Perfect for creating teams or seating arrangements.",
      },
    ],
    how_to: [
      "Paste your list (one item per line)",
      "Optional: Set group size",
      "Click 'Shuffle'",
      "Copy the randomized list",
    ],
    features: [
      "Fisher-Yates shuffle",
      "Group output option",
      "Large list support",
    ],
  },
  "spin-wheel": {
    slug: "spin-wheel",
    title: "Spin Wheel Picker",
    seo_title: "Spin Wheel Picker - Random Choice Wheel",
    description:
      "A fun spin wheel to pick a random item from your list. Enter your choices, spin the wheel, and get a random selection. Great for decisions, games, and classroom activities.",
    mode: "list",
    params: {
      items_text: "Pizza\nSushi\nBurgers\nTacos\nSalad\nRamen",
      items: ["Pizza", "Sushi", "Burgers", "Tacos", "Salad", "Ramen"],
      count: 1,
      unique: false,
    },
    ui: { show_inputs: true, result_type: "wheel", button_text: "Spin" },
    keywords: [
      "spin wheel",
      "wheel picker",
      "spin the wheel",
      "random wheel",
      "decision wheel",
      "prize wheel",
    ],
    priority: 0.8,
    category: "list-tools",
    faq: [
      {
        question: "How many items can I add to the wheel?",
        answer:
          "The wheel works best with 2-12 items, but supports up to 50 choices. For more items, consider using the list picker instead.",
      },
    ],
    how_to: [
      "Enter your choices (one per line)",
      "Click 'Spin' to rotate the wheel",
      "The wheel stops on a random choice",
    ],
    features: [
      "Visual spinning animation",
      "Customizable choices",
      "Touch-friendly",
    ],
  },

  // === 7. Ticket Draw ===
  "ticket-draw": {
    slug: "ticket-draw",
    title: "Ticket Draw (No Replacement)",
    seo_title: "Ticket Draw Generator - Draw Without Replacement",
    description:
      "Draw ticket numbers from a range or custom list without replacement. Perfect for raffles, bingo, and fair ticket drawings. Each ticket can only be drawn once.",
    mode: "ticket",
    params: {
      ticket_source: "range",
      min: 1,
      max: 100,
      count: 1,
      unique: true,
      ticket_remaining: [],
    },
    ui: { show_inputs: true, result_type: "card", button_text: "Draw Ticket" },
    keywords: [
      "ticket draw",
      "raffle draw",
      "bingo number generator",
      "draw without replacement",
      "ticket picker",
    ],
    priority: 0.7,
    category: "list-tools",
    faq: [
      {
        question: "What does 'draw without replacement' mean?",
        answer:
          "Once a ticket is drawn, it cannot be drawn again. This ensures fair raffles where each ticket can only win once.",
      },
      {
        question: "Can I reset the drawing?",
        answer:
          "Yes! Click reset to start fresh with all tickets available again.",
      },
    ],
    how_to: [
      "Set your ticket range or paste custom tickets",
      "Click 'Draw Ticket' for each draw",
      "Tickets are removed as they're drawn",
      "Reset when needed to start over",
    ],
    features: [
      "No replacement drawing",
      "Custom ticket lists",
      "Remaining count display",
      "Reset option",
    ],
  },

  // ============================================================
  // NEW TOOLS
  // ============================================================

  // === UUID Generator ===
  uuid: {
    slug: "uuid",
    title: "Random UUID Generator",
    seo_title: "Random UUID/GUID Generator - Generate Version 4 UUIDs",
    description:
      "Generate cryptographically secure random UUID v4 identifiers. Create single or batch UUIDs with options for uppercase/lowercase and hyphen formatting. Perfect for database IDs, API keys, and unique identifiers.",
    mode: "uuid",
    params: { count: 1, uuid_uppercase: false, uuid_hyphens: true },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate UUID",
      icon: "Fingerprint",
    },
    keywords: [
      "uuid generator",
      "guid generator",
      "random uuid",
      "uuid v4",
      "unique identifier",
      "generate uuid",
    ],
    priority: 0.8,
    category: "random-numbers",
    faq: [
      {
        question: "What is a UUID v4?",
        answer:
          "UUID v4 (Version 4) is a universally unique identifier generated from random numbers. It consists of 32 hexadecimal digits displayed in 5 groups separated by hyphens.",
      },
      {
        question: "Are these UUIDs cryptographically secure?",
        answer:
          "Yes! Our UUID generator uses the Web Crypto API to generate truly random bytes, ensuring each UUID is unique and unpredictable.",
      },
      {
        question: "Can I generate multiple UUIDs at once?",
        answer:
          "Yes! You can generate up to 10,000 UUIDs in a single batch, perfect for bulk data seeding or testing.",
      },
    ],
    how_to: [
      "Choose uppercase or lowercase format",
      "Enable or disable hyphens",
      "Set how many UUIDs to generate",
      "Click 'Generate UUID'",
    ],
    features: [
      "UUID v4 format",
      "Uppercase/lowercase option",
      "With/without hyphens",
      "Batch generation",
    ],
  },

  // === Random Color Generator ===
  "random-color": {
    slug: "random-color",
    title: "Random Color Generator",
    seo_title: "Random Color Generator - HEX, RGB, HSL Color Picker",
    description:
      "Generate random colors for design and development. Get colors in HEX, RGB, or HSL format. Perfect for web designers, developers, and artists seeking color inspiration. Generate single colors or batches.",
    mode: "color",
    params: { count: 1, color_format: "hex" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Color",
      icon: "Palette",
    },
    keywords: [
      "random color generator",
      "color picker",
      "hex color",
      "rgb color",
      "hsl color",
      "random color",
    ],
    priority: 0.7,
    category: "random-numbers",
    faq: [
      {
        question: "What color formats are supported?",
        answer:
          "You can generate colors in HEX (#RRGGBB), RGB (rgb(r, g, b)), or HSL (hsl(h, s%, l%)) format. Choose the format that works best for your project.",
      },
      {
        question: "Can I generate multiple colors at once?",
        answer:
          "Yes! Generate up to 10,000 random colors in a single batch. Perfect for creating color palettes or testing color schemes.",
      },
    ],
    how_to: [
      "Select color format (HEX, RGB, or HSL)",
      "Set how many colors to generate",
      "Click 'Generate Color'",
      "Copy colors for your project",
    ],
    features: [
      "HEX/RGB/HSL formats",
      "Batch generation",
      "Visual color preview",
      "Web-safe colors",
    ],
  },

  // === Mega Millions Generator ===
  "lottery-megamillions": {
    slug: "lottery-megamillions",
    title: "Mega Millions Number Generator",
    seo_title: "Mega Millions Number Generator - Random Number Picker",
    description:
      "Generate random Mega Millions numbers: 5 main numbers (1-70) plus 1 Mega Ball (1-25). Quick pick for Mega Millions drawings with fair, secure random generation. Matches official Mega Millions format.",
    mode: "lottery",
    params: {
      pool_a: { min: 1, max: 70, pick: 5 },
      pool_b: { min: 1, max: 25, pick: 1 },
    },
    ui: {
      show_inputs: false,
      result_type: "bubble",
      button_text: "Pick Lucky Numbers",
      icon: "Ticket",
    },
    keywords: [
      "mega millions generator",
      "mega millions numbers",
      "mega millions quick pick",
      "lottery number generator",
      "random lottery",
    ],
    priority: 0.8,
    category: "lottery",
    faq: [
      {
        question: "How does the Mega Millions number generator work?",
        answer:
          "Our tool generates 5 unique random numbers from 1-70 (white balls) and 1 number from 1-25 (gold Mega Ball), matching the official Mega Millions format.",
      },
      {
        question: "Can I use these numbers for official Mega Millions entries?",
        answer:
          "Yes! These numbers follow the official Mega Millions format and can be used to fill out official tickets. Remember to play responsibly.",
      },
    ],
    how_to: [
      "Click 'Pick Lucky Numbers' for Mega Millions numbers",
      "Use the numbers to fill your ticket",
    ],
    features: [
      "Official Mega Millions format",
      "Unique main numbers",
      "Separate Mega Ball",
      "Bubble display",
    ],
  },

  // === Random Hex Generator ===
  "random-hex": {
    slug: "random-hex",
    title: "Random Hex Generator",
    seo_title: "Random Hexadecimal Number Generator - Developer Tools",
    description:
      "Generate random hexadecimal numbers for developers. Specify byte length and optionally add 0x prefix. Perfect for testing, data generation, and programming. Cryptographically secure generation.",
    mode: "hex",
    params: { count: 1, hex_bytes: 4, hex_prefix: false },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Hex",
      icon: "Code",
    },
    keywords: [
      "random hex generator",
      "hexadecimal generator",
      "random hex number",
      "hex bytes",
      "developer tools",
    ],
    priority: 0.6,
    category: "random-numbers",
    faq: [
      {
        question: "What is a hexadecimal number?",
        answer:
          "Hexadecimal (base-16) uses digits 0-9 and letters A-F. Each byte produces 2 hex characters. Commonly used in programming for representing binary data.",
      },
      {
        question: "What does byte length mean?",
        answer:
          "Each byte equals 2 hexadecimal characters. For example, 4 bytes = 8 hex characters (like '1A3F5C7E'). You can generate from 1 to 1024 bytes.",
      },
      {
        question: "Should I add the 0x prefix?",
        answer:
          "Add 0x prefix if you're using the hex values in code (like 0x1A3F). Omit it if you just need the raw hex string.",
      },
    ],
    how_to: [
      "Set the byte length (1-1024)",
      "Enable 0x prefix if needed",
      "Set how many to generate",
      "Click 'Generate Hex'",
    ],
    features: [
      "Custom byte length",
      "Optional 0x prefix",
      "Batch generation",
      "CSPRNG security",
    ],
  },

  // ============================================================
  // DEVELOPER TOOLS
  // ============================================================

  // === Random Timestamp Generator ===
  "random-timestamp": {
    slug: "random-timestamp",
    title: "Random Timestamp Generator",
    seo_title: "Random Timestamp Generator - Unix Timestamp & ISO Time",
    description:
      "Generate random Unix timestamps and ISO datetime strings for testing. Create timestamps within custom date ranges with options for seconds, milliseconds, and ISO format.",
    mode: "timestamp",
    params: { count: 10, timestamp_format: "unix" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Timestamps",
      icon: "Clock",
    },
    keywords: [
      "random timestamp",
      "unix timestamp generator",
      "iso date generator",
      "random datetime",
      "timestamp testing",
    ],
    priority: 0.7,
    category: "developer-tools",
    faq: [
      {
        question: "What timestamp formats are supported?",
        answer:
          "Supports Unix timestamps (seconds), Unix timestamps with milliseconds, and ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ).",
      },
      {
        question: "Can I generate timestamps for a specific date range?",
        answer:
          "Yes! You can set start and end dates to generate random timestamps within any time period.",
      },
    ],
    how_to: [
      "Select timestamp format (Unix, Unix-ms, or ISO)",
      "Optional: Set date range",
      "Choose how many to generate",
      "Click 'Generate Timestamps'",
    ],
    features: [
      "Multiple format options",
      "Custom date ranges",
      "Batch generation",
      "Testing friendly",
    ],
  },

  // === Random Coordinates Generator ===
  "random-coordinates": {
    slug: "random-coordinates",
    title: "Random Coordinates Generator",
    seo_title: "Random GPS Coordinates Generator - Latitude & Longitude",
    description:
      "Generate random GPS coordinates with latitude and longitude. Supports decimal and DMS formats. Perfect for location testing, mapping apps, and geospatial data generation.",
    mode: "coordinates",
    params: { count: 10, coord_format: "decimal" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Coordinates",
      icon: "MapPin",
    },
    keywords: [
      "random coordinates",
      "gps generator",
      "latitude longitude",
      "random location",
      "geospatial testing",
    ],
    priority: 0.7,
    category: "developer-tools",
    faq: [
      {
        question: "What coordinate formats are supported?",
        answer:
          "Decimal degrees (DD.DDDDDD) and Degrees-Minutes-Seconds (DMS) formats are supported.",
      },
      {
        question: "Can I limit coordinates to a specific region?",
        answer:
          "Yes! You can set custom latitude and longitude ranges to generate coordinates within any geographic area.",
      },
    ],
    how_to: [
      "Select coordinate format",
      "Optional: Set lat/lng bounds",
      "Choose how many to generate",
      "Click 'Generate Coordinates'",
    ],
    features: [
      "Decimal and DMS formats",
      "Custom geographic bounds",
      "6 decimal precision",
      "Batch generation",
    ],
  },

  // === Random IPv4 Generator ===
  "random-ipv4": {
    slug: "random-ipv4",
    title: "Random IP Address Generator (IPv4)",
    seo_title: "Random IPv4 Address Generator - Create Fake IPs for Testing",
    description:
      "Generate random IPv4 addresses for testing and development. Excludes private and reserved ranges by default. Perfect for network application testing, data generation, and mock data.",
    mode: "ipv4",
    params: { count: 10, ipv4_private: false, ipv4_reserved: false },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate IPs",
      icon: "Network",
    },
    keywords: [
      "random ip address",
      "ipv4 generator",
      "fake ip generator",
      "ip testing data",
      "mock ip addresses",
    ],
    priority: 0.7,
    category: "developer-tools",
    faq: [
      {
        question: "What IP ranges are excluded by default?",
        answer:
          "By default, private ranges (10.x, 192.168.x, 172.16-31.x) and reserved ranges (0.x, 127.x, 224+) are excluded for realistic public IP generation.",
      },
      {
        question: "Can I include private IP ranges?",
        answer:
          "Yes! Enable the 'Include Private' option to generate IPs from private network ranges.",
      },
    ],
    how_to: [
      "Choose to include private/reserved ranges",
      "Set how many IPs to generate",
      "Click 'Generate IPs'",
      "Copy for testing",
    ],
    features: [
      "Public IPs by default",
      "Optional private ranges",
      "Realistic distribution",
      "Batch generation",
    ],
  },

  // === Random MAC Address Generator ===
  "random-mac": {
    slug: "random-mac",
    title: "Random MAC Address Generator",
    seo_title: "Random MAC Address Generator - Create Fake MACs for Testing",
    description:
      "Generate random MAC addresses for testing and development. Supports colon, dash, dot separators, and no separator formats. Perfect for network testing and hardware simulation.",
    mode: "mac",
    params: { count: 10, mac_separator: ":", mac_case: "upper" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate MACs",
      icon: "Cpu",
    },
    keywords: [
      "random mac address",
      "mac generator",
      "fake mac address",
      "hardware address",
      "network testing",
    ],
    priority: 0.6,
    category: "developer-tools",
    faq: [
      {
        question: "What MAC address formats are supported?",
        answer:
          "Supports XX:XX:XX:XX:XX:XX (colon), XX-XX-XX-XX-XX-XX (dash), XXXX.XXXX.XXXX (dot), and XXXXXXXXXXXX (no separator) formats.",
      },
      {
        question: "Are these valid MAC addresses?",
        answer:
          "These are randomly generated for testing purposes. They follow the correct format but are not assigned to any actual hardware.",
      },
    ],
    how_to: [
      "Choose separator style",
      "Select uppercase or lowercase",
      "Set how many to generate",
      "Click 'Generate MACs'",
    ],
    features: [
      "Multiple separator formats",
      "Upper/lowercase options",
      "Batch generation",
      "Testing friendly",
    ],
  },

  // === Random Bytes Generator ===
  "random-bytes": {
    slug: "random-bytes",
    title: "Random Bytes Generator",
    seo_title: "Random Bytes Generator - Base64, Hex, Array Format",
    description:
      "Generate cryptographically secure random bytes for testing and development. Output in Base64, Hex, or byte array format. Perfect for encryption testing, data generation, and binary data simulation.",
    mode: "bytes",
    params: { count: 10, bytes_length: 16, bytes_format: "base64" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Bytes",
      icon: "FileCode",
    },
    keywords: [
      "random bytes",
      "base64 generator",
      "random binary data",
      "byte array generator",
      "secure random",
    ],
    priority: 0.6,
    category: "developer-tools",
    faq: [
      {
        question: "What output formats are available?",
        answer:
          "Base64 encoding, hexadecimal string, and JavaScript byte array format are supported.",
      },
      {
        question: "How many bytes can I generate?",
        answer:
          "You can generate from 1 to 1,048,576 bytes (1MB) per result. Multiple results can be generated in a batch.",
      },
    ],
    how_to: [
      "Select byte length",
      "Choose output format",
      "Set how many to generate",
      "Click 'Generate Bytes'",
    ],
    features: [
      "Base64/Hex/Array formats",
      "CSPRNG security",
      "Up to 1MB per result",
      "Batch generation",
    ],
  },

  // ============================================================
  // DATA GENERATION TOOLS
  // ============================================================

  // === Random Fraction Generator ===
  "random-fraction": {
    slug: "random-fraction",
    title: "Random Fraction Generator",
    seo_title: "Random Fraction Generator - Create Random Fractions",
    description:
      "Generate random proper and improper fractions for math education and testing. Automatic simplification available. Perfect for worksheets, quizzes, and mathematical practice.",
    mode: "fraction",
    params: { count: 10, fraction_max: 100, fraction_simplified: true },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Fractions",
      icon: "Divide",
    },
    keywords: [
      "random fraction",
      "fraction generator",
      "math fractions",
      "simplified fractions",
      "random numerator denominator",
    ],
    priority: 0.6,
    category: "data-generation",
    faq: [
      {
        question: "Are fractions simplified?",
        answer:
          "By default, all fractions are automatically simplified to their lowest terms. You can disable this option.",
      },
      {
        question: "What range can I use?",
        answer:
          "You can set the maximum denominator from 2 to 10,000. Numerators are generated to create proper and mixed fractions.",
      },
    ],
    how_to: [
      "Set maximum denominator",
      "Toggle simplification",
      "Choose how many to generate",
      "Click 'Generate Fractions'",
    ],
    features: [
      "Auto-simplification",
      "Custom denominator range",
      "Proper and improper fractions",
      "Math education friendly",
    ],
  },

  // === Random Percentage Generator ===
  "random-percentage": {
    slug: "random-percentage",
    title: "Random Percentage Generator",
    seo_title: "Random Percentage Generator - 0% to 100%",
    description:
      "Generate random percentages from 0% to 100%. Choose integer or decimal precision. Perfect for statistics, probability simulations, discounts, and data visualization testing.",
    mode: "percentage",
    params: { count: 10, percentage_decimals: 0 },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Percentages",
      icon: "Percent",
    },
    keywords: [
      "random percentage",
      "percent generator",
      "random percent",
      "probability generator",
      "discount generator",
    ],
    priority: 0.6,
    category: "data-generation",
    faq: [
      {
        question: "What precision options are available?",
        answer:
          "You can generate whole number percentages (0%, 57%, 100%) or with 1-2 decimal places (0.5%, 99.99%).",
      },
    ],
    how_to: [
      "Select decimal precision (0-2)",
      "Choose how many to generate",
      "Click 'Generate Percentages'",
    ],
    features: [
      "0-100% range",
      "Decimal precision options",
      "Batch generation",
      "Statistics friendly",
    ],
  },

  // === Random Date Generator ===
  "random-date": {
    slug: "random-date",
    title: "Random Date Generator",
    seo_title: "Random Date Generator - Pick Random Dates from Range",
    description:
      "Generate random dates within a custom range. Supports ISO, US (MM/DD/YYYY), and European (DD/MM/YYYY) formats. Perfect for scheduling simulations, data testing, and date selection.",
    mode: "date",
    params: { count: 10, date_format: "iso" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Dates",
      icon: "Calendar",
    },
    keywords: [
      "random date generator",
      "pick random date",
      "date range random",
      "random day",
      "random calendar date",
    ],
    priority: 0.7,
    category: "data-generation",
    faq: [
      {
        question: "What date formats are supported?",
        answer:
          "ISO (YYYY-MM-DD), US format (MM/DD/YYYY), and European format (DD/MM/YYYY) are supported.",
      },
      {
        question: "How do I set a custom date range?",
        answer:
          "You can specify start and end dates in ISO format. Random dates will be generated evenly within that range.",
      },
    ],
    how_to: [
      "Select date format",
      "Optional: Set date range",
      "Choose how many dates to generate",
      "Click 'Generate Dates'",
    ],
    features: [
      "Multiple date formats",
      "Custom date ranges",
      "Even distribution",
      "Batch generation",
    ],
  },

  // === Random Word Generator ===
  "random-words": {
    slug: "random-words",
    title: "Random Word Generator",
    seo_title: "Random Word Generator - Generate Random English Words",
    description:
      "Generate random English words from common vocabulary. Filter by nouns, verbs, or adjectives. Perfect for word games, creative writing prompts, and language learning.",
    mode: "words",
    params: { word_count: 10, word_type: "all" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Words",
      icon: "Type",
    },
    keywords: [
      "random word generator",
      "random words",
      "word picker",
      "random english words",
      "random vocabulary",
    ],
    priority: 0.7,
    category: "data-generation",
    faq: [
      {
        question: "What types of words are available?",
        answer:
          "Common English nouns, verbs, and adjectives. Over 300 frequently used words across all categories.",
      },
      {
        question: "Can I filter by word type?",
        answer:
          "Yes! You can choose to generate only nouns, only verbs, only adjectives, or mix all types together.",
      },
    ],
    how_to: [
      "Select word type filter",
      "Choose how many words to generate",
      "Click 'Generate Words'",
      "Use for games or prompts",
    ],
    features: [
      "300+ common words",
      "Filter by type",
      "Batch generation",
      "Educational use",
    ],
  },

  // ============================================================
  // MATH & EDUCATION TOOLS
  // ============================================================

  // === Random Alphabet/Letter Generator ===
  "random-alphabet": {
    slug: "random-alphabet",
    title: "Random Letter Generator",
    seo_title: "Random Letter Generator - Pick Random Letters A-Z",
    description:
      "Generate random letters from A-Z. Choose uppercase, lowercase, or mixed case. Option for vowels only. Perfect for games, education, and random letter selection.",
    mode: "alphabet",
    params: { count: 10, alphabet_case: "mixed", alphabet_vowels_only: false },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Letters",
      icon: "LetterCase",
    },
    keywords: [
      "random letter",
      "letter generator",
      "alphabet picker",
      "random alphabet",
      "pick a letter",
    ],
    priority: 0.6,
    category: "data-generation",
    faq: [
      {
        question: "What case options are available?",
        answer:
          "You can generate uppercase (A-Z), lowercase (a-z), or mixed case letters randomly.",
      },
      {
        question: "Can I generate only vowels?",
        answer:
          "Yes! Enable 'Vowels Only' to generate only A, E, I, O, U (in your selected case).",
      },
    ],
    how_to: [
      "Select letter case (upper/lower/mixed)",
      "Optional: Enable vowels only",
      "Choose how many letters to generate",
      "Click 'Generate Letters'",
    ],
    features: [
      "Uppercase/lowercase/mixed",
      "Vowels only option",
      "Batch generation",
      "Education friendly",
    ],
  },

  // === Random Prime Number Generator ===
  "random-prime": {
    slug: "random-prime",
    title: "Random Prime Number Generator",
    seo_title: "Random Prime Number Generator - Generate Prime Numbers",
    description:
      "Generate random prime numbers for math education and cryptography testing. Uses the Sieve of Eratosthenes algorithm. Set maximum prime value up to 1 million.",
    mode: "prime",
    params: { count: 10, prime_max: 1000 },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Primes",
      icon: "Hashtag",
    },
    keywords: [
      "random prime number",
      "prime generator",
      "prime numbers",
      "math primes",
      "generate prime",
    ],
    priority: 0.6,
    category: "data-generation",
    faq: [
      {
        question: "How are prime numbers generated?",
        answer:
          "We use the Sieve of Eratosthenes algorithm to efficiently find all primes up to your maximum value, then randomly select from them.",
      },
      {
        question: "What's the maximum prime I can generate?",
        answer:
          "You can set the maximum value from 2 to 1,000,000. Higher values may take longer to process.",
      },
    ],
    how_to: [
      "Set maximum prime value",
      "Choose how many primes to generate",
      "Click 'Generate Primes'",
      "Use for math or testing",
    ],
    features: [
      "Sieve of Eratosthenes",
      "Up to 1M max value",
      "Efficient algorithm",
      "Math education",
    ],
  },

  // === Random Roman Numeral Generator ===
  "random-roman": {
    slug: "random-roman",
    title: "Random Roman Numeral Generator",
    seo_title: "Random Roman Numeral Generator - Generate Roman Numerals",
    description:
      "Generate random Roman numerals from I to MMMCMXCIX (1-3999). Perfect for education, history, and design testing. Learn Roman numeral notation interactively.",
    mode: "roman",
    params: { count: 10, roman_max: 100 },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Roman",
      icon: "Hash",
    },
    keywords: [
      "random roman numeral",
      "roman numeral generator",
      "roman numbers",
      "random roman",
      "roman numerals I to MMMCMXCIX",
    ],
    priority: 0.5,
    category: "data-generation",
    faq: [
      {
        question: "What range of Roman numerals is supported?",
        answer:
          "Supports standard Roman numerals from I (1) to MMMCMXCIX (3,999), the traditional range for Roman numerals.",
      },
      {
        question: "How are Roman numerals calculated?",
        answer:
          "Roman numerals use additive notation: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Subtractive notation (IV=4, IX=9) is also used.",
      },
    ],
    how_to: [
      "Set maximum value",
      "Choose how many to generate",
      "Click 'Generate Roman'",
      "Learn Roman numerals",
    ],
    features: [
      "I to MMMCMXCIX (1-3999)",
      "Proper notation",
      "Educational",
      "Batch generation",
    ],
  },

  // === Random Unicode Character Generator ===
  "random-unicode": {
    slug: "random-unicode",
    title: "Random Unicode Character Generator",
    seo_title: "Random Unicode Generator - Characters & Emojis",
    description:
      "Generate random Unicode characters including ASCII, Latin extended, emoji, and symbols. Perfect for testing internationalization, font rendering, and text processing.",
    mode: "unicode",
    params: { count: 10, unicode_range: "basic", unicode_count: 1 },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Characters",
      icon: "Text",
    },
    keywords: [
      "random unicode",
      "unicode generator",
      "random emoji",
      "unicode character",
      "random symbols",
    ],
    priority: 0.6,
    category: "developer-tools",
    faq: [
      {
        question: "What Unicode ranges are available?",
        answer:
          "Basic ASCII printable characters, Latin Extended (European accents), Emoji range, various symbols, and the entire Basic Multilingual Plane.",
      },
      {
        question: "Can I generate multiple characters per result?",
        answer:
          "Yes! Set 'Characters per result' to generate strings of 1-100 random Unicode characters.",
      },
    ],
    how_to: [
      "Select Unicode range",
      "Set characters per result",
      "Choose how many to generate",
      "Click 'Generate Characters'",
    ],
    features: [
      "ASCII/Latin/Emoji/Symbols",
      "Full Unicode support",
      "Testing friendly",
      "Internationalization",
    ],
  },

  // === Random ASCII Character Generator ===
  "random-ascii": {
    slug: "random-ascii",
    title: "Random ASCII Character Generator",
    seo_title: "Random ASCII Character Generator - 0-255 ASCII Codes",
    description:
      "Generate random ASCII characters. Supports printable characters (32-126) or full ASCII range (0-255). Perfect for testing string processing and character encoding.",
    mode: "ascii",
    params: { count: 10, ascii_printable: true, ascii_count: 10 },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate ASCII",
      icon: "FileType",
    },
    keywords: [
      "random ascii",
      "ascii generator",
      "random character",
      "ascii code",
      "random string",
    ],
    priority: 0.5,
    category: "developer-tools",
    faq: [
      {
        question: "What's the difference between printable and full ASCII?",
        answer:
          "Printable ASCII includes characters 32-126 (space, letters, numbers, symbols). Full ASCII includes control characters (0-31, 127, 128-255).",
      },
      {
        question: "How many characters can I generate per string?",
        answer:
          "You can generate strings from 1 to 1,000 characters each, with up to 10,000 strings per batch.",
      },
    ],
    how_to: [
      "Choose printable or full range",
      "Set characters per string",
      "Choose how many strings",
      "Click 'Generate ASCII'",
    ],
    features: [
      "Printable/full range",
      "Custom string length",
      "Batch generation",
      "Encoding testing",
    ],
  },

  // ============================================================
  // SIMULATION & TESTING DATA
  // ============================================================

  // === Random Temperature Generator ===
  "random-temperature": {
    slug: "random-temperature",
    title: "Random Temperature Generator",
    seo_title: "Random Temperature Generator - Celsius, Fahrenheit, Kelvin",
    description:
      "Generate random temperature values for weather simulation and testing. Supports Celsius, Fahrenheit, and Kelvin units with custom ranges and precision.",
    mode: "temperature",
    params: {
      count: 10,
      temp_unit: "celsius",
      temp_min: -50,
      temp_max: 50,
      temp_decimals: 1,
    },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Temperatures",
      icon: "Thermometer",
    },
    keywords: [
      "random temperature",
      "temperature generator",
      "weather simulation",
      "celsius fahrenheit kelvin",
      "random degrees",
    ],
    priority: 0.6,
    category: "data-generation",
    faq: [
      {
        question: "What temperature units are supported?",
        answer:
          "Celsius (°C), Fahrenheit (°F), and Kelvin (K) units are supported.",
      },
      {
        question: "Can I simulate extreme temperatures?",
        answer:
          "Yes! You can set any min/max range. Default is -50 to 50, but you can simulate Arctic or desert conditions.",
      },
    ],
    how_to: [
      "Select temperature unit",
      "Set min/max range",
      "Choose decimal precision",
      "Click 'Generate Temperatures'",
    ],
    features: [
      "Celsius/Fahrenheit/Kelvin",
      "Custom ranges",
      "Decimal precision",
      "Weather simulation",
    ],
  },

  // === Random Currency Generator ===
  "random-currency": {
    slug: "random-currency",
    title: "Random Currency Amount Generator",
    seo_title: "Random Money Generator - Random Currency Amounts",
    description:
      "Generate random currency amounts with custom symbols and precision. Perfect for financial testing, price simulation, and payment gateway testing.",
    mode: "currency",
    params: {
      count: 10,
      currency_symbol: "$",
      currency_decimals: 2,
      currency_min: 0,
      currency_max: 1000,
    },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Amounts",
      icon: "DollarSign",
    },
    keywords: [
      "random money",
      "currency generator",
      "random amount",
      "random price",
      "financial testing",
    ],
    priority: 0.6,
    category: "data-generation",
    faq: [
      {
        question: "Can I use different currency symbols?",
        answer:
          "Yes! You can set any currency symbol: $, €, £, ¥, ₹, or any other symbol.",
      },
      {
        question: "What precision options are available?",
        answer:
          "You can set 0-4 decimal places. Common values: 0 for yen, 2 for dollars/euros, 3 for some currencies.",
      },
    ],
    how_to: [
      "Set currency symbol",
      "Choose decimal precision",
      "Set min/max amount range",
      "Click 'Generate Amounts'",
    ],
    features: [
      "Custom currency symbol",
      "Flexible precision",
      "Amount range control",
      "Financial testing",
    ],
  },

  // === Random Phone Number Generator ===
  "random-phone": {
    slug: "random-phone",
    title: "Random Phone Number Generator",
    seo_title: "Random Phone Number Generator - Fake Numbers for Testing",
    description:
      "Generate random phone numbers in various international formats. Perfect for UI testing, form validation, and database seeding. Numbers are for testing only.",
    mode: "phone",
    params: { count: 10, phone_country: "international" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Numbers",
      icon: "Phone",
    },
    keywords: [
      "random phone number",
      "phone number generator",
      "fake phone number",
      "test phone numbers",
      "random mobile number",
    ],
    priority: 0.7,
    category: "data-generation",
    faq: [
      {
        question: "What countries are supported?",
        answer:
          "US, UK, China, Japan, Germany, France, and a generic international format are supported.",
      },
      {
        question: "Are these real phone numbers?",
        answer:
          "No! These are randomly generated numbers for testing purposes only. Do not use for actual calls or SMS.",
      },
    ],
    how_to: [
      "Select country format",
      "Choose how many to generate",
      "Click 'Generate Numbers'",
      "Use for testing only",
    ],
    features: [
      "Multiple country formats",
      "Proper formatting",
      "Testing friendly",
      "Batch generation",
    ],
  },

  // === Random Email Generator ===
  "random-email": {
    slug: "random-email",
    title: "Random Email Address Generator",
    seo_title: "Random Email Generator - Fake Email Addresses for Testing",
    description:
      "Generate random email addresses for testing. Choose from random, simple, or professional styles with custom domains. Perfect for form testing and database seeding.",
    mode: "email",
    params: {
      count: 10,
      email_domain: "example.com",
      email_user_style: "random",
    },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Emails",
      icon: "Mail",
    },
    keywords: [
      "random email",
      "email generator",
      "fake email",
      "test email address",
      "random email address",
    ],
    priority: 0.7,
    category: "data-generation",
    faq: [
      {
        question: "Can I use a custom domain?",
        answer:
          "Yes! You can set any domain name. Default is 'example.com' which is reserved for documentation and testing.",
      },
      {
        question: "What username styles are available?",
        answer:
          "Random strings (abc123), simple (user1234), or professional style (happy.fox42) with adjective+noun combinations.",
      },
    ],
    how_to: [
      "Set domain name",
      "Choose username style",
      "Select how many to generate",
      "Click 'Generate Emails'",
    ],
    features: [
      "Custom domains",
      "Multiple styles",
      "Testing friendly",
      "Batch generation",
    ],
  },

  // === Random Username Generator ===
  "random-username": {
    slug: "random-username",
    title: "Random Username Generator",
    seo_title: "Random Username Generator - Create Random Usernames",
    description:
      "Generate random usernames for testing and inspiration. Choose from random strings, word-based, or mixed styles with custom separators. Perfect for gaming and account testing.",
    mode: "username",
    params: { count: 10, username_style: "mixed", username_separator: "_" },
    ui: {
      show_inputs: true,
      result_type: "text",
      button_text: "Generate Usernames",
      icon: "User",
    },
    keywords: [
      "random username",
      "username generator",
      "random gamer name",
      "username ideas",
      "create username",
    ],
    priority: 0.7,
    category: "data-generation",
    faq: [
      {
        question: "What username styles are available?",
        answer:
          "Random strings, cool words, number-based (user123), or mixed style with separators like _ - or .",
      },
      {
        question: "Can I customize the separator?",
        answer:
          "Yes! You can use underscore (_), hyphen (-), dot (.), or no separator at all.",
      },
    ],
    how_to: [
      "Select username style",
      "Choose separator character",
      "Set how many to generate",
      "Click 'Generate Usernames'",
    ],
    features: [
      "Multiple styles",
      "Custom separators",
      "Cool word options",
      "Gaming friendly",
    ],
  },
};
