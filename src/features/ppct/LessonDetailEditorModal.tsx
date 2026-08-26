import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  BookOpen,
  Calendar,
  Layers,
  Laptop,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { LessonStatus, LessonType, PPCTLesson } from '../../types';

interface LessonDetailEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: PPCTLesson | null;
  onSave: (lessonData: PPCTLesson) => void;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}

const availableCompetencies = [
  { id: 'NLa', label: 'NLa: Sử dụng & quản lý CNTT' },
  { id: 'NLb', label: 'NLb: Ứng xử phù hợp trong môi trường số' },
  { id: 'NLc', label: 'NLc: Giải quyết vấn đề với CNTT' },
  { id: 'NLd', label: 'NLd: Ứng dụng CNTT trong học và tự học' },
  { id: 'NLe', label: 'NLe: Hợp tác trong môi trường số' },
];

export function LessonDetailEditorModal({
  isOpen,
  onClose,
  lesson,
  onSave,
  inputClass,
  btnPrimary,
  btnSecondary,
}: LessonDetailEditorModalProps) {
  const [lessonName, setLessonName] = useState('');
  const [topic, setTopic] = useState('');
  const [week, setWeek] = useState(1);
  const [order, setOrder] = useState(1);
  const [periods, setPeriods] = useState(2);
  const [semester, setSemester] = useState<1 | 2>(1);
  const [type, setType] = useState<LessonType>('LESSON');
  const [status, setStatus] = useState<LessonStatus>('PENDING');
  const [notes, setNotes] = useState('');
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  const [knowText, setKnowText] = useState('');
  const [understandText, setUnderstandText] = useState('');
  const [applyText, setApplyText] = useState('');

  useEffect(() => {
    if (lesson) {
      setLessonName(lesson.lessonName || '');
      setTopic(lesson.topic || '');
      setWeek(lesson.week || 1);
      setOrder(lesson.order || 1);
      setPeriods(lesson.periods || 1);
      setSemester(lesson.semester || 1);
      setType(lesson.type || 'LESSON');
      setStatus(lesson.status || 'PENDING');
      setNotes(lesson.notes || '');
      setSelectedCompetencies(lesson.competencies || ['NLa', 'NLc']);
      setKnowText(lesson.objectives?.know?.join('\n') || '');
      setUnderstandText(lesson.objectives?.understand?.join('\n') || '');
      setApplyText(lesson.objectives?.apply?.join('\n') || '');
    }
  }, [lesson, isOpen]);

  if (!isOpen || !lesson) return null;

  const toggleCompetency = (id: string) => {
    setSelectedCompetencies((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonName.trim()) return;

    const parseLines = (text: string) =>
      text
        .split('\n')
        .map((l) => l.trim().replace(/^[-*•]\s*/, ''))
        .filter((l) => l.length > 0);

    const know = parseLines(knowText);
    const understand = parseLines(understandText);
    const apply = parseLines(applyText);

    const updated: PPCTLesson = {
      ...lesson,
      lessonName: lessonName.trim(),
      topic: topic.trim() || 'Chủ đề bài học',
      week: Number(week) || 1,
      order: Number(order) || 1,
      periods: Number(periods) || 1,
      semester: Number(semester) === 2 ? 2 : 1,
      type,
      status,
      notes: notes.trim() || undefined,
      competencies: selectedCompetencies.length > 0 ? selectedCompetencies : undefined,
      objectives:
        know.length > 0 || understand.length > 0 || apply.length > 0
          ? {
              know: know.length > 0 ? know : undefined,
              understand: understand.length > 0 ? understand : undefined,
              apply: apply.length > 0 ? apply : undefined,
            }
          : undefined,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[160] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Chỉnh sửa Bài học PPCT
              </h3>
              <p className="text-xs text-slate-500">
                Cập nhật thông tin bài dạy, số tiết, năng lực và mục tiêu YCCĐ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tên bài học / Hoạt động dạy học *
            </label>
            <input
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="VD: Bài 1: Thông tin và xử lý thông tin"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Chủ đề bài học
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Chủ đề A: Máy tính và xã hội tri thức"
              className={inputClass}
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tuần học
              </label>
              <input
                type="number"
                min={1}
                max={35}
                value={week}
                onChange={(e) => setWeek(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Tiết bắt đầu
              </label>
              <input
                type="number"
                min={1}
                max={150}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Số tiết
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={periods}
                onChange={(e) => setPeriods(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-center"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Học kỳ
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) as 1 | 2)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold"
              >
                <option value={1}>Học kỳ 1</option>
                <option value={2}>Học kỳ 2</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Loại bài dạy
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as LessonType)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="LESSON">Lý thuyết</option>
                <option value="PRACTICE">Thực hành</option>
                <option value="REVIEW">Ôn tập</option>
                <option value="MIDTERM">Kiểm tra Giữa kỳ</option>
                <option value="FINAL">Kiểm tra Cuối kỳ</option>
                <option value="PROJECT">Dự án học tập</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Địa điểm / Ghi chú
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: Phòng máy tính 1, Mang laptop"
                className={inputClass}
              />
            </div>
          </div>

          {/* Competencies Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Mã Năng lực Tin học:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableCompetencies.map((comp) => {
                const isChecked = selectedCompetencies.includes(comp.id);
                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => toggleCompetency(comp.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isChecked
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isChecked ? '✓ ' : '+ '}
                    {comp.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Objectives (Biết / Hiểu / Vận dụng) */}
          <div className="space-y-3 pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Yêu cầu cần đạt chi tiết (Mỗi ý xuống dòng một dòng):
            </label>

            <div>
              <label className="block text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                • Mức độ Nhận biết (Biết):
              </label>
              <textarea
                value={knowText}
                onChange={(e) => setKnowText(e.target.value)}
                rows={2}
                placeholder="Nêu được khái niệm...&#10;Liệt kê được các lệnh..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1">
                • Mức độ Thông hiểu (Hiểu):
              </label>
              <textarea
                value={understandText}
                onChange={(e) => setUnderstandText(e.target.value)}
                rows={2}
                placeholder="Giải thích được nguyên lý...&#10;Phân biệt được giữa A và B..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                • Mức độ Vận dụng & VDC (Vận dụng):
              </label>
              <textarea
                value={applyText}
                onChange={(e) => setApplyText(e.target.value)}
                rows={2}
                placeholder="Vận dụng giải quyết bài toán...&#10;Tạo sản phẩm hoàn chỉnh..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className={btnSecondary}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={btnPrimary}
          >
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
