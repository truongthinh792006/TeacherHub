// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { LayoutDashboard, CheckSquare, MessageSquareQuote, FolderOpen, BookOpen, Users, Wand2, Settings as SettingsIcon, Sun, Moon, Plus, Trash2, Copy, Check, Search, Download, Upload, Calendar as CalendarIcon, Clock, AlertCircle, ExternalLink, MoreHorizontal, X, LogIn, Edit, Eye, Filter, Tag, Star, StarOff, Save, AlignLeft, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../app/AppContext';

export function StudentsPage() {
  const { tasksCtrl, promptsCtrl, docsCtrl, journalCtrl, studentsCtrl, activeTab, setActiveTab, globalFocus, setGlobalFocus, showAlert, showConfirm, glassClass, inputClass, btnPrimary, btnSecondary, darkMode, toggleDarkMode } = useAppContext();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterClass, setFilterClass] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ name: '', className: '', gender: 'Nam', level: 'Khá', status: 'Đang học', notes: '' });

    useEffect(() => {
      if (globalFocus && activeTab === 'students') {
        const item = studentsCtrl.data.find(x => x.id === globalFocus.id);
        if (item) { setEditingItem(item); setFormData(item); setIsModalOpen(true); }
        setGlobalFocus(null);
      }
    }, [globalFocus, activeTab]);

    const classes = ['All', ...new Set(studentsCtrl.data.map(s => s.className))];

    const filtered = studentsCtrl.data.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = filterClass === 'All' || s.className === filterClass;
      return matchSearch && matchClass;
    }).sort((a,b) => a.name.localeCompare(b.name));

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.name || !formData.className) return showAlert("Lỗi", "Vui lòng nhập tên và lớp.");
      if (editingItem) studentsCtrl.updateItem(editingItem.id, formData);
      else studentsCtrl.addItem(formData);
      setIsModalOpen(false);
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ghi chú Học sinh</h1>
          <button onClick={() => {setEditingItem(null); setFormData({ name: '', className: '', gender: 'Nam', level: 'Khá', status: 'Đang học', notes: '' }); setIsModalOpen(true);}} className={btnPrimary}><Plus size={20}/> Thêm Học Sinh</button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input type="text" placeholder="Tìm tên học sinh..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputClass} pl-12`} />
          </div>
          <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className={`${inputClass} md:w-48`}>
            {classes.map(c => <option key={c} value={c}>{c === 'All' ? 'Tất cả các lớp' : `Lớp ${c}`}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(student => (
            <div key={student.id} onClick={() => {setEditingItem(student); setFormData(student); setIsModalOpen(true);}} className={`${glassClass} p-5 cursor-pointer hover:border-blue-300 transition-all`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{student.name}</h3>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded font-bold">{student.className}</span>
              </div>
              <div className="flex gap-2 mb-3 text-xs">
                <span className={`px-2 py-1 rounded-full ${student.level === 'Tốt' ? 'bg-green-100 text-green-700' : student.level === 'Khá' ? 'bg-blue-100 text-blue-700' : student.level === 'Trung bình' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{student.level}</span>
                <span className={`px-2 py-1 rounded-full ${student.status === 'Đang học' ? 'bg-slate-100 text-slate-600' : student.status === 'Cần quan tâm' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>{student.status}</span>
              </div>
              {student.notes && <p className="text-sm text-slate-500 line-clamp-2 italic"><AlignLeft size={14} className="inline mr-1"/>{student.notes}</p>}
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingItem ? 'Chi tiết / Sửa' : 'Thêm Hồ sơ'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full min-h-[44px] min-w-[44px]"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                    <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Lớp *</label>
                    <input type="text" list="class-list" value={formData.className} onChange={e=>setFormData({...formData, className: e.target.value})} className={inputClass} />
                    <datalist id="class-list"><option value="10A1"/><option value="11A1"/><option value="12A1"/></datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Giới tính</label>
                    <select value={formData.gender} onChange={e=>setFormData({...formData, gender: e.target.value})} className={inputClass}><option>Nam</option><option>Nữ</option></select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Học lực</label>
                    <select value={formData.level} onChange={e=>setFormData({...formData, level: e.target.value})} className={inputClass}><option>Tốt</option><option>Khá</option><option>Trung bình</option><option>Cần hỗ trợ</option></select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Trạng thái</label>
                    <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className={inputClass}><option>Đang học</option><option>Cần quan tâm</option><option>Đã nghỉ</option></select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ghi chú (nhắc nhở, đặc điểm...)</label>
                  <textarea value={formData.notes} onChange={e=>setFormData({...formData, notes: e.target.value})} className={`${inputClass} min-h-[100px] resize-y`}></textarea>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between rounded-b-2xl">
                {editingItem ? <button onClick={() => {showConfirm("Xóa", "Xóa hồ sơ này?", () => {studentsCtrl.deleteItem(editingItem.id); setIsModalOpen(false);})}} className="px-4 py-2.5 text-red-600 min-h-[44px] flex items-center gap-2"><Trash2 size={18}/> Xóa</button> : <div></div>}
                <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className={btnSecondary}>Hủy</button>
                  <button onClick={handleSubmit} className={btnPrimary}><Save size={20}/> Lưu</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

