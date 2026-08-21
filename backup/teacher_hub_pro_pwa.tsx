import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  LayoutDashboard, CheckSquare, MessageSquareQuote, FolderOpen,
  BookOpen, Users, Wand2, Settings as SettingsIcon,
  Sun, Moon, Plus, Trash2, Copy, Check, Search, Download, Upload,
  Calendar as CalendarIcon, Clock, AlertCircle, ExternalLink,
  MoreHorizontal, X, LogIn, Edit, Eye, Filter, Tag, Star, StarOff, 
  Save, AlignLeft, ChevronDown
} from 'lucide-react';

// Lớp trừu tượng StorageService - Hiện tại dùng LocalStorage, sẵn sàng thay bằng Firebase sau này
const StorageService = {
  _getKey: (col) => `thp_${col}`,
  getAll: (col) => {
    try { 
      const data = JSON.parse(window.localStorage.getItem(StorageService._getKey(col)));
      return Array.isArray(data) ? data : []; 
    } catch { return []; }
  },
  getById: (col, id) => StorageService.getAll(col).find(x => x.id === id),
  create: (col, data) => {
    const all = StorageService.getAll(col);
    const newItem = { 
      ...data, 
      id: data.id || Date.now().toString(), 
      createdAt: Date.now(), 
      updatedAt: Date.now() 
    };
    window.localStorage.setItem(StorageService._getKey(col), JSON.stringify([newItem, ...all]));
    return newItem;
  },
  update: (col, id, data) => {
    const all = StorageService.getAll(col);
    const updated = all.map(x => x.id === id ? { ...x, ...data, updatedAt: Date.now() } : x);
    window.localStorage.setItem(StorageService._getKey(col), JSON.stringify(updated));
  },
  delete: (col, id) => {
    const all = StorageService.getAll(col);
    window.localStorage.setItem(StorageService._getKey(col), JSON.stringify(all.filter(x => x.id !== id)));
  },
  hardSet: (col, data) => {
    window.localStorage.setItem(StorageService._getKey(col), JSON.stringify(data));
  }
};

// Custom Hook giao tiếp với StorageService
function useStorageController(collectionName, initialData) {
  const [data, setData] = useState(() => {
    const existing = StorageService.getAll(collectionName);
    if (existing && existing.length > 0) {
      // Migration an toàn: Bổ sung createdAt/updatedAt cho data cũ
      const migrated = existing.map(item => ({
        ...item,
        createdAt: item.createdAt || Date.now(),
        updatedAt: item.updatedAt || Date.now()
      }));
      if (JSON.stringify(existing) !== JSON.stringify(migrated)) {
        StorageService.hardSet(collectionName, migrated);
      }
      return migrated;
    }
    StorageService.hardSet(collectionName, initialData);
    return initialData;
  });

  const refresh = useCallback(() => setData(StorageService.getAll(collectionName)), [collectionName]);

  const addItem = (item) => { StorageService.create(collectionName, item); refresh(); };
  const updateItem = (id, item) => { StorageService.update(collectionName, id, item); refresh(); };
  const deleteItem = (id) => { StorageService.delete(collectionName, id); refresh(); };
  const hardSetData = (newData) => { StorageService.hardSet(collectionName, newData); refresh(); };

  return { data, addItem, updateItem, deleteItem, hardSetData };
}

// Initial Mock Data cho người dùng mới
const initialTasks = [
  { id: '1', title: 'Chấm bài kiểm tra 15p Lớp 10A1', dueDate: new Date().toISOString().split('T')[0], priority: 'HIGH', completed: false, createdAt: Date.now(), updatedAt: Date.now() },
  { id: '2', title: 'Nộp kế hoạch giảng dạy tuần sau', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], priority: 'MEDIUM', completed: false, createdAt: Date.now(), updatedAt: Date.now() },
];
const initialPrompts = [
  { id: '1', title: 'Tạo dàn ý bài giảng', content: 'Đóng vai là một giáo viên Tin học THPT, hãy tạo một dàn ý bài giảng chi tiết trong 45 phút cho bài học về "Cấu trúc rẽ nhánh". Yêu cầu có phần khởi động, hình thành kiến thức, luyện tập và vận dụng thực tế.', description: 'Dùng để soạn giáo án nhanh', category: 'Giáo án', tags: 'tin-hoc, thpt', favorite: true, createdAt: Date.now(), updatedAt: Date.now() },
];
const initialDocs = [];
const initialJournal = [];
const initialStudents = [];

