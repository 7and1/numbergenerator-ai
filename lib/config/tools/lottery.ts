import type { ToolConfig } from "../../types";

/**
 * Lottery number generator configurations
 * Includes tools for generating lottery numbers like Powerball and Mega Millions
 */
export const lotteryTools: Record<string, ToolConfig> = {
  // Powerball Number Generator
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
      {
        question: "What are the odds of winning Powerball?",
        answer:
          "The odds of winning the Powerball jackpot are approximately 1 in 292 million. Our generator gives you randomly selected numbers, but winning is never guaranteed.",
      },
      {
        question: "Are these numbers truly random?",
        answer:
          "Yes! We use cryptographically secure random generation (CSPRNG) to ensure each number selection is completely fair and unpredictable.",
      },
      {
        question: "Can I generate multiple sets of Powerball numbers?",
        answer:
          "Click the 'Pick Lucky Numbers' button multiple times to generate different number combinations for multiple tickets.",
      },
      {
        question: "Do lucky numbers really exist?",
        answer:
          "No scientifically proven lucky numbers exist. Each Powerball drawing is independent, and all number combinations have equal probability. Our generator provides truly random selections.",
      },
      {
        question: "Is this better than Quick Pick at the store?",
        answer:
          "Our generator uses the same level of randomness as official Quick Pick systems. The advantage is you can generate numbers from home without visiting a retailer.",
      },
    ],
    how_to: [
      "Click 'Pick Lucky Numbers' for Powerball numbers",
      "The tool generates 5 main numbers (1-69) and 1 Powerball (1-26)",
      "Use the numbers to fill your official ticket",
      "Generate more combinations for additional tickets",
      "Remember to play responsibly",
    ],
    features: [
      "Official Powerball format",
      "Unique main numbers",
      "Separate Powerball",
      "Bubble display",
      "CSPRNG security",
    ],
  },

  // Mega Millions Number Generator
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
      {
        question: "What are the odds of winning Mega Millions?",
        answer:
          "The odds of winning the Mega Millions jackpot are approximately 1 in 302 million. Our generator gives you randomly selected numbers with the same odds as any other combination.",
      },
      {
        question: "Are generated numbers truly random?",
        answer:
          "Absolutely! We use cryptographically secure random number generation (CSPRNG) ensuring each number selection is completely fair and unpredictable.",
      },
      {
        question: "What's the difference between Powerball and Mega Millions?",
        answer:
          "Powerball uses 5 numbers from 1-69 plus a Powerball from 1-26. Mega Millions uses 5 numbers from 1-70 plus a Mega Ball from 1-25. Both offer massive jackpots.",
      },
      {
        question: "Can I generate multiple number sets?",
        answer:
          "Yes! Click 'Pick Lucky Numbers' repeatedly to generate different combinations for multiple tickets or pool entries.",
      },
      {
        question: "Is there any strategy to picking lottery numbers?",
        answer:
          "No! All number combinations have equal probability. Using random numbers (like our generator) is actually better than choosing patterns or birthdays, which many people do.",
      },
    ],
    how_to: [
      "Click 'Pick Lucky Numbers' for Mega Millions numbers",
      "The tool generates 5 main numbers (1-70) and 1 Mega Ball (1-25)",
      "Use the numbers to fill your official ticket",
      "Generate more combinations for additional tickets",
      "Play responsibly and within your budget",
    ],
    features: [
      "Official Mega Millions format",
      "Unique main numbers",
      "Separate Mega Ball",
      "Bubble display",
      "CSPRNG security",
    ],
  },
};
