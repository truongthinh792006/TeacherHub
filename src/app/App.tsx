import React, { useEffect, useState, useCallback } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquareQuote,
  FolderOpen,
  BookOpen,
  Users,
  Wand2,
  Settings as SettingsIcon,
  Search,
  MoreHorizontal,
  LogIn,
  DownloadCloud,
  CalendarDays,
  Briefcase,
  RefreshCw,
  Cloud,
} from 'lucide-react';
import { AppProvider } from './AppContext';
import { useStorageController } from '../hooks/useStorageController';
import { useFirebaseAuthSync } from '../hooks/useFirebaseAuthSync';
import { localDateAfter, localDateString } from '../lib/date';
import { Dashboard } from '../features/dashboard/Dashboard';
import { TasksPage } from '../features/tasks/TasksPage';
import { PromptLibrary } from '../features/prompts/PromptLibrary';
import { StudentsPage } from '../features/students/StudentsPage';
import { JournalPage } from '../features/journal/JournalPage';
import { DocumentCenter } from '../features/documents/DocumentCenter';
import { SettingsPage } from '../features/settings/SettingsPage';
import { AIToolsPage } from '../features/ai-tools/AIToolsPage';
import { PPCTPage } from '../features/ppct/PPCTPage';
import { DepartmentPage } from '../features/department/DepartmentPage';
import { presetGrade10 } from '../features/ppct/ppctPresets';
import { GlobalSearch } from '../components/ui/GlobalSearch';
import { AppModal } from '../components/ui/AppModal';
import { AuthModal } from '../components/auth/AuthModal';
import {
  AppContextType,
  DepartmentRecord,
  DocumentLink,
  FirebaseAuthSyncState,
  GlobalFocus,
  JournalEntry,
  ModalConfig,
  PPCTPlan,
  Prompt,
  Student,
  Task,
} from '../types';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Chấm bài kiểm tra 15p Lớp 10A1',
    dueDate: localDateString(),
    priority: 'HIGH',
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Nộp kế hoạch giảng dạy tuần sau',
    dueDate: localDateAfter(86400000),
    priority: 'MEDIUM',
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const initialPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Tạo dàn ý bài giảng',
    content:
      'Đóng vai là một giáo viên Tin học THPT, hãy tạo một dàn ý bài giảng chi tiết trong 45 phút cho bài học về "Cấu trúc rẽ nhánh". Yêu cầu có phần khởi động, hình thành kiến thức, luyện tập và vận dụng thực tế.',
    description: 'Dùng để soạn giáo án nhanh',
    category: 'Giáo án',
    tags: 'tin-hoc, thpt',
    favorite: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const initialPPCT: PPCTPlan[] = [
  {
    ...presetGrade10,
    id: 'plan-default-10',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const initialDepartmentRecords: DepartmentRecord[] = [
  {
    id: 'eval-1',
    recordType: 'EVALUATION',
    teacherName: 'Nguyễn Văn A',
    observerName: 'Tổ trưởng Chuyên môn',
    className: '10A1',
    lessonName: 'Bài 13: Cấu trúc lặp for trong Python',
    date: localDateString(),
    period: 2,
    scorePlanning: 4.5,
    scoreTeacherActivity: 4.5,
    scoreStudentActivity: 4.0,
    scoreEffectiveness: 4.0,
    totalScore: 17.0,
    rating: 'GIOI',
    strengths: 'Giáo án thiết kế theo CV 5512 rõ ràng, học sinh thực hành code sôi nổi trên Thonny IDE.',
    weaknesses: 'Cần bao quát thêm một số học sinh ở dãy bàn cuối phòng máy.',
    recommendations: 'Tăng cường các bài tập phân hóa cho học sinh hoàn thành sớm nhiệm vụ.',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'meet-1',
    recordType: 'MEETING',
    title: 'Biên bản Sinh hoạt chuyên môn theo Nghiên cứu bài học - Tháng 10',
    date: localDateString(),
    time: '14:00 - 16:30',
    location: 'Phòng máy tính 1',
    chair: 'Tổ trưởng Chuyên môn',
    secretary: 'Thư ký Tổ',
    attendees: 'Toàn thể Giáo viên trong Tổ Tin học',
    absent: 'Không',
    topic: 'LESSON_STUDY',
    content: '1. Đánh giá tiết dạy minh họa của Thầy Nguyễn Văn A.\n2. Phân tích khó khăn của học sinh khi làm quen với vòng lặp trong Python.\n3. Thống nhất điều chỉnh tiến trình dạy học phần Luyện tập.',
    resolutions: 'Nhất trí thông qua kế hoạch bài dạy đã chỉnh sửa để áp dụng cho toàn khối 10.',
    assignments: 'Thầy A nộp hồ sơ bài dạy minh họa lưu trữ chuyên môn.',
    nextMeetingDate: localDateAfter(14 * 86400000),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'assign-1',
    recordType: 'ASSIGNMENT',
    teacherName: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0912 345 678',
    assignedClasses: '10A1, 10A2, 10A3, 10A4',
    periodsPerWeek: 16,
    labSchedule: 'Sáng Thứ 3 (Tiết 1-3 PM1), Chiều Thứ 5 (Tiết 1-2 PM1)',
    notes: 'Phụ trách Phòng máy 1 & Đội tuyển HSG Tin học Khối 10',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'assign-2',
    recordType: 'ASSIGNMENT',
    teacherName: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    phone: '0988 765 432',
    assignedClasses: '11A1, 11A2, 12A1, 12A2',
    periodsPerWeek: 16,
    labSchedule: 'Sáng Thứ 4 (Tiết 1-4 PM2), Chiều Thứ 6 (Tiết 2-4 PM2)',
    notes: 'Phụ trách Phòng máy 2 & Thư ký Hội đồng Chuyên môn',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
  { id: 'tasks', icon: CheckSquare, label: 'Công việc' },
  { id: 'prompts', icon: MessageSquareQuote, label: 'Prompt AI' },
  { id: 'students', icon: Users, label: 'Học sinh' },
];

const moreNavItems = [
  { id: 'ppct', icon: CalendarDays, label: 'PPCT' },
  { id: 'department', icon: Briefcase, label: 'Tổ CM' },
  { id: 'journal', icon: BookOpen, label: 'Nhật ký' },
  { id: 'docs', icon: FolderOpen, label: 'Tài liệu' },
  { id: 'ai-tools', icon: Wand2, label: 'Công cụ AI' },
  { id: 'settings', icon: SettingsIcon, label: 'Cài đặt' },
];

function HeaderCloudSyncIndicator({
  firebaseAuth,
  openAuthModal,
}: {
  firebaseAuth: FirebaseAuthSyncState;
  openAuthModal: () => void;
}) {
  if (!firebaseAuth.isAuthenticated) {
    return (
      <button
        onClick={openAuthModal}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
        title="Đăng nhập để đồng bộ Realtime qua Cloud"
      >
        <Cloud size={13} className="text-slate-400" />
        <span className="hidden sm:inline">Đăng nhập Cloud</span>
      </button>
    );
  }

  const formatLastSync = (iso: string | null) => {
    if (!iso) return 'Realtime';
    const d = new Date(iso);
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
  };

  return (
    <button
      onClick={() => firebaseAuth.syncNow()}
      disabled={firebaseAuth.isSyncing}
      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
        firebaseAuth.isSyncing
          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15'
      }`}
      title={
        firebaseAuth.lastSyncedAt
          ? `Đã đồng bộ Cloud lúc ${new Date(firebaseAuth.lastSyncedAt).toLocaleString('vi-VN')} (Nhấn để đồng bộ lại)`
          : 'Đồng bộ đám mây Realtime'
      }
    >
      <span className={`w-1.5 h-1.5 rounded-full ${firebaseAuth.isSyncing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
      <RefreshCw
        size={12}
        className={firebaseAuth.isSyncing ? 'animate-spin text-amber-500' : 'text-emerald-500'}
      />
      <span className="hidden sm:inline">
        {firebaseAuth.isSyncing
          ? 'Đang đồng bộ...'
          : `Đã đồng bộ ${formatLastSync(firebaseAuth.lastSyncedAt)}`}
      </span>
    </button>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(
    () => window.localStorage.getItem('thp_darkMode') === 'true',
  );
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    onConfirm: null,
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState<boolean>(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  const [globalFocus, setGlobalFocus] = useState<GlobalFocus | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    window.localStorage.setItem('thp_darkMode', String(darkMode));
  }, [darkMode]);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const tasksCtrl = useStorageController<Task>('tasks', initialTasks);
  const promptsCtrl = useStorageController<Prompt>('prompts', initialPrompts);
  const docsCtrl = useStorageController<DocumentLink>('docs', []);
  const journalCtrl = useStorageController<JournalEntry>('journals', []);
  const studentsCtrl = useStorageController<Student>('students', []);
  const ppctCtrl = useStorageController<PPCTPlan>('ppct', initialPPCT);
  const departmentCtrl = useStorageController<DepartmentRecord>('department', initialDepartmentRecords);

  const showAlert = useCallback((title: string, message: string) => {
    setModalConfig({ isOpen: true, title, message, type: 'alert', onConfirm: null });
  }, []);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ isOpen: true, title, message, type: 'confirm', onConfirm });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const refreshAllControllers = useCallback(() => {
    tasksCtrl.refresh();
    promptsCtrl.refresh();
    docsCtrl.refresh();
    journalCtrl.refresh();
    studentsCtrl.refresh();
    ppctCtrl.refresh();
    departmentCtrl.refresh();
  }, [tasksCtrl, promptsCtrl, docsCtrl, journalCtrl, studentsCtrl, ppctCtrl, departmentCtrl]);

  // Firebase Auth & Cloud Firestore Sync hook
  const firebaseAuth = useFirebaseAuthSync({
    onDataRestored: refreshAllControllers,
    showAlert,
  });

  const openAuthModal = () => setAuthModalOpen(true);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const contextValue: AppContextType = {
    darkMode,
    toggleDarkMode,
    activeTab,
    setActiveTab,
    globalFocus,
    setGlobalFocus,
    globalSearchOpen,
    setGlobalSearchOpen,
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
    closeModal,
    glassClass:
      'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl',
    inputClass:
      'w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 min-h-[42px] text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400',
    btnPrimary:
      'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-5 py-2.5 min-h-[42px] rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm',
    btnSecondary:
      'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 min-h-[42px] rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-slate-200/60 dark:border-slate-700/60',
  };

  const page =
    activeTab === 'dashboard' ? (
      <Dashboard />
    ) : activeTab === 'tasks' ? (
      <TasksPage />
    ) : activeTab === 'prompts' ? (
      <PromptLibrary />
    ) : activeTab === 'students' ? (
      <StudentsPage />
    ) : activeTab === 'ppct' ? (
      <PPCTPage />
    ) : activeTab === 'department' ? (
      <DepartmentPage />
    ) : activeTab === 'journal' ? (
      <JournalPage />
    ) : activeTab === 'docs' ? (
      <DocumentCenter />
    ) : activeTab === 'settings' ? (
      <SettingsPage />
    ) : activeTab === 'ai-tools' ? (
      <AIToolsPage />
    ) : (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Wand2 size={64} className="mb-4 opacity-20" />
        <p>Tính năng đang được phát triển.</p>
      </div>
    );

  return (
    <AppProvider value={contextValue}>
      <div
        className={`min-h-[100dvh] transition-colors duration-200 ${
          darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div className="flex h-[100dvh] relative z-10 overflow-hidden pb-[72px] lg:pb-0">
          {/* Sidebar desktop */}
          <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            {/* Header Brand */}
            <div className="p-5 flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                T
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Teacher Hub
                </h2>
                <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
                  Pro Edition
                </p>
              </div>
            </div>

            {/* Navigation items */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
                Menu Chính
              </div>
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm min-h-[40px] ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 pt-5">
                Chuyên môn & Tiện ích
              </div>
              {moreNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm min-h-[40px] ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Install PWA Button (Desktop Sidebar) */}
            {deferredPrompt && (
              <div className="px-3 pb-2">
                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  <DownloadCloud size={15} /> Cài đặt TeacherHub App
                </button>
              </div>
            )}

            {/* User & Cloud Sync Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  {firebaseAuth.isAuthenticated && firebaseAuth.user?.photoURL ? (
                    <img
                      src={firebaseAuth.user.photoURL}
                      alt={firebaseAuth.user.displayName || ''}
                      className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-600"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {firebaseAuth.isAuthenticated && firebaseAuth.user ? (
                        (firebaseAuth.user.displayName || 'G').charAt(0).toUpperCase()
                      ) : (
                        <LogIn size={14} />
                      )}
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {firebaseAuth.isAuthenticated && firebaseAuth.user
                        ? firebaseAuth.user.displayName
                        : 'Local User'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {firebaseAuth.isAuthenticated && firebaseAuth.user
                        ? firebaseAuth.user.email
                        : 'Lưu trữ cục bộ'}
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <HeaderCloudSyncIndicator
                    firebaseAuth={firebaseAuth}
                    openAuthModal={openAuthModal}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 flex flex-col h-full relative overflow-hidden">
            <header className="px-4 py-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center lg:hidden">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm">
                  T
                </div>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <HeaderCloudSyncIndicator
                  firebaseAuth={firebaseAuth}
                  openAuthModal={openAuthModal}
                />
              </div>
              <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
                {/* Install App Header Button */}
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                  >
                    <DownloadCloud size={14} />
                    <span className="hidden sm:inline">Cài App</span>
                  </button>
                )}
                <button
                  onClick={() => setGlobalSearchOpen(true)}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-500 px-4 py-2 rounded-full w-10 sm:w-64 min-h-[38px] overflow-hidden transition-colors"
                >
                  <Search size={16} className="flex-shrink-0" />
                  <span className="hidden sm:inline font-medium text-xs">
                    Tìm kiếm nhanh...
                  </span>
                </button>
              </div>
            </header>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative z-20"
              id="scroll-container"
            >
              <div className="max-w-7xl mx-auto pb-safe-bottom">{page}</div>
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 pb-safe">
          <div className="flex justify-around items-center h-[64px] px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMoreOpen(false);
                }}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                  activeTab === item.id && !mobileMoreOpen
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-500'
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                mobileMoreOpen ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-500'
              }`}
            >
              <MoreHorizontal size={20} />
              <span className="text-[10px]">Thêm</span>
            </button>
          </div>
        </nav>

        {mobileMoreOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setMobileMoreOpen(false)}
          >
            <div
              className="absolute bottom-[64px] left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-4 shadow-xl border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-full duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5" />
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                {moreNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMoreOpen(false);
                    }}
                    className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                        activeTab === item.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <item.icon size={22} />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Install PWA Option in Mobile Drawer */}
              {deferredPrompt && (
                <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setMobileMoreOpen(false);
                      handleInstallClick();
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    <DownloadCloud size={16} /> Cài đặt Teacher Hub App
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-2">
                <HeaderCloudSyncIndicator
                  firebaseAuth={firebaseAuth}
                  openAuthModal={openAuthModal}
                />
              </div>
            </div>
          </div>
        )}

        <GlobalSearch />
        <AppModal modalConfig={modalConfig} closeModal={closeModal} />
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    </AppProvider>
  );
}
