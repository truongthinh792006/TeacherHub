import React, { useState } from 'react';
import {
  Table,
  HelpCircle,
  BookOpenCheck,
  Code2,
  Wand2,
  Sparkles,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';
import { ExamMatrixGenerator } from './ExamMatrixGenerator';
import { QuizPromptBuilder } from './QuizPromptBuilder';
import { LessonPlan5512Builder } from './LessonPlan5512Builder';
import { CodeExerciseGenerator } from './CodeExerciseGenerator';

type SubToolTab = 'exam-matrix' | 'quiz-builder' | 'lesson-plan' | 'code-exercise';

export function AIToolsPage() {
  const { glassClass } = useAppContext();
  const [activeSubTab, setActiveSubTab] = useState<SubToolTab>('exam-matrix');

  const subTools = [
    {
      id: 'exam-matrix' as SubToolTab,
      label: 'Ma trận & Đặc tả Đề',
      icon: Table,
      badge: 'GDPT 2018',
    },
    {
      id: 'quiz-builder' as SubToolTab,
      label: 'Trắc nghiệm Tin học',
      icon: HelpCircle,
      badge: '3 Dạng thức',
    },
    {
      id: 'lesson-plan' as SubToolTab,
      label: 'Kế hoạch Bài dạy 5512',
      icon: BookOpenCheck,
      badge: 'CV 5512',
    },
    {
      id: 'code-exercise' as SubToolTab,
      label: 'Bài tập Code & Test Case',
      icon: Code2,
      badge: 'Python/SQL',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
              <Wand2 size={22} />
            </div>
            Trợ lý AI Giáo viên Tin học
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Bộ công cụ sinh cấu trúc Prompt chuyên sâu hỗ trợ soạn giáo án 5512, ma trận và đề thi Tin học THPT.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-indigo-700 dark:text-indigo-300 w-fit">
          <Sparkles size={14} /> Tối ưu cho ChatGPT / Claude / Gemini
        </div>
      </div>

      {/* Sub-tools Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {subTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeSubTab === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveSubTab(tool.id)}
              className={`p-3.5 sm:p-4 rounded-2xl flex flex-col items-start justify-between transition-all min-h-[90px] text-left border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : `${glassClass} hover:border-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-300`
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <Icon size={20} className={isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} />
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {tool.badge}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold leading-snug">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-Tool Content */}
      <div className="pt-2">
        {activeSubTab === 'exam-matrix' && <ExamMatrixGenerator />}
        {activeSubTab === 'quiz-builder' && <QuizPromptBuilder />}
        {activeSubTab === 'lesson-plan' && <LessonPlan5512Builder />}
        {activeSubTab === 'code-exercise' && <CodeExerciseGenerator />}
      </div>
    </div>
  );
}
