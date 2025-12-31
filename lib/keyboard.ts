/**
 * Keyboard shortcuts utility
 */

export type KeyboardShortcut = {
  key: string;
  description: string;
  action: () => void;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};

type ShortcutMap = Map<string, KeyboardShortcut>;

let shortcuts: ShortcutMap = new Map();
let isEnabled = true;

/**
 * Generate a key signature for the keyboard event
 */
function getKeySignature(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey) parts.push("ctrl");
  if (e.metaKey) parts.push("meta");
  if (e.shiftKey) parts.push("shift");
  if (e.altKey) parts.push("alt");
  parts.push(e.code.toLowerCase());
  return parts.join("+");
}

/**
 * Check if user is typing in an input element
 */
function isTypingElement(target: EventTarget | null): boolean {
  if (!target) return false;
  const el = target as HTMLElement;
  const tag = el.tagName;
  const isInput =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable;
  return isInput;
}

/**
 * Register a keyboard shortcut
 */
export function registerShortcut(shortcut: KeyboardShortcut): () => void {
  const signature = [
    shortcut.ctrlKey ? "ctrl" : "",
    shortcut.metaKey ? "meta" : "",
    shortcut.shiftKey ? "shift" : "",
    shortcut.altKey ? "alt" : "",
    shortcut.key.toLowerCase(),
  ]
    .filter(Boolean)
    .join("+");

  shortcuts.set(signature, shortcut);

  // Return unregister function
  return () => {
    shortcuts.delete(signature);
  };
}

/**
 * Unregister a keyboard shortcut
 */
export function unregisterShortcut(
  key: string,
  modifiers?: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  },
): void {
  const signature = [
    modifiers?.ctrlKey ? "ctrl" : "",
    modifiers?.metaKey ? "meta" : "",
    modifiers?.shiftKey ? "shift" : "",
    modifiers?.altKey ? "alt" : "",
    key.toLowerCase(),
  ]
    .filter(Boolean)
    .join("+");

  shortcuts.delete(signature);
}

/**
 * Enable keyboard shortcuts
 */
export function enableShortcuts(): void {
  isEnabled = true;
}

/**
 * Disable keyboard shortcuts
 */
export function disableShortcuts(): void {
  isEnabled = false;
}

/**
 * Get all registered shortcuts
 */
export function getShortcuts(): KeyboardShortcut[] {
  return Array.from(shortcuts.values());
}

/**
 * Handle keyboard events
 */
export function handleKeyboardEvent(e: KeyboardEvent): boolean {
  if (!isEnabled) return false;
  if (isTypingElement(e.target)) return false;

  const signature = getKeySignature(e);
  const shortcut = shortcuts.get(signature);

  if (shortcut) {
    e.preventDefault();
    shortcut.action();
    return true;
  }

  return false;
}

/**
 * Format shortcut key for display
 */
export function formatShortcutKey(
  key: string,
  modifiers?: {
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
  },
): string {
  const parts: string[] = [];

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  if (modifiers?.ctrlKey) parts.push(isMac ? "^" : "Ctrl");
  if (modifiers?.metaKey) parts.push(isMac ? "Cmd" : "Win");
  if (modifiers?.shiftKey) parts.push("Shift");
  if (modifiers?.altKey) parts.push(isMac ? "Option" : "Alt");

  // Format the key
  let displayKey = key.replace(/^Key/, "").replace(/^Digit/, "");
  if (displayKey === "Space") displayKey = "Space";
  if (displayKey === "Enter") displayKey = "Enter";
  if (displayKey === "Escape") displayKey = "Esc";
  if (displayKey === "ArrowUp") displayKey = "^";
  if (displayKey === "ArrowDown") displayKey = "v";
  if (displayKey === "ArrowLeft") displayKey = "<";
  if (displayKey === "ArrowRight") displayKey = ">";

  parts.push(displayKey);

  if (isMac) {
    return parts.join(""); // Mac style: Cmd+Space
  }
  return parts.join("+"); // Windows/Linux style: Ctrl+Space
}

/**
 * Initialize global keyboard handler
 */
let keyboardHandlerAttached = false;

export function initKeyboardHandler(): () => void {
  if (keyboardHandlerAttached || typeof window === "undefined") {
    return () => {};
  }

  const handler = (e: KeyboardEvent) => {
    handleKeyboardEvent(e);
  };

  window.addEventListener("keydown", handler);
  keyboardHandlerAttached = true;

  return () => {
    window.removeEventListener("keydown", handler);
    keyboardHandlerAttached = false;
  };
}
