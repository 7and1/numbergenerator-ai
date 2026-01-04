export type RecentItem = {
  key: string; // stable identity (pathname)
  href: string; // can include query params
  title: string;
  description?: string;
  usedAt: number;
};

export type FavoriteItem = {
  key: string; // stable identity (pathname)
  href: string;
  title: string;
  description?: string;
  addedAt: number;
};

const FAVORITES_KEY = "ng:favorites:v1";
const RECENTS_KEY = "ng:recents:v1";
const USERDATA_EVENT = "ng:userdata";

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

type UserDataSnapshot = Readonly<{
  favorites: ReadonlyArray<FavoriteItem>;
  recents: ReadonlyArray<RecentItem>;
}>;

const SERVER_SNAPSHOT: UserDataSnapshot = Object.freeze({
  favorites: Object.freeze([]) as ReadonlyArray<FavoriteItem>,
  recents: Object.freeze([]) as ReadonlyArray<RecentItem>,
});

let cachedSnapshot: UserDataSnapshot | null = null;

const safeJsonParse = <T>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const readArray = <T>(key: string): T[] => {
  if (!isBrowser()) return [];
  const parsed = safeJsonParse<unknown>(window.localStorage.getItem(key));
  return Array.isArray(parsed) ? (parsed as T[]) : [];
};

const writeArray = (key: string, value: unknown[]) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(USERDATA_EVENT));
  } catch {
    // ignore quota / privacy mode failures
  }
};

export const normalizePathKey = (href: string): string => {
  try {
    const url = new URL(href, "http://local");
    return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  } catch {
    return href;
  }
};

export const getFavorites = (): FavoriteItem[] => {
  return readArray<FavoriteItem>(FAVORITES_KEY).sort(
    (a, b) => b.addedAt - a.addedAt,
  );
};

export const isFavorite = (keyOrHref: string): boolean => {
  const key = normalizePathKey(keyOrHref);
  return getFavorites().some((f) => f.key === key);
};

export const toggleFavorite = (
  item: Omit<FavoriteItem, "addedAt">,
): FavoriteItem[] => {
  const key = normalizePathKey(item.key || item.href);
  const favorites = readArray<FavoriteItem>(FAVORITES_KEY);
  const exists = favorites.find((f) => f.key === key);

  const next = exists
    ? favorites.filter((f) => f.key !== key)
    : [{ ...item, key, addedAt: Date.now() }, ...favorites];

  writeArray(FAVORITES_KEY, next);
  return next;
};

export const getRecents = (): RecentItem[] => {
  return readArray<RecentItem>(RECENTS_KEY).sort((a, b) => b.usedAt - a.usedAt);
};

export const addRecent = (
  item: Omit<RecentItem, "usedAt">,
  max = 12,
): RecentItem[] => {
  const key = normalizePathKey(item.key || item.href);
  const recents = readArray<RecentItem>(RECENTS_KEY);
  const now = Date.now();

  const merged: RecentItem = { ...item, key, usedAt: now };
  const next = [merged, ...recents.filter((r) => r.key !== key)].slice(0, max);
  writeArray(RECENTS_KEY, next);
  return next;
};

export const clearRecents = () => writeArray(RECENTS_KEY, []);
export const clearFavorites = () => writeArray(FAVORITES_KEY, []);

const computeSnapshot = (): UserDataSnapshot => {
  return { favorites: getFavorites(), recents: getRecents() };
};

export const subscribeUserData = (onStoreChange: () => void) => {
  if (!isBrowser()) return () => {};

  if (!cachedSnapshot) cachedSnapshot = computeSnapshot();

  const refresh = () => {
    cachedSnapshot = computeSnapshot();
    onStoreChange();
  };

  const onStorage = (e: StorageEvent) => {
    if (e.key === FAVORITES_KEY || e.key === RECENTS_KEY) refresh();
  };
  const onLocal = () => refresh();

  window.addEventListener("storage", onStorage);
  window.addEventListener(USERDATA_EVENT, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(USERDATA_EVENT, onLocal);
  };
};

export const getUserDataSnapshot = () => {
  if (!cachedSnapshot) {
    return isBrowser() ? (cachedSnapshot = computeSnapshot()) : SERVER_SNAPSHOT;
  }
  return cachedSnapshot;
};

export const getUserDataServerSnapshot = () => {
  return SERVER_SNAPSHOT;
};
