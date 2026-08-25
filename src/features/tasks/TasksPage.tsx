import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Check,
  Search,
  Calendar as CalendarIcon,
  X,
  Save,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { localDateString } from '../../lib/date';
import { Priority, Task } from '../../types';

export function TasksPage() {
  const {
    tasksCtrl,
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

  const [filter, setFilter] = useState<'All' | 'Incomplete' | 'Completed' | 'Today' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Task | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    dueDate: string;
    priority: Priority;
    completed: boolean;
  }>({
    title: '',
    dueDate: localDateString(),
    priority: 'MEDIUM',
    completed: false,
  });

  useEffect(() => {
    if (globalFocus && activeTab === 'tasks') {
      const item = tasksCtrl.data.find((x) => x.id === globalFocus.id);
      if (item) {
        setEditingItem(item);
        setFormData({
          title: item.title,
          dueDate: item.dueDate,
          priority: item.priority,
          completed: item.completed,
        });
        setIsModalOpen(true);
      }
      setGlobalFocus(null);
    }
  }, [globalFocus, activeTab, tasksCtrl.data, setGlobalFocus]);

  const todayStr = localDateString();

  const filteredTasks = tasksCtrl.data
    .filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      let matchFilter = true;
      if (filter === 'Incomplete') matchFilter = !t.completed;
      if (filter === 'Completed') matchFilter = t.completed;
      if (filter === 'Today') matchFilter = t.dueDate === todayStr;
      if (filter === 'Overdue') matchFilter = t.dueDate < todayStr && !t.completed;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pWeight: Record<Priority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      if (pWeight[b.priority] !== pWeight[a.priority])
        return pWeight[b.priority] - pWeight[a.priority];
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return showAlert('Lỗi', 'Vui lòng nhập tên công việc.');
    if (editingItem) tasksCtrl.updateItem(editingItem.id, formData);
    else tasksCtrl.addItem(formData);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    showConfirm('Xóa', 'Xóa công việc này?', () => tasksCtrl.deleteItem(id));
  };

  const toggleTask = (id: string, current: boolean) => {
    tasksCtrl.updateItem(id, { completed: !current });
  };

  const openModal = (item: Task | null = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            title: item.title,
            dueDate: item.dueDate,
            priority: item.priority,
            completed: item.completed,
          }
        : {
            title: '',
            dueDate: todayStr,
            priority: 'MEDIUM',
            completed: false,
          },
    );
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Quản lý Công việc
        </h1>
        <button onClick={() => openModal()} className={btnPrimary}>
          <Plus size={20} /> Thêm Việc
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
            placeholder="Tìm công việc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputClass} pl-12`}
          />
        </div>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value as 'All' | 'Incomplete' | 'Completed' | 'Today' | 'Overdue',
            )
          }
          className={`${inputClass} md:w-48`}
        >
          <option value="All">Tất cả</option>
          <option value="Incomplete">Chưa làm</option>
          <option value="Completed">Đã xong</option>
          <option value="Today">Hôm nay</option>
          <option value="Overdue">Quá hạn</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`${glassClass} p-4 flex items-center justify-between group transition-all duration-200 ${
              task.completed ? 'opacity-60 bg-slate-100/50 dark:bg-slate-800/40' : ''
            }`}
          >
            <div
              className="flex items-center space-x-4 flex-1 overflow-hidden cursor-pointer"
              onClick={() => openModal(task)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task.id, task.completed);
                }}
                className={`flex-shrink-0 rounded-lg border-2 flex items-center justify-center transition-all min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] ${
                  task.completed
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-slate-300 dark:border-slate-600'
                }`}
              >
                {task.completed && <Check size={18} />}
              </button>
              <div className="flex flex-col truncate flex-1">
                <span
                  className={`text-base font-medium truncate ${
                    task.completed
                      ? 'line-through text-slate-500 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex items-center space-x-3 mt-1 text-xs">
                  <span
                    className={`flex items-center ${
                      task.dueDate < todayStr && !task.completed
                        ? 'text-red-500 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <CalendarIcon size={12} className="mr-1" /> {task.dueDate}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px] ${
                      task.priority === 'HIGH'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : task.priority === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div
            className={`${glassClass} p-12 text-center text-slate-500 flex flex-col items-center`}
          >
            <CheckSquare size={48} className="mb-4 opacity-30" />
            <p>Không có công việc nào khớp với điều kiện.</p>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa Task */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingItem ? 'Sửa Công Việc' : 'Thêm Công Việc'}
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
                <label className="block text-sm font-medium mb-1">Tên công việc *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hạn chót</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mức độ ưu tiên</label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as Priority })
                  }
                  className={inputClass}
                >
                  <option value="LOW">Thấp</option>
                  <option value="MEDIUM">Vừa</option>
                  <option value="HIGH">Cao</option>
                </select>
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
