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

type DepartmentSubTab = 'evaluations' | 'meetings' | 'assignments';

export function DepartmentPage() {
  const {
    departmentCtrl,
    showAlert,
    showConfirm,
    glassClass,
    inputClass,
    btnPrimary,
    btnSecondary,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<DepartmentSubTab>('evaluations');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [editingEval, setEditingEval] = useState<LessonEvaluationRecord | null>(null);
  const [printingEval, setPrintingEval] = useState<LessonEvaluationRecord | null>(null);

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<DepartmentMeetingRecord | null>(null);

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
  const handleSaveEval = (recordData: Omit<LessonEvaluationRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingEval) {
      departmentCtrl.updateItem(editingEval.id, recordData);
      showAlert('Thành công', 'Đã cập nhật phiếu dự giờ!');
      setEditingEval(null);
    } else {
      departmentCtrl.addItem(recordData);
      showAlert('Thành công', 'Đã lưu phiếu dự giờ mới!');
    }
  };

  const handleSaveMeeting = (recordData: Omit<DepartmentMeetingRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingMeeting) {
      departmentCtrl.updateItem(editingMeeting.id, recordData);
      showAlert('Thành công', 'Đã cập nhật biên bản họp tổ!');
      setEditingMeeting(null);
    } else {
      departmentCtrl.addItem(recordData);
      showAlert('Thành công', 'Đã lưu biên bản họp tổ mới!');
    }
  };

  const handleSaveAssign = (recordData: Omit<TeacherAssignmentRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
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

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'GIOI':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">Loại Giỏi</span>;
      case 'KHA':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">Loại Khá</span>;
      case 'DAT':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">Loại Đạt</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">Chưa Đạt</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-md">
              <Briefcase size={22} />
            </div>
            Quản lý Tổ Chuyên môn
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Bộ công cụ dành cho Tổ trưởng chuyên môn: Dự giờ đánh giá CV 5555, Biên bản họp tổ và Phân công phòng máy.
          </p>
        </div>

        {/* Action Button */}
        <div>
          {activeTab === 'evaluations' && (
            <button
              onClick={() => {
                setEditingEval(null);
                setEvalModalOpen(true);
              }}
              className={btnPrimary}
            >
              <Plus size={18} /> Tạo Phiếu Dự giờ
            </button>
          )}
          {activeTab === 'meetings' && (
            <button
              onClick={() => {
                setEditingMeeting(null);
                setMeetingModalOpen(true);
              }}
              className={btnPrimary}
            >
              <Plus size={18} /> Tạo Biên bản Họp
            </button>
          )}
          {activeTab === 'assignments' && (
            <button
              onClick={() => {
                setEditingAssign(null);
                setAssignModalOpen(true);
              }}
              className={btnPrimary}
            >
              <Plus size={18} /> Thêm Giáo viên
            </button>
          )}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className={`${glassClass} p-4 flex items-center gap-3`}>
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 rounded-xl">
            <FileCheck2 size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {totalEvaluations}
            </span>
            <p className="text-[11px] text-slate-500">Tiết dự giờ ({goodEvaluations} Giỏi)</p>
          </div>
        </div>

        <div className={`${glassClass} p-4 flex items-center gap-3`}>
          <div className="p-2.5 bg-purple-100 dark:bg-purple-900/50 text-purple-600 rounded-xl">
            <FileText size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {totalMeetings}
            </span>
            <p className="text-[11px] text-slate-500">Biên bản họp tổ</p>
          </div>
        </div>

        <div className={`${glassClass} p-4 flex items-center gap-3`}>
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {totalTeachers}
            </span>
            <p className="text-[11px] text-slate-500">Giáo viên trong tổ</p>
          </div>
        </div>

        <div className={`${glassClass} p-4 flex items-center gap-3`}>
          <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-600 rounded-xl">
            <Laptop size={20} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              {totalPeriods}
            </span>
            <p className="text-[11px] text-slate-500">Tổng tiết giảng/tuần</p>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'evaluations'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 size={16} /> Phiếu Dự giờ & Đánh giá (CV 5555)
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'meetings'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText size={16} /> Biên bản Họp tổ Chuyên môn
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'assignments'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users size={16} /> Phân công & Lịch Phòng máy
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm giáo viên, bài học, biên bản..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`${inputClass} pl-10 min-h-[40px] text-xs`}
        />
      </div>

      {/* TAB 1: EVALUATIONS */}
      {activeTab === 'evaluations' && (
        <div className="space-y-3">
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
              .filter(
                (e) =>
                  !searchTerm.trim() ||
                  e.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.lessonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.className.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((evalItem) => (
                <div
                  key={evalItem.id}
                  className={`${glassClass} p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {evalItem.teacherName}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
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

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Điểm: <strong className="text-blue-600">{evalItem.totalScore}/20đ</strong></span>
                      <span>Người dự: {evalItem.observerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setPrintingEval(evalItem)}
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
                      title="Xem & In phiếu"
                    >
                      <Printer size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setEditingEval(evalItem);
                        setEvalModalOpen(true);
                      }}
                      className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(evalItem.id, evalItem.lessonName)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* TAB 2: MEETINGS */}
      {activeTab === 'meetings' && (
        <div className="space-y-3">
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
              .filter(
                (m) =>
                  !searchTerm.trim() ||
                  m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.chair.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.content.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((meeting) => (
                <div
                  key={meeting.id}
                  className={`${glassClass} p-4 space-y-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                        {meeting.topic === 'LESSON_STUDY' ? 'Nghiên cứu bài học' : meeting.topic === 'EXAM_MATRIX' ? 'Ma trận đề' : 'Sinh hoạt định kỳ'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Ngày {meeting.date} {meeting.time ? `(${meeting.time})` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        onClick={() => {
                          setEditingMeeting(meeting);
                          setMeetingModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(meeting.id, meeting.title)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    {meeting.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {meeting.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800">
                    <span>Chủ trì: <strong>{meeting.chair}</strong></span>
                    <span>Thư ký: <strong>{meeting.secretary}</strong></span>
                    {meeting.location && <span>Địa điểm: {meeting.location}</span>}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-3">
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
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {assign.periodsPerWeek} tiết/tuần
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <p><strong>Lớp dạy:</strong> {assign.assignedClasses || 'Chưa phân công'}</p>
                        <p><strong>Lịch phòng máy:</strong> {assign.labSchedule || 'Không có lịch'}</p>
                        {assign.notes && <p className="italic text-slate-400">📝 {assign.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                      <span>{assign.phone || assign.email || 'Tin học THPT'}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingAssign(assign);
                            setAssignModalOpen(true);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(assign.id, assign.teacherName)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
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
    </div>
  );
}
