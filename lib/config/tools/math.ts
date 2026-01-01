import type { ToolConfig } from "../../types";

/**
 * Math and education tool configurations
 * Includes tools for generating prime numbers, Roman numerals, and fractions
 */
export const mathTools: Record<string, ToolConfig> = {
  // Random Fraction Generator
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
          "By default, all fractions are automatically simplified to their lowest terms using the greatest common divisor (GCD). You can disable this option.",
      },
      {
        question: "What range can I use?",
        answer:
          "You can set the maximum denominator from 2 to 10,000. Numerators are generated to create proper and improper fractions.",
      },
      {
        question:
          "What's the difference between proper and improper fractions?",
        answer:
          "Proper fractions have numerators smaller than denominators (like 3/4). Improper fractions have numerators equal to or larger than denominators (like 5/4).",
      },
      {
        question: "Can I use this for teaching fractions?",
        answer:
          "Yes! Perfect for creating fraction worksheets, quizzes, and practice problems. Students can also practice simplifying fractions by disabling auto-simplify.",
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
      "GCD algorithm",
    ],
  },

  // Random Prime Number Generator
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
          "We use the Sieve of Eratosthenes algorithm to efficiently find all primes up to your maximum value, then randomly select from them using secure random generation.",
      },
      {
        question: "What's the maximum prime I can generate?",
        answer:
          "You can set the maximum value from 2 to 1,000,000. The largest prime under 1 million is 999,983.",
      },
      {
        question: "Can I use this for cryptography?",
        answer:
          "For educational purposes only. Real cryptography uses much larger primes (hundreds of digits). Our tool is great for learning prime concepts.",
      },
      {
        question: "What makes a number prime?",
        answer:
          "A prime number is greater than 1 and only divisible by 1 and itself. Examples: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29...",
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
      "Random selection",
    ],
  },

  // Random Roman Numeral Generator
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
          "Supports standard Roman numerals from I (1) to MMMCMXCIX (3,999), the traditional range for Roman numerals. Larger numbers require overline notation.",
      },
      {
        question: "How are Roman numerals calculated?",
        answer:
          "Roman numerals use additive and subtractive notation: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Smaller before larger means subtract (IV=4, IX=9).",
      },
      {
        question: "Why is the limit 3,999?",
        answer:
          "Standard Roman numerals require special overline notation for numbers above 3,999. Our generator uses the traditional range without overlines.",
      },
      {
        question: "Can I use this for learning?",
        answer:
          "Yes! Great for students learning Roman numerals, history classes, or anyone wanting to practice reading and writing Roman numerals.",
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
      "Subtractive notation",
    ],
  },
};
