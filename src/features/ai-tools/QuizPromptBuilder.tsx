import React, { useState } from 'react';
import {
  Copy,
  Check,
  BookmarkPlus,
  HelpCircle,
  Sparkles,
  Layers,
  FileCode2,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';

export function QuizPromptBuilder() {
  const { promptsCtrl, showAlert, glassClass, inputClass, btnPrimary, btnSecondary } =
    useAppContext();

  const [grade, setGrade] = useState<'10' | '11' | '12'>('10');
  const [topicCategory, setTopicCategory] = useState('Python cơ bản: Biến, Kiểu dữ liệu, Toán tử');
  const [customTopic, setCustomTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Phân hóa: 40% Biết, 30% Hiểu, 20% Vận dụng, 10% VDC');

  // Cấu trúc định dạng câu hỏi
  const [includePart1, setIncludePart1] = useState(true); // Trắc nghiệm 4 lựa chọn
  const [includePart2, setIncludePart2] = useState(true); // Đúng/Sai 4 ý
  const [includePart3, setIncludePart3] = useState(false); // Trả lời ngắn / Output code
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [includeCodeSnippets, setIncludeCodeSnippets] = useState(true);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const informaticsTopics = [
    'Python cơ bản: Biến, Kiểu dữ liệu, Toán tử, Nhập xuất (input/print)',
    'Cấu trúc điều khiển: Rẽ nhánh if - elif - else',
    'Cấu trúc lặp: Vòng lặp for, while, break/continue',
    'Kiểu dữ liệu tuần tự: Xâu ký tự (String) & Các phương thức xử lý xâu',
    'Kiểu dữ liệu danh sách (List): Thao tác mảng, duyệt list, list comprehension',
    'Chương trình con: Khai báo hàm (def), tham số, giá trị trả về (return), phạm vi biến',
    'Kiểu dữ liệu nâng cao: Tuple, Dictionary (Từ điển), Set (Tập hợp)',
    'Tệp và xử lý tệp: Đọc/ghi file văn bản trong Python',
    'Thuật toán: Tìm kiếm tuần tự, Nhị phân, Sắp xếp nổi bọt/chèn/chọn',
    'Cơ sở dữ liệu & SQL: Mô hình quan hệ, Khóa chính/Khóa ngoại, Lệnh SELECT/INSERT/UPDATE',
    'Thiết kế Web: Cấu trúc HTML5, Định dạng CSS3, Bố cục Flexbox/Grid',
    'Mạng máy tính & Internet: Địa chỉ IP, Giao thức TCP/IP, Thiết bị mạng, An toàn mạng',
    'Đạo đức số: Pháp luật số, Bản quyền phần mềm, An toàn thông tin và bảo mật',
    'Trí tuệ nhân tạo (AI): Khái niệm AI, Ứng dụng và Đạo đức sử dụng AI trong học tập',
    'Tùy chỉnh chủ đề khác...',
  ];

  const selectedTopic =
    topicCategory === 'Tùy chỉnh chủ đề khác...' && customTopic.trim()
      ? customTopic.trim()
      : topicCategory;

  const generatePrompt = () => {
    return `Đóng vai là Giáo viên Tin học THPT giàu kinh nghiệm ra đề thi theo chuẩn GDPT 2018. Hãy tạo một BỘ ĐỀ TRẮC NGHIỆM TIN HỌC LỚP ${grade} với các yêu cầu sau:

1. THÔNG TIN BÀI THI:
- Môn học: Tin học Lớp ${grade}
- Chủ đề: ${selectedTopic}
- Tổng số lượng câu hỏi: ${questionCount} câu
- Phân bố độ khó: ${difficulty}

2. CẤU TRÚC ĐỊNH DẠNG CÂU HỎI:${
      includePart1
        ? `\n- PHẦN 1: Trắc nghiệm 4 lựa chọn (Chọn 1 đáp án đúng duy nhất A, B, C, D). Mỗi câu có 4 phương án rõ ràng, tránh các đáp án 'Tất cả đều đúng/sai'.`
        : ''
    }${
      includePart2
        ? `\n- PHẦN 2: Trắc nghiệm Đúng/Sai (Mỗi câu gồm 1 ngữ cảnh/đoạn mã và 4 mệnh đề a, b, c, d để học sinh chọn Đúng hoặc Sai cho từng mệnh đề).`
        : ''
    }${
      includePart3
        ? `\n- PHẦN 3: Trắc nghiệm trả lời ngắn (Dự đoán output của đoạn code, tìm lỗi cú pháp hoặc điền giá trị kết quả cuối cùng).`
        : ''
    }${
      includeCodeSnippets
        ? `\n- Chú trọng đưa các ĐOẠN CODE NGẮN MINH HỌA chuẩn cú pháp vào đề bài để học sinh phân tích logic.`
        : ''
    }

3. ĐỊNH DẠNG ĐẦU RA YÊU CẦU:
- Trình bày rõ ràng, phân cách từng câu.
- ĐÁP ÁN: Tổng hợp Bảng đáp án ở cuối bài.${
      includeExplanations
        ? `\n- LỜI GIẢI CHI TIẾT: Giải thích vì sao đáp án đó đúng và phân tích cặn kẽ tại sao các phương án khác sai.`
        : ''
    }`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveToPromptLibrary = () => {
    const promptText = generatePrompt();
    promptsCtrl.addItem({
      title: `Đề trắc nghiệm: ${selectedTopic.slice(0, 40)} (Tin ${grade})`,
      content: promptText,
      description: `Prompt sinh ${questionCount} câu trắc nghiệm Tin học ${grade} (${difficulty})`,
      category: 'Đề thi',
      tags: `tin-hoc-${grade}, trac-nghiem, de-thi, python`,
      favorite: false,
    });
    setSaved(true);
    showAlert('Đã lưu Prompt', 'Đã lưu cấu trúc đề này vào Thư viện Prompt AI.');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <HelpCircle className="text-purple-500" size={22} /> Trình tạo Đề thi Trắc nghiệm Tin học
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tạo prompt sinh đề thi trắc nghiệm theo 3 dạng thức mới của Bộ GD&ĐT (Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${glassClass} p-5 space-y-4`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Chủ đề & Khối lớp
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Khối lớp
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as '10' | '11' | '12')}
                  className={inputClass}
                >
                  <option value="10">Tin học 10</option>
                  <option value="11">Tin học 11</option>
                  <option value="12">Tin học 12</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Số lượng câu
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className={inputClass}
                >
                  <option value={5}>5 câu</option>
                  <option value={10}>10 câu</option>
                  <option value={15}>15 câu</option>
                  <option value={20}>20 câu</option>
                  <option value={28}>28 câu (Đề chuẩn)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Chủ đề kiến thức GDPT 2018
              </label>
              <select
                value={topicCategory}
                onChange={(e) => setTopicCategory(e.target.value)}
                className={inputClass}
              >
                {informaticsTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {topicCategory === 'Tùy chỉnh chủ đề khác...' && (
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Nhập chủ đề tùy chỉnh
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="VD: Đệ quy trong Python, Thuật toán Dijkstra..."
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Mức độ phân hóa
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={inputClass}
              >
                <option value="Phân hóa: 40% Biết, 30% Hiểu, 20% Vận dụng, 10% VDC">
                  Tiêu chuẩn: 40% Biết - 30% Hiểu - 20% Vận dụng - 10% VDC
                </option>
                <option value="Cơ bản: 60% Nhận biết, 40% Thông hiểu">
                  Cơ bản (Kiểm tra 15p): 60% Biết - 40% Hiểu
                </option>
                <option value="Nâng cao: 20% Hiểu, 50% Vận dụng, 30% Vận dụng cao">
                  Nâng cao (Ôn HSG / Phân loại giỏi): 50% Vận dụng - 30% VDC
                </option>
              </select>
            </div>
          </div>

          <div className={`${glassClass} p-5 space-y-3`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              2. Định dạng & Thành phần đề
            </h3>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={includePart1}
                onChange={(e) => setIncludePart1(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Phần 1: Trắc nghiệm 4 lựa chọn (A, B, C, D)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={includePart2}
                onChange={(e) => setIncludePart2(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Phần 2: Trắc nghiệm Đúng / Sai (4 mệnh đề a,b,c,d)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={includePart3}
                onChange={(e) => setIncludePart3(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Phần 3: Trắc nghiệm trả lời ngắn (Output code / Điền khuyết)</span>
            </label>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
                <input
                  type="checkbox"
                  checked={includeCodeSnippets}
                  onChange={(e) => setIncludeCodeSnippets(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium flex items-center gap-1">
                  <FileCode2 size={14} className="text-blue-500" /> Kèm Code Snippet minh họa
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
                <input
                  type="checkbox"
                  checked={includeExplanations}
                  onChange={(e) => setIncludeExplanations(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium flex items-center gap-1">
                  <Layers size={14} className="text-purple-500" /> Kèm lời giải thích chi tiết
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Prompt Output */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className={`${glassClass} p-5 flex-1 flex flex-col`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-500" size={18} />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Prompt Sinh đề Trắc nghiệm sẵn sàng
                </h3>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
                {questionCount} câu hỏi • Tin {grade}
              </span>
            </div>

            <div className="flex-1 min-h-[340px] bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-y-auto leading-relaxed border border-slate-800">
              <pre className="whitespace-pre-wrap font-sans">{generatePrompt()}</pre>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 ${btnPrimary} ${
                  copied ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                }`}
              >
                {copied ? (
                  <>
                    <Check size={18} /> Đã sao chép Prompt!
                  </>
                ) : (
                  <>
                    <Copy size={18} /> Sao chép Prompt gửi AI
                  </>
                )}
              </button>

              <button
                onClick={handleSaveToPromptLibrary}
                className={btnSecondary}
              >
                {saved ? <Check size={18} className="text-emerald-500" /> : <BookmarkPlus size={18} />}
                <span>Lưu vào Thư viện</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
