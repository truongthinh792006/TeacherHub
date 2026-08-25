import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  Sparkles,
  Award,
} from 'lucide-react';
import { PPCTPlan } from '../../types';

interface ProgressStatsCardProps {
  plan: PPCTPlan;
  glassClass: string;
}

export function ProgressStatsCard({ plan, glassClass }: ProgressStatsCardProps) {
  const totalLessons = plan.lessons.length;
  const completedLessons = plan.lessons.filter((l) => l.status === 'COMPLETED').length;
  const delayedLessons = plan.lessons.filter((l) => l.status === 'DELAYED').length;
  const makeupLessons = plan.lessons.filter((l) => l.status === 'MAKEUP').length;
  const pendingLessons = plan.lessons.filter((l) => l.status === 'PENDING').length;

  const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find next milestone
  const nextMilestone = plan.lessons.find(
    (l) => (l.type === 'MIDTERM' || l.type === 'FINAL') && l.status !== 'COMPLETED',
  );

  return (
    <div className="space-y-4">
      <div className={`${glassClass} p-5 space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg">
                Khối {plan.grade} • {plan.track === 'ICT' ? 'Tin học Ứng dụng' : plan.track === 'CS' ? 'Khoa học Máy tính' : 'Chuẩn GDPT 2018'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Năm học {plan.academicYear}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mt-1.5">
              {plan.title}
            </h2>
            {plan.assignedClasses && (
              <p className="text-xs text-slate-500">Lớp áp dụng: <strong>{plan.assignedClasses}</strong></p>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                {percentage}%
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {completedLessons}/{totalLessons} bài đã dạy
              </p>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 rounded-lg">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {completedLessons}
              </span>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400">Đã hoàn thành</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
              <Clock size={18} />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {pendingLessons}
              </span>
              <p className="text-[11px] text-slate-500">Chưa dạy</p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/60 text-amber-600 rounded-lg">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-300">
                {delayedLessons}
              </span>
              <p className="text-[11px] text-amber-600/80 dark:text-amber-400">Chậm tiến độ</p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 p-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/60 text-blue-600 rounded-lg">
              <Calendar size={18} />
            </div>
            <div>
              <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                {makeupLessons}
              </span>
              <p className="text-[11px] text-blue-600/80 dark:text-blue-400">Dạy bù / Điều chỉnh</p>
            </div>
          </div>
        </div>

        {/* Milestone Banner */}
        {nextMilestone && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl text-xs">
            <Award className="text-purple-600 flex-shrink-0" size={20} />
            <div className="flex-1 overflow-hidden">
              <span className="font-bold text-purple-900 dark:text-purple-200">
                Cột mốc đánh giá tiếp theo:
              </span>{' '}
              <span className="text-purple-700 dark:text-purple-300">
                Tuần {nextMilestone.week} - {nextMilestone.lessonName}
              </span>
            </div>
          </div>
        )}

        {/* Warning if delayed */}
        {delayedLessons > 0 && (
          <div className="flex items-center gap-2.5 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 rounded-xl text-xs">
            <AlertTriangle size={18} className="flex-shrink-0" />
            <span>
              Bạn đang có <strong>{delayedLessons} bài học bị chậm tiến độ</strong>. Hãy lên lịch dạy bù để kịp kiểm tra định kỳ!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
