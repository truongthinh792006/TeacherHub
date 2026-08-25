import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, X, Save, AlignLeft } from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { Student } from '../../types';

export function StudentsPage() {
  const {
    studentsCtrl,
    activeTab,
    globalFocus,
    setGlobalFocus,
    showAlert,
    showConfirm,
    glassClass,
    inputClass,
    btnPrimary,
    btnSecondary,
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    className: '',
    gender: 'Nam',
    level: 'Khá',
    status: 'Đang học',
    notes: '',
  });

  useEffect(() => {
    if (globalFocus && activeTab === 'students') {
      const item = studentsCtrl.data.find((x) => x.id === globalFocus.id);
      if (item) {
        setEditingItem(item);
        setFormData({
          name: item.name,
          className: item.className,
          gender: item.gender,
          level: item.level,
          status: item.status,
          notes: item.notes,
        });
        setIsModalOpen(true);
      }
      setGlobalFocus(null);
    }
  }, [globalFocus, activeTab, studentsCtrl.data, setGlobalFocus]);

  const classes = ['All', ...Array.from(new Set(studentsCtrl.data.map((s) => s.className)))];

  const filtered = studentsCtrl.data
    .filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = filterClass === 'All' || s.className === filterClass;
      return matchSearch && matchClass;
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'vi'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.className.trim())
      return showAlert('Lỗi', 'Vui lòng nhập tên và lớp.');
    if (editingItem) studentsCtrl.updateItem(editingItem.id, formData);
    else studentsCtrl.addItem(formData);
    setIsModalOpen(false);
  };

  const openModal = (item: Student | null = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            name: item.name,
            className: item.className,
            gender: item.gender,
            level: item.level,
            status: item.status,
            notes: item.notes,
          }
        : {
            name: '',
            className: '',
            gender: 'Nam',
            level: 'Khá',
            status: 'Đang học',
            notes: '',
          },
    );
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Ghi chú Học sinh
        </h1>
        <button onClick={() => openModal()} className={btnPrimary}>
          <Plus size={20} /> Thêm Học Sinh
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm tên học sinh..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-12`}
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className={`${inputClass} md:w-48`}
        >
          {classes.map((c) => (
            <option key={c} value={c}>
              {c === 'All' ? 'Tất cả các lớp' : `Lớp ${c}`}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((student) => (
          <div
            key={student.id}
            onClick={() => openModal(student)}
            className={`${glassClass} p-5 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {student.name}
              </h3>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded font-bold">
                {student.className}
              </span>
            </div>
            <div className="flex gap-2 mb-3 text-xs">
              <span
                className={`px-2 py-1 rounded-full ${
                  student.level === 'Tốt'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    : student.level === 'Khá'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : student.level === 'Trung bình'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                }`}
              >
                {student.level}
              </span>
              <span
                className={`px-2 py-1 rounded-full ${
                  student.status === 'Đang học'
                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    : student.status === 'Cần quan tâm'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                    : 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {student.status}
              </span>
            </div>
            {student.notes && (
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                <AlignLeft size={14} className="inline mr-1" />
                {student.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Chi tiết / Sửa' : 'Thêm Hồ sơ'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lớp *</label>
                  <input
                    type="text"
                    list="class-list"
                    value={formData.className}
                    onChange={(e) =>
                      setFormData({ ...formData, className: e.target.value })
                    }
                    className={inputClass}
                  />
                  <datalist id="class-list">
                    <option value="10A1" />
                    <option value="11A1" />
                    <option value="12A1" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Giới tính</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className={inputClass}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Học lực</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className={inputClass}
                  >
                    <option value="Tốt">Tốt</option>
                    <option value="Khá">Khá</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Cần hỗ trợ">Cần hỗ trợ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={inputClass}
                  >
                    <option value="Đang học">Đang học</option>
                    <option value="Cần quan tâm">Cần quan tâm</option>
                    <option value="Đã nghỉ">Đã nghỉ</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ghi chú (nhắc nhở, đặc điểm...)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className={`${inputClass} min-h-[100px] resize-y`}
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between rounded-b-2xl">
              {editingItem ? (
                <button
                  onClick={() => {
                    showConfirm('Xóa', 'Xóa hồ sơ này?', () => {
                      studentsCtrl.deleteItem(editingItem.id);
                      setIsModalOpen(false);
                    });
                  }}
                  className="px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium min-h-[44px] flex items-center gap-2"
                >
                  <Trash2 size={18} /> Xóa
                </button>
              ) : (
                <div></div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className={btnSecondary}>
                  Hủy
                </button>
                <button onClick={handleSubmit} className={btnPrimary}>
                  <Save size={20} /> Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
