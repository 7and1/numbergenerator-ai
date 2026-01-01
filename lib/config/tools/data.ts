import type { ToolConfig } from "../../types";

/**
 * Data generation tool configurations
 * Includes tools for generating random data like colors, dates, words, emails, etc.
 */
export const dataTools: Record<string, ToolConfig> = {
  // Random Color Generator
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
      {
        question: "Are these colors web-safe?",
        answer:
          "Our colors use the full 24-bit color space (16.7 million colors). While not limited to the 216 web-safe colors, they work perfectly in all modern browsers.",
      },
      {
        question: "Can I use this for design inspiration?",
        answer:
          "Absolutely! Generate random colors to discover new color combinations, break creative blocks, or find unexpected palettes for your designs.",
      },
      {
        question: "What's the difference between RGB and HSL?",
        answer:
          "RGB uses red, green, and blue values (0-255). HSL uses hue, saturation, and lightness, which is often more intuitive for designers to work with.",
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
      "Full color spectrum",
      "Design inspiration",
    ],
  },

  // Random Date Generator
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
          "ISO (YYYY-MM-DD), US format (MM/DD/YYYY), and European format (DD/MM/YYYY) are supported. ISO is recommended for international use.",
      },
      {
        question: "How do I set a custom date range?",
        answer:
          "You can specify start and end dates in ISO format. Random dates will be generated evenly within that range.",
      },
      {
        question: "Can I generate dates in the past or future?",
        answer:
          "Yes! Set your custom range to include past dates, future dates, or both. Perfect for historical data testing or future planning simulations.",
      },
      {
        question: "Are leap years handled correctly?",
        answer:
          "Yes! Our date generation correctly handles leap years, varying month lengths, and all calendar complexities.",
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
      "Leap year aware",
    ],
  },

  // Random Word Generator
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
          "Common English nouns, verbs, and adjectives. Over 300 frequently used words across all categories, carefully selected for everyday use.",
      },
      {
        question: "Can I filter by word type?",
        answer:
          "Yes! You can choose to generate only nouns, only verbs, only adjectives, or mix all types together. Great for grammar exercises.",
      },
      {
        question: "Are these common English words?",
        answer:
          "Yes! We use frequently used English words from common vocabulary. These are words you'll encounter in everyday life and literature.",
      },
      {
        question: "How many words can I generate?",
        answer:
          "Generate from 1 to 100 words at once. Perfect for creating word lists, writing prompts, or vocabulary exercises.",
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

  // Random Letter/Alphabet Generator
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
          "Yes! Enable 'Vowels Only' to generate only A, E, I, O, U (in your selected case). Perfect for certain word games and patterns.",
      },
      {
        question: "Can I generate multiple letters?",
        answer:
          "Yes! Generate from 1 to 100 letters at once. Great for creating random strings for games or testing.",
      },
      {
        question: "Can teachers use this in the classroom?",
        answer:
          "Absolutely! Use for alphabet games, letter drills, spelling practice, and random selection for activities.",
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
      "Equal probability",
    ],
  },

  // Random Temperature Generator
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
          "Celsius (C), Fahrenheit (F), and Kelvin (K) units are supported. Choose based on your region or application needs.",
      },
      {
        question: "Can I simulate extreme temperatures?",
        answer:
          "Yes! You can set any min/max range. Default is -50 to 50, but you can simulate Arctic conditions (-40C) or desert heat (50C+).",
      },
      {
        question: "What's the precision?",
        answer:
          "Set 0-3 decimal places for more precise temperatures. Useful for scientific data or weather API testing.",
      },
      {
        question: "What are realistic temperature ranges?",
        answer:
          "Earth's surface temperatures range from about -89C (Antarctica) to 57C (Death Valley). Set your range based on the climate you're simulating.",
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
      "Batch generation",
    ],
  },

  // Random Currency Generator
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
          "Yes! You can set any currency symbol: $, , , , , or any other symbol. Great for international testing.",
      },
      {
        question: "What precision options are available?",
        answer:
          "You can set 0-4 decimal places. Common values: 0 for yen, 2 for dollars/euros, 3 for some currencies like Bahraini dinar.",
      },
      {
        question: "Can I test price ranges?",
        answer:
          "Yes! Set min and max amounts to simulate specific price ranges. Perfect for e-commerce testing and financial applications.",
      },
      {
        question: "Can I generate negative amounts?",
        answer:
          "Set a negative minimum to generate negative amounts (like -$50 to $100). Useful for financial systems that handle debits.",
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
      "Negative values supported",
    ],
  },

  // Random Phone Number Generator
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
          "US, UK, China, Japan, Germany, France, and a generic international format are supported. More formats coming soon.",
      },
      {
        question: "Are these real phone numbers?",
        answer:
          "No! These are randomly generated numbers for testing purposes only. Do not use for actual calls or SMS. They follow correct formatting but are not assigned.",
      },
      {
        question: "Can I use these for validation testing?",
        answer:
          "Yes! Test your phone number input validation, length checks, format requirements, and error handling with these test numbers.",
      },
      {
        question: "Why use 555 for US numbers?",
        answer:
          "555-0100 through 555-0199 are reserved for fictional use in movies, TV, and testing. They're never assigned to real phones.",
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
      "Fictional area codes",
    ],
  },

  // Random Email Generator
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
          "Yes! You can set any domain name. Default is 'example.com' which is reserved for documentation and testing per RFC 2606.",
      },
      {
        question: "What username styles are available?",
        answer:
          "Random strings (abc123), simple (user1234), or professional style (happy.fox42) with adjective+noun combinations.",
      },
      {
        question: "Are these email addresses valid?",
        answer:
          "These follow valid email format but are for testing only. Never send emails to these addresses as they may reach real mailboxes.",
      },
      {
        question: "What's professional style?",
        answer:
          "Professional style creates readable email-like addresses using adjective+noun combinations, like 'swift.eagle@example.com'. Great for UI mockups.",
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
      "Valid format",
    ],
  },

  // Random Username Generator
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
          "Random strings, cool words, number-based (user123), or mixed style with separators like _ - or . for more creative usernames.",
      },
      {
        question: "Can I customize the separator?",
        answer:
          "Yes! You can use underscore (_), hyphen (-), dot (.), or no separator at all. The separator appears between word parts in mixed style.",
      },
      {
        question: "What can I use these usernames for?",
        answer:
          "Gaming usernames, testing account creation, database seeding, character names, and inspiration when creating your own username.",
      },
      {
        question: "How long are the usernames?",
        answer:
          "Lengths vary by style. Random strings use 8-12 characters, word-based usernames combine words for memorable results.",
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
      "Batch generation",
    ],
  },

  // Random Percentage Generator
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
      {
        question: "What can I use random percentages for?",
        answer:
          "Probability simulations, discount percentages, progress tracking, statistical sampling, grade calculations, and data visualization.",
      },
      {
        question: "Can I use this for discount codes?",
        answer:
          "Yes! Generate random discount percentages for promotions, coupons, or sale simulations. Set precision to 0 for whole number discounts.",
      },
    ],
    how_to: [
      "Select decimal precision (0-2)",
      "Choose how many to generate",
      "Click 'Generate Percentages'",
      "Use for statistics or calculations",
    ],
    features: [
      "0-100% range",
      "Decimal precision options",
      "Batch generation",
      "Statistics friendly",
      "Even distribution",
    ],
  },
};
