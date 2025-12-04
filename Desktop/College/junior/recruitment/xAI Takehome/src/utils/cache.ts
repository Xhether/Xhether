// Browser Session Storage Cache
// Persists across page reloads in the same tab, but clears on close.

export function getCachedData<T>(key: string, ttlSeconds: number = 300): T | null {
  const cachedItem = sessionStorage.getItem(key);
  if (!cachedItem) return null;

  try {
    const item = JSON.parse(cachedItem);
    const now = Date.now();
    if (now - item.timestamp > ttlSeconds * 1000) {
      sessionStorage.removeItem(key);
      return null;
    }
    return item.data as T;
  } catch (e) {
    return null;
  }
}

export function setCachedData<T>(key: string, data: T): void {
  const item = {
    data,
    timestamp: Date.now(),
  };
  sessionStorage.setItem(key, JSON.stringify(item));
}

export function clearCache(key?: string): void {
  if (key) {
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.clear();
  }
}

