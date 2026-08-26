import React, { useState, useEffect } from 'react';
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
  Sparkles,
  BookOpenCheck,
  FileText,
  Table,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Edit3,
  Pencil,
  Plus,
  Trash2,
  ListOrdered,
} from 'lucide-react';
import { LessonStatus, PPCTLesson, PPCTPlan } from '../../types';
import { localDateString } from '../../lib/date';
import {
  LessonAIGeneratorModal,
  AIGeneratorTab,
} from './LessonAIGeneratorModal';
import { LessonDetailEditorModal } from './LessonDetailEditorModal';

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
  const [editMode, setEditMode] = useState(false);

  // AI Generator Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<PPCTLesson | null>(null);
  const [selectedAITab, setSelectedAITab] = useState<AIGeneratorTab>('khbd');
  const [openDropdownLessonId, setOpenDropdownLessonId] = useState<string | null>(null);

  // Lesson Detail Editor Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<PPCTLesson | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownLessonId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

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

  const openAIGenerator = (lesson: PPCTLesson, tab: AIGeneratorTab) => {
    setSelectedLesson(lesson);
    setSelectedAITab(tab);
    setAiModalOpen(true);
    setOpenDropdownLessonId(null);
  };

  // Lesson Editing Operations
  const handleOpenEditLesson = (lesson: PPCTLesson) => {
    setEditingLesson(lesson);
    setDetailModalOpen(true);
  };

  const handleAddNewLesson = () => {
    const lastLesson = plan.lessons[plan.lessons.length - 1];
    const newLesson: PPCTLesson = {
      id: `lesson-${Date.now()}`,
      order: (lastLesson?.order || 0) + (lastLesson?.periods || 1),
      week: Math.min(35, (lastLesson?.week || 1) + 1),
      semester: (lastLesson?.week || 1) >= 18 ? 2 : 1,
      topic: 'Chủ đề mới',
      lessonName: 'Bài học mới',
      periods: 2,
      type: 'LESSON',
      status: 'PENDING',
    };
    setEditingLesson(newLesson);
    setDetailModalOpen(true);
  };

  const handleSaveLessonDetail = (updatedLesson: PPCTLesson) => {
    const exists = plan.lessons.some((l) => l.id === updatedLesson.id);
    let updatedList: PPCTLesson[];
    if (exists) {
      updatedList = plan.lessons.map((l) =>
        l.id === updatedLesson.id ? updatedLesson : l,
      );
    } else {
      updatedList = [...plan.lessons, updatedLesson];
    }
    onBatchUpdateLessons(updatedList);
  };

  const handleDeleteLesson = (lessonId: string, lessonName: string) => {
    showConfirm(
      'Xóa bài học',
      `Bạn có chắc chắn muốn xóa bài học "${lessonName}" khỏi kế hoạch phân phối chương trình?`,
      () => {
        const updatedList = plan.lessons.filter((l) => l.id !== lessonId);
        onBatchUpdateLessons(updatedList);
      },
    );
  };

  const handleMoveLesson = (lessonId: string, direction: 'UP' | 'DOWN') => {
    const index = plan.lessons.findIndex((l) => l.id === lessonId);
    if (index === -1) return;
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= plan.lessons.length) return;

    const newLessons = [...plan.lessons];
    const temp = newLessons[index];
    newLessons[index] = newLessons[targetIndex];
    newLessons[targetIndex] = temp;

    // Recalculate order numbers continuously
    let curr = 1;
    const recalculated = newLessons.map((l) => {
      const item = { ...l, order: curr };
      curr += l.periods;
      return item;
    });

    onBatchUpdateLessons(recalculated);
  };

  const handleAutoRecalculatePeriods = () => {
    showConfirm(
      'Tính lại tiết PPCT liên tục',
      'Tự động đánh lại số tiết PPCT bắt đầu từ tiết 1 liên tục theo số tiết của từng bài học?',
      () => {
        let curr = 1;
        const recalculated = plan.lessons.map((l) => {
          const item = { ...l, order: curr };
          curr += l.periods;
          return item;
        });
        onBatchUpdateLessons(recalculated);
      },
    );
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'PRACTICE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Laptop size={11} /> Thực hành
          </span>
        );
      case 'MIDTERM':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Award size={11} /> Giữa kỳ
          </span>
        );
      case 'FINAL':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <Award size={11} /> Cuối kỳ
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <RotateCcw size={11} /> Ôn tập
          </span>
        );
      case 'PROJECT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <BookOpen size={11} /> Dự án
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
            <BookOpen size={11} /> Lý thuyết
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className={`${glassClass} p-3.5 sm:p-4 space-y-3`}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Semester Tabs */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              onClick={() => setSemesterFilter('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                semesterFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Cả năm (35T)
            </button>
            <button
              onClick={() => setSemesterFilter(1)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                semesterFilter === 1
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Học kỳ 1 (T1-18)
            </button>
            <button
              onClick={() => setSemesterFilter(2)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                semesterFilter === 2
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Học kỳ 2 (T19-35)
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-52">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Tìm bài học, chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} pl-9 pr-3 py-1.5 text-xs min-h-[38px]`}
              />
            </div>

            <Filter size={16} className="text-slate-400 hidden sm:inline" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${inputClass} w-auto min-h-[38px] text-xs py-1.5`}
            >
              <option value="ALL">Tất cả</option>
              <option value="COMPLETED">Đã dạy</option>
              <option value="PENDING">Chưa dạy</option>
              <option value="DELAYED">Chậm</option>
              <option value="MAKEUP">Dạy bù</option>
            </select>

            {/* Toggle Edit Mode Button */}
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[38px] ${
                editMode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60'
              }`}
              title="Bật/Tắt chế độ chỉnh sửa bài học, thêm dòng, xóa dòng"
            >
              <Edit3 size={14} />
              <span className="hidden sm:inline">Chỉnh sửa</span>
            </button>
          </div>
        </div>

        {/* Quick batch buttons & Edit toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">
              Hiển thị <strong>{filteredLessons.length}</strong> / {plan.lessons.length} bài học
            </span>
            {editMode && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Đang ở Chế độ Chỉnh sửa
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <button
                  onClick={handleAddNewLesson}
                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Thêm bài học
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  onClick={handleAutoRecalculatePeriods}
                  className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  title="Tự động tính lại số thứ tự tiết từ tiết 1"
                >
                  <ListOrdered size={14} /> Tính lại tiết
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleMarkAllSemester(1)}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={14} /> Xong HK1
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  onClick={() => handleMarkAllSemester(2)}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={14} /> Xong HK2
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  onClick={handleResetAll}
                  className="text-[11px] font-semibold text-slate-500 hover:text-rose-500 transition-colors"
                >
                  Đặt lại
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-2.5">
        {filteredLessons.length === 0 ? (
          <div className={`${glassClass} p-8 text-center text-slate-500 space-y-2`}>
            <Calendar size={32} className="mx-auto opacity-30" />
            <p>Không tìm thấy bài học nào phù hợp với bộ lọc.</p>
            {editMode && (
              <button
                onClick={handleAddNewLesson}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs inline-flex items-center gap-1.5"
              >
                <Plus size={14} /> Thêm bài học đầu tiên
              </button>
            )}
          </div>
        ) : (
          filteredLessons.map((lesson, idx) => {
            const isCompleted = lesson.status === 'COMPLETED';
            const isDelayed = lesson.status === 'DELAYED';
            const isMakeup = lesson.status === 'MAKEUP';
            const isMenuOpen = openDropdownLessonId === lesson.id;
            const fullIndex = plan.lessons.findIndex((l) => l.id === lesson.id);

            return (
              <div
                key={lesson.id}
                className={`${glassClass} p-3.5 sm:p-4 transition-all hover:border-slate-300 dark:hover:border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-3 relative ${
                  isCompleted
                    ? 'bg-white/40 dark:bg-slate-900/40 opacity-90'
                    : isDelayed
                    ? 'border-amber-300/80 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20'
                    : ''
                }`}
              >
                {/* Left: Reorder controls (in edit mode) or Checkbox */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {editMode ? (
                    <div className="flex flex-col items-center gap-0.5 mt-0.5 flex-shrink-0">
                      <button
                        onClick={() => handleMoveLesson(lesson.id, 'UP')}
                        disabled={fullIndex === 0}
                        className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                        title="Di chuyển lên"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveLesson(lesson.id, 'DOWN')}
                        disabled={fullIndex === plan.lessons.length - 1}
                        className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                        title="Di chuyển xuống"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggleComplete(lesson)}
                      className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title={isCompleted ? 'Đánh dấu chưa dạy' : 'Đánh dấu đã hoàn thành'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={22} className="text-emerald-500" />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>
                  )}

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                        Tuần {lesson.week} • Tiết {lesson.order}{lesson.periods > 1 ? `-${lesson.order + lesson.periods - 1}` : ''}
                      </span>
                      {getTypeBadge(lesson.type)}
                      <span className="text-[10px] text-slate-400">
                        {lesson.semester === 1 ? 'Học kỳ 1' : 'Học kỳ 2'}
                      </span>

                      {/* Competencies Badges */}
                      {lesson.competencies && lesson.competencies.length > 0 && (
                        <div className="flex items-center gap-1">
                          {lesson.competencies.map((comp) => (
                            <span
                              key={comp}
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50"
                              title={`Mã năng lực: ${comp}`}
                            >
                              {comp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-bold text-slate-900 dark:text-white ${
                          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {lesson.lessonName}
                      </h4>
                      {/* Quick Edit icon button */}
                      <button
                        onClick={() => handleOpenEditLesson(lesson)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Chỉnh sửa chi tiết bài học này"
                      >
                        <Pencil size={12} />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {lesson.topic}
                    </p>

                    {lesson.notes && (
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 italic">
                        📝 {lesson.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: AI Tools + Actions */}
                <div className="flex flex-wrap items-center gap-2 lg:self-center pl-8 lg:pl-0">
                  {/* Delete & Edit Buttons in Edit Mode */}
                  {editMode ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditLesson(lesson)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1"
                      >
                        <Edit3 size={13} /> Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id, lesson.lessonName)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Xóa bài học này"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ) : null}

                  {/* AI Assistant Button & Dropdown Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownLessonId(isMenuOpen ? null : lesson.id);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 shadow-sm transition-colors"
                      title="Mở Trợ lý AI tạo tài liệu theo bài học"
                    >
                      <Sparkles size={13} className="text-indigo-600 dark:text-indigo-400" />
                      <span>Trợ lý AI</span>
                      <ChevronDown size={12} className={`transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Popover */}
                    {isMenuOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                      >
                        <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                          Sinh tài liệu AI theo bài học
                        </div>

                        {/* Option 1: KHBD 5512 */}
                        <button
                          onClick={() => openAIGenerator(lesson, 'khbd')}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 flex items-start gap-2.5 transition-colors group"
                        >
                          <BookOpenCheck size={16} className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              📄 Tạo KHBD 5512
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Giáo án 4 hoạt động chuẩn CV 5512
                            </p>
                          </div>
                        </button>

                        {/* Option 2: Bản đặc tả */}
                        <button
                          onClick={() => openAIGenerator(lesson, 'spec')}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 flex items-start gap-2.5 transition-colors group"
                        >
                          <FileText size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              📋 Tạo Bản đặc tả
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Đặc tả 3 dạng thức kèm mã năng lực
                            </p>
                          </div>
                        </button>

                        {/* Option 3: Ma trận CV 7991 */}
                        <button
                          onClick={() => openAIGenerator(lesson, 'matrix')}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 flex items-start gap-2.5 transition-colors group"
                        >
                          <Table size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              📊 Tạo Ma trận (CV 7991)
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Ma trận kiểm tra chuẩn 17/12/2024
                            </p>
                          </div>
                        </button>

                        {/* Option 4: Đề trắc nghiệm 3 dạng thức */}
                        <button
                          onClick={() => openAIGenerator(lesson, 'quiz')}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 flex items-start gap-2.5 transition-colors group"
                        >
                          <HelpCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              ❓ Tạo Đề trắc nghiệm 3 dạng thức
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Bộ đề thi chuẩn bám sát YCCĐ của bài
                            </p>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status Selector */}
                  <select
                    value={lesson.status}
                    onChange={(e) => handleStatusChange(lesson, e.target.value as LessonStatus)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-none min-h-[34px] ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400'
                        : isDelayed
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400'
                        : isMakeup
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <option value="PENDING">Chưa dạy</option>
                    <option value="COMPLETED">Đã dạy xong</option>
                    <option value="DELAYED">Chậm tiến độ</option>
                    <option value="MAKEUP">Dạy bù</option>
                  </select>

                  {/* Date Input */}
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

      {/* Lesson AI Generator Modal */}
      <LessonAIGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        lesson={selectedLesson}
        plan={plan}
        initialTab={selectedAITab}
      />

      {/* Lesson Detail Editor Modal */}
      <LessonDetailEditorModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        lesson={editingLesson}
        onSave={handleSaveLessonDetail}
        inputClass={inputClass}
        btnPrimary="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 text-xs shadow-sm"
        btnSecondary={btnSecondary}
      />
    </div>
  );
}
