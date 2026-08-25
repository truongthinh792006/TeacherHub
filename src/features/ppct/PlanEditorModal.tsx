import React, { useState } from 'react';
import {
  X,
  Plus,
  Sparkles,
  BookOpen,
  Check,
  Calendar,
} from 'lucide-react';
import { GradeLevel, PPCTPlan, TrackType } from '../../types';
import { allPPCTPresets } from './ppctPresets';

interface PlanEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (planData: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}

export function PlanEditorModal({
  isOpen,
  onClose,
  onSavePlan,
  inputClass,
  btnPrimary,
  btnSecondary,
}: PlanEditorModalProps) {
  const [mode, setMode] = useState<'PRESET' | 'CUSTOM'>('PRESET');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Custom fields
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState<GradeLevel>('10');
  const [track, setTrack] = useState<TrackType>('GENERAL');
  const [academicYear, setAcademicYear] = useState('2024 - 2025');
  const [assignedClasses, setAssignedClasses] = useState('10A1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'PRESET') {
      const preset = allPPCTPresets[selectedPresetIndex];
      onSavePlan({
        ...preset,
        academicYear,
        assignedClasses: assignedClasses.trim() || preset.assignedClasses,
      });
    } else {
      if (!title.trim()) return;
      onSavePlan({
        title: title.trim(),
        grade,
        track,
        academicYear,
        assignedClasses: assignedClasses.trim(),
        totalPeriods: 70,
        totalWeeks: 35,
        isDefault: false,
        lessons: allPPCTPresets[0].lessons.map((l) => ({ ...l })), // Clone default lesson structure as initial template
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="text-blue-500" size={20} /> Tạo Kế hoạch PPCT mới
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('PRESET')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'PRESET'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sparkles size={14} /> Mẫu chuẩn GDPT 2018
          </button>
          <button
            type="button"
            onClick={() => setMode('CUSTOM')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'CUSTOM'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Plus size={14} /> Tự cấu hình Kế hoạch
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'PRESET' ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Chọn Mẫu Phân phối chương trình:
              </label>
              <div className="space-y-2">
                {allPPCTPresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPresetIndex(idx)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedPresetIndex === idx
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white">
                        {preset.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {preset.lessons.length} bài học • {preset.totalPeriods} tiết • 35 tuần
                      </p>
                    </div>
                    {selectedPresetIndex === idx && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Năm học
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Lớp phụ trách
                  </label>
                  <input
                    type="text"
                    value={assignedClasses}
                    onChange={(e) => setAssignedClasses(e.target.value)}
                    placeholder="VD: 10A1, 10A2"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Tên kế hoạch *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: PPCT Tin học 10 - Năm học 2024-2025"
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Khối lớp
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as GradeLevel)}
                    className={inputClass}
                  >
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Định hướng
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as TrackType)}
                    className={inputClass}
                  >
                    <option value="GENERAL">Chung / Cơ bản</option>
                    <option value="ICT">Tin học Ứng dụng (ICT)</option>
                    <option value="CS">Khoa học Máy tính (CS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Năm học
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Lớp phụ trách
                  </label>
                  <input
                    type="text"
                    value={assignedClasses}
                    onChange={(e) => setAssignedClasses(e.target.value)}
                    placeholder="VD: 10A1, 10A2"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 ${btnSecondary}`}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={`flex-1 ${btnPrimary}`}
            >
              Tạo Kế hoạch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
