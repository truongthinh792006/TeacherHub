import React from 'react';
import {
  CheckSquare,
  MessageSquareQuote,
  Users,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  ChevronRight,
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
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
          Xin chào, Thầy/Cô 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2 text-sm">
          <CalendarIcon size={15} /> {todayDateStr}
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {/* Today's Tasks */}
        <div
          className={`${glassClass} p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-indigo-600`}
        >
          <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit">
            <CheckSquare size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hôm nay</p>
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
              {todayTasks}{' '}
              <span className="text-xs font-normal text-slate-400">/ {pendingTasks}</span>
            </h3>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div
          className={`${glassClass} p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-rose-500`}
        >
          <div className="p-2.5 bg-rose-500/10 text-rose-500 rounded-xl w-fit">
            <AlertCircle size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quá hạn</p>
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
              {overdueTasks}
            </h3>
          </div>
        </div>

        {/* Prompts */}
        <div
          className={`${glassClass} p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-emerald-500`}
        >
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit">
            <MessageSquareQuote size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Prompt AI</p>
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
              {promptsCtrl.data.length}
            </h3>
          </div>
        </div>

        {/* Students */}
        <div
          className={`${glassClass} p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-slate-400`}
        >
          <div className="p-2.5 bg-slate-500/10 text-slate-700 dark:text-slate-300 rounded-xl w-fit">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Học sinh</p>
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
              {studentsCtrl.data.length}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
        {/* Urgent Tasks Section */}
        <div className={`${glassClass} p-5 lg:p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock size={18} className="text-indigo-600 dark:text-indigo-400" /> Cần làm ngay
            </h2>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium py-1.5 px-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center gap-1"
            >
              Xem tất cả <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2.5">
            {tasks
              .filter((t) => !t.completed)
              .slice(0, 4)
              .map((task) => (
                <div
                  key={task.id}
                  onClick={() => setActiveTab('tasks')}
                  className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors border border-slate-200/50 dark:border-slate-700/50"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        task.priority === 'HIGH'
                          ? 'bg-rose-500'
                          : task.priority === 'MEDIUM'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0">
                    {task.dueDate}
                  </span>
                </div>
              ))}
            {tasks.filter((t) => !t.completed).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8">
                Tuyệt vời! Không còn công việc nào chưa hoàn thành.
              </p>
            )}
          </div>
        </div>

        {/* Teaching Journal Quick Peek */}
        <div className={`${glassClass} p-5 lg:p-6`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" /> Nhật ký gần đây
            </h2>
            <button
              onClick={() => setActiveTab('journal')}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-medium py-1.5 px-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-center gap-1"
            >
              Xem tất cả <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2.5">
            {journalCtrl.data.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                onClick={() => setActiveTab('journal')}
                className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors border border-slate-200/50 dark:border-slate-700/50 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {entry.title}
                  </h4>
                  <span className="text-[10px] text-slate-400">{entry.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {entry.content}
                </p>
              </div>
            ))}
            {journalCtrl.data.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-8">
                Chưa có nhật ký giảng dạy nào được ghi lại.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
