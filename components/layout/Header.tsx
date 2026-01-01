"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  Search,
  X,
  Menu,
  Sun,
  Moon,
  Star,
  ChevronDown,
  Hash,
  Lock,
  Ticket,
  Box,
  Circle,
  List,
  Dice1,
  Code,
  Globe,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CONFIG_MAP } from "@/lib/configMap";
import {
  getFavorites,
  isFavorite,
  toggleFavorite,
  subscribeUserData,
} from "@/lib/userData";

// Navigation categories configuration
const NAV_CATEGORIES = [
  {
    id: "numbers",
    title: "Numbers",
    icon: Dice1,
    description: "Random number generators",
    tools: [
      "1-10",
      "1-100",
      "1-1000",
      "1-10000",
      "0-99",
      "1-20",
      "range-advanced",
    ],
  },
  {
    id: "passwords",
    title: "Passwords & PINs",
    icon: Lock,
    description: "Secure passwords and codes",
    tools: [
      "password-strong",
      "password-12",
      "password-20",
      "password-pro",
      "pin-4",
      "pin-6",
      "pin-8",
      "pin-10",
    ],
  },
  {
    id: "lottery",
    title: "Lottery",
    icon: Ticket,
    description: "Lottery number pickers",
    tools: ["lottery-powerball", "lottery-megamillions"],
  },
  {
    id: "dice-coins",
    title: "Dice & Coins",
    icon: Box,
    description: "Virtual dice and coin flips",
    tools: ["dice-d6", "dice-roller", "coin-flip", "coin-flip-pro"],
  },
  {
    id: "list-tools",
    title: "List Tools",
    icon: List,
    description: "Pick from lists and shuffle",
    tools: ["list-picker", "shuffle-list", "spin-wheel", "ticket-draw"],
  },
  {
    id: "developer",
    title: "Developer",
    icon: Code,
    description: "Developer tools",
    tools: [
      "uuid",
      "random-hex",
      "random-ipv4",
      "random-mac",
      "random-bytes",
      "random-timestamp",
      "random-coordinates",
      "random-color",
    ],
  },
];

const THEME_KEY = "ng:theme";

// Get initial theme from localStorage or system preference
const getInitialTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Apply theme to document
const applyTheme = (theme: "light" | "dark") => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

