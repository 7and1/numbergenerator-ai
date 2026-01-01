import type { ToolConfig } from "../../types";

/**
 * Password and PIN generator configurations
 * Includes tools for generating secure passwords and PIN codes
 */
export const passwordTools: Record<string, ToolConfig> = {
  // Strong Password Generator (16 characters)
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
          "Each password is generated using cryptographically secure random number generation (CSPRNG), providing maximum entropy for security. Our 16-character passwords offer approximately 128 bits of entropy.",
      },
      {
        question: "Are my passwords stored or logged?",
        answer:
          "No! All password generation happens locally in your browser. We never store, transmit, or log any passwords. Your generated passwords disappear when you close the page.",
      },
      {
        question: "What makes a password strong?",
        answer:
          "Strong passwords use a mix of uppercase letters, lowercase letters, numbers, and symbols. Our 16-character passwords provide 128+ bits of entropy, making them virtually uncrackable by brute force.",
      },
      {
        question: "Why 16 characters?",
        answer:
          "16 characters is considered the gold standard for password security. At this length with full character set usage, passwords are virtually impossible to crack with current technology.",
      },
      {
        question: "Should I remember these passwords?",
        answer:
          "No! These strong passwords are designed to be stored in a password manager. They're too complex to memorize but provide maximum security when stored properly.",
      },
      {
        question: "Can I customize the password length?",
        answer:
          "Yes! Use our Password Generator Pro to create passwords of any length from 8 to 128 characters with custom character options.",
      },
      {
        question: "How often should I change my passwords?",
        answer:
          "Modern security guidance suggests using strong unique passwords for each site and only changing them if there's a suspected breach. Our generator helps create unique passwords for every account.",
      },
    ],
    how_to: [
      "Click 'Generate Password' to create a secure 16-character password",
      "Copy the password using the copy button",
      "Store it securely in a password manager",
      "Use it for your account registration",
      "Generate a new password for each account",
    ],
    features: [
      "16-character default length",
      "Mixed case, numbers, symbols",
      "CSPRNG security",
      "Grouped format (xxxx-xxxx-xxxx-xxxx)",
      "No storage or tracking",
      "Client-side generation",
    ],
  },

  // 12 Character Password Generator
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
          "A 12-character random password with mixed case, numbers, and symbols provides approximately 75 bits of entropy, which is very secure against brute force attacks and meets most security requirements.",
      },
      {
        question: "Why choose 12 characters over 16?",
        answer:
          "12-character passwords offer a balance between security and usability. They're strong enough for most applications while being slightly easier to manage if you need to type them occasionally.",
      },
      {
        question: "What characters are included?",
        answer:
          "Our 12-character passwords include uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and symbols (!@#$%^&*). This full character set maximizes security.",
      },
      {
        question: "Can I use this for sensitive accounts?",
        answer:
          "Yes! 12-character random passwords are suitable for most accounts including banking, email, and social media. For maximum security, consider 16+ characters.",
      },
      {
        question: "Are these passwords generated securely?",
        answer:
          "Absolutely! We use the Web Crypto API with CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) to ensure each password is truly random and unpredictable.",
      },
      {
        question: "Do you store any generated passwords?",
        answer:
          "No! All generation happens in your browser. We never see, store, or transmit any passwords. They disappear when you leave the page.",
      },
    ],
    how_to: [
      "Click generate for a 12-char password",
      "Copy and store securely in a password manager",
      "Use for account registration or password updates",
      "Generate unique passwords for each site",
    ],
    features: [
      "12 character length",
      "Full character set",
      "Secure generation",
      "No storage or logging",
      "Mobile friendly",
    ],
  },

  // 20 Character Password Generator
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
          "20-character passwords provide approximately 130 bits of entropy, making them virtually uncrackable by brute force. This is recommended for high-security accounts like banking, cryptocurrency, and password managers.",
      },
      {
        question: "Is 20 characters overkill?",
        answer:
          "For most users, yes. However, for high-value accounts, cryptocurrency wallets, or if you want maximum security assurance, 20-character passwords provide an extra margin of safety.",
      },
      {
        question: "How long would it take to crack a 20-character password?",
        answer:
          "With current technology, cracking a truly random 20-character password could take billions of years even with the most powerful supercomputers. It's effectively uncrackable.",
      },
      {
        question: "What characters are included?",
        answer:
          "All character types: uppercase (A-Z), lowercase (a-z), numbers (0-9), and symbols (!@#$%^&*). This provides maximum entropy per character.",
      },
      {
        question: "Should I use this for all my accounts?",
        answer:
          "You can, but 16-character passwords are sufficient for most accounts. Reserve 20-character passwords for your most critical accounts.",
      },
      {
        question: "Are these passwords compatible with all websites?",
        answer:
          "Most modern websites support 20-character passwords. However, some older systems may have length restrictions. Check the site's password requirements.",
      },
    ],
    how_to: [
      "Click generate for a 20-char password",
      "Use for critical accounts (banking, crypto, password manager)",
      "Store securely in a password manager",
      "Never reuse across multiple sites",
    ],
    features: [
      "20 character length",
      "Maximum security",
      "Grouped display for readability",
      "Full character set",
      "CSPRNG generation",
    ],
  },

  // 4-Digit PIN Generator
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
          "Yes! Each PIN is generated using cryptographically secure random number generation, ensuring unpredictable results. However, avoid common sequences like 1234 when the result is predictable.",
      },
      {
        question: "Can I use this for my phone or ATM PIN?",
        answer:
          "Yes, you can use these PINs for your devices. Remember: never share your PIN and avoid using obvious sequences. Regenerate if you get a pattern like 1234 or 0000.",
      },
      {
        question: "What are the odds of guessing a 4-digit PIN?",
        answer:
          "There are 10,000 possible combinations (0000-9999), giving a 1 in 10,000 chance per random guess. This is why using random PINs is more secure than choosing birthdays.",
      },
      {
        question: "Should I avoid certain PINs?",
        answer:
          "Yes! Avoid common PINs like 1234, 0000, 1111, 1212, and birth years. Our generator produces truly random PINs, but you can regenerate if you get a common sequence.",
      },
      {
        question: "Can I generate multiple PINs at once?",
        answer:
          "Click generate multiple times to create different PINs, or use our advanced tools to generate multiple PINs in bulk for testing or fleet device setup.",
      },
      {
        question: "Are these PINs stored anywhere?",
        answer:
          "No! PIN generation happens entirely in your browser. We never store, transmit, or log any generated PINs. They're completely private.",
      },
    ],
    how_to: [
      "Click 'Generate PIN' for a random 4-digit code",
      "Review the PIN - regenerate if you see a common pattern",
      "Memorize or store securely",
      "Use for phone lock, ATM, or security system",
      "Regenerate as often as needed",
    ],
    features: [
      "4-digit format (0000-9999)",
      "Secure CSPRNG",
      "Leading zeros included",
      "Instant generation",
      "No storage or logging",
    ],
  },

  // 6-Digit PIN Generator
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
          "6-digit PINs have 1 million possible combinations (000000-999999) compared to 10,000 for 4-digit PINs, making them 100x more secure against brute force attacks.",
      },
      {
        question: "Where are 6-digit PINs commonly used?",
        answer:
          "6-digit PINs are standard for banking apps, 2FA (two-factor authentication), credit card security, and modern smartphone passcodes.",
      },
      {
        question: "How secure is a 6-digit PIN?",
        answer:
          "With 1 million possible combinations, 6-digit PINs provide good security for most purposes. Combined with rate limiting, they're very effective against attacks.",
      },
      {
        question: "Can I use this for 2FA codes?",
        answer:
          "This generates static PINs for device locks or banking, not time-based 2FA codes. For 2FA, use an authenticator app. This tool is great for setting up your initial PIN.",
      },
      {
        question: "Should I avoid common 6-digit PINs?",
        answer:
          "Yes! Avoid patterns like 123456, 000000, 111111, or birth dates (YYMMDD). Our random generator helps avoid these patterns.",
      },
      {
        question: "Are my generated PINs private?",
        answer:
          "Completely! All generation happens in your browser. We never store, transmit, or see any PINs you generate.",
      },
    ],
    how_to: [
      "Click 'Generate PIN' for a 6-digit code",
      "Use for 2FA setup, banking apps, or device security",
      "Store securely or memorize",
      "Regenerate if you see an obvious pattern",
    ],
    features: [
      "6-digit format (000000-999999)",
      "Enhanced security (1M combinations)",
      "Leading zeros included",
      "CSPRNG generation",
      "No storage or logging",
    ],
  },

  // 8-Digit PIN Generator
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
          "An 8-digit PIN has 100 million possible combinations, making it extremely secure against brute force attacks. Even with rate limiting, it would take years to crack.",
      },
      {
        question: "When should I use an 8-digit PIN?",
        answer:
          "Use 8-digit PINs for high-security scenarios: corporate access systems, safes, security systems, or when maximum PIN security is required.",
      },
      {
        question: "How does 8-digit compare to passwords?",
        answer:
          "8-digit PINs are more secure than short passwords but less secure than long random passwords. They're a good compromise when you need numeric-only security.",
      },
      {
        question: "Can all systems accept 8-digit PINs?",
        answer:
          "Many modern systems support 8-digit PINs, especially banking and security applications. Check your system's requirements before using.",
      },
      {
        question: "Are 8-digit PINs harder to remember?",
        answer:
          "Slightly harder than shorter PINs, but much more secure. Consider breaking it into two groups of 4 digits for easier memorization.",
      },
      {
        question: "Is the generation truly random?",
        answer:
          "Yes! We use cryptographically secure random generation ensuring each digit has equal probability and no predictable patterns.",
      },
    ],
    how_to: [
      "Click 'Generate PIN' for an 8-digit code",
      "Use for high-security needs",
      "Consider grouping digits for memorization (XXXX-XXXX)",
      "Store securely in a password manager if needed",
    ],
    features: [
      "8-digit format (00000000-99999999)",
      "100M combinations",
      "Maximum PIN security",
      "CSPRNG generation",
      "No storage",
    ],
  },

  // 10-Digit PIN Generator
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
          "10-digit PINs are used for enhanced security systems, corporate access codes, specialized authentication systems, and applications requiring extended PIN formats.",
      },
      {
        question: "How secure is a 10-digit PIN?",
        answer:
          "With 10 billion possible combinations, 10-digit PINs provide extremely high security. They're virtually uncrackable through brute force with proper rate limiting.",
      },
      {
        question: "Can I use this as a phone number or ID?",
        answer:
          "Yes! 10-digit codes are commonly used for identification, confirmation codes, and reference numbers. Our generator creates truly random values.",
      },
      {
        question: "Are there any drawbacks to 10-digit PINs?",
        answer:
          "The main drawback is memorability. 10 digits can be difficult to remember, so they're best used in scenarios where you can store the code securely.",
      },
      {
        question: "What's the difference between this and random numbers?",
        answer:
          "10-digit PINs include leading zeros and are formatted specifically for security codes. Random number generators may not preserve the exact format needed.",
      },
      {
        question: "Can I generate these in bulk?",
        answer:
          "Yes! Generate as many unique 10-digit PINs as needed for employee badges, access codes, or verification systems.",
      },
    ],
    how_to: [
      "Click 'Generate PIN' for a 10-digit code",
      "Use for specialized security systems",
      "Can serve as ID or reference numbers",
      "Store securely - difficult to memorize",
    ],
    features: [
      "10-digit format",
      "10 billion combinations",
      "CSPRNG security",
      "Leading zeros included",
      "Bulk generation capable",
    ],
  },

  // Password Generator Pro
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
          "Yes! Password Pro can generate up to 50 passwords in a single batch, perfect for setting up multiple accounts, user onboarding, or password rotation.",
      },
      {
        question: "What does 'exclude ambiguous characters' mean?",
        answer:
          "This option removes characters that look similar (like 0/O, 1/l/I) to prevent confusion when reading or typing passwords. Useful for passwords that need to be read aloud or manually entered.",
      },
      {
        question: "What does 'ensure each character type' do?",
        answer:
          "This guarantees that every generated password contains at least one lowercase letter, one uppercase letter, one number, and one symbol (if enabled). No character type is ever missing.",
      },
      {
        question: "Can I customize which characters are excluded?",
        answer:
          "Yes! Use the 'Exclude Characters' field to specify any characters you don't want included. Useful for systems with specific character restrictions.",
      },
      {
        question: "What's the best password length?",
        answer:
          "16 characters is recommended for most users. It provides excellent security while remaining manageable. You can adjust from 8 to 128 characters based on your needs.",
      },
      {
        question: "Should I use memorable or random passwords?",
        answer:
          "Always use random passwords! Memorable passwords are easier to guess. Store random passwords in a password manager rather than trying to remember them.",
      },
      {
        question: "Are batch-generated passwords unique?",
        answer:
          "Yes! Each password in a batch is independently generated with the same security level. Within a batch of 50, duplicates are statistically extremely unlikely.",
      },
    ],
    how_to: [
      "Set password length (8-128 characters)",
      "Choose how many to generate (up to 50)",
      "Customize character options (include/exclude types)",
      "Enable 'exclude ambiguous' for readability",
      "Optional: Exclude specific characters",
      "Click generate for batch passwords",
      "Copy all or individual passwords",
    ],
    features: [
      "Batch generation (up to 50)",
      "Exclude ambiguous chars",
      "Ensure each character type",
      "Custom exclusions",
      "Length customization",
      "Grouping option",
      "CSPRNG security",
    ],
  },
};
