import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckSquare,
  MessageSquareQuote,
  FolderOpen,
  BookOpen,
  Users,
  Search,
  X,
  LucideIcon,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';

interface SearchResultItem {
  id: string;
  type: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  tab: string;
}

export function GlobalSearch() {
  const {
    globalSearchOpen,
    setGlobalSearchOpen,
    setActiveTab,
    setGlobalFocus,
    tasksCtrl,
    promptsCtrl,
    docsCtrl,
    journalCtrl,
    studentsCtrl,
  } = useAppContext();

  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (globalSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [globalSearchOpen]);

  const results = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const lowerTerm = searchTerm.toLowerCase();
    const res: SearchResultItem[] = [];

    tasksCtrl.data
      .filter((t) => t.title.toLowerCase().includes(lowerTerm))
      .forEach((t) =>
        res.push({
          id: t.id,
          type: 'Công việc',
          icon: CheckSquare,
          title: t.title,
          desc: t.dueDate,
          tab: 'tasks',
        }),
      );

    promptsCtrl.data
      .filter(
        (p) =>
          p.title.toLowerCase().includes(lowerTerm) ||
          p.content.toLowerCase().includes(lowerTerm),
      )
      .forEach((p) =>
        res.push({
          id: p.id,
          type: 'Prompt',
          icon: MessageSquareQuote,
          title: p.title,
          desc: p.category,
          tab: 'prompts',
        }),
      );

    studentsCtrl.data
      .filter(
        (s) =>
          s.name.toLowerCase().includes(lowerTerm) ||
          s.className.toLowerCase().includes(lowerTerm),
      )
      .forEach((s) =>
        res.push({
          id: s.id,
          type: 'Học sinh',
          icon: Users,
          title: s.name,
          desc: s.className,
          tab: 'students',
        }),
      );

    journalCtrl.data
      .filter(
        (j) =>
          j.title.toLowerCase().includes(lowerTerm) ||
          j.content.toLowerCase().includes(lowerTerm),
      )
      .forEach((j) =>
        res.push({
          id: j.id,
          type: 'Nhật ký',
          icon: BookOpen,
          title: j.title,
          desc: j.date,
          tab: 'journal',
        }),
      );

    docsCtrl.data
      .filter(
        (d) =>
          d.title.toLowerCase().includes(lowerTerm) ||
          d.category.toLowerCase().includes(lowerTerm),
      )
      .forEach((d) =>
        res.push({
          id: d.id,
          type: 'Tài liệu',
          icon: FolderOpen,
          title: d.title,
          desc: d.category,
          tab: 'docs',
        }),
      );

    return res.slice(0, 15);
  }, [
    searchTerm,
    tasksCtrl.data,
    promptsCtrl.data,
    studentsCtrl.data,
    journalCtrl.data,
    docsCtrl.data,
  ]);

  if (!globalSearchOpen) return null;

  const handleSelect = (res: SearchResultItem) => {
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
          <input
            ref={inputRef}
            type="text"
            placeholder="Tìm kiếm mọi thứ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-lg text-slate-800 dark:text-white outline-none placeholder:text-slate-400 min-h-[44px]"
          />
          <button
            onClick={() => setSearchTerm('')}
            className={`p-2 ${
              searchTerm ? 'opacity-100' : 'opacity-0'
            } transition-opacity text-slate-400`}
          >
            <X size={20} />
          </button>
          <button
            onClick={() => setGlobalSearchOpen(false)}
            className="p-2 text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap min-h-[44px]"
          >
            Đóng
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="p-4 text-center text-slate-500">Nhập ít nhất 2 ký tự...</p>
          )}
          {searchTerm.length >= 2 && results.length === 0 && (
            <p className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
              <Search size={32} className="opacity-30" /> Không tìm thấy kết quả nào.
            </p>
          )}
          {results.map((res, idx) => {
            const Icon = res.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(res)}
                className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start gap-4 rounded-xl transition-colors min-h-[60px]"
              >
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-blue-500 flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {res.desc}
                  </p>
                </div>
                <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded flex-shrink-0">
                  {res.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
