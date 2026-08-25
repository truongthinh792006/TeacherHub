import {
  BackupPayload,
  DocumentLink,
  JournalEntry,
  Prompt,
  SafetySnapshot,
  SafetySnapshotInfo,
  Student,
  Task,
} from '../types';

const SNAPSHOT_KEY = 'thp_safety_snapshot';

export const StorageService = {
  getKey: (collection: string) => `thp_${collection}`,

  getAll: <T>(collection: string): T[] => {
    try {
      const raw = window.localStorage.getItem(StorageService.getKey(collection));
      const value: unknown = raw ? JSON.parse(raw) : null;
      return Array.isArray(value) ? (value as T[]) : [];
    } catch (error) {
      console.error(`[StorageService] Error reading collection "${collection}":`, error);
      return [];
    }
  },

  create: <T extends object>(
    collection: string,
    data: T,
  ): (T & { id: string; createdAt: number; updatedAt: number }) | null => {
    try {
      const now = Date.now();
      const existing = StorageService.getAll<T>(collection);
      const item = {
        ...data,
        id: (data as { id?: string }).id || crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      window.localStorage.setItem(
        StorageService.getKey(collection),
        JSON.stringify([item, ...existing]),
      );
      return item;
    } catch (error) {
      console.error(`[StorageService] Error creating item in "${collection}":`, error);
      return null;
    }
  },

  update: <T extends object>(collection: string, id: string, data: Partial<T>): boolean => {
    try {
      const existing = StorageService.getAll<T & { id: string }>(collection);
      const updated = existing.map((item) =>
        item.id === id ? { ...item, ...data, updatedAt: Date.now() } : item,
      );
      window.localStorage.setItem(
        StorageService.getKey(collection),
        JSON.stringify(updated),
      );
      return true;
    } catch (error) {
      console.error(`[StorageService] Error updating item in "${collection}":`, error);
      return false;
    }
  },

  delete: <T extends { id: string }>(collection: string, id: string): boolean => {
    try {
      const existing = StorageService.getAll<T>(collection);
      const filtered = existing.filter((item) => item.id !== id);
      window.localStorage.setItem(
        StorageService.getKey(collection),
        JSON.stringify(filtered),
      );
      return true;
    } catch (error) {
      console.error(`[StorageService] Error deleting item in "${collection}":`, error);
      return false;
    }
  },

  hardSet: <T>(collection: string, data: T[]): boolean => {
    try {
      window.localStorage.setItem(
        StorageService.getKey(collection),
        JSON.stringify(data),
      );
      return true;
    } catch (error) {
      console.error(`[StorageService] Error hardSet in "${collection}":`, error);
      return false;
    }
  },

  getCurrentBackupPayload: (): BackupPayload => {
    const tasks = StorageService.getAll<Task>('tasks');
    const prompts = StorageService.getAll<Prompt>('prompts');
    const docs = StorageService.getAll<DocumentLink>('docs');
    const journals = StorageService.getAll<JournalEntry>('journals');
    const students = StorageService.getAll<Student>('students');
    const darkModeRaw = window.localStorage.getItem('thp_darkMode');
    const darkMode = darkModeRaw === 'true';

    return { tasks, prompts, docs, journals, students, darkMode };
  },

  createSafetySnapshot: (note?: string): boolean => {
    try {
      const currentData = StorageService.getCurrentBackupPayload();
      const snapshot: SafetySnapshot = {
        timestamp: Date.now(),
        createdAt: new Date().toISOString(),
        note: note || 'Bản sao lưu an toàn tự động',
        data: currentData,
      };
      window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
      return true;
    } catch (error) {
      console.error('[StorageService] Error creating safety snapshot:', error);
      return false;
    }
  },

  hasSafetySnapshot: (): boolean => {
    try {
      const raw = window.localStorage.getItem(SNAPSHOT_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Boolean(parsed && parsed.timestamp && parsed.data);
    } catch {
      return false;
    }
  },

  getSafetySnapshotInfo: (): SafetySnapshotInfo | null => {
    try {
      const raw = window.localStorage.getItem(SNAPSHOT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SafetySnapshot;
      if (!parsed || !parsed.data) return null;

      return {
        timestamp: parsed.timestamp,
        createdAt: parsed.createdAt,
        note: parsed.note,
        counts: {
          tasks: Array.isArray(parsed.data.tasks) ? parsed.data.tasks.length : 0,
          prompts: Array.isArray(parsed.data.prompts) ? parsed.data.prompts.length : 0,
          docs: Array.isArray(parsed.data.docs) ? parsed.data.docs.length : 0,
          journals: Array.isArray(parsed.data.journals) ? parsed.data.journals.length : 0,
          students: Array.isArray(parsed.data.students) ? parsed.data.students.length : 0,
        },
      };
    } catch (error) {
      console.error('[StorageService] Error getting safety snapshot info:', error);
      return null;
    }
  },

  restoreSafetySnapshot: (): BackupPayload | null => {
    try {
      const raw = window.localStorage.getItem(SNAPSHOT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SafetySnapshot;
      if (!parsed || !parsed.data) return null;

      const success = StorageService.atomicSetAll(parsed.data);
      return success ? parsed.data : null;
    } catch (error) {
      console.error('[StorageService] Error restoring safety snapshot:', error);
      return null;
    }
  },

  atomicSetAll: (payload: BackupPayload): boolean => {
    // Take a pre-transaction in-memory snapshot in case any step throws
    const previousState = StorageService.getCurrentBackupPayload();

    try {
      if (payload.tasks !== undefined) {
        window.localStorage.setItem(StorageService.getKey('tasks'), JSON.stringify(payload.tasks));
      }
      if (payload.prompts !== undefined) {
        window.localStorage.setItem(StorageService.getKey('prompts'), JSON.stringify(payload.prompts));
      }
      if (payload.docs !== undefined) {
        window.localStorage.setItem(StorageService.getKey('docs'), JSON.stringify(payload.docs));
      }
      if (payload.journals !== undefined) {
        window.localStorage.setItem(StorageService.getKey('journals'), JSON.stringify(payload.journals));
      }
      if (payload.students !== undefined) {
        window.localStorage.setItem(StorageService.getKey('students'), JSON.stringify(payload.students));
      }
      if (payload.darkMode !== undefined) {
        window.localStorage.setItem('thp_darkMode', String(payload.darkMode));
      }
      return true;
    } catch (error) {
      console.error('[StorageService] atomicSetAll failed, rolling back to previous state:', error);
      // Attempt rollback to previous state
      try {
        window.localStorage.setItem(StorageService.getKey('tasks'), JSON.stringify(previousState.tasks));
        window.localStorage.setItem(StorageService.getKey('prompts'), JSON.stringify(previousState.prompts));
        window.localStorage.setItem(StorageService.getKey('docs'), JSON.stringify(previousState.docs));
        window.localStorage.setItem(StorageService.getKey('journals'), JSON.stringify(previousState.journals));
        window.localStorage.setItem(StorageService.getKey('students'), JSON.stringify(previousState.students));
        if (previousState.darkMode !== undefined) {
          window.localStorage.setItem('thp_darkMode', String(previousState.darkMode));
        }
      } catch (rollbackError) {
        console.error('[StorageService] Rollback also failed:', rollbackError);
      }
      return false;
    }
  },
};
