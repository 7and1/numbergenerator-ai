import type { ToolConfig } from "../../types";

/**
 * Dice and coin flipper configurations
 * Includes tools for rolling dice and flipping coins
 */
export const diceTools: Record<string, ToolConfig> = {
  // D6 Dice Roller
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
          "Yes! We use cryptographically secure random generation to ensure each roll is completely fair and unpredictable, just like physical dice.",
      },
      {
        question: "Can I roll multiple dice at once?",
        answer:
          "For multiple dice, use our advanced dice roller which supports multiple rolls, different die types, and modifiers.",
      },
      {
        question: "What can I use a D6 roller for?",
        answer:
          "Perfect for board games (Monopoly, Backgammon, Yahtzee), decision making, teaching probability, or anytime you need a random 1-6 result.",
      },
      {
        question: "How is this different from physical dice?",
        answer:
          "Our digital dice offer the same fairness with instant results, no dice to lose, and works anywhere. The random generation is mathematically equivalent to physical dice.",
      },
      {
        question: "Are the results truly random?",
        answer:
          "Yes! We use CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) which provides true randomness suitable for fair gaming.",
      },
      {
        question: "Does this work for classroom activities?",
        answer:
          "Yes! Teachers use our D6 roller for probability lessons, math games, and random selection. It's easier than managing physical dice for large classes.",
      },
      {
        question: "Can I use this for D&D?",
        answer:
          "Yes! While D20 is more common in D&D, D6 rolls are used for weapon damage, certain abilities, and random effects. Use our advanced dice roller for full D&D support.",
      },
    ],
    how_to: [
      "Click 'Roll Dice' to roll a D6",
      "See your result instantly with animation",
      "Use for board games, decisions, or activities",
      "Roll again for additional results",
    ],
    features: [
      "Single D6 roll",
      "Secure random",
      "Large display",
      "Instant results",
      "No internet required after load",
    ],
  },

  // Advanced Dice Roller
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
      {
        question: "Can I roll multiple dice at once?",
        answer:
          "Yes! Set the number of rolls to throw multiple dice simultaneously. Great for damage rolls or skill checks with multiple dice.",
      },
      {
        question: "Is this suitable for D&D 5th Edition?",
        answer:
          "Absolutely! Supports all standard D&D dice types, advantage/disadvantage, and modifiers. Perfect for in-person or online play.",
      },
      {
        question: "Are the dice rolls fair?",
        answer:
          "Yes! Each roll uses cryptographically secure random generation, ensuring fair results equivalent to high-quality physical dice.",
      },
      {
        question: "Can I use this for other RPG systems?",
        answer:
          "Yes! The custom dice option supports any number of sides, making it compatible with Pathfinder, Call of Cthulhu, Warhammer, and most RPG systems.",
      },
    ],
    how_to: [
      "Select dice type (D4, D6, D8, D10, D12, D20, or custom)",
      "Choose number of rolls",
      "Optional: Add advantage/disadvantage",
      "Optional: Set a modifier",
      "Click 'Roll Dice' for results",
      "View individual rolls and total sum",
    ],
    features: [
      "All standard RPG dice",
      "Multiple rolls",
      "Advantage/disadvantage",
      "Modifiers",
      "Sum display",
      "Custom sides",
      "CSPRNG fairness",
    ],
  },

  // Coin Flip
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
      {
        question: "What can I use a coin flip for?",
        answer:
          "Perfect for making decisions, settling disputes, sports kickoffs, board games, probability education, or anytime you need a binary random choice.",
      },
      {
        question: "How is this different from a real coin?",
        answer:
          "Our digital coin flip provides the same 50/50 probability with instant results, no coin needed, and works anywhere. The randomness is mathematically equivalent to physical coins.",
      },
      {
        question: "Are the results truly random?",
        answer:
          "Yes! We use CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) ensuring each flip is independent and fair.",
      },
      {
        question: "Can I see my flip history?",
        answer:
          "Use our coin flip simulator which tracks statistics including heads/tails counts, percentages, and streak tracking.",
      },
      {
        question: "Does this work offline?",
        answer:
          "Once loaded, our coin flipper works entirely offline in your browser. No internet connection needed for flips.",
      },
    ],
    how_to: [
      "Click 'Flip Coin' for heads or tails",
      "Use for quick decisions or games",
      "Result appears instantly",
      "Flip again for additional tosses",
    ],
    features: [
      "Single coin flip",
      "50/50 probability",
      "Instant result",
      "Works offline",
      "No tracking",
    ],
  },

  // Coin Flip Pro (with stats)
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
          "The simulator tracks consecutive heads or tails results, showing you the longest streak for each outcome in your session. Great for observing probability in action.",
      },
      {
        question: "Can I flip more than 10 coins?",
        answer:
          "Yes! Adjust the number of flips from 1 to 1000 to experiment with probability and see how results converge toward 50/50 over many flips.",
      },
      {
        question: "Why track coin flip statistics?",
        answer:
          "Statistics help demonstrate the law of large numbers - over many flips, results approach 50/50. Useful for teaching probability and validating randomness.",
      },
      {
        question: "What's the longest possible streak?",
        answer:
          "There's no theoretical limit - you could get heads 100 times in a row, though the probability is extremely low (about 1 in 1,267,650,600,228,229,401,496,703,205,376).",
      },
      {
        question: "Can I reset the statistics?",
        answer:
          "Each session tracks flips independently. Refresh the page or clear results to start a new statistics session.",
      },
      {
        question: "Is this useful for classroom teaching?",
        answer:
          "Yes! Teachers use this to demonstrate probability, the law of large numbers, and statistical concepts with visual, real-time results.",
      },
    ],
    how_to: [
      "Set number of flips",
      "Click 'Flip Coins'",
      "View statistics: counts, percentages, streaks",
      "Observe how results approach 50/50 over many flips",
      "Reset to start a new session",
    ],
    features: [
      "Multiple flips at once",
      "Streak tracking",
      "Statistics display",
      "Percentage breakdown",
      "Up to 1000 flips",
      "Educational",
    ],
  },
};
