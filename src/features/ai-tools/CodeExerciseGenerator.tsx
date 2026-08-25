import React, { useState } from 'react';
import {
  Copy,
  Check,
  BookmarkPlus,
  Code2,
  Sparkles,
  Terminal,
  FileCheck2,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';

export function CodeExerciseGenerator() {
  const { promptsCtrl, showAlert, glassClass, inputClass, btnPrimary, btnSecondary } =
    useAppContext();

  const [language, setLanguage] = useState<'Python' | 'SQL' | 'HTML/CSS' | 'C++'>('Python');
  const [level, setLevel] = useState('Trung bình (Rẽ nhánh, Vòng lặp, Mảng 1 chiều)');
  const [context, setContext] = useState('Hệ thống quản lý điểm số & Xếp loại học sinh');
  const [testCaseCount, setTestCaseCount] = useState(4);
  const [includeRubric, setIncludeRubric] = useState(true);
  const [includeEdgeCases, setIncludeEdgeCases] = useState(true);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const contexts = [
    'Hệ thống quản lý điểm số & Xếp loại học sinh',
    'Tính hóa đơn tiền điện / nước / cước phí Taxi bậc thang',
    'Phân tích & Xử lý văn bản tiếng Việt (đếm từ, chuẩn hóa họ tên)',
    'Hệ thống quản lý mượn/trả sách thư viện trường học',
    'Quản lý sản phẩm & Tính doanh thu bán hàng siêu thị mini',
    'Trò chơi tương tác: Đoán số bí mật, Oẳn tù tì, Cờ caro',
    'Bài toán hình học: Tính chu vi, diện tích và kiểm tra tam giác',
    'Thuật toán số học: Số nguyên tố, Ước chung lớn nhất, Số hoàn hảo',
  ];

  const generatePrompt = () => {
    return `Đóng vai là Chuyên gia Lập trình & Giảng viên Tin học, hãy tạo một BÀI TẬP LẬP TRÌNH THỰC HÀNH hoàn chỉnh bằng ngôn ngữ ${language} với các yêu cầu chi tiết sau:

1. THÔNG TIN BÀI TẬP:
- Ngôn ngữ lập trình: ${language}
- Mức độ bài toán: ${level}
- Ngữ cảnh thực tế ứng dụng: ${context}

2. CẤU TRÚC YÊU CẦU ĐẦU RA:
- TÊN BÀI TOÁN: Ngắn gọn, hấp dẫn.
- ĐỀ BÀI (PROBLEM STATEMENT): Nêu rõ bối cảnh, yêu cầu xử lý logic.
- ĐỊNH DẠNG ĐẦU VÀO (INPUT FORMAT): Quy cách nhập dữ liệu từ bàn phím hoặc tham số.
- ĐỊNH DẠNG ĐẦU RA (OUTPUT FORMAT): Quy cách in kết quả chính xác ra màn hình.
- RÀNG BUỘC (CONSTRAINTS): Giới hạn dữ liệu (vd: $1 \\le N \\le 10^5$, thời gian chạy $\\le 1.0s$).

3. BỘ TEST CASES (${testCaseCount} TEST CASES):
- Cung cấp ${testCaseCount} bộ test cases mẫu gồm:
  + Input
  + Output mong đợi
  + Giải thích từng bước xử lý dữ liệu để ra được output đó.${
      includeEdgeCases
        ? '\n- Chú ý có ít nhất 1-2 Test Case bao quát các TRƯỜNG HỢP BIÊN (Edge Cases: dữ liệu rỗng, số âm, giá trị cực đại, chia cho 0...).'
        : ''
    }

4. MÃ NGUỒN MẪU (SOLUTION CODE):
- Viết code ${language} chuẩn mực, tối ưu, có chú thích (comments) giải thích rõ ràng từng khối lệnh logic.

5. BAREM CHẤM ĐIỂM CHI TIẾT (THANG ĐIỂM 10):${
      includeRubric
        ? `
- Phân chia điểm cụ thể:
  + Cú pháp & Nhập xuất dữ liệu chuẩn (2.0đ)
  + Thuật toán & Xử lý logic đúng (5.0đ)
  + Xử lý tốt các trường hợp biên & tối ưu (2.0đ)
  + Trình bày code sạch sẽ, đặt tên biến chuẩn PEP 8 (1.0đ)`
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
      title: `Bài tập ${language}: ${context.slice(0, 35)}`,
      content: promptText,
      description: `Đề bài tập thực hành lập trình ${language} (${level}) kèm ${testCaseCount} test cases & barem điểm`,
      category: 'Giáo án',
      tags: `lap-trinh, ${language.toLowerCase()}, bai-tap, test-cases`,
      favorite: false,
    });
    setSaved(true);
    showAlert('Đã lưu Bài tập', 'Đã lưu cấu trúc bài tập lập trình vào Thư viện Prompt AI.');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Code2 className="text-blue-500" size={22} /> Trình tạo Bài tập Lập trình & Test Cases
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thiết kế bài tập code (Python, SQL, HTML, C++) kèm ràng buộc, bộ test cases và barem chấm điểm chi tiết.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${glassClass} p-5 space-y-4`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Cấu hình bài toán
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Ngôn ngữ lập trình
                </label>
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as 'Python' | 'SQL' | 'HTML/CSS' | 'C++')
                  }
                  className={inputClass}
                >
                  <option value="Python">Python 3.x</option>
                  <option value="SQL">SQL / MySQL / SQLite</option>
                  <option value="HTML/CSS">HTML5 & CSS3</option>
                  <option value="C++">C++</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Số lượng Test Cases
                </label>
                <select
                  value={testCaseCount}
                  onChange={(e) => setTestCaseCount(parseInt(e.target.value))}
                  className={inputClass}
                >
                  <option value={3}>3 bộ Test</option>
                  <option value={4}>4 bộ Test</option>
                  <option value={5}>5 bộ Test (Khuyên dùng)</option>
                  <option value={8}>8 bộ Test (Chấm tự động)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Mức độ khó
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={inputClass}
              >
                <option value="Cơ bản (Cú pháp, Biến, Toán tử, Nhập xuất)">
                  Dễ: Biến, Nhập xuất, Phép toán cơ bản
                </option>
                <option value="Trung bình (Rẽ nhánh, Vòng lặp, Mảng 1 chiều)">
                  Trung bình: Cấu trúc rẽ nhánh & Vòng lặp
                </option>
                <option value="Khá (Xử lý Chuỗi, Hàm, Danh sách List/Array)">
                  Khá: Xử lý chuỗi, mảng & viết hàm
                </option>
                <option value="Nâng cao (Thuật toán tìm kiếm/sắp xếp, Cấu trúc dữ liệu)">
                  Nâng cao: Thuật toán & Cấu trúc dữ liệu
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Ngữ cảnh bài toán thực tế
              </label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className={inputClass}
              >
                {contexts.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`${glassClass} p-5 space-y-3`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              2. Thành phần bổ trợ
            </h3>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={includeEdgeCases}
                onChange={(e) => setIncludeEdgeCases(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium flex items-center gap-1">
                <Terminal size={14} className="text-blue-500" /> Kèm Test Cases trường hợp biên (Edge Cases)
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={includeRubric}
                onChange={(e) => setIncludeRubric(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium flex items-center gap-1">
                <FileCheck2 size={14} className="text-emerald-500" /> Kèm Barem chấm điểm chi tiết (Thang 10)
              </span>
            </label>
          </div>
        </div>

        {/* Prompt Output */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className={`${glassClass} p-5 flex-1 flex flex-col`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-500" size={18} />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Prompt Sinh Bài tập Lập trình sẵn sàng
                </h3>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
                {language} • {testCaseCount} Test Cases
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