// Search modal component
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{
      slug: string;
      title: string;
      description: string;
      category?: string;
    }>
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const tools = Object.values(CONFIG_MAP).filter(
      (t) => !t.slug.startsWith("template-"),
    );

    const searchLower = query.toLowerCase();
    const filtered = tools
      .filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchLower) ||
          tool.description?.toLowerCase().includes(searchLower) ||
          tool.slug.toLowerCase().includes(searchLower) ||
          tool.keywords?.some((k) => k.toLowerCase().includes(searchLower)),
      )
      .map((tool) => ({
        slug: tool.slug,
        title: tool.title,
        description: tool.description || "",
        category: tool.category,
      }))
      .slice(0, 8);

    setResults(filtered);
    setSelectedIndex(-1);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : i));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : -1));
      }
      if (e.key === "Enter" && selectedIndex >= 0) {
        const selected = results[selectedIndex];
        if (selected) {
          window.location.href = `/${selected.slug}`;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div
        ref={resultsRef}
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools... (e.g., 'password', 'dice', '1-100')"
            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            aria-label="Search input"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto">
            {results.map((result, index) => {
              const IconComponent = result.category
                ? NAV_CATEGORIES.find((c) => c.id === result.category)?.icon ||
                  Search
                : Search;
              return (
                <Link
                  key={result.slug}
                  href={`/${result.slug}`}
                  className={cn(
                    "flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors",
                    index === selectedIndex && "bg-zinc-50 dark:bg-zinc-800",
                  )}
                  onClick={onClose}
                >
                  <IconComponent className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {result.title}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {result.description}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400">/{result.slug}</div>
                </Link>
              );
            })}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
            No tools found for &quot;{query}&quot;
          </div>
        )}

        {!query && (
          <div className="p-4">
            <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3 px-2">
              Quick Links
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NAV_CATEGORIES.slice(0, 6).map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    href={`/#${cat.id}`}
                    className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    onClick={onClose}
                  >
                    <Icon className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {cat.title}
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-center text-zinc-400">
              Press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">
                Esc
              </kbd>{" "}
              to close
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile nav component
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const [favorites, setFavorites] = useState<
    Array<{ href: string; title: string }>
  >([]);

  useEffect(() => {
    setFavorites(getFavorites().map((f) => ({ href: f.href, title: f.title })));
    const unsub = subscribeUserData(() => {
      setFavorites(
        getFavorites().map((f) => ({ href: f.href, title: f.title })),
      );
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-zinc-900 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Menu
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-6">
          {/* Favorites */}
          {favorites.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
                <Star size={16} />
                Favorites
              </h3>
              <ul className="space-y-1">
                {favorites.map((fav) => (
                  <li key={fav.href}>
                    <Link
                      href={fav.href}
                      onClick={onClose}
                      className={cn(
                        "block px-3 py-2 rounded-lg font-medium transition-colors",
                        pathname === fav.href
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      )}
                    >
                      {fav.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Categories */}
          {NAV_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const tools = category.tools
              .map((slug) => CONFIG_MAP[slug])
              .filter(Boolean);

            if (tools.length === 0) return null;

            return (
              <section key={category.id}>
                <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                  <Icon size={16} className={cn("text-zinc-500")} />
                  {category.title}
                </h3>
                <ul className="space-y-1 ml-6">
                  {tools.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${tool.slug}`}
                        onClick={onClose}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          pathname === `/${tool.slug}`
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                        )}
                      >
                        {tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// Desktop dropdown menu
interface NavDropdownProps {
  category: (typeof NAV_CATEGORIES)[0];
  pathname: string;
}

function NavDropdown({ category, pathname }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const Icon = category.icon;
  const tools = category.tools.map((slug) => CONFIG_MAP[slug]).filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (tools.length === 0) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          pathname && category.tools.some((t) => pathname === `/${t}`)
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon size={16} />
        <span>{category.title}</span>
        <ChevronDown
          size={14}
          className={cn("transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-2 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                pathname === `/${tool.slug}`
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800",
              )}
              onClick={() => setIsOpen(false)}
            >
              <span className="flex-1 truncate">{tool.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Header component
interface HeaderProps {
  currentTitle?: string;
}

export function Header({ currentTitle }: HeaderProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [favorites, setFavorites] = useState<
    Array<{ href: string; title: string }>
  >([]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const favoritesRef = useRef<HTMLDivElement>(null);

  // Initialize theme
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
      applyTheme(next);
      return next;
    });
  }, []);

  // Handle scroll for sticky header behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    const throttledHandleScroll = () => requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [lastScrollY]);

  // Load favorites
  useEffect(() => {
    setFavorites(getFavorites().map((f) => ({ href: f.href, title: f.title })));
    const unsub = subscribeUserData(() => {
      setFavorites(
        getFavorites().map((f) => ({ href: f.href, title: f.title })),
      );
    });
    return unsub;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close favorites dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        favoritesRef.current &&
        !favoritesRef.current.contains(e.target as Node)
      ) {
        setIsFavoritesOpen(false);
      }
    };

    if (isFavoritesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFavoritesOpen]);

  // Check if current page is favorited
  const currentPath = pathname;
  const isCurrentFavorite = currentPath ? isFavorite(currentPath) : false;

  // Toggle favorite for current page
  const handleToggleFavorite = useCallback(() => {
    if (currentTitle && currentPath) {
      toggleFavorite({
        key: currentPath,
        href: currentPath,
        title: currentTitle,
      });
      setIsFavoritesOpen(false);
    }
  }, [currentTitle, currentPath]);

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-transform duration-300",
          "bg-white/80 dark:bg-black/80 backdrop-blur-md",
          "border-b border-zinc-200 dark:border-zinc-800",
          isScrolled && "shadow-sm",
          !isVisible && "-translate-y-full",
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-black text-xl tracking-tight text-zinc-900 dark:text-zinc-100 hover:opacity-80 transition-opacity"
            >
              <Hash size={24} className="text-zinc-400" />
              <span className="hidden sm:inline">NumberGenerator.ai</span>
              <span className="sm:hidden">NG.ai</span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_CATEGORIES.map((category) => (
                <NavDropdown
                  key={category.id}
                  category={category}
                  pathname={pathname || ""}
                />
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Search tools"
              >
                <Search size={18} />
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                  {isMac ? "Cmd" : "Ctrl"} K
                </kbd>
              </button>

              {/* Favorites dropdown */}
              {favorites.length > 0 && (
                <div ref={favoritesRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setIsFavoritesOpen((prev) => !prev)}
                    className={cn(
                      "flex items-center gap-1 p-2 rounded-lg transition-colors",
                      isFavoritesOpen
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    )}
                    aria-label="Favorites"
                    aria-expanded={isFavoritesOpen}
                  >
                    <Star
                      size={18}
                      className={
                        isCurrentFavorite
                          ? "fill-yellow-500 text-yellow-500"
                          : ""
                      }
                    />
                  </button>

                  {isFavoritesOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-2 z-50">
                      {favorites.slice(0, 6).map((fav) => (
                        <Link
                          key={fav.href}
                          href={fav.href}
                          className="block px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                          onClick={() => setIsFavoritesOpen(false)}
                        >
                          {fav.title}
                        </Link>
                      ))}
                      {favorites.length > 6 && (
                        <div className="px-4 py-2 text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
                          +{favorites.length - 6} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Add to favorite button (when on a tool page) */}
              {currentTitle && currentPath && currentPath !== "/" && (
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={cn(
                    "hidden sm:flex items-center gap-1 p-2 rounded-lg transition-colors",
                    isCurrentFavorite
                      ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
                      : "text-zinc-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30",
                  )}
                  aria-label={
                    isCurrentFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Heart
                    size={18}
                    className={isCurrentFavorite ? "fill-current" : ""}
                  />
                </button>
              )}

              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden flex items-center justify-center p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>

              {/* Mobile search button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden flex items-center justify-center p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Mobile navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}

// Mobile bottom navigation bar (PWA pattern)
export function MobileBottomNav() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [favorites, setFavorites] = useState<
    Array<{ href: string; title: string }>
  >([]);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    setFavorites(getFavorites().map((f) => ({ href: f.href, title: f.title })));
    const unsub = subscribeUserData(() => {
      setFavorites(
        getFavorites().map((f) => ({ href: f.href, title: f.title })),
      );
    });
    return unsub;
  }, []);

  const navItems: Array<{ href: string; icon: any; label: string }> = [
    { href: "/", icon: Hash, label: "Home" },
    { href: "/1-100", icon: Dice1, label: "Numbers" },
    { href: "/password-strong", icon: Lock, label: "Password" },
    { href: "/dice-roller", icon: Box, label: "Dice" },
  ];

  if (favorites.length > 0) {
    navItems.push({ href: favorites[0].href, icon: Star, label: "Favorites" });
  } else {
    navItems.push({ href: "/coin-flip", icon: Circle, label: "Coin" });
  }

  // Import icons after component definition to avoid issues
  const HomeIcon = navItems[0].href === "/" ? Hash : navItems[0].icon;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-40 safe-area-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center flex-1 gap-1 transition-colors",
            pathname === "/"
              ? "text-black dark:text-white"
              : "text-zinc-400 dark:text-zinc-600",
          )}
        >
          <Hash size={20} />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link
          href="/1-100"
          className={cn(
            "flex flex-col items-center justify-center flex-1 gap-1 transition-colors",
            pathname?.startsWith("/1-") && !pathname?.includes("-")
              ? "text-black dark:text-white"
              : "text-zinc-400 dark:text-zinc-600",
          )}
        >
          <Dice1 size={20} />
          <span className="text-xs font-medium">Numbers</span>
        </Link>
        <Link
          href="/password-strong"
          className={cn(
            "flex flex-col items-center justify-center flex-1 gap-1 transition-colors",
            pathname === "/password-strong"
              ? "text-black dark:text-white"
              : "text-zinc-400 dark:text-zinc-600",
          )}
        >
          <Lock size={20} />
          <span className="text-xs font-medium">Password</span>
        </Link>
        <Link
          href="/dice-roller"
          className={cn(
            "flex flex-col items-center justify-center flex-1 gap-1 transition-colors",
            pathname?.includes("dice")
              ? "text-black dark:text-white"
              : "text-zinc-400 dark:text-zinc-600",
          )}
        >
          <Box size={20} />
          <span className="text-xs font-medium">Dice</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            const event = new CustomEvent("mobile-menu-open");
            window.dispatchEvent(event);
          }}
          className="flex flex-col items-center justify-center flex-1 gap-1 text-zinc-400 dark:text-zinc-600"
          aria-label="Open navigation menu"
        >
          <Menu size={20} aria-hidden="true" />
          <span className="text-xs font-medium" aria-hidden="true">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
}
