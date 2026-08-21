import { useCallback, useState } from 'react';
import { StorageService } from '../lib/storage.service';

export function useStorageController<T extends { id: string; createdAt?: number; updatedAt?: number }>(collectionName: string, initialData: T[]) {
  const [data, setData] = useState<T[]>(() => {
    const existing = StorageService.getAll<T>(collectionName);
    if (existing.length > 0) {
      const migrated = existing.map(item => ({ ...item, createdAt: item.createdAt || Date.now(), updatedAt: item.updatedAt || Date.now() })) as T[];
      if (JSON.stringify(existing) !== JSON.stringify(migrated)) StorageService.hardSet(collectionName, migrated);
      return migrated;
    }
    StorageService.hardSet(collectionName, initialData);
    return initialData;
  });
  const refresh = useCallback(() => setData(StorageService.getAll<T>(collectionName)), [collectionName]);
  return {
    data,
    addItem: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => { StorageService.create(collectionName, item); refresh(); },
    updateItem: (id: string, item: Partial<T>) => { StorageService.update<T>(collectionName, id, item); refresh(); },
    deleteItem: (id: string) => { StorageService.delete<T>(collectionName, id); refresh(); },
    hardSetData: (items: T[]) => { StorageService.hardSet(collectionName, items); refresh(); },
  };
}
