import React, { useState, useEffect } from 'react';
import { X, Save, Layers } from 'lucide-react';
import { PPCTPlan } from '../../types';

interface PlanAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planId: string, updates: Partial<PPCTPlan>) => void;
  plan: PPCTPlan | null;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}

export function PlanAssignmentModal({
  isOpen,
  onClose,
  onSave,
  plan,
  inputClass,
  btnPrimary,
  btnSecondary,
}: PlanAssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [assignedClasses, setAssignedClasses] = useState('');

  useEffect(() => {
    if (plan) {
      setTitle(plan.title || '');
      setAcademicYear(plan.academicYear || '2024 - 2025');
      setAssignedClasses(plan.assignedClasses || '');
    }
  }, [plan, isOpen]);

  if (!isOpen || !plan) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(plan.id, {
      title: title.trim() || plan.title,
      academicYear: academicYear.trim() || '2024 - 2025',
      assignedClasses: assignedClasses.trim() || 'Toàn khối',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="text-indigo-600 dark:text-indigo-400" size={20} />
            Sửa thông tin Khung PPCT Khối {plan.grade}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tên kế hoạch phân phối chương trình
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Năm học áp dụng
            </label>
            <input
              type="text"
              required
              placeholder="VD: 2024 - 2025"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Lớp phụ trách / Áp dụng
            </label>
            <input
              type="text"
              placeholder="VD: 10A1, 10A2, 10A3 hoặc Toàn khối"
              value={assignedClasses}
              onChange={(e) => setAssignedClasses(e.target.value)}
              className={inputClass}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Điền danh sách các lớp học sinh theo học khung chương trình này.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className={btnSecondary}>
              Hủy
            </button>
            <button type="submit" className={btnPrimary}>
              <Save size={16} />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
