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

export const FirebaseService = {
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
    await setDoc(docRef, {
      ...backupData,
      updatedAtClient: Date.now(),
      updatedAtServer: serverTimestamp(),
      userEmail: user.email,
      userName: user.displayName,
    });

    const nowIso = new Date().toISOString();
    FirebaseService.setLastSyncedAt(nowIso);
  },

  downloadFromCloud: async (user: User): Promise<boolean> => {
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

    // 1. Create safety snapshot before overwriting
    StorageService.createSafetySnapshot(
      `Snapshot tự động trước khi nạp dữ liệu Firebase Cloud lúc ${new Date().toLocaleString('vi-VN')}`,
    );

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
