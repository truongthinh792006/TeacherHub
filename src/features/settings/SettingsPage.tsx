// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { LayoutDashboard, CheckSquare, MessageSquareQuote, FolderOpen, BookOpen, Users, Wand2, Settings as SettingsIcon, Sun, Moon, Plus, Trash2, Copy, Check, Search, Download, Upload, Calendar as CalendarIcon, Clock, AlertCircle, ExternalLink, MoreHorizontal, X, LogIn, Edit, Eye, Filter, Tag, Star, StarOff, Save, AlignLeft, ChevronDown } from 'lucide-react';
import { useAppContext } from '../../app/AppContext';

import { localDateString } from '../../lib/date';

export function SettingsPage() {
  const { tasksCtrl, promptsCtrl, docsCtrl, journalCtrl, studentsCtrl, activeTab, setActiveTab, globalFocus, setGlobalFocus, showAlert, showConfirm, glassClass, inputClass, btnPrimary, btnSecondary, darkMode, toggleDarkMode } = useAppContext();

    const handleExport = () => {
      const data = {
        tasks: tasksCtrl.data, prompts: promptsCtrl.data, docs: docsCtrl.data,
        journals: journalCtrl.data, students: studentsCtrl.data
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `TeacherHub_Backup_${localDateString()}.json`);
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
      reader.onerror = () => showAlert("Lỗi", "Không thể đọc file backup.");
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



