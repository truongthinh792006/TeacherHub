import { useState, useEffect, useCallback, useRef } from 'react';
import {
  auth,
  db,
  doc,
  onAuthStateChanged,
  onSnapshot,
  User,
} from '../lib/firebase';
import {
  FirebaseAuthSyncState,
  FirebaseUserProfile,
} from '../types';
import { FirebaseService } from '../lib/firebase.service';

interface UseFirebaseAuthSyncProps {
  onDataRestored?: () => void;
  showAlert?: (title: string, message: string) => void;
}

export function useFirebaseAuthSync({
  onDataRestored,
  showAlert,
}: UseFirebaseAuthSyncProps = {}): FirebaseAuthSyncState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() =>
    FirebaseService.getLastSyncedAt(),
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  const isInitialSnapshotRef = useRef(true);

  // Map Firebase User to Serialized Profile
  const mapUserProfile = (u: User | null): FirebaseUserProfile | null => {
    if (!u) return null;
    return {
      uid: u.uid,
      email: u.email,
      displayName: u.displayName || u.email?.split('@')[0] || 'Giáo viên',
      photoURL: u.photoURL,
    };
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserProfile(mapUserProfile(user));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Realtime Firestore Listener when logged in
  useEffect(() => {
    if (!currentUser) return;

    isInitialSnapshotRef.current = true;
    const docRef = doc(db, 'users', currentUser.uid, 'data', 'main');

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        // Skip first trigger on attach to avoid duplicate download on load
        if (isInitialSnapshotRef.current) {
          isInitialSnapshotRef.current = false;
          return;
        }

        if (docSnap.exists()) {
          const data = docSnap.data();
          const remoteTime = data.updatedAtClient || 0;
          const localSyncTime = lastSyncedAt ? new Date(lastSyncedAt).getTime() : 0;

          // If remote update happened more recently than local sync, download and notify
          if (remoteTime > localSyncTime + 3000) {
            FirebaseService.downloadFromCloud(currentUser)
              .then(() => {
                const nowIso = new Date().toISOString();
                setLastSyncedAt(nowIso);
                if (onDataRestored) onDataRestored();
                if (showAlert) {
                  showAlert(
                    'Đồng bộ Realtime',
                    'Dữ liệu vừa được tự động cập nhật từ phiên làm việc trên thiết bị khác!',
                  );
                }
              })
              .catch((err) => console.error('[Realtime Sync Error]', err));
          }
        }
      },
      (error) => {
        console.warn('[Firestore onSnapshot error]', error);
      },
    );

    return () => unsubscribe();
  }, [currentUser, lastSyncedAt, onDataRestored, showAlert]);

  const loginWithGoogle = useCallback(async () => {
    try {
      setIsSyncing(true);
      setSyncError(null);
      const user = await FirebaseService.loginWithGoogle();
      setCurrentUser(user);
      setUserProfile(mapUserProfile(user));

      // Auto Smart Sync on login
      const result = await FirebaseService.smartSync(user);
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      if (result.action === 'DOWNLOADED' && onDataRestored) {
        onDataRestored();
      }
      if (showAlert) {
        showAlert('Đăng nhập thành công', `Chào mừng ${user.displayName || user.email}! ${result.message}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập Google thất bại.';
      setSyncError(msg);
      if (showAlert) showAlert('Lỗi đăng nhập Google', msg);
    } finally {
      setIsSyncing(false);
    }
  }, [onDataRestored, showAlert]);

  const loginWithEmail = useCallback(
    async (email: string, pass: string) => {
      try {
        setIsSyncing(true);
        setSyncError(null);
        const user = await FirebaseService.loginWithEmail(email, pass);
        setCurrentUser(user);
        setUserProfile(mapUserProfile(user));

        const result = await FirebaseService.smartSync(user);
        const nowIso = new Date().toISOString();
        setLastSyncedAt(nowIso);
        if (result.action === 'DOWNLOADED' && onDataRestored) {
          onDataRestored();
        }
        if (showAlert) {
          showAlert('Đăng nhập thành công', `Xin chào ${user.displayName || user.email}! ${result.message}`);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Đăng nhập thất bại.';
        setSyncError(msg);
        if (showAlert) showAlert('Lỗi đăng nhập', msg);
      } finally {
        setIsSyncing(false);
      }
    },
    [onDataRestored, showAlert],
  );

  const registerWithEmail = useCallback(
    async (email: string, pass: string, name?: string) => {
      try {
        setIsSyncing(true);
        setSyncError(null);
        const user = await FirebaseService.registerWithEmail(email, pass, name);
        setCurrentUser(user);
        setUserProfile(mapUserProfile(user));

        // Initial upload of existing local data to new account
        await FirebaseService.uploadToCloud(user);
        const nowIso = new Date().toISOString();
        setLastSyncedAt(nowIso);

        if (showAlert) {
          showAlert(
            'Tạo tài khoản thành công',
            `Chào mừng ${name || user.email}! Toàn bộ dữ liệu của bạn đã được sao lưu an toàn lên Cloud Firestore.`,
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Đăng ký thất bại.';
        setSyncError(msg);
        if (showAlert) showAlert('Lỗi đăng ký', msg);
      } finally {
        setIsSyncing(false);
      }
    },
    [showAlert],
  );

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        await FirebaseService.sendPasswordReset(email);
        if (showAlert) {
          showAlert(
            'Đã gửi email khôi phục',
            `Vui lòng kiểm tra hòm thư ${email} để đặt lại mật khẩu của bạn.`,
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Không thể gửi email khôi phục.';
        if (showAlert) showAlert('Lỗi khôi phục mật khẩu', msg);
      }
    },
    [showAlert],
  );

  const logout = useCallback(async () => {
    try {
      await FirebaseService.logout();
      setCurrentUser(null);
      setUserProfile(null);
      setSyncError(null);
      if (showAlert) {
        showAlert('Đã đăng xuất', 'Đã đăng xuất tài khoản Firebase khỏi thiết bị này.');
      }
    } catch (err: unknown) {
      console.error('Logout error:', err);
    }
  }, [showAlert]);

  const syncNow = useCallback(async (): Promise<boolean> => {
    if (!currentUser) {
      if (showAlert) showAlert('Thông báo', 'Vui lòng đăng nhập Firebase để đồng bộ.');
      return false;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);
      const result = await FirebaseService.smartSync(currentUser);
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);

      if (result.action === 'DOWNLOADED' && onDataRestored) {
        onDataRestored();
      }

      if (showAlert) {
        showAlert('Đồng bộ thành công', result.message);
      }
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đồng bộ thất bại.';
      setSyncError(msg);
      if (showAlert) showAlert('Lỗi đồng bộ Cloud', msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser, onDataRestored, showAlert]);

  const forceUpload = useCallback(async (): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      setIsSyncing(true);
      setSyncError(null);
      await FirebaseService.uploadToCloud(currentUser);
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      if (showAlert) showAlert('Tải lên thành công', 'Đã đẩy toàn bộ dữ liệu máy lên Cloud Firestore!');
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tải lên thất bại.';
      setSyncError(msg);
      if (showAlert) showAlert('Lỗi tải lên', msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser, showAlert]);

  const forceDownload = useCallback(async (): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      setIsSyncing(true);
      setSyncError(null);
      const success = await FirebaseService.downloadFromCloud(currentUser);
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      if (onDataRestored) onDataRestored();
      if (showAlert) showAlert('Tải về thành công', 'Đã cập nhật toàn bộ dữ liệu từ Cloud Firestore về máy!');
      return success;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tải về thất bại.';
      setSyncError(msg);
      if (showAlert) showAlert('Lỗi tải về', msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser, onDataRestored, showAlert]);

  return {
    user: userProfile,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    isSyncing,
    lastSyncedAt,
    syncError,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    logout,
    syncNow,
    forceUpload,
    forceDownload,
  };
}
