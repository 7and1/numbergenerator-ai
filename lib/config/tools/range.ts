import type { ToolConfig } from "../../types";

/**
 * Number range tool configurations
 * Includes tools for generating random numbers within specific ranges
 */
export const rangeTools: Record<string, ToolConfig> = {
  // Template shell for range-based tools
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

  // Random Number 1-10
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
      {
        question: "Can I use this for contests and giveaways?",
        answer:
          "Absolutely! Our cryptographically secure generation ensures fair and unbiased results, making it perfect for contests, raffles, and prize drawings.",
      },
      {
        question: "Is my data private when using this tool?",
        answer:
          "Yes! All number generation happens locally in your browser. We never store, transmit, or track your generated numbers or any personal data.",
      },
      {
        question: "What's the probability of getting any specific number?",
        answer:
          "Each number from 1 to 10 has an exactly equal 10% chance of being selected. Our CSPRNG ensures perfect statistical distribution.",
      },
      {
        question: "Does this work on mobile devices?",
        answer:
          "Yes! Our random number generator is fully responsive and works perfectly on smartphones, tablets, and desktop computers.",
      },
    ],
    how_to: [
      "Click the 'Generate' button to get a random number from 1-10",
      "The number appears instantly with a smooth animation",
      "Use the result for games, decisions, or any random selection",
      "Click again to generate additional numbers as needed",
      "Copy the result using the copy button if you need to save it",
    ],
    features: [
      "Cryptographically secure random generation",
      "Instant results",
      "Works offline",
      "No signup required",
      "Mobile friendly",
      "No tracking or ads",
    ],
  },

  // Random Number 1-100
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
      {
        question: "What are the odds for each number?",
        answer:
          "Each number from 1 to 100 has exactly a 1% chance of being selected. Our CSPRNG ensures statistically fair distribution.",
      },
      {
        question: "Can I generate multiple unique numbers from 1-100?",
        answer:
          "Yes! Use our advanced random number generator to create multiple unique numbers from 1 to 100 without repeats.",
      },
      {
        question: "Is this better than using physical dice or drawing numbers?",
        answer:
          "Our digital generator offers the same fairness as physical methods but with instant results, no setup required, and works anywhere.",
      },
      {
        question: "Are my generated numbers tracked or stored?",
        answer:
          "No! All generation happens in your browser. We never see, store, or track any numbers you generate.",
      },
      {
        question: "Can I use this for classroom activities?",
        answer:
          "Yes! Teachers love using our 1-100 generator for random student selection, math games, and probability demonstrations.",
      },
    ],
    how_to: [
      "Click 'Generate' for an instant random number 1-100",
      "Use for contests, games, or decision making",
      "Click again for additional numbers",
      "Copy results using the copy button if needed",
      "Use advanced mode for multiple unique numbers",
    ],
    features: [
      "One-click generation",
      "Secure CSPRNG",
      "Mobile friendly",
      "No tracking",
      "Instant results",
      "Classroom friendly",
    ],
  },

  // Random Number 1-1000
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
      {
        question: "What's the probability of getting a specific number?",
        answer:
          "Each number from 1 to 1000 has exactly a 0.1% (1 in 1000) chance of being selected. Perfect for fair drawings and statistical sampling.",
      },
      {
        question: "Is this suitable for scientific sampling?",
        answer:
          "Yes! Our CSPRNG provides cryptographically secure randomness suitable for statistical sampling, research, and data analysis.",
      },
      {
        question: "Can I customize the range beyond 1000?",
        answer:
          "Absolutely! You can adjust the min and max values to create any custom range you need for your specific use case.",
      },
      {
        question: "Why use a 1-1000 range instead of smaller ranges?",
        answer:
          "The 1-1000 range is ideal when you need more possible outcomes than 1-100 provides, such as larger raffles, statistical sampling, or ID generation.",
      },
      {
        question: "Is there a limit to how many numbers I can generate?",
        answer:
          "You can generate unlimited single numbers. For bulk generation, use our advanced tool to create up to 1000 numbers at once.",
      },
    ],
    how_to: [
      "Click generate for a random number 1-1000",
      "Adjust range if needed using the min/max inputs",
      "Copy or use the result immediately",
      "Generate additional numbers with another click",
      "Use advanced mode for bulk unique generation",
    ],
    features: [
      "Large range support",
      "Cryptographically secure",
      "Instant results",
      "Customizable range",
      "Statistical quality",
    ],
  },

  // Random Number 1-10000
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
      {
        question: "What is the probability for each number in 1-10000?",
        answer:
          "Each number has exactly a 0.01% chance (1 in 10,000). Our CSPRNG ensures perfect statistical distribution across the entire range.",
      },
      {
        question: "What can I use a 1-10000 generator for?",
        answer:
          "Perfect for large raffles, employee ID selection, statistical sampling, lottery-style drawings, and generating random codes or identifiers.",
      },
      {
        question: "Is this suitable for lottery-style drawings?",
        answer:
          "Yes! The 1-10,000 range is commonly used for raffles and drawings. Our cryptographically secure generation ensures fair results.",
      },
      {
        question: "Can I generate unique numbers from this range?",
        answer:
          "Use our advanced generator to create multiple unique numbers from 1-10,000 without any duplicates, perfect for large drawings.",
      },
      {
        question: "How is this different from pseudo-random generators?",
        answer:
          "We use CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) which provides true randomness suitable for security and fair drawings.",
      },
      {
        question: "Can I use this for database testing?",
        answer:
          "Absolutely! Generate random IDs, test data, or foreign key values within the 1-10,000 range for database development and testing.",
      },
    ],
    how_to: [
      "Set your range (default 1-10000)",
      "Click generate to get a random number",
      "Get your random number instantly",
      "Copy the result if needed",
      "Repeat for additional numbers",
    ],
    features: [
      "Extended range support",
      "Secure random generation",
      "Fast results",
      "ID generation ready",
      "Statistical quality",
    ],
  },

  // Random Number 0-99
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
          "The 0-99 range is useful for percentage calculations (00-99%), zero-based indexing in programming, and games where zero matters. It gives exactly 100 possibilities starting from zero.",
      },
      {
        question: "How do I use this for percentage calculations?",
        answer:
          "Treat the result as a percentage: 00 = 0%, 50 = 50%, 99 = 99%. Perfect for probability simulations, discount calculations, and statistical modeling.",
      },
      {
        question: "Is this suitable for programming-related tasks?",
        answer:
          "Yes! The 0-99 range is perfect for testing zero-based indexing, array access simulation, and algorithms that expect ranges starting at zero.",
      },
      {
        question: "What's the probability of getting any specific number?",
        answer:
          "Each number from 0 to 99 has exactly a 1% chance. The number 00 is included, giving you exactly 100 possible outcomes.",
      },
      {
        question: "Can I generate multiple unique numbers from 0-99?",
        answer:
          "Use our advanced generator to create multiple unique numbers. Perfect for bingo-style games or drawing all numbers without replacement.",
      },
      {
        question: "Is the leading zero displayed for single digits?",
        answer:
          "Single digits (0-9) display without leading zeros by default. This gives you clean results whether you're using them for math or display purposes.",
      },
      {
        question: "Can I use this for board games?",
        answer:
          "Yes! Many board games use 0-99 or percentage-based mechanics. Our generator provides instant, fair results without physical dice or spinners.",
      },
    ],
    how_to: [
      "Click generate for a number 0-99",
      "Use for percentages (treat result as 0-99%)",
      "Use for zero-based games or programming tests",
      "Generate additional numbers as needed",
      "Copy results for your records",
    ],
    features: [
      "Zero-inclusive range",
      "Quick generation",
      "No ads",
      "Percentage friendly",
      "Programming ready",
    ],
  },

  // Random Number 1-20
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
          "Perfect for board games with d20 dice (like D&D), classroom activities, picking volunteers, workout routines, and any situation requiring a random number from 1-20.",
      },
      {
        question: "Is this the same as rolling a d20 die?",
        answer:
          "Yes! Generating a random number 1-20 is exactly equivalent to rolling a 20-sided die. Our digital version is faster and always fair.",
      },
      {
        question: "Can teachers use this in the classroom?",
        answer:
          "Absolutely! Use it for random student selection, math problems, assigning presentation order, or creating random groups.",
      },
      {
        question: "What's the probability for each number?",
        answer:
          "Each number from 1 to 20 has exactly a 5% chance (1 in 20). Our CSPRNG ensures perfect statistical distribution.",
      },
      {
        question: "Is this suitable for D&D and tabletop games?",
        answer:
          "Yes! When you don't have physical dice handy, or need to roll secretly as a game master, our 1-20 generator works perfectly.",
      },
      {
        question: "Can I generate multiple numbers at once?",
        answer:
          "Use our advanced random number generator to roll multiple d20 dice at once, great for D&D advantage/disadvantage rolls.",
      },
      {
        question: "Is this better than physical dice?",
        answer:
          "Our digital generator offers instant results, works anywhere, never gets lost, and provides guaranteed fairness without any bias.",
      },
    ],
    how_to: [
      "Click generate for a number 1-20",
      "Use for board games, D&D, or classroom activities",
      "Roll multiple times for repeated selections",
      "Copy results if needed for record-keeping",
    ],
    features: [
      "Game-friendly range",
      "Instant results",
      "Secure random",
      "D&D compatible",
      "Teacher friendly",
    ],
  },

  // Advanced Range Generator
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
          "Yes! Set the count parameter to generate up to 1000 random numbers in a single click. Perfect for bulk data generation.",
      },
      {
        question: "How do I generate unique random numbers?",
        answer:
          "Enable the 'Unique' option to ensure no duplicate numbers are generated. Great for lottery-style draws, raffle tickets, and creating random samples.",
      },
      {
        question: "Can I get decimal numbers?",
        answer:
          "Set the precision parameter to control decimal places. Precision=1 gives tenths (1.5), precision=2 gives hundredths (1.25), etc.",
      },
      {
        question: "What does the step parameter do?",
        answer:
          "Step controls the increment between possible values. Step=1 gives integers (1,2,3), step=0.5 gives halves (1.0,1.5,2.0), step=10 gives multiples of 10.",
      },
      {
        question: "Can I sort the generated numbers?",
        answer:
          "Yes! Choose ascending (lowest to highest), descending (highest to lowest), or leave unsorted for completely random order.",
      },
      {
        question: "What's the maximum count I can generate?",
        answer:
          "You can generate up to 1000 numbers at once. For unique generation, the count cannot exceed your range size.",
      },
      {
        question: "Is this suitable for scientific sampling?",
        answer:
          "Yes! Our CSPRNG provides cryptographically secure randomness suitable for statistical sampling, research, and scientific applications.",
      },
    ],
    how_to: [
      "Set your min and max range",
      "Choose how many numbers to generate (up to 1000)",
      "Toggle unique values to avoid duplicates",
      "Enable sorting if needed (ascending/descending)",
      "Set precision for decimal numbers (0-6 places)",
      "Optional: Set custom step value",
      "Click generate for your results",
    ],
    features: [
      "Bulk generation (up to 1000)",
      "Unique/sorted options",
      "Decimal precision",
      "Custom step values",
      "Copy all results",
      "Statistical quality",
    ],
  },
};
