import React from 'react';
import {
  CheckSquare,
  MessageSquareQuote,
  Users,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { localDateString } from '../../lib/date';

export function Dashboard() {
  const {
    tasksCtrl,
    promptsCtrl,
    journalCtrl,
    studentsCtrl,
    setActiveTab,
    glassClass,
  } = useAppContext();

  const todayStr = localDateString();
  const tasks = tasksCtrl.data;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const todayTasks = tasks.filter((t) => !t.completed && t.dueDate === todayStr).length;
  const overdueTasks = tasks.filter((t) => !t.completed && t.dueDate < todayStr).length;
  const todayDateStr = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">
          Xin chào, Thầy/Cô 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 text-sm lg:text-base">
          <CalendarIcon size={16} /> {todayDateStr}
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <div
          className={`${glassClass} p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-blue-500`}
        >
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl w-fit">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hôm nay</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {todayTasks}{' '}
              <span className="text-sm font-normal text-slate-400">/ {pendingTasks}</span>
            </h3>
          </div>
        </div>

        <div
          className={`${glassClass} p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-red-500`}
        >
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl w-fit">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quá hạn</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {overdueTasks}
            </h3>
          </div>
        </div>

        <div
          className={`${glassClass} p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-emerald-500`}
        >
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-xl w-fit">
            <MessageSquareQuote size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Prompt AI</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {promptsCtrl.data.length}
            </h3>
          </div>
        </div>

        <div
          className={`${glassClass} p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-purple-500`}
        >
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-xl w-fit">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Học sinh</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {studentsCtrl.data.length}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className={`${glassClass} p-5 lg:p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock size={20} className="text-blue-500" /> Cần làm ngay
            </h2>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-sm text-blue-500 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 min-h-[44px]"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {tasks
              .filter((t) => !t.completed)
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 4)
              .map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
                >
                  <div className="flex items-center space-x-3 truncate flex-1">
                    <div
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        task.priority === 'HIGH'
                          ? 'bg-red-500'
                          : task.priority === 'MEDIUM'
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <span className="text-sm lg:text-base text-slate-700 dark:text-slate-300 truncate font-medium">
                      {task.title}
                    </span>
                  </div>
                  <span
                    className={`text-xs whitespace-nowrap ml-3 px-2 py-1 rounded-md border ${
                      task.dueDate < todayStr
                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-800'
                        : 'bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-700'
                    }`}
                  >
                    {task.dueDate.slice(5)}
                  </span>
                </div>
              ))}
            {tasks.filter((t) => !t.completed).length === 0 && (
              <p className="text-slate-500 text-center py-6 text-sm">
                Tuyệt vời! Không có việc chờ.
              </p>
            )}
          </div>
        </div>

        <div className={`${glassClass} p-5 lg:p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BookOpen size={20} className="text-purple-500" /> Nhật ký gần đây
            </h2>
            <button
              onClick={() => setActiveTab('journal')}
              className="text-sm text-purple-500 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800 min-h-[44px]"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-4">
            {journalCtrl.data
              .slice()
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 3)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="border-l-2 border-purple-400 dark:border-purple-600 pl-4 py-1"
                >
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block mb-1">
                    {entry.date} - {entry.category}
                  </span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                    {entry.title}
                  </p>
                </div>
              ))}
            {journalCtrl.data.length === 0 && (
              <p className="text-slate-500 text-center py-6 text-sm">Chưa có nhật ký nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
