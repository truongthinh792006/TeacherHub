import React, { useEffect, useState } from 'react';
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
  Save,
  DownloadCloud,
} from 'lucide-react';
import { AppProvider } from './AppContext';
import { useStorageController } from '../hooks/useStorageController';
import { localDateAfter, localDateString } from '../lib/date';
import { Dashboard } from '../features/dashboard/Dashboard';
import { TasksPage } from '../features/tasks/TasksPage';
import { PromptLibrary } from '../features/prompts/PromptLibrary';
import { StudentsPage } from '../features/students/StudentsPage';
import { JournalPage } from '../features/journal/JournalPage';
import { DocumentCenter } from '../features/documents/DocumentCenter';
import { SettingsPage } from '../features/settings/SettingsPage';
import { AIToolsPage } from '../features/ai-tools/AIToolsPage';
import { GlobalSearch } from '../components/ui/GlobalSearch';
import { AppModal } from '../components/ui/AppModal';
import {
  AppContextType,
  DocumentLink,
  GlobalFocus,
  JournalEntry,
  ModalConfig,
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

const navItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
  { id: 'tasks', icon: CheckSquare, label: 'Công việc' },
  { id: 'prompts', icon: MessageSquareQuote, label: 'Prompt AI' },
  { id: 'students', icon: Users, label: 'Học sinh' },
];

const moreNavItems = [
  { id: 'journal', icon: BookOpen, label: 'Nhật ký' },
  { id: 'docs', icon: FolderOpen, label: 'Tài liệu' },
  { id: 'ai-tools', icon: Wand2, label: 'Công cụ AI' },
  { id: 'settings', icon: SettingsIcon, label: 'Cài đặt' },
];

function SyncIndicator() {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
      <Save size={14} className="text-slate-500" />{' '}
      <span className="hidden sm:inline">Đã lưu cục bộ</span>
    </div>
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

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const showAlert = (title: string, message: string) =>
    setModalConfig({ isOpen: true, title, message, type: 'alert', onConfirm: null });

  const showConfirm = (title: string, message: string, onConfirm: () => void) =>
    setModalConfig({ isOpen: true, title, message, type: 'confirm', onConfirm });

  const closeModal = () => setModalConfig((prev) => ({ ...prev, isOpen: false }));

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
    showAlert,
    showConfirm,
    closeModal,
    glassClass:
      'bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm rounded-2xl',
    inputClass:
      'w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 min-h-[44px] text-base md:text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all',
    btnPrimary:
      'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 min-h-[44px] rounded-xl font-medium transition-colors flex items-center justify-center gap-2',
    btnSecondary:
      'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 min-h-[44px] rounded-xl font-medium transition-colors flex items-center justify-center gap-2',
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
        className={`min-h-[100dvh] transition-colors duration-300 ${
          darkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[100px] opacity-20 ${
              darkMode ? 'bg-blue-600' : 'bg-blue-400'
            }`}
          />
          <div
            className={`absolute top-1/2 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-20 ${
              darkMode ? 'bg-purple-600' : 'bg-purple-400'
            }`}
          />
        </div>

        <div className="flex h-[100dvh] relative z-10 overflow-hidden pb-[72px] lg:pb-0">
          {/* Sidebar desktop */}
          <aside className="hidden lg:flex flex-col w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800">
            <div className="p-6 flex items-center space-x-3 border-b border-slate-200/50 dark:border-slate-800">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                T
              </div>
              <div>
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Teacher Hub
                </h2>
                <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                  Pro Edition
                </p>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">
                Menu Chính
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium min-h-[44px] ${
                    activeTab === item.id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon
                    size={20}
                    className={activeTab === item.id ? 'animate-pulse' : ''}
                  />
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4 pt-6">
                Thêm
              </div>
              {moreNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium min-h-[44px] ${
                    activeTab === item.id
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Install PWA Button (Desktop Sidebar) */}
            {deferredPrompt && (
              <div className="px-4 pb-2">
                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95"
                >
                  <DownloadCloud size={16} /> Cài đặt TeacherHub App
                </button>
              </div>
            )}

            <div className="p-4 border-t border-slate-200/50 dark:border-slate-800">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <LogIn size={20} className="text-slate-500" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    Local User
                  </p>
                  <SyncIndicator />
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 flex flex-col h-full relative overflow-hidden">
            <header className="px-4 py-3 sm:p-4 lg:p-6 flex items-center justify-between sticky top-0 z-30 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800 lg:border-none lg:bg-transparent">
              <div className="flex items-center lg:hidden">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  T
                </div>
              </div>
              <div className="hidden lg:flex items-center">
                <SyncIndicator />
              </div>
              <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
                {/* Install App Header Button */}
                {deferredPrompt && (
                  <button
                    onClick={handleInstallClick}
                    className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-700 px-3 py-2 rounded-full text-xs font-semibold min-h-[40px] transition-colors"
                  >
                    <DownloadCloud size={16} />
                    <span className="hidden sm:inline">Cài App</span>
                  </button>
                )}
                <button
                  onClick={() => setGlobalSearchOpen(true)}
                  className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-500 px-4 py-2.5 rounded-full w-10 sm:w-64 min-h-[44px] overflow-hidden"
                >
                  <Search size={20} className="flex-shrink-0" />
                  <span className="hidden sm:inline font-medium text-sm">
                    Tìm mọi thứ...
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40 pb-safe">
          <div className="flex justify-around items-center h-[72px] px-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMoreOpen(false);
                }}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                  activeTab === item.id && !mobileMoreOpen
                    ? 'text-blue-600'
                    : 'text-slate-500'
                }`}
              >
                <item.icon
                  size={24}
                  className={
                    activeTab === item.id && !mobileMoreOpen ? 'animate-bounce-slight' : ''
                  }
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
            <button
              onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                mobileMoreOpen ? 'text-purple-600' : 'text-slate-500'
              }`}
            >
              <MoreHorizontal size={24} />
              <span className="text-[10px] font-medium">Thêm</span>
            </button>
          </div>
        </nav>

        {mobileMoreOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileMoreOpen(false)}
          >
            <div
              className="absolute bottom-[72px] left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-full duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
              <div className="grid grid-cols-4 gap-4 mb-4">
                {moreNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMoreOpen(false);
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                        activeTab === item.id
                          ? 'bg-purple-100 text-purple-600 border-2 border-purple-500'
                          : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <item.icon size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
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
                    className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md"
                  >
                    <DownloadCloud size={18} /> Cài đặt Teacher Hub App
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-2">
                <SyncIndicator />
              </div>
            </div>
          </div>
        )}

        <GlobalSearch />
        <AppModal modalConfig={modalConfig} closeModal={closeModal} />
      </div>
    </AppProvider>
  );
}
