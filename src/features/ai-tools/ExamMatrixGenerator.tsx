import React, { useState } from 'react';
import {
  Copy,
  Check,
  BookmarkPlus,
  Table,
  Sparkles,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';

export function ExamMatrixGenerator() {
  const { promptsCtrl, showAlert, glassClass, inputClass, btnPrimary, btnSecondary } =
    useAppContext();

  const [grade, setGrade] = useState<'10' | '11' | '12'>('10');
  const [examType, setExamType] = useState('Kiểm tra Giữa kỳ 1');
  const [topic, setTopic] = useState('Lập trình Python cơ bản (Biến, Kiểu dữ liệu, Rẽ nhánh, Vòng lặp)');
  const [duration, setDuration] = useState('45'); // Phút

  // Tỷ lệ nhận thức (%)
  const [nbPercent, setNbPercent] = useState(40);
  const [thPercent, setThPercent] = useState(30);
  const [vdPercent, setVdPercent] = useState(20);
  const [vdcPercent, setVdcPercent] = useState(10);

  // Số lượng câu hỏi theo cấu trúc mới GDPT 2018
  const [mcqCount, setMcqCount] = useState(16); // Phần 1: Trắc nghiệm 4 lựa chọn (0.25đ/câu = 4.0đ)
  const [tfCount, setTfCount] = useState(4); // Phần 2: Đúng/Sai (1.0đ/câu = 4.0đ)
  const [shortCount, setShortCount] = useState(4); // Phần 3: Trả lời ngắn / Tự luận (0.5đ/câu = 2.0đ)

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalPercent = nbPercent + thPercent + vdPercent + vdcPercent;
  const totalScore = (mcqCount * 0.25 + tfCount * 1.0 + shortCount * 0.5).toFixed(1);

  const generatePrompt = () => {
    return `Đóng vai là Chuyên gia Giáo dục môn Tin học THPT theo chương trình GDPT 2018, hãy xây dựng:
1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ
2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA

THÔNG TIN ĐỀ KIỂM TRA:
- Môn học: Tin học Lớp ${grade} (Bộ sách Cánh Diều / Kết nối tri thức)
- Loại bài kiểm tra: ${examType}
- Thời gian làm bài: ${duration} phút
- Phạm vi kiến thức / Chủ đề trọng tâm: ${topic}

CẤU TRÚC ĐỀ VÀ MA TRẬN NHẬN THỨC:
- Tỷ lệ phân bố mức độ nhận thức:
  + Nhận biết: ${nbPercent}%
  + Thông hiểu: ${thPercent}%
  + Vận dụng: ${vdPercent}%
  + Vận dụng cao: ${vdcPercent}%

- Cấu trúc các phần câu hỏi (Tổng điểm: ${totalScore} điểm):
  + Phần 1 (Trắc nghiệm nhiều lựa chọn): ${mcqCount} câu (mỗi câu 0.25 điểm = ${(mcqCount * 0.25).toFixed(2)}đ)
  + Phần 2 (Trắc nghiệm Đúng/Sai): ${tfCount} câu (mỗi câu gồm 4 ý a,b,c,d, tối đa 1.0 điểm = ${(tfCount * 1.0).toFixed(2)}đ)
  + Phần 3 (Trắc nghiệm trả lời ngắn / Tự luận lập trình): ${shortCount} câu (mỗi câu 0.5 điểm = ${(shortCount * 0.5).toFixed(2)}đ)

YÊU CẦU ĐẦU RA:
- Xuất dạng Bảng Markdown chuẩn theo đúng biểu mẫu hướng dẫn ra đề của Bộ GD&ĐT.
- Bảng Ma trận: Chi tiết số câu, số điểm theo từng mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) cho từng đơn vị kiến thức.
- Bản đặc tả: Ghi rõ Yêu cầu cần đạt (YCCĐ) cụ thể cho từng câu hỏi tương ứng trong ma trận.`;
  };

  const handleCopy = () => {
    const promptText = generatePrompt();
    navigator.clipboard.writeText(promptText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveToPromptLibrary = () => {
    const promptText = generatePrompt();
    promptsCtrl.addItem({
      title: `Ma trận & Đặc tả ${examType} - Tin học ${grade}`,
      content: promptText,
      description: `Ma trận đề kiểm tra môn Tin học ${grade} (${duration}p) - Chủ đề: ${topic.slice(0, 50)}...`,
      category: 'Đề thi',
      tags: `tin-hoc-${grade}, ma-tran, de-thi, gdpt-2018`,
      favorite: true,
    });
    setSaved(true);
    showAlert(
      'Đã lưu vào Thư viện',
      'Đã lưu cấu trúc Ma trận này vào tab "Prompt AI". Bạn có thể xem lại hoặc chỉnh sửa bất cứ lúc nào!',
    );
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header tool */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Table className="text-blue-500" size={22} /> Trình tạo Ma trận & Bản đặc tả Đề
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Thiết kế ma trận đề kiểm tra Tin học chuẩn 4 mức độ nhận thức theo định hướng GDPT 2018.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setGrade('10');
              setExamType('Kiểm tra Giữa kỳ 1');
              setTopic('Lập trình Python cơ bản (Biến, Kiểu dữ liệu, Rẽ nhánh, Vòng lặp)');
              setDuration('45');
              setNbPercent(40);
              setThPercent(30);
              setVdPercent(20);
              setVdcPercent(10);
              setMcqCount(16);
              setTfCount(4);
              setShortCount(4);
            }}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshCw size={14} /> Mặc định
          </button>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form (Left Column) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${glassClass} p-5 space-y-4`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Thông tin chung
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
                  Thời lượng
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={inputClass}
                >
                  <option value="15">15 phút</option>
                  <option value="45">45 phút (1 tiết)</option>
                  <option value="60">60 phút</option>
                  <option value="90">90 phút</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Kỳ kiểm tra
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className={inputClass}
              >
                <option value="Kiểm tra thường xuyên (15p)">Kiểm tra thường xuyên (15p)</option>
                <option value="Kiểm tra Giữa kỳ 1">Kiểm tra Giữa học kỳ 1</option>
                <option value="Kiểm tra Cuối kỳ 1">Kiểm tra Cuối học kỳ 1</option>
                <option value="Kiểm tra Giữa kỳ 2">Kiểm tra Giữa học kỳ 2</option>
                <option value="Kiểm tra Cuối kỳ 2">Kiểm tra Cuối học kỳ 2</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Chủ đề kiến thức trọng tâm *
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`${inputClass} min-h-[80px] resize-y text-xs`}
                placeholder="VD: Cấu trúc rẽ nhánh if-else, Vòng lặp for/while, Danh sách list trong Python..."
              />
            </div>
          </div>

          <div className={`${glassClass} p-5 space-y-4`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              2. Cấu trúc câu hỏi & Mức độ
            </h3>

            {/* Số lượng câu hỏi */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-medium block">P1: Trắc nghiệm</span>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={mcqCount}
                  onChange={(e) => setMcqCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent font-bold text-base text-center text-blue-600 dark:text-blue-400 outline-none"
                />
                <span className="text-[10px] text-slate-400">câu (0.25đ/câu)</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-medium block">P2: Đúng/Sai</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={tfCount}
                  onChange={(e) => setTfCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent font-bold text-base text-center text-purple-600 dark:text-purple-400 outline-none"
                />
                <span className="text-[10px] text-slate-400">câu (1.0đ/câu)</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-medium block">P3: Tự luận/Ngắn</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={shortCount}
                  onChange={(e) => setShortCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent font-bold text-base text-center text-emerald-600 dark:text-emerald-400 outline-none"
                />
                <span className="text-[10px] text-slate-400">câu (0.5đ/câu)</span>
              </div>
            </div>

            {/* Tỷ lệ % mức độ */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tỷ lệ nhận thức:
                </span>
                <span
                  className={`text-xs font-bold ${
                    totalPercent === 100 ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  Tổng: {totalPercent}% {totalPercent !== 100 && '(cần = 100%)'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block text-center">Biết (%)</label>
                  <input
                    type="number"
                    value={nbPercent}
                    onChange={(e) => setNbPercent(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block text-center">Hiểu (%)</label>
                  <input
                    type="number"
                    value={thPercent}
                    onChange={(e) => setThPercent(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block text-center">Vận dụng (%)</label>
                  <input
                    type="number"
                    value={vdPercent}
                    onChange={(e) => setVdPercent(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block text-center">VD Cao (%)</label>
                  <input
                    type="number"
                    value={vdcPercent}
                    onChange={(e) => setVdcPercent(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Prompt & Actions (Right Column) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className={`${glassClass} p-5 flex-1 flex flex-col`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-500" size={18} />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Prompt Ma trận & Đặc tả sẵn sàng gửi AI
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                <Calculator size={14} /> Tổng điểm: <strong>{totalScore}/10</strong>
              </div>
            </div>

            <div className="flex-1 min-h-[340px] bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-y-auto leading-relaxed border border-slate-800">
              <pre className="whitespace-pre-wrap font-sans">{generatePrompt()}</pre>
            </div>

            {/* Action buttons */}
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
