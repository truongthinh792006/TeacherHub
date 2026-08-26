import React, { useState, useEffect } from 'react';
import { X, Save, Monitor, HardDrive } from 'lucide-react';
import { DepartmentEquipmentRecord } from '../../types';

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<DepartmentEquipmentRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: DepartmentEquipmentRecord | null;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}

export function EquipmentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  inputClass,
  btnPrimary,
  btnSecondary,
}: EquipmentModalProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [condition, setCondition] = useState('');
  const [assignedGrades, setAssignedGrades] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setQuantity(initialData.quantity || '');
      setCondition(initialData.condition || '');
      setAssignedGrades(initialData.assignedGrades || '');
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setQuantity('1');
      setCondition('Hoạt động tốt, đảm bảo quy chuẩn kỹ thuật');
      setAssignedGrades('Khối 10, 11, 12');
      setNotes('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      recordType: 'EQUIPMENT',
      name: name.trim(),
      quantity: quantity.trim() || '1',
      condition: condition.trim() || 'Hoạt động tốt',
      assignedGrades: assignedGrades.trim() || 'Khối 10, 11, 12',
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Monitor className="text-blue-600 dark:text-blue-400" size={20} />
            {initialData ? 'Chỉnh sửa Thiết bị / Phòng máy' : 'Thêm Thiết bị / Phòng thực hành mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tên phòng máy / Thiết bị dạy học <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Phòng máy tính số 1 (Phòng A), Bộ Switch & Router..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Số lượng / Quy mô <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: 46 máy tính, 04 bộ..."
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Khối lớp sử dụng
              </label>
              <input
                type="text"
                placeholder="VD: Khối 10, Khối 12"
                value={assignedGrades}
                onChange={(e) => setAssignedGrades(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tình trạng kỹ thuật
            </label>
            <input
              type="text"
              placeholder="VD: Hoạt động tốt, kết nối mạng LAN/Internet 150Mbps..."
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mục đích & Ghi chú sử dụng
            </label>
            <textarea
              rows={3}
              placeholder="VD: Phục vụ các tiết thực hành lập trình, thiết kế web, đồ họa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputClass} min-h-[70px] resize-none`}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className={btnSecondary}>
              Hủy bỏ
            </button>
            <button type="submit" className={btnPrimary}>
              <Save size={16} />
              <span>{initialData ? 'Cập nhật' : 'Thêm thiết bị'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
