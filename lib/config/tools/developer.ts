import type { ToolConfig } from "../../types";

/**
 * Developer tool configurations
 * Includes tools for generating UUIDs, timestamps, coordinates, IPs, and other developer utilities
 */
export const developerTools: Record<string, ToolConfig> = {
  // UUID Generator
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
          "UUID v4 (Version 4) is a universally unique identifier generated from random numbers. It consists of 32 hexadecimal digits displayed in 5 groups separated by hyphens (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx).",
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
      {
        question: "What's the difference between UUID and GUID?",
        answer:
          "UUID (Universally Unique Identifier) and GUID (Globally Unique Identifier) are essentially the same thing. GUID is Microsoft's implementation of UUID. Our tool generates standard UUID v4 format.",
      },
      {
        question: "Should I use uppercase or lowercase?",
        answer:
          "UUIDs are case-insensitive for comparison, but some systems prefer lowercase. Our tool lets you choose either format.",
      },
      {
        question: "Can I remove hyphens from UUIDs?",
        answer:
          "Yes! Disable the hyphens option to generate compact 32-character UUIDs without dashes. Some APIs prefer this format.",
      },
      {
        question: "What can I use UUIDs for?",
        answer:
          "Database primary keys, API request IDs, session identifiers, distributed system tracing, file names, or any situation requiring globally unique identifiers.",
      },
    ],
    how_to: [
      "Choose uppercase or lowercase format",
      "Enable or disable hyphens",
      "Set how many UUIDs to generate",
      "Click 'Generate UUID'",
      "Copy all or individual UUIDs",
    ],
    features: [
      "UUID v4 format",
      "Uppercase/lowercase option",
      "With/without hyphens",
      "Batch generation",
      "CSPRNG security",
      "No collisions",
    ],
  },

  // Random Timestamp Generator
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
          "Supports Unix timestamps (seconds since epoch), Unix timestamps with milliseconds, and ISO 8601 format (YYYY-MM-DDTHH:MM:SS.sssZ).",
      },
      {
        question: "Can I generate timestamps for a specific date range?",
        answer:
          "Yes! You can set start and end dates to generate random timestamps within any time period. Perfect for testing date-sensitive features.",
      },
      {
        question: "What is Unix timestamp?",
        answer:
          "Unix timestamp represents the number of seconds since January 1, 1970 (UTC). It's a common way to store dates in databases and APIs.",
      },
      {
        question: "Can I use this for load testing?",
        answer:
          "Yes! Generate thousands of timestamps for creating test data with realistic date distributions. Perfect for populating databases.",
      },
      {
        question: "What's the range of possible timestamps?",
        answer:
          "Our tool supports dates from year 1970 to 2100+. This covers essentially any practical use case for modern applications.",
      },
      {
        question: "Are timestamps timezone-aware?",
        answer:
          "Unix timestamps are always UTC. ISO timestamps include timezone information (Z suffix for UTC). Both formats are unambiguous.",
      },
    ],
    how_to: [
      "Select timestamp format (Unix, Unix-ms, or ISO)",
      "Optional: Set date range",
      "Choose how many to generate",
      "Click 'Generate Timestamps'",
      "Copy results for testing",
    ],
    features: [
      "Multiple format options",
      "Custom date ranges",
      "Batch generation",
      "Testing friendly",
      "UTC based",
    ],
  },

  // Random Coordinates Generator
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
          "Decimal degrees (DD.DDDDDD) and Degrees-Minutes-Seconds (DMS) formats are supported. Decimal is more common in development.",
      },
      {
        question: "Can I limit coordinates to a specific region?",
        answer:
          "Yes! You can set custom latitude and longitude ranges to generate coordinates within any geographic area. Perfect for local testing.",
      },
      {
        question: "What's the precision of generated coordinates?",
        answer:
          "Our coordinates use 6 decimal places, providing approximately 10cm precision - more than enough for most mapping and location applications.",
      },
      {
        question: "Are these valid coordinates?",
        answer:
          "Yes! Latitude ranges from -90 to +90, longitude from -180 to +180. All generated coordinates fall within valid geographic bounds.",
      },
      {
        question: "Can I use this for mapping app testing?",
        answer:
          "Absolutely! Generate random coordinates to test map rendering, location features, geospatial queries, and distance calculations.",
      },
      {
        question: "What can I use random coordinates for?",
        answer:
          "Location-based app testing, geospatial data seeding, map feature testing, proximity search testing, and generating random test locations.",
      },
    ],
    how_to: [
      "Select coordinate format",
      "Optional: Set lat/lng bounds",
      "Choose how many to generate",
      "Click 'Generate Coordinates'",
      "Copy for your mapping project",
    ],
    features: [
      "Decimal and DMS formats",
      "Custom geographic bounds",
      "6 decimal precision",
      "Batch generation",
      "Valid GPS coordinates",
    ],
  },

  // Random IPv4 Generator
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
          "Yes! Enable the 'Include Private' option to generate IPs from private network ranges like 192.168.x.x for internal network testing.",
      },
      {
        question: "Are these real IP addresses?",
        answer:
          "These are randomly generated IP addresses following the IPv4 format. They're not assigned to any actual system and are safe for testing.",
      },
      {
        question: "Can I use these for production?",
        answer:
          "No! These are for testing only. Never use randomly generated IPs in production systems. Use properly allocated IP addresses.",
      },
      {
        question: "What can I use random IPs for?",
        answer:
          "Testing IP-based access controls, populating databases with test data, network application development, and analytics testing.",
      },
      {
        question: "How many IPs can I generate?",
        answer:
          "Generate up to 10,000 IP addresses in a single batch. Perfect for large-scale data generation and testing.",
      },
    ],
    how_to: [
      "Choose to include private/reserved ranges",
      "Set how many IPs to generate",
      "Click 'Generate IPs'",
      "Copy for testing",
      "Use in development only",
    ],
    features: [
      "Public IPs by default",
      "Optional private ranges",
      "Realistic distribution",
      "Batch generation",
      "Testing friendly",
    ],
  },

  // Random MAC Address Generator
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
          "These are randomly generated for testing purposes. They follow the correct format but are not assigned to any actual hardware. Do not use in production.",
      },
      {
        question: "What's a MAC address used for?",
        answer:
          "MAC (Media Access Control) addresses uniquely identify network interfaces. They're used for network communication at the data link layer.",
      },
      {
        question: "Can I use these for testing?",
        answer:
          "Yes! Perfect for testing network device management, MAC filtering logic, hardware inventory systems, and network visualization tools.",
      },
      {
        question: "Should I use uppercase or lowercase?",
        answer:
          "MAC addresses are case-insensitive, but many systems display them in uppercase. Choose based on your testing needs.",
      },
      {
        question: "Are these unicast or multicast?",
        answer:
          "Our generated MAC addresses are designed to be unicast (the first byte's least significant bit is 0), representing individual device addresses.",
      },
    ],
    how_to: [
      "Choose separator style",
      "Select uppercase or lowercase",
      "Set how many to generate",
      "Click 'Generate MACs'",
      "Use for testing only",
    ],
    features: [
      "Multiple separator formats",
      "Upper/lowercase options",
      "Batch generation",
      "Testing friendly",
      "Valid format",
    ],
  },

  // Random Bytes Generator
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
          "Base64 encoding, hexadecimal string, and JavaScript byte array format are supported. Choose based on your development needs.",
      },
      {
        question: "How many bytes can I generate?",
        answer:
          "You can generate from 1 to 1,048,576 bytes (1MB) per result. Multiple results can be generated in a batch.",
      },
      {
        question: "Are these bytes cryptographically secure?",
        answer:
          "Yes! We use the Web Crypto API's getRandomValues() which provides cryptographically strong random values suitable for security applications.",
      },
      {
        question: "When should I use Base64 vs Hex?",
        answer:
          "Base64 is more compact and common in web applications. Hex is commonly used in cryptography and low-level programming. Both represent the same binary data.",
      },
      {
        question: "Can I use this for encryption key testing?",
        answer:
          "Yes! Generate random bytes for encryption keys, initialization vectors (IVs), salts, and other cryptographic testing purposes.",
      },
      {
        question: "What's the byte array format?",
        answer:
          "JavaScript array format like [12, 45, 255]. Useful for Node.js development, testing binary protocols, and working with TypedArrays.",
      },
    ],
    how_to: [
      "Select byte length",
      "Choose output format (Base64, Hex, or Array)",
      "Set how many to generate",
      "Click 'Generate Bytes'",
      "Use for security testing",
    ],
    features: [
      "Base64/Hex/Array formats",
      "CSPRNG security",
      "Up to 1MB per result",
      "Batch generation",
      "Crypto testing",
    ],
  },

  // Random Hex Generator
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
          "Add 0x prefix if you're using the hex values in code (like 0x1A3F). Omit it if you just need the raw hex string for data or configuration.",
      },
      {
        question: "Are these hex values secure?",
        answer:
          "Yes! We use cryptographically secure random generation, making these hex values suitable for testing security features and generating test tokens.",
      },
      {
        question: "Can I use this for color codes?",
        answer:
          "Yes! 3 bytes gives you 6 hex digits (like 1A3F5C) which is perfect for RGB color codes. For 8-digit colors with alpha, use 4 bytes.",
      },
      {
        question: "What's the difference between uppercase and lowercase hex?",
        answer:
          "Purely cosmetic - hex values are case-insensitive. A-F and a-f represent the same values. Choose based on your coding style or requirements.",
      },
    ],
    how_to: [
      "Set the byte length (1-1024)",
      "Enable 0x prefix if needed",
      "Set how many to generate",
      "Click 'Generate Hex'",
      "Copy for your project",
    ],
    features: [
      "Custom byte length",
      "Optional 0x prefix",
      "Batch generation",
      "CSPRNG security",
      "Developer friendly",
    ],
  },

  // Random Unicode Character Generator
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
          "Yes! Set 'Characters per result' to generate strings of 1-100 random Unicode characters. Great for generating test text.",
      },
      {
        question: "Are these characters valid?",
        answer:
          "Yes! All generated characters are valid Unicode code points. They can be used in any modern application or system.",
      },
      {
        question: "Can I use this for emoji generation?",
        answer:
          "Yes! Select the emoji range to generate random emoji characters. Perfect for testing emoji support in your application.",
      },
      {
        question: "What's internationalization testing?",
        answer:
          "i18n testing ensures your app works with different character sets. Our Unicode generator helps test support for international characters and symbols.",
      },
      {
        question: "Can I generate specific character ranges?",
        answer:
          "Yes! Choose from presets or select the full range to sample from the entire Basic Multilingual Plane (65,536 characters).",
      },
    ],
    how_to: [
      "Select Unicode range",
      "Set characters per result",
      "Choose how many to generate",
      "Click 'Generate Characters'",
      "Use for i18n testing",
    ],
    features: [
      "ASCII/Latin/Emoji/Symbols",
      "Full Unicode support",
      "Testing friendly",
      "Internationalization",
      "Batch generation",
    ],
  },

  // Random ASCII Character Generator
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
      {
        question: "What are control characters?",
        answer:
          "Control characters (0-31, 127) are non-printing codes like tab, newline, and bell. They're used for device control, not display.",
      },
      {
        question: "Can I use this for password testing?",
        answer:
          "Yes! Generate random ASCII strings for testing password validation, input sanitization, and character encoding.",
      },
      {
        question: "What's the extended ASCII range (128-255)?",
        answer:
          "Extended ASCII includes accented characters, symbols, and box-drawing characters. Different encodings (ISO-8859-1, Windows-1252) assign different meanings.",
      },
      {
        question: "Are these safe for filenames?",
        answer:
          'Printable ASCII (excluding special characters like /\\:*?"<>|) is safe for filenames. Use the printable range for filename testing.',
      },
    ],
    how_to: [
      "Choose printable or full range",
      "Set characters per string",
      "Choose how many strings",
      "Click 'Generate ASCII'",
      "Use for encoding testing",
    ],
    features: [
      "Printable/full range",
      "Custom string length",
      "Batch generation",
      "Encoding testing",
      "Character validation",
    ],
  },
};
