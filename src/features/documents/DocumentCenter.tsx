import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  X,
  Edit,
  Save,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { DocumentLink } from '../../types';

export function DocumentCenter() {
  const {
    docsCtrl,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocumentLink | null>(null);
  const [formData, setFormData] = useState<Omit<DocumentLink, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    url: '',
    category: 'Chuyên môn',
    description: '',
  });

  useEffect(() => {
    if (globalFocus && activeTab === 'docs') {
      const item = docsCtrl.data.find((x) => x.id === globalFocus.id);
      if (item) {
        setEditingItem(item);
        setFormData({
          title: item.title,
          url: item.url,
          category: item.category,
          description: item.description,
        });
        setIsModalOpen(true);
      }
      setGlobalFocus(null);
    }
  }, [globalFocus, activeTab, docsCtrl.data, setGlobalFocus]);

  const filtered = docsCtrl.data.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedDocs = filtered.reduce<Record<string, DocumentLink[]>>((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim())
      return showAlert('Lỗi', 'Cần nhập Tên tài liệu và Link URL.');
    let cleanUrl = formData.url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'http://' + cleanUrl;

    if (editingItem) docsCtrl.updateItem(editingItem.id, { ...formData, url: cleanUrl });
    else docsCtrl.addItem({ ...formData, url: cleanUrl });
    setIsModalOpen(false);
  };

  const openModal = (item: DocumentLink | null = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            title: item.title,
            url: item.url,
            category: item.category,
            description: item.description,
          }
        : {
            title: '',
            url: '',
            category: 'Chuyên môn',
            description: '',
          },
    );
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Tài liệu (Drive Links)
        </h1>
        <button onClick={() => openModal()} className={btnPrimary}>
          <Plus size={20} /> Thêm Link
        </button>
      </div>

      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Tìm tài liệu, thư mục..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`${inputClass} pl-12`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {Object.entries(groupedDocs).map(([category, categoryDocs]) => (
          <div key={category} className={`${glassClass} p-5 lg:p-6`}>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center gap-2">
              <FolderOpen size={20} className="text-amber-500" /> {category}
            </h3>
            <ul className="space-y-3">
              {categoryDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium flex-1 truncate min-h-[32px] hover:underline"
                    >
                      <ExternalLink size={18} className="flex-shrink-0" />
                      <span className="truncate">{doc.title}</span>
                    </a>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openModal(doc)}
                        className="p-2 text-slate-400 hover:text-blue-500 min-h-[44px] min-w-[44px] flex justify-center items-center rounded-lg"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() =>
                          showConfirm('Xóa', 'Xóa tài liệu này?', () =>
                            docsCtrl.deleteItem(doc.id),
                          )
                        }
                        className="p-2 text-slate-400 hover:text-red-500 min-h-[44px] min-w-[44px] flex justify-center items-center rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {doc.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-7">
                      {doc.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {Object.keys(groupedDocs).length === 0 && (
          <p className="text-slate-500 w-full col-span-2 text-center py-8">
            Không có tài liệu nào.
          </p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Sửa Link Tài liệu' : 'Thêm Link Mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tên tài liệu *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Link (Google Drive/OneDrive) *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Thư mục / Danh mục
                </label>
                <input
                  type="text"
                  list="doc-categories"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={inputClass}
                />
                <datalist id="doc-categories">
                  <option value="Chuyên môn" />
                  <option value="Tập huấn" />
                  <option value="Biểu mẫu" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mô tả thêm (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setIsModalOpen(false)} className={btnSecondary}>
                Hủy
              </button>
              <button onClick={handleSubmit} className={btnPrimary}>
                <Save size={20} /> Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