export default function App() {
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem('thp_darkMode') === 'true');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'alert', onConfirm: null });
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  
  // State phục vụ click từ Search (Deep Linking)
  const [globalFocus, setGlobalFocus] = useState(null);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    window.localStorage.setItem('thp_darkMode', darkMode);
  }, [darkMode]);

  const tasksCtrl = useStorageController('tasks', initialTasks);
  const promptsCtrl = useStorageController('prompts', initialPrompts);
  const docsCtrl = useStorageController('docs', initialDocs);
  const journalCtrl = useStorageController('journals', initialJournal);
  const studentsCtrl = useStorageController('students', initialStudents);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const showAlert = (title, message) => setModalConfig({ isOpen: true, title, message, type: 'alert' });
  const showConfirm = (title, message, onConfirm) => setModalConfig({ isOpen: true, title, message, type: 'confirm', onConfirm });
  const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

  const glassClass = "bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm rounded-2xl";
  const inputClass = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 min-h-[44px] text-base md:text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all";
  const btnPrimary = "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 min-h-[44px] rounded-xl font-medium transition-colors flex items-center justify-center gap-2";
  const btnSecondary = "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 min-h-[44px] rounded-xl font-medium transition-colors flex items-center justify-center gap-2";

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'tasks', icon: CheckSquare, label: 'Công việc' },
    { id: 'prompts', icon: MessageSquareQuote, label: 'Prompt AI' },
    { id: 'students', icon: Users, label: 'Học sinh' },
  ];
  const moreNavItems = [
    { id: 'journal', icon: BookOpen, label: 'Nhật ký' },
    { id: 'docs', icon: FolderOpen, label: 'Tài liệu' },
    { id: 'ai-tools', icon: Wand2, label: 'Công cụ AI' },
    { id: 'settings', icon: SettingsIcon, label: 'Cài đặt' },
  ];

  const GlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef(null);

    useEffect(() => { if (globalSearchOpen && inputRef.current) setTimeout(() => inputRef.current.focus(), 100); }, [globalSearchOpen]);

    const results = useMemo(() => {
      if (!searchTerm || searchTerm.length < 2) return [];
      const lowerTerm = searchTerm.toLowerCase();
      let res = [];

      tasksCtrl.data.filter(t => t.title.toLowerCase().includes(lowerTerm))
        .forEach(t => res.push({ id: t.id, type: 'Công việc', icon: CheckSquare, title: t.title, desc: t.dueDate, tab: 'tasks' }));
      promptsCtrl.data.filter(p => p.title.toLowerCase().includes(lowerTerm) || p.content.toLowerCase().includes(lowerTerm))
        .forEach(p => res.push({ id: p.id, type: 'Prompt', icon: MessageSquareQuote, title: p.title, desc: p.category, tab: 'prompts' }));
      studentsCtrl.data.filter(s => s.name.toLowerCase().includes(lowerTerm) || s.className.toLowerCase().includes(lowerTerm))
        .forEach(s => res.push({ id: s.id, type: 'Học sinh', icon: Users, title: s.name, desc: s.className, tab: 'students' }));
      journalCtrl.data.filter(j => j.title.toLowerCase().includes(lowerTerm) || j.content.toLowerCase().includes(lowerTerm))
        .forEach(j => res.push({ id: j.id, type: 'Nhật ký', icon: BookOpen, title: j.title, desc: j.date, tab: 'journal' }));
      docsCtrl.data.filter(d => d.title.toLowerCase().includes(lowerTerm) || d.category.toLowerCase().includes(lowerTerm))
        .forEach(d => res.push({ id: d.id, type: 'Tài liệu', icon: FolderOpen, title: d.title, desc: d.category, tab: 'docs' }));
      
      return res.slice(0, 15);
    }, [searchTerm, tasksCtrl.data, promptsCtrl.data, studentsCtrl.data, journalCtrl.data, docsCtrl.data]);

    if (!globalSearchOpen) return null;

    const handleSelect = (res) => {
      setActiveTab(res.tab);
      setGlobalFocus({ id: res.id, action: 'view' });
      setGlobalSearchOpen(false);
      setSearchTerm('');
    };

    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-safe-top sm:p-4">
        <div className="w-full h-full sm:h-auto sm:max-h-[80vh] max-w-2xl bg-white dark:bg-slate-900 sm:rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="text-slate-400" size={24} />
            <input ref={inputRef} type="text" placeholder="Tìm kiếm mọi thứ..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 bg-transparent text-lg text-slate-800 dark:text-white outline-none placeholder:text-slate-400 min-h-[44px]" />
            <button onClick={() => setSearchTerm('')} className={`p-2 ${searchTerm ? 'opacity-100' : 'opacity-0'} transition-opacity text-slate-400`}><X size={20} /></button>
            <button onClick={() => setGlobalSearchOpen(false)} className="p-2 text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap min-h-[44px]">Đóng</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {searchTerm.length > 0 && searchTerm.length < 2 && <p className="p-4 text-center text-slate-500">Nhập ít nhất 2 ký tự...</p>}
            {searchTerm.length >= 2 && results.length === 0 && <p className="p-8 text-center text-slate-500 flex flex-col items-center gap-2"><Search size={32} className="opacity-30" /> Không tìm thấy kết quả nào.</p>}
            {results.map((res, idx) => (
              <button key={idx} onClick={() => handleSelect(res)} className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-4 rounded-xl transition-colors min-h-[60px]">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-blue-500 flex-shrink-0"><res.icon size={20} /></div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{res.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{res.desc}</p>
                </div>
                <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded flex-shrink-0">{res.type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SyncIndicator = () => (
    <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
      <Save size={14} className="text-slate-500"/> <span className="hidden sm:inline">Đã lưu cục bộ</span>
    </div>
  );

  const Dashboard = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tasks = tasksCtrl.data;
    const pendingTasks = tasks.filter(t => !t.completed).length;
    const todayTasks = tasks.filter(t => !t.completed && t.dueDate === todayStr).length;
    const overdueTasks = tasks.filter(t => !t.completed && t.dueDate < todayStr).length;
    const todayDateStr = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
      <div className="space-y-6 animate-in fade-in">
        <header className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">Xin chào, Thầy/Cô 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2 text-sm lg:text-base"><CalendarIcon size={16} /> {todayDateStr}</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <div className={`${glassClass} p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-blue-500`}>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-xl w-fit"><CheckSquare size={24} /></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hôm nay</p>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{todayTasks} <span className="text-sm font-normal text-slate-400">/ {pendingTasks}</span></h3>
            </div>
          </div>
          
          <div className={`${glassClass} p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-red-500`}>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl w-fit"><AlertCircle size={24} /></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quá hạn</p>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{overdueTasks}</h3>
            </div>
          </div>

          <div className={`${glassClass} p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-emerald-500`}>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-xl w-fit"><MessageSquareQuote size={24} /></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Prompt AI</p>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{promptsCtrl.data.length}</h3>
            </div>
          </div>

          <div className={`${glassClass} p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-3 border-l-4 border-l-purple-500`}>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-xl w-fit"><Users size={24} /></div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Học sinh</p>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{studentsCtrl.data.length}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className={`${glassClass} p-5 lg:p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Clock size={20} className="text-blue-500" /> Cần làm ngay</h2>
              <button onClick={() => setActiveTab('tasks')} className="text-sm text-blue-500 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 min-h-[44px]">Xem tất cả</button>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => !t.completed).sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center space-x-3 truncate flex-1">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${task.priority === 'HIGH' ? 'bg-red-500' : task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <span className="text-sm lg:text-base text-slate-700 dark:text-slate-300 truncate font-medium">{task.title}</span>
                  </div>
                  <span className={`text-xs whitespace-nowrap ml-3 px-2 py-1 rounded-md border ${task.dueDate < todayStr ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-700'}`}>{task.dueDate.slice(5)}</span>
                </div>
              ))}
              {tasks.filter(t => !t.completed).length === 0 && <p className="text-slate-500 text-center py-6 text-sm">Tuyệt vời! Không có việc chờ.</p>}
            </div>
          </div>

          <div className={`${glassClass} p-5 lg:p-6`}>
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><BookOpen size={20} className="text-purple-500" /> Nhật ký gần đây</h2>
              <button onClick={() => setActiveTab('journal')} className="text-sm text-purple-500 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 min-h-[44px]">Xem tất cả</button>
            </div>
            <div className="space-y-4">
              {journalCtrl.data.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3).map(entry => (
                <div key={entry.id} className="border-l-2 border-purple-400 dark:border-purple-600 pl-4 py-1">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 block mb-1">{entry.date} - {entry.category}</span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{entry.title}</p>
                </div>
              ))}
              {journalCtrl.data.length === 0 && <p className="text-slate-500 text-center py-6 text-sm">Chưa có nhật ký nào.</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PromptLibrary = () => {
    const [filterCategory, setFilterCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '', description: '', category: 'Giáo án', tags: '', favorite: false });
    const [copiedId, setCopiedId] = useState(null);

    // Deep linking handler
    useEffect(() => {
      if (globalFocus && activeTab === 'prompts') {
        const item = promptsCtrl.data.find(x => x.id === globalFocus.id);
        if (item) { setEditingItem(item); setFormData(item); setIsModalOpen(true); }
        setGlobalFocus(null);
      }
    }, [globalFocus, activeTab]);

    const categories = ['All', ...new Set(promptsCtrl.data.map(p => p.category))];
    
    const filteredPrompts = promptsCtrl.data.filter(p => {
      const matchCat = filterCategory === 'All' || p.category === filterCategory;
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => (b.favorite === a.favorite ? b.updatedAt - a.updatedAt : b.favorite ? 1 : -1));

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title || !formData.content) return showAlert("Lỗi", "Vui lòng nhập tiêu đề và nội dung.");
      if (editingItem) promptsCtrl.updateItem(editingItem.id, formData);
      else promptsCtrl.addItem(formData);
      setIsModalOpen(false);
    };

    const handleDelete = (id) => {
      showConfirm("Xóa Prompt", "Bạn có chắc chắn muốn xóa Prompt này không?", () => promptsCtrl.deleteItem(id));
    };

    const handleCopy = (e, id, content) => {
      e.stopPropagation();
      navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    };

    const openModal = (item = null) => {
      setEditingItem(item);
      setFormData(item || { title: '', content: '', description: '', category: 'Giáo án', tags: '', favorite: false });
      setIsModalOpen(true);
    };

    const toggleFav = (e, id, current) => {
      e.stopPropagation();
      promptsCtrl.updateItem(id, { favorite: !current });
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Thư viện Prompt AI</h1>
          <button onClick={() => openModal()} className={btnPrimary}><Plus size={20}/> Thêm Prompt</button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input type="text" placeholder="Tìm kiếm prompt..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputClass} pl-12`} />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`${inputClass} md:w-48`}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filteredPrompts.map(prompt => (
            <div key={prompt.id} onClick={() => openModal(prompt)} className={`${glassClass} p-5 flex flex-col h-full relative group cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors`}>
              <div className="mb-3 flex justify-between items-start">
                <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-lg">{prompt.category}</span>
                <div className="flex gap-2">
                  <button onClick={(e) => toggleFav(e, prompt.id, prompt.favorite)} className="p-2 -mr-2 text-amber-400 hover:scale-110 transition-transform">
                    {prompt.favorite ? <Star fill="currentColor" size={20}/> : <StarOff size={20} className="text-slate-300"/>}
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">{prompt.title}</h3>
              {prompt.description && <p className="text-xs text-slate-500 mb-2 italic">{prompt.description}</p>}
              <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 line-clamp-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-[13px]">{prompt.content}</p>
              
              <div className="mt-4 flex gap-2">
                 <button onClick={(e) => handleCopy(e, prompt.id, prompt.content)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px]">
                  {copiedId === prompt.id ? <><Check size={18} className="text-green-500"/> Đã copy</> : <><Copy size={18}/> Copy</>}
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
                <h2 className="text-xl font-bold">{editingItem ? 'Chi tiết Prompt' : 'Thêm Prompt Mới'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium mb-1">Tiêu đề *</label>
                  <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="VD: Soạn giáo án bài 1..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Danh mục</label>
                  <input type="text" list="prompt-cats" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className={inputClass} />
                  <datalist id="prompt-cats"><option value="Giáo án"/><option value="Đề thi"/><option value="Trò chơi"/><option value="Khác"/></datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả ngắn gọn</label>
                  <input type="text" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nội dung Prompt (để gửi cho AI) *</label>
                  <textarea value={formData.content} onChange={e=>setFormData({...formData, content: e.target.value})} className={`${inputClass} min-h-[150px] resize-y`} placeholder="Đóng vai là..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags (cách nhau dấu phẩy)</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                    <input type="text" value={formData.tags} onChange={e=>setFormData({...formData, tags: e.target.value})} className={`${inputClass} pl-10`} placeholder="tin-hoc, thpt, kiem-tra" />
                  </div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer p-2 min-h-[44px]">
                  <input type="checkbox" checked={formData.favorite} onChange={e=>setFormData({...formData, favorite: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Đánh dấu Yêu thích</span>
                </label>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between rounded-b-2xl sticky bottom-0">
                {editingItem ? (
                  <button onClick={() => handleDelete(editingItem.id)} className="px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium min-h-[44px] flex items-center gap-2"><Trash2 size={18}/> Xóa</button>
                ) : <div></div>}
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

  const Tasks = () => {
    const [filter, setFilter] = useState('All'); // All, Incomplete, Completed, Today, Overdue
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ title: '', dueDate: new Date().toISOString().split('T')[0], priority: 'MEDIUM', completed: false });

    useEffect(() => {
      if (globalFocus && activeTab === 'tasks') {
        const item = tasksCtrl.data.find(x => x.id === globalFocus.id);
        if (item) { setEditingItem(item); setFormData(item); setIsModalOpen(true); }
        setGlobalFocus(null);
      }
    }, [globalFocus, activeTab]);

    const todayStr = new Date().toISOString().split('T')[0];

    const filteredTasks = tasksCtrl.data.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      let matchFilter = true;
      if (filter === 'Incomplete') matchFilter = !t.completed;
      if (filter === 'Completed') matchFilter = t.completed;
      if (filter === 'Today') matchFilter = t.dueDate === todayStr;
      if (filter === 'Overdue') matchFilter = t.dueDate < todayStr && !t.completed;
      return matchSearch && matchFilter;
    }).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      if (pWeight[b.priority] !== pWeight[a.priority]) return pWeight[b.priority] - pWeight[a.priority];
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title.trim()) return showAlert("Lỗi", "Vui lòng nhập tên công việc.");
      if (editingItem) tasksCtrl.updateItem(editingItem.id, formData);
      else tasksCtrl.addItem(formData);
      setIsModalOpen(false);
    };

    const handleDelete = (id) => {
      showConfirm("Xóa", "Xóa công việc này?", () => tasksCtrl.deleteItem(id));
    };

    const toggleTask = (id, current) => {
      tasksCtrl.updateItem(id, { completed: !current });
    };

    const openModal = (item = null) => {
      setEditingItem(item);
      setFormData(item || { title: '', dueDate: todayStr, priority: 'MEDIUM', completed: false });
      setIsModalOpen(true);
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Quản lý Công việc</h1>
          <button onClick={() => openModal()} className={btnPrimary}><Plus size={20}/> Thêm Việc</button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input type="text" placeholder="Tìm công việc..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputClass} pl-12`} />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${inputClass} md:w-48`}>
            <option value="All">Tất cả</option>
            <option value="Incomplete">Chưa làm</option>
            <option value="Completed">Đã xong</option>
            <option value="Today">Hôm nay</option>
            <option value="Overdue">Quá hạn</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div key={task.id} className={`${glassClass} p-4 flex items-center justify-between group transition-all duration-200 ${task.completed ? 'opacity-60 bg-slate-100/50 dark:bg-slate-800/40' : ''}`}>
              <div className="flex items-center space-x-4 flex-1 overflow-hidden cursor-pointer" onClick={() => openModal(task)}>
                <button onClick={(e) => { e.stopPropagation(); toggleTask(task.id, task.completed); }} className={`flex-shrink-0 rounded-lg border-2 flex items-center justify-center transition-all min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] ${task.completed ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                  {task.completed && <Check size={18} />}
                </button>
                <div className="flex flex-col truncate flex-1">
                  <span className={`text-base font-medium truncate ${task.completed ? 'line-through text-slate-500 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</span>
                  <div className="flex items-center space-x-3 mt-1 text-xs">
                    <span className={`flex items-center ${task.dueDate < todayStr && !task.completed ? 'text-red-500 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                      <CalendarIcon size={12} className="mr-1" /> {task.dueDate}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-[10px] ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{task.priority}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(task.id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center"><Trash2 size={20} /></button>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className={`${glassClass} p-12 text-center text-slate-500 flex flex-col items-center`}>
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
                <h2 className="text-xl font-bold">{editingItem ? 'Sửa Công Việc' : 'Thêm Công Việc'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px] flex items-center justify-center"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên công việc *</label>
                  <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hạn chót</label>
                  <input type="date" value={formData.dueDate} onChange={e=>setFormData({...formData, dueDate: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mức độ ưu tiên</label>
                  <select value={formData.priority} onChange={e=>setFormData({...formData, priority: e.target.value})} className={inputClass}>
                    <option value="LOW">Thấp</option><option value="MEDIUM">Vừa</option><option value="HIGH">Cao</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setIsModalOpen(false)} className={btnSecondary}>Hủy</button>
                <button onClick={handleSubmit} className={btnPrimary}><Save size={20}/> Lưu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Students = () => {
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

  const Journal = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const todayStr = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({ date: todayStr, title: '', category: 'Chuyên môn', content: '', conclusion: '', notes: '' });

    useEffect(() => {
      if (globalFocus && activeTab === 'journal') {
        const item = journalCtrl.data.find(x => x.id === globalFocus.id);
        if (item) { setEditingItem(item); setFormData(item); setIsModalOpen(true); }
        setGlobalFocus(null);
      }
    }, [globalFocus, activeTab]);

    const categories = ['Họp tổ', 'Chuyên môn', 'Dạy học', 'Dự giờ', 'Kiểm tra', 'Công việc', 'Khác'];

    const filtered = journalCtrl.data.filter(j => {
      const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'All' || j.category === filterCategory;
      return matchSearch && matchCat;
    }).sort((a,b) => new Date(b.date) - new Date(a.date));

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title || !formData.date) return showAlert("Lỗi", "Vui lòng nhập ngày và tiêu đề.");
      if (editingItem) journalCtrl.updateItem(editingItem.id, formData);
      else journalCtrl.addItem(formData);
      setIsModalOpen(false);
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Nhật ký Giảng dạy</h1>
          <button onClick={() => {setEditingItem(null); setFormData({ date: todayStr, title: '', category: 'Chuyên môn', content: '', conclusion: '', notes: '' }); setIsModalOpen(true);}} className={btnPrimary}><Plus size={20}/> Viết Nhật ký</button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input type="text" placeholder="Tìm nhật ký..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputClass} pl-12`} />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`${inputClass} md:w-48`}>
            <option value="All">Tất cả danh mục</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-4">
          {filtered.map(entry => (
             <div key={entry.id} onClick={() => {setEditingItem(entry); setFormData(entry); setIsModalOpen(true);}} className={`${glassClass} p-5 cursor-pointer hover:border-purple-300 transition-all border-l-4 border-l-purple-500`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{entry.title}</h3>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{entry.date}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2 block">{entry.category}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{entry.content}</p>
             </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h2 className="text-xl font-bold">{editingItem ? 'Chi tiết Nhật ký' : 'Viết Nhật ký Mới'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full min-h-[44px] min-w-[44px]"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ngày *</label>
                    <input type="date" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Danh mục</label>
                    <select value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className={inputClass}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tiêu đề / Tóm tắt sự việc *</label>
                  <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nội dung chi tiết</label>
                  <textarea value={formData.content} onChange={e=>setFormData({...formData, content: e.target.value})} className={`${inputClass} min-h-[120px] resize-y`}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kết luận / Đánh giá</label>
                  <textarea value={formData.conclusion} onChange={e=>setFormData({...formData, conclusion: e.target.value})} className={`${inputClass} min-h-[80px] resize-y`}></textarea>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between rounded-b-2xl sticky bottom-0">
                {editingItem ? <button onClick={() => {showConfirm("Xóa", "Xóa mục nhật ký này?", () => {journalCtrl.deleteItem(editingItem.id); setIsModalOpen(false);})}} className="px-4 py-2.5 text-red-600 min-h-[44px] flex items-center gap-2"><Trash2 size={18}/> Xóa</button> : <div></div>}
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

  const DocumentCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({ title: '', url: '', category: 'Chuyên môn', description: '' });

    useEffect(() => {
      if (globalFocus && activeTab === 'docs') {
        const item = docsCtrl.data.find(x => x.id === globalFocus.id);
        if (item) { setEditingItem(item); setFormData(item); setIsModalOpen(true); }
        setGlobalFocus(null);
      }
    }, [globalFocus, activeTab]);

    const filtered = docsCtrl.data.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const groupedDocs = filtered.reduce((acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    }, {});

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formData.title.trim() || !formData.url.trim()) return showAlert("Lỗi", "Cần nhập Tên tài liệu và Link URL.");
      let cleanUrl = formData.url.trim();
      if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'http://' + cleanUrl;
      
      if (editingItem) docsCtrl.updateItem(editingItem.id, { ...formData, url: cleanUrl });
      else docsCtrl.addItem({ ...formData, url: cleanUrl });
      setIsModalOpen(false);
    };

    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tài liệu (Drive Links)</h1>
          <button onClick={() => {setEditingItem(null); setFormData({ title: '', url: '', category: 'Chuyên môn', description: '' }); setIsModalOpen(true);}} className={btnPrimary}><Plus size={20}/> Thêm Link</button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
          <input type="text" placeholder="Tìm tài liệu, thư mục..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${inputClass} pl-12`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {Object.entries(groupedDocs).map(([category, categoryDocs]) => (
            <div key={category} className={`${glassClass} p-5 lg:p-6`}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center gap-2">
                <FolderOpen size={20} className="text-amber-500" /> {category}
              </h3>
              <ul className="space-y-3">
                {categoryDocs.map(doc => (
                  <li key={doc.id} className="flex flex-col p-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-3">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium flex-1 truncate min-h-[32px] hover:underline">
                        <ExternalLink size={18} className="flex-shrink-0" />
                        <span className="truncate">{doc.title}</span>
                      </a>
                      <div className="flex gap-1">
                        <button onClick={() => {setEditingItem(doc); setFormData(doc); setIsModalOpen(true);}} className="p-2 text-slate-400 hover:text-blue-500 min-h-[44px] min-w-[44px] flex justify-center items-center"><Edit size={18} /></button>
                        <button onClick={() => showConfirm("Xóa", "Xóa tài liệu này?", () => docsCtrl.deleteItem(doc.id))} className="p-2 text-slate-400 hover:text-red-500 min-h-[44px] min-w-[44px] flex justify-center items-center"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    {doc.description && <p className="text-xs text-slate-500 mt-1 ml-7">{doc.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {Object.keys(groupedDocs).length === 0 && <p className="text-slate-500 w-full col-span-2 text-center py-8">Không có tài liệu nào.</p>}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingItem ? 'Sửa Link Tài liệu' : 'Thêm Link Mới'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full min-h-[44px] min-w-[44px]"><X size={24}/></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên tài liệu *</label>
                  <input type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Link (Google Drive/OneDrive) *</label>
                  <input type="url" value={formData.url} onChange={e=>setFormData({...formData, url: e.target.value})} placeholder="https://..." className={inputClass} />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Thư mục / Danh mục</label>
                   <input type="text" list="doc-categories" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} className={inputClass} />
                   <datalist id="doc-categories"><option value="Chuyên môn"/><option value="Tập huấn"/><option value="Biểu mẫu"/></datalist>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mô tả thêm (Tùy chọn)</label>
                  <input type="text" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} className={inputClass} />
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setIsModalOpen(false)} className={btnSecondary}>Hủy</button>
                <button onClick={handleSubmit} className={btnPrimary}><Save size={20}/> Lưu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Settings = () => {
    const handleExport = () => {
      const data = {
        tasks: tasksCtrl.data, prompts: promptsCtrl.data, docs: docsCtrl.data,
        journals: journalCtrl.data, students: studentsCtrl.data
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `TeacherHub_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    const handleImport = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonObj = JSON.parse(event.target.result);
          if (jsonObj.tasks) tasksCtrl.hardSetData(jsonObj.tasks);
          if (jsonObj.prompts) promptsCtrl.hardSetData(jsonObj.prompts);
          if (jsonObj.docs) docsCtrl.hardSetData(jsonObj.docs);
          if (jsonObj.journals) journalCtrl.hardSetData(jsonObj.journals);
          if (jsonObj.students) studentsCtrl.hardSetData(jsonObj.students);
          showAlert("Thành công", "Đã phục hồi toàn bộ dữ liệu.");
        } catch (error) {
          showAlert("Lỗi", "File backup không hợp lệ.");
        }
      };
      reader.readAsText(file);
    };

    return (
      <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Cài đặt</h1>
        
        <div className={`${glassClass} p-5 lg:p-6 space-y-6`}>
           <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">Giao diện</h3>
              <p className="text-sm text-slate-500">Chuyển đổi Sáng / Tối</p>
            </div>
            <button onClick={toggleDarkMode} className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center">
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
             <h3 className="font-bold text-slate-800 dark:text-white mb-1">Sao lưu Dữ liệu (Local JSON)</h3>
             <p className="text-sm text-slate-500 mb-4">Lưu trữ file backup đề phòng rủi ro mất dữ liệu trình duyệt.</p>
             <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
                  <Download size={20} /> Tải file Backup
                </button>
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded-xl font-medium transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
                  <Upload size={20} /> Phục hồi từ file
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
             </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white font-bold text-2xl shadow-lg mb-3">T</div>
             <p className="font-bold text-slate-800 dark:text-white">Teacher Hub Pro</p>
             <p className="text-xs text-slate-500 mt-1">Version 1.2.0 (Offline Mode)</p>
          </div>
        </div>
      </div>
    );
  };

  const renderModals = () => {
    if (!modalConfig.isOpen) return null;
    return (
      <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{modalConfig.title}</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{modalConfig.message}</p>
          <div className="flex gap-3 justify-end">
            {modalConfig.type === 'confirm' && (
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 min-h-[44px]">Hủy</button>
            )}
            <button onClick={() => { if (modalConfig.onConfirm) modalConfig.onConfirm(); closeModal(); }} className={`px-5 py-2.5 rounded-xl font-medium min-h-[44px] text-white ${modalConfig.type === 'confirm' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {modalConfig.type === 'confirm' ? 'Xác nhận' : 'Đóng'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-[100dvh] transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[100px] opacity-20 ${darkMode ? 'bg-blue-600' : 'bg-blue-400'}`}></div>
        <div className={`absolute top-1/2 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-20 ${darkMode ? 'bg-purple-600' : 'bg-purple-400'}`}></div>
      </div>

      <div className="flex h-[100dvh] relative z-10 overflow-hidden pb-[72px] lg:pb-0">
        <aside className="hidden lg:flex flex-col w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800">
          <div className="p-6 flex items-center space-x-3 border-b border-slate-200/50 dark:border-slate-800">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">T</div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Teacher Hub</h2>
              <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Pro Edition</p>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Menu Chính</div>
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium min-h-[44px] ${activeTab === item.id ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <item.icon size={20} className={activeTab === item.id ? 'animate-pulse' : ''}/> <span>{item.label}</span>
              </button>
            ))}
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4 pt-6">Thêm</div>
            {moreNavItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium min-h-[44px] ${activeTab === item.id ? 'bg-purple-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                <item.icon size={20} /> <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-800">
             <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
               <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center"><LogIn size={20} className="text-slate-500"/></div>
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-bold text-slate-800 dark:text-white truncate">Local User</p>
                 <SyncIndicator />
               </div>
             </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          <header className="px-4 py-3 sm:p-4 lg:p-6 flex items-center justify-between sticky top-0 z-30 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800 lg:border-none lg:bg-transparent">
             <div className="flex items-center lg:hidden">
               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">T</div>
             </div>
             <div className="hidden lg:flex items-center"><SyncIndicator /></div>
             <div className="flex-1 flex justify-end">
               <button onClick={() => setGlobalSearchOpen(true)} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-500 px-4 py-2.5 rounded-full w-10 sm:w-64 min-h-[44px] overflow-hidden">
                 <Search size={20} className="flex-shrink-0" />
                 <span className="hidden sm:inline font-medium text-sm">Tìm mọi thứ...</span>
               </button>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative z-20" id="scroll-container">
            <div className="max-w-7xl mx-auto pb-safe-bottom">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'tasks' && <Tasks />}
              {activeTab === 'prompts' && <PromptLibrary />}
              {activeTab === 'students' && <Students />}
              {activeTab === 'journal' && <Journal />}
              {activeTab === 'docs' && <DocumentCenter />}
              {activeTab === 'settings' && <Settings />}
              {activeTab === 'ai-tools' && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                   <Wand2 size={64} className="mb-4 opacity-20" />
                   <p>Công cụ AI (Giáo án, Đề thi) sẽ được ra mắt trong phiên bản sau.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-40 pb-safe">
        <div className="flex justify-around items-center h-[72px] px-2">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMoreOpen(false); }} className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${activeTab === item.id && !mobileMoreOpen ? 'text-blue-600' : 'text-slate-500'}`}>
              <item.icon size={24} className={activeTab === item.id && !mobileMoreOpen ? 'animate-bounce-slight' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setMobileMoreOpen(!mobileMoreOpen)} className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${mobileMoreOpen ? 'text-purple-600' : 'text-slate-500'}`}>
            <MoreHorizontal size={24} />
            <span className="text-[10px] font-medium">Thêm</span>
          </button>
        </div>
      </nav>

      {mobileMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMoreOpen(false)}>
          <div className="absolute bottom-[72px] left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-full duration-200" onClick={e => e.stopPropagation()}>
             <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
             <div className="grid grid-cols-4 gap-4 mb-4">
                {moreNavItems.map(item => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMoreOpen(false); }} className="flex flex-col items-center gap-2">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${activeTab === item.id ? 'bg-purple-100 text-purple-600 border-2 border-purple-500' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}><item.icon size={24} /></div>
                     <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                  </button>
                ))}
             </div>
             <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-2">
                <SyncIndicator />
             </div>
          </div>
        </div>
      )}

      <GlobalSearch />
      {renderModals()}

      <style dangerouslySetInnerHTML={{__html: `
        :root { --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px); --safe-area-inset-top: env(safe-area-inset-top, 0px); }
        body { -webkit-tap-highlight-color: transparent; overscroll-behavior-y: none; }
        .pb-safe { padding-bottom: var(--safe-area-inset-bottom); }
        .pb-safe-bottom { padding-bottom: calc(24px + var(--safe-area-inset-bottom)); }
        .pt-safe-top { padding-top: var(--safe-area-inset-top); }
        @media screen and (max-width: 768px) { input, select, textarea { font-size: 16px !important; } }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark ::-webkit-scrollbar-thumb { background: #334155; }
        .animate-bounce-slight { animation: bounceSlight 0.4s ease-in-out; }
        @keyframes bounceSlight { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}} />
    </div>
  );
}