import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  User,
} from './firebase';
import { BackupData, BackupPayload } from '../types';
import { StorageService } from './storage.service';
import { validateBackupData } from './backup.validator';

const CLOUD_SYNC_TIME_KEY = 'thp_firebase_last_synced';

// Unique session ID per browser tab session
const SESSION_ID: string = (() => {
  try {
    const existing = window.sessionStorage.getItem('thp_session_id');
    if (existing) return existing;
    const newId = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    window.sessionStorage.setItem('thp_session_id', newId);
    return newId;
  } catch {
    return 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
  }
})();

export const FirebaseService = {
  // Session Identification
  getSessionId: (): string => {
    return SESSION_ID;
  },

  // Authentication
  loginWithGoogle: async (): Promise<User> => {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  },

  loginWithEmail: async (email: string, pass: string): Promise<User> => {
    const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return res.user;
  },

  registerWithEmail: async (
    email: string,
    pass: string,
    displayName?: string,
  ): Promise<User> => {
    const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName && displayName.trim()) {
      await updateProfile(res.user, { displayName: displayName.trim() });
    }
    return res.user;
  },

  sendPasswordReset: async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email.trim());
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
    window.localStorage.removeItem(CLOUD_SYNC_TIME_KEY);
  },

  // Sync Timestamp Helpers
  getLastSyncedAt: (): string | null => {
    return window.localStorage.getItem(CLOUD_SYNC_TIME_KEY);
  },

  setLastSyncedAt: (iso: string): void => {
    window.localStorage.setItem(CLOUD_SYNC_TIME_KEY, iso);
  },

  // Firestore Sync Operations
  uploadToCloud: async (user: User): Promise<void> => {
    if (!user) throw new Error('Người dùng chưa đăng nhập.');

    const localPayload = StorageService.getCurrentBackupPayload();
    const backupData: BackupData = {
      app: 'TeacherHubPro',
      schemaVersion: 1,
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      data: localPayload,
    };

    const docRef = doc(db, 'users', user.uid, 'data', 'main');
    const nowTime = Date.now();
    await setDoc(docRef, {
      ...backupData,
      updatedAtClient: nowTime,
      updatedAtServer: serverTimestamp(),
      userEmail: user.email,
      userName: user.displayName,
      lastUpdatedBySession: SESSION_ID,
    });

    const nowIso = new Date(nowTime).toISOString();
    FirebaseService.setLastSyncedAt(nowIso);
  },

  downloadFromCloud: async (
    user: User,
    options: { createSnapshot?: boolean; snapshotReason?: string } = {},
  ): Promise<boolean> => {
    if (!user) throw new Error('Người dùng chưa đăng nhập.');

    const docRef = doc(db, 'users', user.uid, 'data', 'main');
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      throw new Error('Chưa có bản lưu nào trên Cloud Firestore của tài khoản này.');
    }

    const cloudData = snap.data();
    const validation = validateBackupData(cloudData);

    if (!validation.isValid || !validation.data) {
      throw new Error(
        `Dữ liệu trên Cloud Firestore không hợp lệ:\n• ${validation.errors.join('\n• ')}`,
      );
    }

    // 1. Create safety snapshot before overwriting (if requested or by default)
    if (options.createSnapshot !== false) {
      const reason =
        options.snapshotReason ||
        `Snapshot tự động trước khi nạp dữ liệu Firebase Cloud lúc ${new Date().toLocaleString('vi-VN')}`;
      StorageService.createSafetySnapshot(reason);
    }

    // 2. Overwrite atomically
    const success = StorageService.atomicSetAll(validation.data.data);
    if (!success) {
      throw new Error('Ghi dữ liệu vào LocalStorage thất bại (dung lượng trình duyệt có thể bị đầy).');
    }

    const nowIso = new Date().toISOString();
    FirebaseService.setLastSyncedAt(nowIso);
    return true;
  },

  smartSync: async (
    user: User,
  ): Promise<{ action: 'UPLOADED' | 'DOWNLOADED' | 'EQUAL'; message: string }> => {
    if (!user) throw new Error('Người dùng chưa đăng nhập.');

    const docRef = doc(db, 'users', user.uid, 'data', 'main');
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      // First time user: upload local database to cloud
      await FirebaseService.uploadToCloud(user);
      return {
        action: 'UPLOADED',
        message: 'Đã khởi tạo và tải toàn bộ dữ liệu máy bạn lên Cloud Firestore!',
      };
    }

    const cloudData = snap.data();
    const cloudModified = cloudData.updatedAtClient || 0;
    const lastSyncIso = FirebaseService.getLastSyncedAt();
    const localSyncTime = lastSyncIso ? new Date(lastSyncIso).getTime() : 0;

    // Check if cloud data is noticeably newer (more than 3 seconds diff)
    if (cloudModified > localSyncTime + 3000) {
      await FirebaseService.downloadFromCloud(user);
      return {
        action: 'DOWNLOADED',
        message: 'Đã tải dữ liệu mới nhất từ Cloud Firestore về máy của bạn!',
      };
    } else {
      // Local is equal or newer -> upload to Cloud
      await FirebaseService.uploadToCloud(user);
      return {
        action: 'UPLOADED',
        message: 'Đã sao lưu toàn bộ dữ liệu mới nhất lên Cloud Firestore!',
      };
    }
  },
};
