import React, { useRef, useState } from 'react';
import {
  Download,
  Upload,
  Sun,
  Moon,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  X,
  History,
  CheckCircle2,
  CloudUpload,
  CloudDownload,
  LogIn,
  LogOut,
  RefreshCw,
  Flame,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { localDateString } from '../../lib/date';
import { StorageService } from '../../lib/storage.service';
import { validateBackupData } from '../../lib/backup.validator';
import { BackupData, BackupValidationResult, SafetySnapshotInfo } from '../../types';

export function SettingsPage() {
  const {
    tasksCtrl,
    promptsCtrl,
    docsCtrl,
    journalCtrl,
    studentsCtrl,
    ppctCtrl,
    departmentCtrl,
    firebaseAuth,
    openAuthModal,
    showAlert,
    showConfirm,
    glassClass,
    btnPrimary,
    btnSecondary,
    darkMode,
    toggleDarkMode,
  } = useAppContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewResult, setPreviewResult] = useState<BackupValidationResult | null>(null);
  const [snapshotInfo, setSnapshotInfo] = useState<SafetySnapshotInfo | null>(() =>
    StorageService.getSafetySnapshotInfo(),
  );

  const refreshSnapshotInfo = () => {
    setSnapshotInfo(StorageService.getSafetySnapshotInfo());
  };

  const handleExport = () => {
    const backup: BackupData = {
      app: 'TeacherHubPro',
      schemaVersion: 1,
      version: '1.2.0',
      exportedAt: new Date().toISOString(),
      data: {
        tasks: tasksCtrl.data,
        prompts: promptsCtrl.data,
        docs: docsCtrl.data,
        journals: journalCtrl.data,
        students: studentsCtrl.data,
        ppct: ppctCtrl.data,
        department: departmentCtrl.data,
        darkMode,
      },
    };

    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute(
      'download',
      `TeacherHub_Backup_${localDateString()}_${Date.now().toString().slice(-4)}.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawContent = event.target?.result;
        if (typeof rawContent !== 'string') {
          showAlert('Lỗi', 'Không thể đọc nội dung file.');
          return;
        }

        const jsonObj = JSON.parse(rawContent);
        const result = validateBackupData(jsonObj);

        if (!result.isValid) {
          showAlert(
            'File không hợp lệ',
            `Phát hiện các lỗi trong file sao lưu:\n• ${result.errors.slice(0, 5).join('\n• ')}${
              result.errors.length > 5 ? `\n(và ${result.errors.length - 5} lỗi khác...)` : ''
            }`,
          );
          return;
        }

        setPreviewResult(result);
      } catch (error) {
        console.error('Error parsing JSON backup:', error);
        showAlert('Lỗi', 'File không đúng định dạng JSON hoặc bị hỏng.');
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.onerror = () => {
      showAlert('Lỗi', 'Không thể đọc file backup từ thiết bị.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    if (!previewResult || !previewResult.data) return;

    const backupData = previewResult.data.data;

    // 1. Tạo Safety Snapshot trước khi ghi đè
    const snapshotCreated = StorageService.createSafetySnapshot(
      `Snapshot tự động trước khi khôi phục ngày ${new Date().toLocaleString('vi-VN')}`,
    );

    // 2. Ghi đè atomically toàn bộ collections
    const success = StorageService.atomicSetAll(backupData);

    if (success) {
      // 3. Cập nhật state React của các controllers
      tasksCtrl.hardSetData(backupData.tasks);
      promptsCtrl.hardSetData(backupData.prompts);
      docsCtrl.hardSetData(backupData.docs);
      journalCtrl.hardSetData(backupData.journals);
      studentsCtrl.hardSetData(backupData.students);
      if (backupData.ppct) {
        ppctCtrl.hardSetData(backupData.ppct);
      }
      if (backupData.department) {
        departmentCtrl.hardSetData(backupData.department);
      }

      if (backupData.darkMode !== undefined && backupData.darkMode !== darkMode) {
        toggleDarkMode();
      }

      setPreviewResult(null);
      refreshSnapshotInfo();

      showAlert(
        'Khôi phục thành công',
        `Đã nạp toàn bộ dữ liệu từ file sao lưu.${
          snapshotCreated
            ? '\n\nĐã tự động lưu 1 bản Snapshot an toàn của dữ liệu trước đó. Bạn có thể nhấn nút "Hoàn tác" bất cứ lúc nào.'
            : ''
        }`,
      );
    } else {
      setPreviewResult(null);
      showAlert(
        'Lỗi khôi phục',
        'Có lỗi xảy ra trong quá trình ghi dữ liệu (có thể do LocalStorage bị đầy). Dữ liệu đã được giữ nguyên trạng thái cũ.',
      );
    }
  };

  const handleRollback = () => {
    const info = StorageService.getSafetySnapshotInfo();
    if (!info) {
      showAlert('Thông báo', 'Chưa có bản Snapshot an toàn nào được lưu.');
      return;
    }

    const formattedTime = new Date(info.timestamp).toLocaleString('vi-VN');

    showConfirm(
      'Xác nhận hoàn tác',
      `Khôi phục dữ liệu về trạng thái trước đó (lưu lúc ${formattedTime})?\n\nDữ liệu sẽ gồm: ${info.counts.tasks} việc, ${info.counts.prompts} prompt, ${info.counts.students} học sinh, ${info.counts.journals} nhật ký, ${info.counts.docs} tài liệu, ${info.counts.ppct} PPCT, ${info.counts.department || 0} hồ sơ tổ.`,
      () => {
        const restored = StorageService.restoreSafetySnapshot();
        if (restored) {
          tasksCtrl.hardSetData(restored.tasks);
          promptsCtrl.hardSetData(restored.prompts);
          docsCtrl.hardSetData(restored.docs);
          journalCtrl.hardSetData(restored.journals);
          studentsCtrl.hardSetData(restored.students);
          if (restored.ppct) {
            ppctCtrl.hardSetData(restored.ppct);
          }
          if (restored.department) {
            departmentCtrl.hardSetData(restored.department);
          }
          if (restored.darkMode !== undefined && restored.darkMode !== darkMode) {
            toggleDarkMode();
          }
          showAlert('Thành công', 'Đã khôi phục thành công về bản Snapshot trước đó!');
        } else {
          showAlert('Lỗi', 'Không thể khôi phục từ snapshot.');
        }
      },
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Cài đặt</h1>

      <div className={`${glassClass} p-5 lg:p-6 space-y-6`}>
        {/* Giao diện */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Giao diện</h3>
            <p className="text-sm text-slate-500">Chuyển đổi Sáng / Tối</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* 1. Đồng bộ Firebase Cloud Firestore (Real-time) */}
        <div className="pb-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Flame className="text-amber-500" size={20} /> Firebase Cloud (Đồng bộ Realtime)
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Lưu trữ tự động trên Google Cloud Firestore, đồng bộ tức thì đa thiết bị.
            </p>
          </div>

          {firebaseAuth.isAuthenticated && firebaseAuth.user ? (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {firebaseAuth.user.photoURL ? (
                    <img
                      src={firebaseAuth.user.photoURL}
                      alt={firebaseAuth.user.displayName || ''}
                      className="w-11 h-11 rounded-full border-2 border-amber-300 dark:border-amber-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                      {(firebaseAuth.user.displayName || 'G').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                      {firebaseAuth.user.displayName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{firebaseAuth.user.email}</p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 font-medium">
                      {firebaseAuth.lastSyncedAt
                        ? `Đồng bộ lần cuối: ${new Date(firebaseAuth.lastSyncedAt).toLocaleString('vi-VN')}`
                        : 'Sẵn sàng đồng bộ đa thiết bị'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => firebaseAuth.syncNow()}
                    disabled={firebaseAuth.isSyncing}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white flex items-center justify-center gap-1.5 min-h-[38px] shadow-sm transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={firebaseAuth.isSyncing ? 'animate-spin' : ''} />
                    <span>{firebaseAuth.isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}</span>
                  </button>
                  <button
                    onClick={() => firebaseAuth.logout()}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors min-h-[38px]"
                    title="Đăng xuất khỏi Firebase Cloud"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>

              {/* Secondary Actions: Manual Cloud Overrides */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => firebaseAuth.forceUpload()}
                  disabled={firebaseAuth.isSyncing}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700/60"
                  title="Đẩy đè toàn bộ dữ liệu máy hiện tại lên Cloud"
                >
                  <CloudUpload size={14} className="text-amber-500" />
                  <span>Tải lên Cloud (Upload)</span>
                </button>
                <button
                  onClick={() => firebaseAuth.forceDownload()}
                  disabled={firebaseAuth.isSyncing}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors border border-slate-200/60 dark:border-slate-700/60"
                  title="Nạp đè toàn bộ dữ liệu từ Cloud về máy hiện tại"
                >
                  <CloudDownload size={14} className="text-emerald-500" />
                  <span>Tải về Máy (Download)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Đăng nhập tài khoản để đồng bộ Realtime
                </p>
                <p className="text-[11px] text-slate-500">
                  Tự động lưu và đồng bộ tức thì giữa máy tính ở trường và thiết bị ở nhà.
                </p>
              </div>
              <button
                onClick={openAuthModal}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all min-h-[40px]"
              >
                <LogIn size={16} />
                <span>Đăng nhập / Đăng ký</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Sao lưu dữ liệu Cục bộ (Local JSON & Safety Snapshot) */}
        <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-white mb-1">
            Sao lưu & Phục hồi Cục bộ (Local JSON)
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Lưu trữ file backup offline đề phòng rủi ro mất dữ liệu trình duyệt.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
            >
              <Download size={20} /> Tải file Backup
            </button>
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded-xl font-medium transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
              <Upload size={20} /> Phục hồi từ file
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelected}
                className="hidden"
              />
            </label>
          </div>

          {/* Rollback Snapshot Section */}
          {snapshotInfo && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <History className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                    Bản sao lưu an toàn tự động
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                    Lưu lúc: {new Date(snapshotInfo.timestamp).toLocaleString('vi-VN')} ({snapshotInfo.counts.tasks} việc, {snapshotInfo.counts.prompts} prompt, {snapshotInfo.counts.students} HS, {snapshotInfo.counts.ppct || 0} PPCT, {snapshotInfo.counts.department || 0} hồ sơ tổ)
                  </p>
                </div>
              </div>
              <button
                onClick={handleRollback}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 min-h-[36px] transition-colors whitespace-nowrap"
              >
                <RotateCcw size={14} /> Hoàn tác bản này
              </button>
            </div>
          )}
        </div>

        {/* Thông tin phiên bản */}
        <div className="pt-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white font-bold text-2xl shadow-lg mb-3">
            T
          </div>
          <p className="font-bold text-slate-800 dark:text-white">Teacher Hub Pro</p>
          <p className="text-xs text-slate-500 mt-1">Version 1.2.0 (Firebase Realtime & PWA Offline)</p>
        </div>
      </div>

      {/* Restore Preview & Confirmation Modal */}
      {previewResult && previewResult.data && (
        <div className="fixed inset-0 z-[250] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <FileCheck className="text-emerald-500" size={24} />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  Xem trước dữ liệu Khôi phục
                </h3>
              </div>
              <button
                onClick={() => setPreviewResult(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                <p>
                  <strong>Ngày xuất file:</strong>{' '}
                  {new Date(previewResult.data.exportedAt).toLocaleString('vi-VN')}
                </p>
                <p>
                  <strong>Phiên bản cấu trúc:</strong> Schema v{previewResult.data.schemaVersion} ({previewResult.data.version})
                </p>
              </div>

              {/* Bảng so sánh số lượng */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  So sánh số lượng bản ghi
                </p>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-sm">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                      <tr>
                        <th className="p-3">Danh mục</th>
                        <th className="p-3 text-center">Hiện tại</th>
                        <th className="p-3 text-center text-blue-600 dark:text-blue-400">File sao lưu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="p-3 font-medium">Công việc (Tasks)</td>
                        <td className="p-3 text-center text-slate-500">{tasksCtrl.data.length}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {previewResult.summary.tasks}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Prompt AI</td>
                        <td className="p-3 text-center text-slate-500">{promptsCtrl.data.length}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {previewResult.summary.prompts}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Hồ sơ Học sinh</td>
                        <td className="p-3 text-center text-slate-500">{studentsCtrl.data.length}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {previewResult.summary.students}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Phân phối chương trình (PPCT)</td>
                        <td className="p-3 text-center text-slate-500">{ppctCtrl.data.length}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {previewResult.summary.ppct}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Hồ sơ Tổ chuyên môn</td>
                        <td className="p-3 text-center text-slate-500">{departmentCtrl.data.length}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {previewResult.summary.department}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Nhật ký Giảng dạy</td>
                        <td className="p-3 text-center text-slate-500">{journalCtrl.data.length}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {previewResult.summary.journals}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Tài liệu & Links</td>
                        <td className="p-3 text-center text-slate-500">{docsCtrl.data.length}</td>
                        <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400">
                          {previewResult.summary.docs}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cảnh báo ghi đè */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Cảnh báo:</strong> Quá trình khôi phục sẽ thay thế toàn bộ dữ liệu hiện có bằng dữ liệu trong file backup. Một bản Snapshot an toàn của dữ liệu hiện tại sẽ được tự động lưu lại để bạn có thể hoàn tác nếu cần.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
              <button
                onClick={() => setPreviewResult(null)}
                className={btnSecondary}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmRestore}
                className={btnPrimary}
              >
                <Upload size={18} /> Xác nhận Khôi phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
