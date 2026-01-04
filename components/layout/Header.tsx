"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
  List,
  Dice1,
  Code,
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
  onClose: () => void;
}

function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const tools = useMemo(
    () =>
      Object.values(CONFIG_MAP).filter((t) => !t.slug.startsWith("template-")),
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return tools
      .filter(
        (tool) =>
          tool.title.toLowerCase().includes(q) ||
          tool.description?.toLowerCase().includes(q) ||
          tool.slug.toLowerCase().includes(q) ||
          tool.keywords?.some((k) => k.toLowerCase().includes(q)),
      )
      .map((tool) => ({
        slug: tool.slug,
        title: tool.title,
        description: tool.description || "",
        category: tool.category,
      }))
      .slice(0, 8);
  }, [query, tools]);

  // Keyboard navigation
  useEffect(() => {
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
  }, [results, selectedIndex, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div
        ref={resultsRef}
        className="w-full max-w-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <Search className="w-5 h-5 text-violet-500 dark:text-violet-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            placeholder="Search tools... (e.g., 'password', 'dice', '1-100')"
            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-base"
            aria-label="Search input"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
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
                    "flex items-start gap-3 p-4 transition-all duration-150 border-l-2",
                    index === selectedIndex
                      ? "bg-violet-50 dark:bg-violet-950/20 border-violet-500"
                      : "bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
                  )}
                  onClick={onClose}
                >
                  <IconComponent className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {result.title}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                      {result.description}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400 font-mono">
                    /{result.slug}
                  </div>
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
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 px-2">
              Quick Links
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NAV_CATEGORIES.slice(0, 6).map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    href={`/#${cat.id}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/60 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:text-violet-700 dark:hover:text-violet-300 transition-all duration-150 border border-transparent hover:border-violet-200 dark:hover:border-violet-900/50"
                    onClick={onClose}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{cat.title}</span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 text-xs text-center text-zinc-400">
              Press{" "}
              <kbd className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono border border-zinc-200 dark:border-zinc-700">
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
  >(() => getFavorites().map((f) => ({ href: f.href, title: f.title })));

  useEffect(() => {
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
          "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
          pathname && category.tools.some((t) => pathname === `/${t}`)
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon size={16} />
        <span>{category.title}</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full mt-2 w-56 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-xl shadow-xl shadow-zinc-900/10 dark:shadow-black/30 border border-zinc-200/70 dark:border-zinc-800/70 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200"
          onMouseLeave={() => setIsOpen(false)}
        >
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150",
                pathname === `/${tool.slug}`
                  ? "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 font-semibold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100",
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
  const [theme, setTheme] = useState<"light" | "dark">(() => getInitialTheme());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [favorites, setFavorites] = useState<
    Array<{ href: string; title: string }>
  >(() => getFavorites().map((f) => ({ href: f.href, title: f.title })));
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const favoritesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // Handle scroll for sticky header behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

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
          "sticky top-0 z-40 w-full transition-all duration-200",
          "bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75 dark:supports-[backdrop-filter]:bg-zinc-950/75",
          "border-b border-zinc-200/60 dark:border-zinc-800/60",
          !isVisible && "-translate-y-full",
          "shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.3)]",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-xl outline-none pr-2"
              aria-label="NumberGenerator.ai Home"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 dark:from-violet-400 dark:to-indigo-500 text-white shadow-lg shadow-violet-500/25 dark:shadow-violet-400/20 ring-1 ring-violet-500/20 dark:ring-violet-400/20 group-hover:scale-105 group-hover:shadow-violet-500/40 dark:group-hover:shadow-violet-400/30 transition-all duration-200">
                <Hash size={20} strokeWidth={3} className="relative z-10" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200 hidden sm:inline">
                  NumberGenerator.ai
                </span>
                <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50 sm:hidden">
                  NG.ai
                </span>
              </div>
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
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm bg-zinc-100/60 dark:bg-zinc-900/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-200 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 group w-64 shadow-sm hover:shadow-md"
                aria-label="Search tools"
              >
                <Search
                  size={16}
                  className="group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200"
                />
                <span className="flex-1 text-left font-medium">
                  Search tools...
                </span>
                <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 font-mono shadow-sm">
                  {isMac ? "⌘" : "Ctrl"} K
                </kbd>
              </button>

              {/* Mobile Search Icon */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-2.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* Favorites dropdown */}
              {favorites.length > 0 && (
                <div ref={favoritesRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setIsFavoritesOpen((prev) => !prev)}
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 border shadow-sm",
                      isFavoritesOpen
                        ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50"
                        : "bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 border-zinc-200/50 dark:border-zinc-800/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-200/50 dark:hover:border-amber-900/30",
                    )}
                    aria-label="Favorites"
                    aria-expanded={isFavoritesOpen}
                  >
                    <Star
                      size={18}
                      className={
                        isCurrentFavorite ? "fill-amber-500 text-amber-500" : ""
                      }
                    />
                  </button>

                  {isFavoritesOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-zinc-900/10 dark:shadow-black/40 border border-zinc-200/70 dark:border-zinc-800/70 py-2 z-50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/60 dark:bg-zinc-900/60 mb-1">
                        Favorites
                      </div>
                      {favorites.slice(0, 6).map((fav) => (
                        <Link
                          key={fav.href}
                          href={fav.href}
                          className="block px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
                          onClick={() => setIsFavoritesOpen(false)}
                        >
                          {fav.title}
                        </Link>
                      ))}
                      {favorites.length > 6 && (
                        <div className="px-4 py-2 text-xs text-center text-zinc-400 border-t border-zinc-100 dark:border-zinc-800">
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
                    "hidden sm:flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200 border shadow-sm",
                    isCurrentFavorite
                      ? "text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 shadow-rose-500/10"
                      : "bg-white dark:bg-zinc-900 text-zinc-400 border-zinc-200/50 dark:border-zinc-800/50 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50/50 dark:hover:bg-rose-950/20",
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

              <div className="h-6 w-px bg-zinc-200/60 dark:bg-zinc-800/60 hidden sm:block mx-1" />

              {/* Theme toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-center h-10 w-10 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-200"
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 ml-1"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}

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
