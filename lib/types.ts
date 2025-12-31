export type GeneratorMode =
  | "range"
  | "digit"
  | "password"
  | "lottery"
  | "list"
  | "shuffle"
  | "dice"
  | "coin"
  | "ticket"
  | "uuid"
  | "color"
  | "hex"
  | "timestamp"
  | "coordinates"
  | "ipv4"
  | "mac"
  | "fraction"
  | "percentage"
  | "date"
  | "bytes"
  | "words"
  | "alphabet"
  | "prime"
  | "roman"
  | "unicode"
  | "ascii"
  | "temperature"
  | "currency"
  | "phone"
  | "email"
  | "username";

export interface GeneratorParams {
  // === Range Mode (数值范围) ===
  min?: number;
  max?: number;
  step?: number;
  precision?: number; // 小数位
  count?: number; // 生成数量
  unique?: boolean; // 是否去重
  sort?: "asc" | "desc" | null;

  // === Digit/Password Mode (密码/PIN) ===
  length?: number;
  pad_zero?: boolean; // PIN补零
  charset?: "numeric" | "alphanumeric" | "hex" | "strong" | "custom";
  custom_charset?: string;
  grouping?: boolean; // 分组显示 (xxxx-xxxx)

  // === Password Pro options ===
  include_lower?: boolean;
  include_upper?: boolean;
  include_digits?: boolean;
  include_symbols?: boolean;
  exclude_ambiguous?: boolean;
  exclude_chars?: string;
  ensure_each?: boolean;

  // === Lottery Mode (彩票双池) ===
  pool_a?: { min: number; max: number; pick: number }; // 主池
  pool_b?: { min: number; max: number; pick: number }; // 副池 (如 Powerball)

  // === List/Simulation Mode (列表/模拟) ===
  items?: string[]; // 骰子面/硬币面
  weights?: number[]; // optional weights for list picks (same length as items)
  items_text?: string; // UI textarea source (optional)
  pick?: number; // alias for count in some UIs
  group_size?: number; // output grouping for shuffle/list

  // === Dice Mode ===
  dice_sides?: number; // e.g. 6, 20
  dice_rolls?: number; // roll N times
  dice_adv?: "none" | "advantage" | "disadvantage";
  dice_custom_faces?: string[]; // optional custom faces (non-numeric allowed)
  dice_modifier?: number; // e.g. +2

  // === Coin Mode ===
  coin_flips?: number; // flip N times
  coin_labels?: [string, string]; // [heads, tails]

  // === Ticket Draw Mode ===
  ticket_source?: "range" | "list";
  ticket_remaining?: string[]; // stateful bag for "no replacement"

  // === UUID Mode ===
  uuid_uppercase?: boolean; // UPPERCASE vs lowercase
  uuid_hyphens?: boolean; // with/without hyphens (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

  // === Color Mode ===
  color_format?: "hex" | "rgb" | "hsl"; // output format

  // === Hex Mode ===
  hex_bytes?: number; // number of bytes (2 hex chars per byte)
  hex_prefix?: boolean; // add 0x prefix

  // === Timestamp Mode ===
  timestamp_format?: "unix" | "unix-ms" | "iso"; // timestamp format
  timestamp_start?: number; // Unix timestamp start (seconds)
  timestamp_end?: number; // Unix timestamp end (seconds)

  // === Coordinates Mode ===
  lat_min?: number; // Minimum latitude (default -90)
  lat_max?: number; // Maximum latitude (default 90)
  lng_min?: number; // Minimum longitude (default -180)
  lng_max?: number; // Maximum longitude (default 180)
  coord_format?: "decimal" | "dms" | "plus"; // decimal, DMS, or plus codes

  // === IPv4 Mode ===
  ipv4_private?: boolean; // Include private IP ranges (10.x, 192.168.x, etc.)
  ipv4_reserved?: boolean; // Include reserved ranges

  // === MAC Address Mode ===
  mac_separator?: ":" | "-" | "." | ""; // MAC address separator
  mac_case?: "upper" | "lower"; // Uppercase or lowercase

  // === Fraction Mode ===
  fraction_max?: number; // Maximum denominator (default 100)
  fraction_simplified?: boolean; // Simplify fractions (default true)

  // === Percentage Mode ===
  percentage_decimals?: number; // Decimal places (0-2, default 0)

  // === Date Mode ===
  date_start?: string; // Start date (ISO string)
  date_end?: string; // End date (ISO string)
  date_format?: "iso" | "us" | "eu" | "custom"; // Date format
  date_format_string?: string; // Custom format string

  // === Bytes Mode ===
  bytes_length?: number; // Number of random bytes
  bytes_format?: "base64" | "hex" | "array"; // Output format

  // === Words Mode ===
  word_count?: number; // Number of words to generate
  word_type?: "all" | "nouns" | "verbs" | "adjectives"; // Word type filter

  // === Alphabet Mode ===
  alphabet_case?: "upper" | "lower" | "mixed"; // Letter case
  alphabet_vowels_only?: boolean; // Only vowels

  // === Prime Mode ===
  prime_max?: number; // Maximum prime value

  // === Roman Mode ===
  roman_max?: number; // Maximum value (default 3999)

  // === Unicode Mode ===
  unicode_range?: "basic" | "latin" | "emoji" | "symbols" | "all"; // Character range
  unicode_count?: number; // Number of characters per result

  // === ASCII Mode ===
  ascii_printable?: boolean; // Only printable characters (32-126)
  ascii_count?: number; // Number of characters

  // === Temperature Mode ===
  temp_unit?: "celsius" | "fahrenheit" | "kelvin"; // Temperature unit
  temp_min?: number; // Minimum temperature
  temp_max?: number; // Maximum temperature
  temp_decimals?: number; // Decimal places

  // === Currency Mode ===
  currency_symbol?: string; // Currency symbol (default: $)
  currency_decimals?: number; // Decimal places (default 2)
  currency_min?: number; // Minimum amount
  currency_max?: number; // Maximum amount

  // === Phone Mode ===
  phone_format?: string; // Format template (e.g., "+1-XXX-XXX-XXXX")
  phone_country?: "us" | "uk" | "cn" | "jp" | "de" | "fr" | "international"; // Country format

  // === Email Mode ===
  email_domain?: string; // Domain (e.g., example.com)
  email_user_style?: "random" | "simple" | "professional"; // Username style

  // === Username Mode ===
  username_style?: "random" | "word" | "number" | "mixed"; // Username style
  username_separator?: string; // Separator (e.g., "_", "-", ".")
}

export interface UIConfig {
  show_inputs: boolean; // 是否允许用户修改 Min/Max/Length
  result_type: "text" | "card" | "bubble" | "icon" | "wheel";
  button_text: string; // "Generate", "Roll", "Flip"
  icon?: string; // Lucide icon name
  description_template?: string; // 动态描述模板
}

export type ToolCategory =
  | "random-numbers"
  | "passwords-pins"
  | "lottery"
  | "dice"
  | "coins"
  | "list-tools"
  | "developer-tools"
  | "data-generation";

export interface ToolConfig {
  slug: string;
  title: string;
  seo_title: string;
  description: string;
  mode: GeneratorMode;
  params: GeneratorParams;
  ui: UIConfig;
  // Extended SEO fields
  keywords?: string[];
  priority?: number;
  category?: ToolCategory;
  faq?: Array<{ question: string; answer: string }>;
  how_to?: string[];
  features?: string[];
}

export interface GenerationResult {
  values: (string | number)[];
  bonus_values?: (string | number)[];
  formatted: string;
  timestamp: number;
  warnings?: string[];
  meta?: Record<string, unknown>;
}
