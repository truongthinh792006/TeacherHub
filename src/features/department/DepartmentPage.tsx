import React, { useState } from 'react';
import {
  Briefcase,
  FileCheck2,
  FileText,
  Users,
  Plus,
  Trash2,
  Edit,
  Printer,
  Search,
  Award,
  Calendar,
  Layers,
  Laptop,
  CheckCircle2,
  Sparkles,
  BookOpenCheck,
  FileSpreadsheet,
  FileDown,
  ExternalLink,
  Filter,
  Monitor,
  HardDrive,
  Network,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import {
  DepartmentMeetingRecord,
  DepartmentRecord,
  LessonEvaluationRecord,
  TeacherAssignmentRecord,
} from '../../types';
import { LessonObservationForm } from './LessonObservationForm';
import { MeetingMinutesModal } from './MeetingMinutesModal';
import { TeacherAssignmentModal } from './TeacherAssignmentModal';
import { PrintEvaluationView } from './PrintEvaluationView';
import { PrintMeetingView } from './PrintMeetingView';
import {
  exportAppendix1Word,
  exportAppendix2Word,
  exportLessonEvaluationWord,
  exportMeetingMinutesWord,
} from './departmentDocxExporter';
import {
  exportDepartmentAppendix1Excel,
  exportTeacherAssignmentsExcel,
} from './departmentExcelExporter';

type DepartmentSubTab =
  | 'plan-appendix1'
  | 'plan-appendix2'
  | 'meetings'
  | 'evaluations';

export function DepartmentPage() {
  const {
    departmentCtrl,
    ppctCtrl,
    setActiveTab: setMainActiveTab,
    showAlert,
    showConfirm,
    glassClass,
    inputClass,
    btnPrimary,
    btnSecondary,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<DepartmentSubTab>('plan-appendix1');
  const [searchTerm, setSearchTerm] = useState('');
  const [meetingTopicFilter, setMeetingTopicFilter] = useState<string>('ALL');
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');

  // Modals state
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [editingEval, setEditingEval] = useState<LessonEvaluationRecord | null>(null);
  const [printingEval, setPrintingEval] = useState<LessonEvaluationRecord | null>(null);

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<DepartmentMeetingRecord | null>(null);
  const [printingMeeting, setPrintingMeeting] = useState<DepartmentMeetingRecord | null>(null);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editingAssign, setEditingAssign] = useState<TeacherAssignmentRecord | null>(null);

  // Filter records by type
  const evaluations = departmentCtrl.data.filter(
    (r): r is LessonEvaluationRecord => r.recordType === 'EVALUATION',
  );
  const meetings = departmentCtrl.data.filter(
    (r): r is DepartmentMeetingRecord => r.recordType === 'MEETING',
  );
  const assignments = departmentCtrl.data.filter(
    (r): r is TeacherAssignmentRecord => r.recordType === 'ASSIGNMENT',
  );

  // Statistics
  const totalEvaluations = evaluations.length;
  const goodEvaluations = evaluations.filter((e) => e.rating === 'GIOI').length;
  const totalMeetings = meetings.length;
  const totalTeachers = assignments.length;
  const totalPeriods = assignments.reduce((acc, a) => acc + (a.periodsPerWeek || 0), 0);

  // CRUD Handlers
  const handleSaveEval = (
    recordData: Omit<LessonEvaluationRecord, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    if (editingEval) {
      departmentCtrl.updateItem(editingEval.id, recordData);
      showAlert('Thành công', 'Đã cập nhật phiếu dự giờ!');
      setEditingEval(null);
    } else {
      departmentCtrl.addItem(recordData);
      showAlert('Thành công', 'Đã lưu phiếu dự giờ mới!');
    }
  };

  const handleSaveMeeting = (
    recordData: Omit<DepartmentMeetingRecord, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    if (editingMeeting) {
      departmentCtrl.updateItem(editingMeeting.id, recordData);
      showAlert('Thành công', 'Đã cập nhật biên bản họp tổ!');
      setEditingMeeting(null);
    } else {
      departmentCtrl.addItem(recordData);
      showAlert('Thành công', 'Đã lưu biên bản họp tổ mới!');
    }
  };

  const handleSaveAssign = (
    recordData: Omit<TeacherAssignmentRecord, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    if (editingAssign) {
      departmentCtrl.updateItem(editingAssign.id, recordData);
      showAlert('Thành công', 'Đã cập nhật phân công giáo viên!');
      setEditingAssign(null);
    } else {
      departmentCtrl.addItem(recordData);
      showAlert('Thành công', 'Đã thêm giáo viên vào tổ chuyên môn!');
    }
  };

  const handleDeleteRecord = (id: string, name: string) => {
    showConfirm('Xác nhận xóa', `Bạn có chắc chắn muốn xóa bản ghi "${name}"?`, () => {
      departmentCtrl.deleteItem(id);
    });
  };

  const handleExportAppendix1Docx = () => {
    try {
      exportAppendix1Word(ppctCtrl.data);
      showAlert(
        'Xuất Word thành công',
        'Đã tải tệp Word Kế hoạch dạy học của Tổ chuyên môn (Phụ lục 1 CV 5512)!',
      );
    } catch (err) {
      console.error(err);
      showAlert('Lỗi', 'Không thể tạo tệp Word.');
    }
  };

  const handleExportAppendix1Excel = () => {
    try {
      exportDepartmentAppendix1Excel(ppctCtrl.data);
      showAlert(
        'Xuất Excel thành công',
        'Đã tải tệp Excel Kế hoạch dạy học và thiết bị phòng máy (Phụ lục 1 CV 5512)!',
      );
    } catch (err) {
      console.error(err);
      showAlert('Lỗi', 'Không thể tạo tệp Excel.');
    }
  };

  const handleExportAssignmentsExcel = () => {
    try {
      exportTeacherAssignmentsExcel(assignments);
      showAlert(
        'Xuất Excel thành công',
        'Đã tải tệp Excel Bảng phân công chuyên môn và lịch phòng máy (Phụ lục 2)!',
      );
    } catch (err) {
      console.error(err);
      showAlert('Lỗi', 'Không thể tạo tệp Excel.');
    }
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'GIOI':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Loại Giỏi
          </span>
        );
      case 'KHA':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Loại Khá
          </span>
        );
      case 'DAT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Loại Đạt
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Chưa Đạt
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Briefcase size={22} />
            </div>
            Quản lý Tổ Chuyên môn (CV 5512)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Hồ sơ chuyên môn GDPT 2018: Kế hoạch dạy học (PL1), Kế hoạch giáo viên (PL2), Biên bản sinh hoạt tổ và Sổ dự giờ (CV 5555).
          </p>
        </div>

        {/* Global Tab Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'plan-appendix1' && (
            <>
              <button
                onClick={handleExportAppendix1Excel}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3.5 py-2 min-h-[40px] rounded-xl font-semibold transition-colors flex items-center gap-1.5 text-xs shadow-sm"
                title="Xuất Excel Kế hoạch dạy học & thiết bị phòng máy (PL1)"
              >
                <FileSpreadsheet size={16} />
                <span>Xuất Excel (.xlsx)</span>
              </button>
              <button
                onClick={handleExportAppendix1Docx}
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-3.5 py-2 min-h-[40px] rounded-xl font-semibold transition-colors flex items-center gap-1.5 text-xs shadow-sm"
                title="Xuất Word Kế hoạch dạy học của Tổ chuyên môn"
              >
                <FileDown size={16} />
                <span>Xuất Word (.doc)</span>
              </button>
            </>
          )}

          {activeTab === 'plan-appendix2' && (
            <>
              <button
                onClick={handleExportAssignmentsExcel}
                className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-3.5 py-2 min-h-[40px] rounded-xl font-semibold transition-colors flex items-center gap-1.5 text-xs shadow-sm"
                title="Xuất bảng Excel phân công chuyên môn"
              >
                <FileSpreadsheet size={16} />
                <span>Xuất Excel</span>
              </button>
              <button
                onClick={() => {
                  setEditingAssign(null);
                  setAssignModalOpen(true);
                }}
                className={btnPrimary}
              >
                <Plus size={16} /> Thêm Giáo viên
              </button>
            </>
          )}

          {activeTab === 'meetings' && (
            <button
              onClick={() => {
                setEditingMeeting(null);
                setMeetingModalOpen(true);
              }}
              className={btnPrimary}
            >
              <Plus size={16} /> Tạo Biên bản Họp
            </button>
          )}

          {activeTab === 'evaluations' && (
            <button
              onClick={() => {
                setEditingEval(null);
                setEvalModalOpen(true);
              }}
              className={btnPrimary}
            >
              <Plus size={16} /> Tạo Phiếu Dự giờ
            </button>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`${glassClass} p-3.5 sm:p-4 flex items-center gap-3`}>
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <BookOpenCheck size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {ppctCtrl.data.length}
            </span>
            <p className="text-[11px] text-slate-500">Khung PPCT các khối</p>
          </div>
        </div>

        <div className={`${glassClass} p-3.5 sm:p-4 flex items-center gap-3`}>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {totalTeachers}
            </span>
            <p className="text-[11px] text-slate-500">Giáo viên ({totalPeriods} tiết/tuần)</p>
          </div>
        </div>

        <div className={`${glassClass} p-3.5 sm:p-4 flex items-center gap-3`}>
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {totalMeetings}
            </span>
            <p className="text-[11px] text-slate-500">Biên bản sinh hoạt tổ</p>
          </div>
        </div>

        <div className={`${glassClass} p-3.5 sm:p-4 flex items-center gap-3`}>
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-xl">
            <FileCheck2 size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {totalEvaluations}
            </span>
            <p className="text-[11px] text-slate-500">Tiết dự giờ ({goodEvaluations} Giỏi)</p>
          </div>
        </div>
      </div>

      {/* 4 Official Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
        <button
          onClick={() => setActiveTab('plan-appendix1')}
          className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'plan-appendix1'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpenCheck size={16} />
          <span>Kế hoạch Dạy học (PL1)</span>
        </button>

        <button
          onClick={() => setActiveTab('plan-appendix2')}
          className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'plan-appendix2'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users size={16} />
          <span>Kế hoạch Giáo viên (PL2)</span>
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'meetings'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText size={16} />
          <span>Biên bản Sinh hoạt tổ</span>
        </button>

        <button
          onClick={() => setActiveTab('evaluations')}
          className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            activeTab === 'evaluations'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCheck2 size={16} />
          <span>Sổ Dự giờ & Đánh giá</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: KẾ HOẠCH DẠY HỌC (PHỤ LỤC 1 - CV 5512) */}
      {/* ========================================================================= */}
      {activeTab === 'plan-appendix1' && (
        <div className="space-y-6">
          {/* Section I: Khung PPCT các khối */}
          <div className={`${glassClass} p-4 sm:p-5 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={18} className="text-indigo-600 dark:text-indigo-400" />
                  I. Khung Phân phối chương trình các khối lớp (Tin học THPT)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Thời lượng chuẩn: 70 tiết / 35 tuần theo chương trình GDPT 2018.
                </p>
              </div>

              <button
                onClick={() => setMainActiveTab('ppct')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Xem phân hệ PPCT</span>
                <ExternalLink size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {ppctCtrl.data.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono">
                      Khối {plan.grade} • {plan.track}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {plan.academicYear}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {plan.title}
                  </h4>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p>• {plan.lessons.length} bài học và hoạt động giáo dục</p>
                    <p>• Tổng số: {plan.totalPeriods} tiết / {plan.totalWeeks} tuần thực học</p>
                    <p>• Lớp phụ trách: {plan.assignedClasses || 'Toàn khối'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section II: Kế hoạch phòng máy & thiết bị */}
          <div className={`${glassClass} p-4 sm:p-5 space-y-4`}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Monitor size={18} className="text-blue-600 dark:text-blue-400" />
                II. Kế hoạch Thiết bị dạy học và Phòng máy tính thực hành
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bố trí phòng máy và phương tiện phục vụ các tiết thực hành theo đúng PPCT.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Phòng thực hành / Thiết bị</th>
                    <th className="p-3">Số lượng</th>
                    <th className="p-3">Tình trạng kỹ thuật</th>
                    <th className="p-3">Khối lớp sử dụng</th>
                    <th className="p-3">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Phòng máy tính 1 (Phòng A)
                    </td>
                    <td className="p-3">46 máy tính</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">
                      Hoạt động tốt, mạng LAN/Internet 150Mbps
                    </td>
                    <td className="p-3">Khối 10, Khối 12</td>
                    <td className="p-3">Thực hành lập trình & thiết kế Web</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Phòng máy tính 2 (Phòng B)
                    </td>
                    <td className="p-3">41 máy tính</td>
                    <td className="p-3 text-emerald-600 dark:text-emerald-400 font-medium">
                      Cài đặt VS Code, Python, Office, GIMP
                    </td>
                    <td className="p-3">Khối 11, Khối 12</td>
                    <td className="p-3">Thực hành mạng máy tính & đồ họa</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Bộ thiết bị mạng thực hành
                    </td>
                    <td className="p-3">04 bộ</td>
                    <td className="p-3">Switch, Router Wi-Fi, Kìm bấm cáp</td>
                    <td className="p-3">Khối 12 (Bài 3, 4, 5, 22)</td>
                    <td className="p-3">Thực hành kết nối mạng nội bộ</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      Máy chiếu & Tivi tương tác
                    </td>
                    <td className="p-3">02 bộ</td>
                    <td className="p-3">Độ nét cao, kết nối không dây HDMI</td>
                    <td className="p-3">Các khối lớp</td>
                    <td className="p-3">Trình chiếu bài giảng điện tử số hóa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section III: Kế hoạch kiểm tra định kỳ (CV 7991) */}
          <div className={`${glassClass} p-4 sm:p-5 space-y-4`}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={18} className="text-amber-600 dark:text-amber-400" />
                III. Kế hoạch Kiểm tra, Đánh giá định kỳ (Theo chuẩn CV 7991/BGDĐT-GDTrH)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cấu trúc đề kiểm tra đánh giá năng lực 3 dạng thức mới: Nhiều lựa chọn, Đúng/Sai đa ý và Trả lời ngắn.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                    Giữa Học kỳ 1
                  </span>
                  <span className="text-[10px] text-slate-400">Tuần 9 - 10</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Kiểm tra Giữa kỳ I (45 phút)
                </h4>
                <p className="text-[11px] text-slate-500">
                  • Hình thức: Trắc nghiệm 3 dạng thức khách quan trên máy tính/giấy
                </p>
                <p className="text-[11px] text-slate-500">• Tỷ lệ: 40% Biết - 30% Hiểu - 20% VD - 10% VDC</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    Cuối Học kỳ 1
                  </span>
                  <span className="text-[10px] text-slate-400">Tuần 18</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Kiểm tra Cuối kỳ I (45 phút)
                </h4>
                <p className="text-[11px] text-slate-500">
                  • Hình thức: Trắc nghiệm kết hợp thực hành sản phẩm website
                </p>
                <p className="text-[11px] text-slate-500">• Đánh giá năng lực tổng hợp HK1</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    Giữa Học kỳ 2
                  </span>
                  <span className="text-[10px] text-slate-400">Tuần 26 - 28</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Kiểm tra Giữa kỳ II (45 phút)
                </h4>
                <p className="text-[11px] text-slate-500">
                  • Hình thức: Trắc nghiệm định dạng đề thi Tốt nghiệp THPT 2025
                </p>
                <p className="text-[11px] text-slate-500">• Đánh giá kiến thức HTML5 & CSS3</p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                    Cuối Học kỳ 2
                  </span>
                  <span className="text-[10px] text-slate-400">Tuần 33 - 35</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Kiểm tra Cuối kỳ II (45 phút)
                </h4>
                <p className="text-[11px] text-slate-500">
                  • Hình thức: Đề thi khảo sát tổng hợp kiến thức cả năm
                </p>
                <p className="text-[11px] text-slate-500">• Đánh giá chuẩn đầu ra GDPT 2018</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KẾ HOẠCH GIÁO VIÊN (PHỤ LỤC 2 - CV 5512) */}
      {/* ========================================================================= */}
      {activeTab === 'plan-appendix2' && (
        <div className="space-y-4">
          <div className={`${glassClass} p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`}>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Tìm giáo viên, lớp dạy, phòng máy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} pl-9 pr-3 py-1.5 text-xs min-h-[38px]`}
              />
            </div>

            <div className="text-xs text-slate-500">
              Tổng số <strong>{assignments.length}</strong> giáo viên trong tổ
            </div>
          </div>

          {assignments.length === 0 ? (
            <div className={`${glassClass} p-12 text-center text-slate-500 space-y-3`}>
              <Users size={48} className="mx-auto opacity-30 text-emerald-500" />
              <p>Chưa có danh sách phân công giáo viên trong tổ.</p>
              <button
                onClick={() => {
                  setEditingAssign(null);
                  setAssignModalOpen(true);
                }}
                className={`${btnPrimary} mx-auto text-xs`}
              >
                <Plus size={16} /> Thêm Giáo viên đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments
                .filter(
                  (a) =>
                    !searchTerm.trim() ||
                    a.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    a.assignedClasses.toLowerCase().includes(searchTerm.toLowerCase()),
                )
                .map((assign) => (
                  <div
                    key={assign.id}
                    className={`${glassClass} p-4 space-y-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col justify-between`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Users className="text-emerald-500" size={18} />
                          {assign.teacherName}
                        </h4>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {assign.periodsPerWeek} tiết/tuần
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                        <p>
                          <strong>• Lớp phụ trách:</strong>{' '}
                          <span className="font-semibold text-slate-800 dark:text-slate-100">
                            {assign.assignedClasses || 'Chưa phân công'}
                          </span>
                        </p>
                        <p>
                          <strong>• Lịch phòng máy:</strong> {assign.labSchedule || 'Không có lịch'}
                        </p>
                        {assign.notes && (
                          <p className="italic text-slate-500 dark:text-slate-400">
                            📝 Nhiệm vụ kiêm nhiệm: {assign.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                      <span>{assign.phone || assign.email || 'Tin học THPT'}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => exportAppendix2Word(assign)}
                          className="px-2 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg flex items-center gap-1 transition-colors"
                          title="Xuất Word Kế hoạch giáo viên (Phụ lục 2)"
                        >
                          <FileDown size={13} />
                          <span>Word PL2</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingAssign(assign);
                            setAssignModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Chỉnh sửa phân công"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(assign.id, assign.teacherName)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Xóa giáo viên"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BIÊN BẢN SINH HOẠT TỔ */}
      {/* ========================================================================= */}
      {activeTab === 'meetings' && (
        <div className="space-y-4">
          {/* Filter and Search */}
          <div className={`${glassClass} p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`}>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Tìm tiêu đề, chủ trì, nội dung họp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} pl-9 pr-3 py-1.5 text-xs min-h-[38px]`}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <select
                value={meetingTopicFilter}
                onChange={(e) => setMeetingTopicFilter(e.target.value)}
                className={`${inputClass} w-auto text-xs py-1.5 min-h-[38px]`}
              >
                <option value="ALL">Tất cả chủ đề</option>
                <option value="LESSON_STUDY">Nghiên cứu bài học</option>
                <option value="EXAM_MATRIX">Ma trận đề (CV 7991)</option>
                <option value="SPECIALIZED_TOPIC">Chuyên đề chuyên môn</option>
                <option value="GENERAL">Sinh hoạt định kỳ</option>
              </select>
            </div>
          </div>

          {meetings.length === 0 ? (
            <div className={`${glassClass} p-12 text-center text-slate-500 space-y-3`}>
              <FileText size={48} className="mx-auto opacity-30 text-purple-500" />
              <p>Chưa có biên bản họp tổ nào được lưu.</p>
              <button
                onClick={() => {
                  setEditingMeeting(null);
                  setMeetingModalOpen(true);
                }}
                className={`${btnPrimary} mx-auto text-xs`}
              >
                <Plus size={16} /> Tạo Biên bản Họp tổ đầu tiên
              </button>
            </div>
          ) : (
            meetings
              .filter((m) => {
                if (meetingTopicFilter !== 'ALL' && m.topic !== meetingTopicFilter) return false;
                if (searchTerm.trim()) {
                  const t = searchTerm.toLowerCase();
                  return (
                    m.title.toLowerCase().includes(t) ||
                    m.chair.toLowerCase().includes(t) ||
                    m.content.toLowerCase().includes(t)
                  );
                }
                return true;
              })
              .map((meeting) => (
                <div
                  key={meeting.id}
                  className={`${glassClass} p-4 sm:p-5 space-y-3 hover:border-purple-300 dark:hover:border-purple-700 transition-all`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                        {meeting.topic === 'LESSON_STUDY'
                          ? 'Nghiên cứu bài học'
                          : meeting.topic === 'EXAM_MATRIX'
                          ? 'Ma trận đề'
                          : meeting.topic === 'SPECIALIZED_TOPIC'
                          ? 'Chuyên đề'
                          : 'Định kỳ'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Ngày {meeting.date} {meeting.time ? `(${meeting.time})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        onClick={() => setPrintingMeeting(meeting)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg flex items-center gap-1 transition-colors"
                        title="Xem & In biên bản họp"
                      >
                        <Printer size={15} />
                        <span className="hidden sm:inline">In / PDF</span>
                      </button>
                      <button
                        onClick={() => exportMeetingMinutesWord(meeting)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg flex items-center gap-1 transition-colors"
                        title="Xuất tệp Word .doc"
                      >
                        <FileDown size={15} />
                        <span className="hidden sm:inline">Word</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingMeeting(meeting);
                          setMeetingModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(meeting.id, meeting.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Xóa biên bản"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {meeting.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {meeting.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2.5 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    <span>Chủ trì: <strong>{meeting.chair}</strong></span>
                    <span>Thư ký: <strong>{meeting.secretary}</strong></span>
                    {meeting.location && <span>Địa điểm: {meeting.location}</span>}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SỔ DỰ GIỜ & ĐÁNH GIÁ (CV 5555) */}
      {/* ========================================================================= */}
      {activeTab === 'evaluations' && (
        <div className="space-y-4">
          {/* Filter and Search */}
          <div className={`${glassClass} p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`}>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Tìm giáo viên, bài học, lớp dạy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} pl-9 pr-3 py-1.5 text-xs min-h-[38px]`}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className={`${inputClass} w-auto text-xs py-1.5 min-h-[38px]`}
              >
                <option value="ALL">Tất cả xếp loại</option>
                <option value="GIOI">Loại Giỏi</option>
                <option value="KHA">Loại Khá</option>
                <option value="DAT">Loại Đạt</option>
                <option value="CHUA_DAT">Chưa Đạt</option>
              </select>
            </div>
          </div>

          {evaluations.length === 0 ? (
            <div className={`${glassClass} p-12 text-center text-slate-500 space-y-3`}>
              <FileCheck2 size={48} className="mx-auto opacity-30 text-blue-500" />
              <p>Chưa có phiếu dự giờ nào được lưu.</p>
              <button
                onClick={() => {
                  setEditingEval(null);
                  setEvalModalOpen(true);
                }}
                className={`${btnPrimary} mx-auto text-xs`}
              >
                <Plus size={16} /> Tạo Phiếu Dự giờ đầu tiên
              </button>
            </div>
          ) : (
            evaluations
              .filter((e) => {
                if (ratingFilter !== 'ALL' && e.rating !== ratingFilter) return false;
                if (searchTerm.trim()) {
                  const t = searchTerm.toLowerCase();
                  return (
                    e.teacherName.toLowerCase().includes(t) ||
                    e.lessonName.toLowerCase().includes(t) ||
                    e.className.toLowerCase().includes(t)
                  );
                }
                return true;
              })
              .map((evalItem) => (
                <div
                  key={evalItem.id}
                  className={`${glassClass} p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {evalItem.teacherName}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        Lớp {evalItem.className} • Tiết {evalItem.period}
                      </span>
                      {getRatingBadge(evalItem.rating)}
                      <span className="text-[10px] text-slate-400">
                        Ngày {evalItem.date}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {evalItem.lessonName}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>
                        Điểm: <strong className="text-indigo-600 dark:text-indigo-400">{evalItem.totalScore.toFixed(1)}/20đ</strong>
                      </span>
                      <span>Người dự: {evalItem.observerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => setPrintingEval(evalItem)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg flex items-center gap-1 transition-colors"
                      title="Xem & In phiếu"
                    >
                      <Printer size={15} />
                      <span className="hidden sm:inline">In / PDF</span>
                    </button>
                    <button
                      onClick={() => exportLessonEvaluationWord(evalItem)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg flex items-center gap-1 transition-colors"
                      title="Xuất tệp Word .doc"
                    >
                      <FileDown size={15} />
                      <span className="hidden sm:inline">Word</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingEval(evalItem);
                        setEvalModalOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(evalItem.id, evalItem.lessonName)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Xóa phiếu"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Modals */}
      <LessonObservationForm
        isOpen={evalModalOpen}
        onClose={() => {
          setEvalModalOpen(false);
          setEditingEval(null);
        }}
        onSave={handleSaveEval}
        initialData={editingEval}
        inputClass={inputClass}
        btnPrimary={btnPrimary}
        btnSecondary={btnSecondary}
      />

      <MeetingMinutesModal
        isOpen={meetingModalOpen}
        onClose={() => {
          setMeetingModalOpen(false);
          setEditingMeeting(null);
        }}
        onSave={handleSaveMeeting}
        initialData={editingMeeting}
        inputClass={inputClass}
        btnPrimary={btnPrimary}
        btnSecondary={btnSecondary}
      />

      <TeacherAssignmentModal
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setEditingAssign(null);
        }}
        onSave={handleSaveAssign}
        initialData={editingAssign}
        inputClass={inputClass}
        btnPrimary={btnPrimary}
        btnSecondary={btnSecondary}
      />

      <PrintEvaluationView
        evaluation={printingEval}
        onClose={() => setPrintingEval(null)}
        btnPrimary={btnPrimary}
        btnSecondary={btnSecondary}
      />

      <PrintMeetingView
        meeting={printingMeeting}
        onClose={() => setPrintingMeeting(null)}
        btnPrimary={btnPrimary}
        btnSecondary={btnSecondary}
      />
    </div>
  );
}
