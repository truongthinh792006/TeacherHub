import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, X, Save } from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { localDateString } from '../../lib/date';
import { JournalEntry } from '../../types';

export function JournalPage() {
  const {
    journalCtrl,
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
  const [filterCategory, setFilterCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JournalEntry | null>(null);
  const todayStr = localDateString();
  const [formData, setFormData] = useState<Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>>({
    date: todayStr,
    title: '',
    category: 'Chuyên môn',
    content: '',
    conclusion: '',
    notes: '',
  });

  useEffect(() => {
    if (globalFocus && activeTab === 'journal') {
      const item = journalCtrl.data.find((x) => x.id === globalFocus.id);
      if (item) {
        setEditingItem(item);
        setFormData({
          date: item.date,
          title: item.title,
          category: item.category,
          content: item.content,
          conclusion: item.conclusion,
          notes: item.notes,
        });
        setIsModalOpen(true);
      }
      setGlobalFocus(null);
    }
  }, [globalFocus, activeTab, journalCtrl.data, setGlobalFocus]);

  const categories = [
    'Họp tổ',
    'Chuyên môn',
    'Dạy học',
    'Dự giờ',
    'Kiểm tra',
    'Công việc',
    'Khác',
  ];

  const filtered = journalCtrl.data
    .filter((j) => {
      const matchSearch =
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'All' || j.category === filterCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date.trim())
      return showAlert('Lỗi', 'Vui lòng nhập ngày và tiêu đề.');
    if (editingItem) journalCtrl.updateItem(editingItem.id, formData);
    else journalCtrl.addItem(formData);
    setIsModalOpen(false);
  };

  const openModal = (item: JournalEntry | null = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            date: item.date,
            title: item.title,
            category: item.category,
            content: item.content,
            conclusion: item.conclusion,
            notes: item.notes,
          }
        : {
            date: todayStr,
            title: '',
            category: 'Chuyên môn',
            content: '',
            conclusion: '',
            notes: '',
          },
    );
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Nhật ký Giảng dạy
        </h1>
        <button onClick={() => openModal()} className={btnPrimary}>
          <Plus size={20} /> Viết Nhật ký
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
            placeholder="Tìm nhật ký..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-12`}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`${inputClass} md:w-48`}
        >
          <option value="All">Tất cả danh mục</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            onClick={() => openModal(entry)}
            className={`${glassClass} p-5 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-all border-l-4 border-l-purple-500`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                {entry.title}
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {entry.date}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2 block">
              {entry.category}
            </span>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
              {entry.content}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-slate-500 text-center py-8">Không có mục nhật ký nào.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Chi tiết Nhật ký' : 'Viết Nhật ký Mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tiêu đề / Tóm tắt sự việc *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nội dung chi tiết</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className={`${inputClass} min-h-[120px] resize-y`}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kết luận / Đánh giá
                </label>
                <textarea
                  value={formData.conclusion}
                  onChange={(e) =>
                    setFormData({ ...formData, conclusion: e.target.value })
                  }
                  className={`${inputClass} min-h-[80px] resize-y`}
                ></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between rounded-b-2xl sticky bottom-0">
              {editingItem ? (
                <button
                  onClick={() => {
                    showConfirm('Xóa', 'Xóa mục nhật ký này?', () => {
                      journalCtrl.deleteItem(editingItem.id);
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
