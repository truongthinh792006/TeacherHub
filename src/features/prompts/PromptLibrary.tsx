import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Tag,
  Star,
  StarOff,
  Save,
  X,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { Prompt } from '../../types';

export function PromptLibrary() {
  const {
    promptsCtrl,
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

  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState<Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    content: '',
    description: '',
    category: 'Giáo án',
    tags: '',
    favorite: false,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deep linking handler
  useEffect(() => {
    if (globalFocus && activeTab === 'prompts') {
      const item = promptsCtrl.data.find((x) => x.id === globalFocus.id);
      if (item) {
        setEditingItem(item);
        setFormData({
          title: item.title,
          content: item.content,
          description: item.description,
          category: item.category,
          tags: item.tags,
          favorite: item.favorite,
        });
        setIsModalOpen(true);
      }
      setGlobalFocus(null);
    }
  }, [globalFocus, activeTab, promptsCtrl.data, setGlobalFocus]);

  const categories = ['All', ...Array.from(new Set(promptsCtrl.data.map((p) => p.category)))];

  const filteredPrompts = promptsCtrl.data
    .filter((p) => {
      const matchCat = filterCategory === 'All' || p.category === filterCategory;
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) =>
      b.favorite === a.favorite ? b.updatedAt - a.updatedAt : b.favorite ? 1 : -1,
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim())
      return showAlert('Lỗi', 'Vui lòng nhập tiêu đề và nội dung.');
    if (editingItem) promptsCtrl.updateItem(editingItem.id, formData);
    else promptsCtrl.addItem(formData);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    showConfirm('Xóa Prompt', 'Bạn có chắc chắn muốn xóa Prompt này không?', () =>
      promptsCtrl.deleteItem(id),
    );
  };

  const handleCopy = (e: React.MouseEvent, id: string, content: string) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => showAlert('Lỗi', 'Không thể sao chép nội dung.'));
  };

  const openModal = (item: Prompt | null = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            title: item.title,
            content: item.content,
            description: item.description,
            category: item.category,
            tags: item.tags,
            favorite: item.favorite,
          }
        : {
            title: '',
            content: '',
            description: '',
            category: 'Giáo án',
            tags: '',
            favorite: false,
          },
    );
    setIsModalOpen(true);
  };

  const toggleFav = (e: React.MouseEvent, id: string, current: boolean) => {
    e.stopPropagation();
    promptsCtrl.updateItem(id, { favorite: !current });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Thư viện Prompt AI
        </h1>
        <button onClick={() => openModal()} className={btnPrimary}>
          <Plus size={20} /> Thêm Prompt
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
            placeholder="Tìm kiếm prompt..."
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
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredPrompts.map((prompt) => (
          <div
            key={prompt.id}
            onClick={() => openModal(prompt)}
            className={`${glassClass} p-5 flex flex-col h-full relative group cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors`}
          >
            <div className="mb-3 flex justify-between items-start">
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg">
                {prompt.category}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => toggleFav(e, prompt.id, prompt.favorite)}
                  className="p-2 -mr-2 text-amber-400 hover:scale-110 transition-transform"
                >
                  {prompt.favorite ? (
                    <Star fill="currentColor" size={20} />
                  ) : (
                    <StarOff size={20} className="text-slate-300 dark:text-slate-600" />
                  )}
                </button>
              </div>
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">
              {prompt.title}
            </h3>
            {prompt.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 italic">
                {prompt.description}
              </p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 line-clamp-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-[13px]">
              {prompt.content}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={(e) => handleCopy(e, prompt.id, prompt.content)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                {copiedId === prompt.id ? (
                  <>
                    <Check size={18} className="text-green-500" /> Đã copy
                  </>
                ) : (
                  <>
                    <Copy size={18} /> Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Thêm/Sửa Prompt */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Chi tiết Prompt' : 'Thêm Prompt Mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                  placeholder="VD: Soạn giáo án bài 1..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Danh mục</label>
                <input
                  type="text"
                  list="prompt-cats"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={inputClass}
                />
                <datalist id="prompt-cats">
                  <option value="Giáo án" />
                  <option value="Đề thi" />
                  <option value="Trò chơi" />
                  <option value="Khác" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mô tả ngắn gọn</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nội dung Prompt (để gửi cho AI) *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className={`${inputClass} min-h-[150px] resize-y`}
                  placeholder="Đóng vai là..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tags (cách nhau dấu phẩy)
                </label>
                <div className="relative">
                  <Tag
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className={`${inputClass} pl-10`}
                    placeholder="tin-hoc, thpt, kiem-tra"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-2 min-h-[44px]">
                <input
                  type="checkbox"
                  checked={formData.favorite}
                  onChange={(e) =>
                    setFormData({ ...formData, favorite: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Đánh dấu Yêu thích
                </span>
              </label>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between rounded-b-2xl sticky bottom-0">
              {editingItem ? (
                <button
                  onClick={() => handleDelete(editingItem.id)}
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
