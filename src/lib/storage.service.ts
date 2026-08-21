export const StorageService = {
  getKey: (collection: string) => `thp_${collection}`,
  getAll: <T,>(collection: string): T[] => {
    try {
      const raw = window.localStorage.getItem(StorageService.getKey(collection));
      const value: unknown = raw ? JSON.parse(raw) : null;
      return Array.isArray(value) ? value as T[] : [];
    } catch { return []; }
  },
  create: <T extends object>(collection: string, data: T): T & { id: string; createdAt: number; updatedAt: number } | null => {
    try {
      const now = Date.now();
      const item = { ...data, id: (data as { id?: string }).id || crypto.randomUUID(), createdAt: now, updatedAt: now };
      window.localStorage.setItem(StorageService.getKey(collection), JSON.stringify([item, ...StorageService.getAll(collection)]));
      return item;
    } catch { return null; }
  },
  update: <T extends object>(collection: string, id: string, data: Partial<T>): boolean => {
    try { window.localStorage.setItem(StorageService.getKey(collection), JSON.stringify(StorageService.getAll<T & { id: string }>(collection).map(item => item.id === id ? { ...item, ...data, updatedAt: Date.now() } : item))); return true; } catch { return false; }
  },
  delete: <T extends { id: string }>(collection: string, id: string): boolean => {
    try { window.localStorage.setItem(StorageService.getKey(collection), JSON.stringify(StorageService.getAll<T>(collection).filter(item => item.id !== id))); return true; } catch { return false; }
  },
  hardSet: <T,>(collection: string, data: T[]): boolean => {
    try { window.localStorage.setItem(StorageService.getKey(collection), JSON.stringify(data)); return true; } catch { return false; }
  },
};
