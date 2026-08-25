import { useState, useEffect, useCallback } from 'react';
import {
  BackupData,
  GoogleDriveSyncState,
  GoogleUserProfile,
} from '../types';
import { GDriveService } from '../lib/gdrive.service';
import { StorageService } from '../lib/storage.service';
import { validateBackupData } from '../lib/backup.validator';

interface UseGoogleDriveSyncProps {
  onDataRestored?: () => void;
  showAlert?: (title: string, message: string) => void;
}

export function useGoogleDriveSync({
  onDataRestored,
  showAlert,
}: UseGoogleDriveSyncProps = {}): GoogleDriveSyncState {
  const [clientId, setClientIdState] = useState<string>(() => GDriveService.getClientId());
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => Boolean(GDriveService.getStoredToken()));
  const [userProfile, setUserProfile] = useState<GoogleUserProfile | null>(() =>
    GDriveService.getStoredUserProfile(),
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() =>
    GDriveService.getLastSyncedAt(),
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  const setClientId = useCallback((id: string) => {
    GDriveService.setClientId(id);
    setClientIdState(id);
  }, []);

  // Check token on mount and fetch user profile if missing
  useEffect(() => {
    const token = GDriveService.getStoredToken();
    if (token) {
      setIsSignedIn(true);
      if (!userProfile) {
        GDriveService.fetchUserProfile(token).then((prof) => {
          if (prof) setUserProfile(prof);
        });
      }
    } else {
      setIsSignedIn(false);
      setUserProfile(null);
    }
  }, [userProfile]);

  const login = useCallback(async () => {
    try {
      setIsSyncing(true);
      setSyncError(null);
      const token = await GDriveService.requestToken(clientId);
      setIsSignedIn(true);
      const profile = await GDriveService.fetchUserProfile(token);
      if (profile) setUserProfile(profile);
      if (showAlert) {
        showAlert('Đã kết nối Google Drive', `Xin chào ${profile?.name || 'Giáo viên'}! Bạn đã có thể đồng bộ dữ liệu đa thiết bị.`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập Google thất bại.';
      setSyncError(msg);
      if (showAlert) showAlert('Lỗi kết nối', msg);
    } finally {
      setIsSyncing(false);
    }
  }, [clientId, showAlert]);

  const logout = useCallback(() => {
    GDriveService.clearStoredToken();
    setIsSignedIn(false);
    setUserProfile(null);
    setSyncError(null);
    if (showAlert) {
      showAlert('Đã ngắt kết nối', 'Đã ngắt kết nối tài khoản Google Drive khỏi thiết bị này.');
    }
  }, [showAlert]);

  const uploadToDrive = useCallback(async (): Promise<boolean> => {
    const token = GDriveService.getStoredToken();
    if (!token) {
      setSyncError('Chưa kết nối Google Drive.');
      return false;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      const localPayload = StorageService.getCurrentBackupPayload();
      const backupData: BackupData = {
        app: 'TeacherHubPro',
        schemaVersion: 1,
        version: '1.2.0',
        exportedAt: new Date().toISOString(),
        data: localPayload,
      };

      await GDriveService.uploadBackup(token, backupData);
      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể đẩy dữ liệu lên Drive.';
      setSyncError(msg);
      if (showAlert) showAlert('Lỗi tải lên Drive', msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [showAlert]);

  const downloadFromDrive = useCallback(async (): Promise<boolean> => {
    const token = GDriveService.getStoredToken();
    if (!token) {
      setSyncError('Chưa kết nối Google Drive.');
      return false;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      const fileInfo = await GDriveService.findBackupFile(token);
      if (!fileInfo) {
        throw new Error('Chưa tìm thấy file sao lưu nào của Teacher Hub trên Google Drive của bạn.');
      }

      const rawData = await GDriveService.downloadBackup(token, fileInfo.id);
      const validation = validateBackupData(rawData);

      if (!validation.isValid || !validation.data) {
        throw new Error(`File sao lưu trên Drive không hợp lệ:\n• ${validation.errors.join('\n• ')}`);
      }

      // 1. Create safety snapshot before applying
      StorageService.createSafetySnapshot(
        `Snapshot tự động trước khi đồng bộ từ Drive lúc ${new Date().toLocaleString('vi-VN')}`,
      );

      // 2. Overwrite atomically
      const success = StorageService.atomicSetAll(validation.data.data);
      if (!success) {
        throw new Error('Ghi dữ liệu vào thiết bị thất bại (có thể do LocalStorage bị đầy).');
      }

      const nowIso = new Date().toISOString();
      setLastSyncedAt(nowIso);
      GDriveService.setLastSyncedAt(nowIso);

      if (onDataRestored) {
        onDataRestored();
      }

      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu từ Drive.';
      setSyncError(msg);
      if (showAlert) showAlert('Lỗi tải về từ Drive', msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [onDataRestored, showAlert]);

  const syncNow = useCallback(async (): Promise<boolean> => {
    const token = GDriveService.getStoredToken();
    if (!token) {
      await login();
      return false;
    }

    try {
      setIsSyncing(true);
      setSyncError(null);

      const fileInfo = await GDriveService.findBackupFile(token);
      if (!fileInfo) {
        // First time sync: upload local database to Drive
        return await uploadToDrive();
      }

      const remoteTime = new Date(fileInfo.modifiedTime).getTime();
      const localSyncTime = lastSyncedAt ? new Date(lastSyncedAt).getTime() : 0;

      if (remoteTime > localSyncTime + 5000) {
        // Remote is noticeably newer -> download and update
        const downloaded = await downloadFromDrive();
        if (downloaded && showAlert) {
          showAlert('Đồng bộ thành công', 'Đã cập nhật dữ liệu mới nhất từ Google Drive về máy!');
        }
        return downloaded;
      } else {
        // Local is newer or equal -> upload to Drive
        const uploaded = await uploadToDrive();
        if (uploaded && showAlert) {
          showAlert('Đồng bộ thành công', 'Đã sao lưu toàn bộ dữ liệu mới nhất lên Google Drive!');
        }
        return uploaded;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi trong quá trình đồng bộ.';
      setSyncError(msg);
      if (showAlert) showAlert('Lỗi đồng bộ', msg);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [login, uploadToDrive, downloadFromDrive, lastSyncedAt, showAlert]);

  return {
    isSignedIn,
    userProfile,
    isSyncing,
    lastSyncedAt,
    syncError,
    clientId,
    setClientId,
    login,
    logout,
    syncNow,
    uploadToDrive,
    downloadFromDrive,
  };
}
