import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Plus,
  Trash2,
  Sparkles,
  Printer,
  Copy,
  Check,
  ChevronDown,
  Layers,
  BookOpen,
  FileSpreadsheet,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { PPCTLesson, PPCTPlan } from '../../types';
import { ProgressStatsCard } from './ProgressStatsCard';
import { WeeklyProgressTracker } from './WeeklyProgressTracker';
import { PlanEditorModal } from './PlanEditorModal';
import { presetGrade10 } from './ppctPresets';
import { exportPPCTToExcel } from './ppctExcelExporter';

export function PPCTPage() {
  const {
    ppctCtrl,
    showAlert,
    showConfirm,
    glassClass,
    inputClass,
    btnPrimary,
    btnSecondary,
  } = useAppContext();

  const [activePlanId, setActivePlanId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto initialize default Grade 10 plan if collection is completely empty
  useEffect(() => {
    if (ppctCtrl.data.length === 0) {
      ppctCtrl.addItem(presetGrade10);
    }
  }, [ppctCtrl]);

  // Set active plan
  useEffect(() => {
    if (ppctCtrl.data.length > 0) {
      if (!activePlanId || !ppctCtrl.data.some((p) => p.id === activePlanId)) {
        setActivePlanId(ppctCtrl.data[0].id);
      }
    }
  }, [ppctCtrl.data, activePlanId]);

  const activePlan = ppctCtrl.data.find((p) => p.id === activePlanId) || ppctCtrl.data[0];

  const handleUpdateLesson = (lessonId: string, updates: Partial<PPCTLesson>) => {
    if (!activePlan) return;
    const updatedLessons = activePlan.lessons.map((l) =>
      l.id === lessonId ? { ...l, ...updates } : l,
    );
    ppctCtrl.updateItem(activePlan.id, { lessons: updatedLessons });
  };

  const handleBatchUpdateLessons = (updatedLessons: PPCTLesson[]) => {
    if (!activePlan) return;
    ppctCtrl.updateItem(activePlan.id, { lessons: updatedLessons });
  };

  const handleCreatePlan = (
    planData: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    ppctCtrl.addItem(planData);
    showAlert('Đã tạo Kế hoạch', `Đã thêm kế hoạch "${planData.title}" vào danh sách!`);
  };

  const handleDeletePlan = () => {
    if (!activePlan) return;
    if (ppctCtrl.data.length <= 1) {
      showAlert('Không thể xóa', 'Bạn cần giữ lại ít nhất 1 Kế hoạch PPCT trong hệ thống.');
      return;
    }
    showConfirm(
      'Xóa Kế hoạch PPCT',
      `Bạn có chắc chắn muốn xóa kế hoạch "${activePlan.title}"? Dữ liệu tiến độ của kế hoạch này sẽ bị mất.`,
      () => {
        ppctCtrl.deleteItem(activePlan.id);
        const remaining = ppctCtrl.data.filter((p) => p.id !== activePlan.id);
        if (remaining.length > 0) {
          setActivePlanId(remaining[0].id);
        }
      },
    );
  };

  const handleExportMarkdown = () => {
    if (!activePlan) return;
    let md = `# KẾ HOẠCH PHÂN PHỐI CHƯƠNG TRÌNH & TIẾN ĐỘ GIẢNG DẠY\n\n`;
    md += `- **Môn học:** Tin học Lớp ${activePlan.grade}\n`;
    md += `- **Kế hoạch:** ${activePlan.title}\n`;
    md += `- **Năm học:** ${activePlan.academicYear}\n`;
    md += `- **Lớp phụ trách:** ${activePlan.assignedClasses || 'Tất cả'}\n`;
    md += `- **Tổng số:** ${activePlan.totalPeriods} tiết / ${activePlan.totalWeeks} tuần\n\n`;
    md += `| Tuần | Tiết | Học kỳ | Tên bài học / Nhiệm vụ | Thể loại | Trạng thái | Ngày dạy |\n`;
    md += `| :---: | :---: | :---: | :--- | :---: | :---: | :---: |\n`;

    activePlan.lessons.forEach((l) => {
      const typeStr =
        l.type === 'PRACTICE'
          ? 'Thực hành'
          : l.type === 'MIDTERM'
          ? 'KT Giữa kỳ'
          : l.type === 'FINAL'
          ? 'KT Cuối kỳ'
          : l.type === 'REVIEW'
          ? 'Ôn tập'
          : l.type === 'PROJECT'
          ? 'Dự án'
          : 'Lý thuyết';
      const statusStr =
        l.status === 'COMPLETED'
          ? 'Đã dạy'
          : l.status === 'DELAYED'
          ? 'Chậm'
          : l.status === 'MAKEUP'
          ? 'Dạy bù'
          : 'Chưa dạy';
      md += `| ${l.week} | ${l.order}${l.periods > 1 ? `-${l.order + l.periods - 1}` : ''} | HK${l.semester} | ${l.lessonName} | ${typeStr} | ${statusStr} | ${l.completedDate || '-'} |\n`;
    });

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      showAlert(
        'Đã sao chép Bảng PPCT',
        'Đã sao chép toàn bộ tiến độ phân phối chương trình dưới dạng Bảng Markdown!',
      );
    });
  };

  const handleExportExcel = () => {
    if (!activePlan) return;
    try {
      exportPPCTToExcel(activePlan);
      showAlert(
        'Xuất Excel thành công',
        `Đã xuất tệp bảng tính Excel Kế hoạch dạy học môn Tin học Khối ${activePlan.grade} (${activePlan.totalPeriods} tiết) chuẩn mẫu giáo dục!`,
      );
    } catch (err) {
      console.error('Error exporting Excel:', err);
      showAlert('Lỗi xuất Excel', 'Không thể tạo tệp Excel, vui lòng thử lại.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
              <CalendarDays size={22} />
            </div>
            Phân phối chương trình & Tiến độ
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Theo dõi tiến độ 35 tuần giảng dạy môn Tin học THPT theo chuẩn GDPT 2018.
          </p>
        </div>

        {/* Plan Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className={btnPrimary}
          >
            <Plus size={18} /> Thêm Kế hoạch
          </button>

          <button
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-4 py-2.5 min-h-[42px] rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 text-xs shadow-sm"
            title="Xuất bảng phân phối chương trình ra tệp Excel .xlsx chuẩn sư phạm"
          >
            <FileSpreadsheet size={17} />
            <span>Xuất Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportMarkdown}
            className={btnSecondary}
            title="Sao chép bảng tiến độ Markdown để in ấn hoặc báo cáo"
          >
            {copied ? <Check size={17} className="text-emerald-500" /> : <Copy size={17} />}
            <span className="hidden sm:inline">Xuất Bảng MD</span>
          </button>
        </div>
      </div>

      {/* Plan Selector Dropdown Bar */}
      {ppctCtrl.data.length > 0 && (
        <div className={`${glassClass} p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="flex items-center gap-3 flex-1 overflow-hidden">
            <Layers className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" size={20} />
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] uppercase font-bold text-slate-400">
                Kế hoạch đang theo dõi:
              </label>
              <select
                value={activePlan?.id || ''}
                onChange={(e) => setActivePlanId(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-800 dark:text-white outline-none cursor-pointer"
              >
                {ppctCtrl.data.map((p) => (
                  <option key={p.id} value={p.id} className="text-slate-900 dark:text-slate-100 dark:bg-slate-800">
                    {p.title} {p.assignedClasses ? `(${p.assignedClasses})` : ''} - Năm học {p.academicYear}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleDeletePlan}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors text-xs flex items-center gap-1"
              title="Xóa kế hoạch này"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Xóa Kế hoạch</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {activePlan ? (
        <div className="space-y-6">
          <ProgressStatsCard plan={activePlan} glassClass={glassClass} />

          <WeeklyProgressTracker
            plan={activePlan}
            onUpdateLesson={handleUpdateLesson}
            onBatchUpdateLessons={handleBatchUpdateLessons}
            glassClass={glassClass}
            inputClass={inputClass}
            btnSecondary={btnSecondary}
            showConfirm={showConfirm}
          />
        </div>
      ) : (
        <div className={`${glassClass} p-12 text-center text-slate-500 space-y-4`}>
          <BookOpen size={48} className="mx-auto opacity-30 text-blue-500" />
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Chưa có Kế hoạch Phân phối chương trình
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hãy tạo kế hoạch mới từ mẫu chuẩn GDPT 2018 (Khối 10, 11, 12) để bắt đầu theo dõi tiến độ.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className={`${btnPrimary} mx-auto`}
          >
            <Plus size={18} /> Khởi tạo Kế hoạch ngay
          </button>
        </div>
      )}

      {/* Modal */}
      <PlanEditorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSavePlan={handleCreatePlan}
        inputClass={inputClass}
        btnPrimary={btnPrimary}
        btnSecondary={btnSecondary}
      />
    </div>
  );
}
