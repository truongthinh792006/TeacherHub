import React, { useState, useEffect } from 'react';
import {
  X,
  UserCheck,
} from 'lucide-react';
import { TeacherAssignmentRecord } from '../../types';

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<TeacherAssignmentRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: TeacherAssignmentRecord | null;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}

export function TeacherAssignmentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  inputClass,
  btnPrimary,
  btnSecondary,
}: TeacherAssignmentModalProps) {
  const [teacherName, setTeacherName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [assignedClasses, setAssignedClasses] = useState('10A1, 10A2');
  const [periodsPerWeek, setPeriodsPerWeek] = useState(17);
  const [labSchedule, setLabSchedule] = useState('Sáng Thứ 3 (Tiết 1-3 PM1), Chiều Thứ 5 (Tiết 1-2 PM2)');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setTeacherName(initialData.teacherName);
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setAssignedClasses(initialData.assignedClasses);
      setPeriodsPerWeek(initialData.periodsPerWeek);
      setLabSchedule(initialData.labSchedule);
      setNotes(initialData.notes || '');
    } else {
      setTeacherName('');
      setEmail('');
      setPhone('');
      setAssignedClasses('10A1, 10A2');
      setPeriodsPerWeek(17);
      setLabSchedule('Sáng Thứ 3 (Tiết 1-3 PM1)');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;

    onSave({
      recordType: 'ASSIGNMENT',
      teacherName: teacherName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      assignedClasses: assignedClasses.trim(),
      periodsPerWeek,
      labSchedule: labSchedule.trim(),
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 rounded-xl">
              <UserCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              {initialData ? 'Chỉnh sửa Phân công' : 'Thêm Giáo viên & Phân công Chuyên môn'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Họ và tên Giáo viên *
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="VD: Thầy Nguyễn Văn A"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nguyenvana@gmail.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Số điện thoại
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Lớp phụ trách
              </label>
              <input
                type="text"
                value={assignedClasses}
                onChange={(e) => setAssignedClasses(e.target.value)}
                placeholder="10A1, 10A2, 11A1"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Số tiết / Tuần
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={periodsPerWeek}
                onChange={(e) => setPeriodsPerWeek(parseInt(e.target.value) || 0)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Lịch sử dụng / Trực phòng máy tính
            </label>
            <textarea
              value={labSchedule}
              onChange={(e) => setLabSchedule(e.target.value)}
              placeholder="VD: Sáng Thứ 3 (Tiết 1-3 PM1), Chiều Thứ 5 (Tiết 1-2 PM2)..."
              className={`${inputClass} min-h-[55px] text-xs resize-y`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Ghi chú thêm
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Phụ trách Đội tuyển HSG Tin học khối 11"
              className={inputClass}
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className={`flex-1 ${btnSecondary}`}>
              Hủy
            </button>
            <button type="submit" className={`flex-1 ${btnPrimary}`}>
              {initialData ? 'Cập nhật' : 'Thêm Giáo viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
