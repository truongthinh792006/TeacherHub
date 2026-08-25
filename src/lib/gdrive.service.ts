import { BackupData, GoogleUserProfile } from '../types';

const CLIENT_ID_KEY = 'thp_gdrive_client_id';
const TOKEN_KEY = 'thp_gdrive_token';
const TOKEN_EXP_KEY = 'thp_gdrive_token_exp';
const USER_KEY = 'thp_gdrive_user';
const LAST_SYNCED_KEY = 'thp_gdrive_last_synced';

const BACKUP_FILENAME = 'teacher_hub_backup.json';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';

// Default Demo/Public Google OAuth Client ID for TeacherHub (User can configure their own in Settings)
export const DEFAULT_CLIENT_ID = '382914838421-exampleteacherhuboauth.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: unknown }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

export interface DriveFileInfo {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
}

export const GDriveService = {
  getClientId: (): string => {
    return window.localStorage.getItem(CLIENT_ID_KEY) || DEFAULT_CLIENT_ID;
  },

  setClientId: (clientId: string): void => {
    window.localStorage.setItem(CLIENT_ID_KEY, clientId.trim());
  },

  getStoredToken: (): string | null => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const exp = window.localStorage.getItem(TOKEN_EXP_KEY);
    if (!token || !exp) return null;
    if (Date.now() > parseInt(exp, 10)) {
      GDriveService.clearStoredToken();
      return null;
    }
    return token;
  },

  setStoredToken: (token: string, expiresInSeconds = 3500): void => {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(TOKEN_EXP_KEY, String(Date.now() + expiresInSeconds * 1000));
  },

  clearStoredToken: (): void => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(TOKEN_EXP_KEY);
    window.localStorage.removeItem(USER_KEY);
  },

  getStoredUserProfile: (): GoogleUserProfile | null => {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as GoogleUserProfile;
    } catch {
      return null;
    }
  },

  setStoredUserProfile: (profile: GoogleUserProfile): void => {
    window.localStorage.setItem(USER_KEY, JSON.stringify(profile));
  },

  getLastSyncedAt: (): string | null => {
    return window.localStorage.getItem(LAST_SYNCED_KEY);
  },

  setLastSyncedAt: (timestampIso: string): void => {
    window.localStorage.setItem(LAST_SYNCED_KEY, timestampIso);
  },

  loadGsiScript: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }
      const existingScript = document.getElementById('google-gsi-script');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        return;
      }
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (e) => reject(new Error('Không thể tải Google Identity Services script.'));
      document.head.appendChild(script);
    });
  },

  requestToken: async (clientId?: string): Promise<string> => {
    await GDriveService.loadGsiScript();
    const effectiveClientId = clientId || GDriveService.getClientId();

    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google Identity Services chưa sẵn sàng.'));
        return;
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: effectiveClientId,
        scope: DRIVE_SCOPE,
        callback: (res) => {
          if (res.access_token) {
            GDriveService.setStoredToken(res.access_token);
            resolve(res.access_token);
          } else {
            reject(new Error('Đăng nhập Google thất bại hoặc người dùng đã hủy.'));
          }
        },
        error_callback: (err) => {
          console.error('[GDriveService] Auth error:', err);
          reject(new Error('Lỗi xác thực Google. Vui lòng kiểm tra lại Google Client ID.'));
        },
      });

      client.requestAccessToken({ prompt: '' });
    });
  },

  fetchUserProfile: async (token: string): Promise<GoogleUserProfile | null> => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      const profile: GoogleUserProfile = {
        name: data.name || data.email,
        email: data.email,
        picture: data.picture,
      };
      GDriveService.setStoredUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('[GDriveService] Error fetching user profile:', error);
      return null;
    }
  },

  findBackupFile: async (token: string): Promise<DriveFileInfo | null> => {
    const query = encodeURIComponent(`name = '${BACKUP_FILENAME}' and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,size)&spaces=drive`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 401) {
        GDriveService.clearStoredToken();
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng kết nối lại Google Drive.');
      }
      throw new Error(`Lỗi tìm kiếm file trên Drive: ${res.statusText}`);
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0] as DriveFileInfo;
    }
    return null;
  },

  uploadBackup: async (token: string, backupData: BackupData): Promise<DriveFileInfo> => {
    const existingFile = await GDriveService.findBackupFile(token);
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: BACKUP_FILENAME,
      mimeType: 'application/json',
      description: 'Teacher Hub Pro Backup Database',
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(backupData, null, 2) +
      closeDelimiter;

    let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    let method = 'POST';

    if (existingFile) {
      url = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`;
      method = 'PATCH';
    }

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    });

    if (!res.ok) {
      throw new Error(`Không thể đẩy file lên Google Drive (${res.status}): ${res.statusText}`);
    }

    const uploaded = await res.json();
    GDriveService.setLastSyncedAt(new Date().toISOString());
    return uploaded as DriveFileInfo;
  },

  downloadBackup: async (token: string, fileId: string): Promise<unknown> => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`Không thể tải file từ Google Drive (${res.status}): ${res.statusText}`);
    }

    return await res.json();
  },
};
