import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  RotateCcw,
  Search,
  Laptop,
  BookOpen,
  Award,
  Calendar,
  Filter,
  CheckCheck,
} from 'lucide-react';
import { LessonStatus, PPCTLesson, PPCTPlan } from '../../types';
import { localDateString } from '../../lib/date';

interface WeeklyProgressTrackerProps {
  plan: PPCTPlan;
  onUpdateLesson: (lessonId: string, updates: Partial<PPCTLesson>) => void;
  onBatchUpdateLessons: (updatedLessons: PPCTLesson[]) => void;
  glassClass: string;
  inputClass: string;
  btnSecondary: string;
  showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export function WeeklyProgressTracker({
  plan,
  onUpdateLesson,
  onBatchUpdateLessons,
  glassClass,
  inputClass,
  btnSecondary,
  showConfirm,
}: WeeklyProgressTrackerProps) {
  const [semesterFilter, setSemesterFilter] = useState<'ALL' | 1 | 2>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLessons = plan.lessons.filter((l) => {
    if (semesterFilter !== 'ALL' && l.semester !== semesterFilter) return false;
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        l.lessonName.toLowerCase().includes(term) ||
        l.topic.toLowerCase().includes(term) ||
        String(l.week).includes(term)
      );
    }
    return true;
  });

  const handleToggleComplete = (lesson: PPCTLesson) => {
    if (lesson.status === 'COMPLETED') {
      onUpdateLesson(lesson.id, {
        status: 'PENDING',
        completedDate: undefined,
      });
    } else {
      onUpdateLesson(lesson.id, {
        status: 'COMPLETED',
        completedDate: localDateString(),
      });
    }
  };

  const handleStatusChange = (lesson: PPCTLesson, newStatus: LessonStatus) => {
    onUpdateLesson(lesson.id, {
      status: newStatus,
      completedDate: newStatus === 'COMPLETED' ? lesson.completedDate || localDateString() : undefined,
    });
  };

  const handleMarkAllSemester = (sem: 1 | 2) => {
    showConfirm(
      `Đánh dấu hoàn thành Học kỳ ${sem}`,
      `Bạn có chắc chắn muốn đánh dấu toàn bộ các bài học trong Học kỳ ${sem} là ĐÃ HOÀN THÀNH?`,
      () => {
        const today = localDateString();
        const updated = plan.lessons.map((l) =>
          l.semester === sem ? { ...l, status: 'COMPLETED' as LessonStatus, completedDate: l.completedDate || today } : l,
        );
        onBatchUpdateLessons(updated);
      },
    );
  };

  const handleResetAll = () => {
    showConfirm(
      'Đặt lại toàn bộ tiến độ',
      'Bạn có chắc chắn muốn chuyển toàn bộ bài học về trạng thái CHƯA DẠY?',
      () => {
        const updated = plan.lessons.map((l) => ({
          ...l,
          status: 'PENDING' as LessonStatus,
          completedDate: undefined,
        }));
        onBatchUpdateLessons(updated);
      },
    );
  };

  const getTypeBadge = (type: PPCTLesson['type']) => {
    switch (type) {
      case 'PRACTICE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            <Laptop size={12} /> Thực hành
          </span>
        );
      case 'MIDTERM':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
            <Award size={12} /> KT Giữa kỳ
          </span>
        );
      case 'FINAL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
            <Award size={12} /> KT Cuối kỳ
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
            <RotateCcw size={12} /> Ôn tập
          </span>
        );
      case 'PROJECT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
            <BookOpen size={12} /> Dự án
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Lý thuyết
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className={`${glassClass} p-4 space-y-3`}>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm bài học, chủ đề, tuần..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10 min-h-[40px] text-xs`}
            />
          </div>

          {/* Semester Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1">
            <button
              onClick={() => setSemesterFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                semesterFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Cả năm (35T)
            </button>
            <button
              onClick={() => setSemesterFilter(1)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                semesterFilter === 1
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Học kỳ 1 (T1-18)
            </button>
            <button
              onClick={() => setSemesterFilter(2)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                semesterFilter === 2
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Học kỳ 2 (T19-35)
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${inputClass} w-auto min-h-[40px] text-xs py-1.5`}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="PENDING">Chưa dạy</option>
              <option value="DELAYED">Chậm tiến độ</option>
              <option value="MAKEUP">Dạy bù</option>
            </select>
          </div>
        </div>

        {/* Quick batch buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500">
            Hiển thị <strong>{filteredLessons.length}</strong> / {plan.lessons.length} bài học
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleMarkAllSemester(1)}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck size={14} /> Xong HK1
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleMarkAllSemester(2)}
              className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <CheckCheck size={14} /> Xong HK2
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={handleResetAll}
              className="text-[11px] font-semibold text-slate-500 hover:text-red-500 transition-colors"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-2.5">
        {filteredLessons.length === 0 ? (
          <div className={`${glassClass} p-8 text-center text-slate-500 space-y-2`}>
            <Calendar size={32} className="mx-auto opacity-30" />
            <p>Không tìm thấy bài học nào phù hợp với bộ lọc.</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => {
            const isCompleted = lesson.status === 'COMPLETED';
            const isDelayed = lesson.status === 'DELAYED';
            const isMakeup = lesson.status === 'MAKEUP';

            return (
              <div
                key={lesson.id}
                className={`${glassClass} p-3.5 sm:p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-white/40 dark:bg-slate-900/40 opacity-90'
                    : isDelayed
                    ? 'border-amber-300/80 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20'
                    : ''
                }`}
              >
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleToggleComplete(lesson)}
                    className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title={isCompleted ? 'Đánh dấu chưa dạy' : 'Đánh dấu đã hoàn thành'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={24} className="text-emerald-500" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                        Tuần {lesson.week} • Tiết {lesson.order}{lesson.periods > 1 ? `-${lesson.order + lesson.periods - 1}` : ''}
                      </span>
                      {getTypeBadge(lesson.type)}
                      <span className="text-[10px] text-slate-400">
                        {lesson.semester === 1 ? 'Học kỳ 1' : 'Học kỳ 2'}
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold text-slate-800 dark:text-white ${
                        isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : ''
                      }`}
                    >
                      {lesson.lessonName}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {lesson.topic}
                    </p>

                    {lesson.notes && (
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic">
                        📝 {lesson.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Status selector & Date */}
                <div className="flex items-center gap-2 sm:self-center pl-9 sm:pl-0">
                  <select
                    value={lesson.status}
                    onChange={(e) => handleStatusChange(lesson, e.target.value as LessonStatus)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none min-h-[34px] ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : isDelayed
                        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                        : isMakeup
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <option value="PENDING">Chưa dạy</option>
                    <option value="COMPLETED">Đã dạy xong</option>
                    <option value="DELAYED">Chậm tiến độ</option>
                    <option value="MAKEUP">Dạy bù</option>
                  </select>

                  <input
                    type="date"
                    value={lesson.completedDate || lesson.scheduledDate || ''}
                    onChange={(e) =>
                      onUpdateLesson(lesson.id, {
                        completedDate: e.target.value || undefined,
                        status: e.target.value ? 'COMPLETED' : lesson.status,
                      })
                    }
                    className="text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 min-h-[34px]"
                    title="Ngày thực dạy"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
