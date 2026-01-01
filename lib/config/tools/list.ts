import type { ToolConfig } from "../../types";

/**
 * List manipulation tool configurations
 * Includes tools for picking from lists, shuffling, and wheel spinners
 */
export const listTools: Record<string, ToolConfig> = {
  // List Picker
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
          "You can paste up to 10,000 items. Perfect for large contests, drawings, or random selection from big datasets.",
      },
      {
        question: "Is the selection truly random?",
        answer:
          "Yes! We use cryptographically secure random generation (CSPRNG) ensuring each item has equal probability of being selected.",
      },
      {
        question: "Can I pick multiple winners?",
        answer:
          "Yes! Set the count to pick multiple items at once. Enable 'Unique' to ensure no item is picked more than once.",
      },
      {
        question: "What can I use this for?",
        answer:
          "Perfect for contest winner selection, random student calling, team selection, giveaway drawings, or any situation requiring fair random selection.",
      },
      {
        question: "Are my lists stored or private?",
        answer:
          "Completely private! All processing happens in your browser. We never see, store, or transmit any list data you enter.",
      },
      {
        question: "Can I use special characters in my list?",
        answer:
          "Yes! Your list can contain any text including names, email addresses, numbers, or special characters. Each line becomes a separate item.",
      },
    ],
    how_to: [
      "Paste your list (one item per line)",
      "Set how many to pick",
      "Toggle unique selection if needed",
      "Click 'Pick' for random selection",
      "Copy results or pick again",
    ],
    features: [
      "Paste any list",
      "Pick 1 or multiple",
      "Unique option",
      "No list size limit",
      "Private processing",
      "CSPRNG fairness",
    ],
  },

  // Shuffle List
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
          "Our tool uses the Fisher-Yates shuffle algorithm with cryptographically secure random numbers for truly fair shuffling. Each item has equal chance for any position.",
      },
      {
        question: "Can I create groups from a shuffled list?",
        answer:
          "Yes! Set a group size to output your shuffled list in groups. Perfect for creating teams, seating arrangements, or breaking into working groups.",
      },
      {
        question: "What can I use shuffling for?",
        answer:
          "Creating teams, randomizing playlists, seating arrangements, presentation order, workout routines, or any situation needing random order.",
      },
      {
        question: "Is the shuffling truly random?",
        answer:
          "Yes! The Fisher-Yates algorithm with CSPRNG ensures mathematically fair shuffling. Every permutation has equal probability.",
      },
      {
        question: "How large can my list be?",
        answer:
          "You can shuffle up to 10,000 items. Perfect for classrooms, conferences, or large group activities.",
      },
      {
        question: "Can I shuffle multiple times?",
        answer:
          "Yes! Click shuffle again for a completely new random arrangement. Each shuffle is independent and equally random.",
      },
      {
        question: "Is my list data private?",
        answer:
          "Absolutely! All shuffling happens in your browser. We never store or transmit any list data you enter.",
      },
    ],
    how_to: [
      "Paste your list (one item per line)",
      "Optional: Set group size",
      "Click 'Shuffle'",
      "Copy the randomized list",
      "Shuffle again for new order",
    ],
    features: [
      "Fisher-Yates shuffle",
      "Group output option",
      "Large list support",
      "Private processing",
      "Instant results",
    ],
  },

  // Spin Wheel Picker
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
      {
        question: "Is the spin wheel fair?",
        answer:
          "Yes! The wheel uses cryptographically secure random generation ensuring each segment has equal probability. The visual animation is for fun only.",
      },
      {
        question: "What can I use the wheel for?",
        answer:
          "Decision making, classroom activities, prize wheels, choosing dinner, picking a workout, or anytime you want a fun random selection.",
      },
      {
        question: "Can I reuse the wheel?",
        answer:
          "Yes! Edit your choices anytime and spin as many times as you like. Each spin is independent and equally random.",
      },
      {
        question: "Does the wheel animation affect the result?",
        answer:
          "No! The result is determined the moment you click spin using secure random generation. The animation is purely for visual enjoyment.",
      },
      {
        question: "Can I use this on a mobile device?",
        answer:
          "Yes! Our spin wheel is touch-friendly and works perfectly on smartphones and tablets. Great for classroom or party use.",
      },
    ],
    how_to: [
      "Enter your choices (one per line)",
      "Click 'Spin' to rotate the wheel",
      "The wheel stops on a random choice",
      "Spin again for more selections",
      "Edit choices anytime",
    ],
    features: [
      "Visual spinning animation",
      "Customizable choices",
      "Touch-friendly",
      "Fun and engaging",
      "CSPRNG fairness",
    ],
  },

  // Ticket Draw (No Replacement)
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
          "Once a ticket is drawn, it cannot be drawn again. This ensures fair raffles where each ticket can only win once. The remaining ticket count decreases with each draw.",
      },
      {
        question: "Can I reset the drawing?",
        answer:
          "Yes! Click reset to start fresh with all tickets available again. Great for starting a new raffle or bingo game.",
      },
      {
        question: "What can I use this for?",
        answer:
          "Raffle drawings, bingo number calling, lottery-style giveaways, door prizes, or any situation requiring fair selection without repeats.",
      },
      {
        question: "Can I use custom ticket numbers?",
        answer:
          "Yes! Instead of a range, paste your own list of ticket numbers. Perfect for pre-sold raffle tickets or custom numbering systems.",
      },
      {
        question: "How many tickets can I have?",
        answer:
          "You can draw from ranges up to 10,000 tickets or paste a custom list. Great for small office raffles to large community events.",
      },
      {
        question: "Is this fair for raffles?",
        answer:
          "Absolutely! Each remaining ticket has equal probability. Since tickets aren't replaced, each draw is fair and transparent.",
      },
      {
        question: "Can I see which tickets remain?",
        answer:
          "Yes! The tool displays how many tickets remain in the pool, so you always know the drawing status.",
      },
    ],
    how_to: [
      "Set your ticket range or paste custom tickets",
      "Click 'Draw Ticket' for each draw",
      "Tickets are removed as they're drawn",
      "View remaining ticket count",
      "Reset when needed to start over",
    ],
    features: [
      "No replacement drawing",
      "Custom ticket lists",
      "Remaining count display",
      "Reset option",
      "CSPRNG fairness",
      "Raffle ready",
    ],
  },
};
