import { useCallback, useEffect, useState } from 'react';
import { StorageService } from '../lib/storage.service';
import { BaseRecord, StorageController } from '../types';

export function useStorageController<T extends BaseRecord>(
  collectionName: string,
  initialData: T[],
): StorageController<T> {
  const [data, setData] = useState<T[]>(() => {
    const existing = StorageService.getAll<T>(collectionName);
    if (existing.length > 0) {
      const migrated = existing.map((item) => ({
        ...item,
        createdAt: item.createdAt || Date.now(),
        updatedAt: item.updatedAt || Date.now(),
      })) as T[];
      if (JSON.stringify(existing) !== JSON.stringify(migrated)) {
        StorageService.hardSet(collectionName, migrated);
      }
      return migrated;
    }
    StorageService.hardSet(collectionName, initialData);
    return initialData;
  });

  const refresh = useCallback(() => {
    setData(StorageService.getAll<T>(collectionName));
  }, [collectionName]);

  // Realtime multi-tab synchronization
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === StorageService.getKey(collectionName)) {
        refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [collectionName, refresh]);

  return {
    data,
    addItem: (item: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<BaseRecord>) => {
      StorageService.create(collectionName, item);
      refresh();
    },
    updateItem: (id: string, item: Partial<T>) => {
      StorageService.update<T>(collectionName, id, item);
      refresh();
    },
    deleteItem: (id: string) => {
      StorageService.delete<T>(collectionName, id);
      refresh();
    },
    hardSetData: (items: T[]) => {
      StorageService.hardSet(collectionName, items);
      refresh();
    },
    refresh,
  };
}
