import React, { useState } from 'react';
import {
  Copy,
  Check,
  BookmarkPlus,
  BookOpenCheck,
  Sparkles,
  Laptop,
  CheckSquare,
} from 'lucide-react';
import { useAppContext } from '../../app/AppContext';

export function LessonPlan5512Builder() {
  const { promptsCtrl, showAlert, glassClass, inputClass, btnPrimary, btnSecondary } =
    useAppContext();

  const [grade, setGrade] = useState<'10' | '11' | '12'>('10');
  const [lessonName, setLessonName] = useState('Bài 15: Cấu trúc rẽ nhánh trong Python');
  const [duration, setDuration] = useState('1 tiết (45 phút)');
  const [textbook, setTextbook] = useState('Cánh Diều / Kết nối tri thức');
  const [software, setSoftware] = useState('Python 3.x, Thonny IDE / IDLE / Google Colab');

  // Năng lực Tin học cần chú trọng
  const [focusNLc, setFocusNLc] = useState(true); // Giải quyết vấn đề với sự trợ giúp của CNTT-TT
  const [focusNLa, setFocusNLa] = useState(true); // Sử dụng và quản lý các phương tiện CNTT-TT
  const [focusNLe, setFocusNLe] = useState(false); // Hợp tác trong môi trường số

  // Phương pháp dạy học
  const [teachingMethod, setTeachingMethod] = useState('Dạy học giải quyết vấn đề + Thực hành trên máy tính');

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const generatePrompt = () => {
    return `Đóng vai là Chuyên gia Phương pháp dạy học Tin học THPT. Hãy soạn một KẾ HOẠCH BÀI DẠY (GIÁO ÁN) hoàn chỉnh theo đúng cấu trúc CÔNG VĂN 5512/BGDĐT-GDTrH cho bài học sau:

I. THÔNG TIN BÀI DẠY:
- Tên bài: ${lessonName}
- Môn học: Tin học - Khối lớp ${grade} (${textbook})
- Thời lượng: ${duration}
- Phương pháp / Kỹ thuật dạy học chính: ${teachingMethod}
- Thiết bị & Học liệu: Máy chiếu, phòng máy tính học sinh, ${software}, Phiếu học tập.

II. YÊU CẦU CẤU TRÚC THEO CHUẨN CÔNG VĂN 5512:

1. MỤC TIÊU:
- Về kiến thức: Liệt kê rõ các kiến thức học sinh sẽ nắm được.
- Về năng lực:
  + Năng lực chung: Tự chủ - tự học, Giao tiếp - hợp tác, Giải quyết vấn đề & sáng tạo.
  + Năng lực Tin học đặc thù:${focusNLa ? '\n    * NLa: Sử dụng và quản lý các phương tiện CNTT-TT.' : ''}${
      focusNLc
        ? '\n    * NLc: Giải quyết vấn đề với sự trợ giúp của CNTT-TT (tư duy thuật toán, viết code).'
        : ''
    }${focusNLe ? '\n    * NLe: Hợp tác trong môi trường số.' : ''}
- Về phẩm chất: Chăm chỉ, Trung thực, Trách nhiệm trong thực hành lập trình.

2. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:
- Chuẩn bị của Giáo viên: Giáo án, Bài trình chiếu (Slide), Mã nguồn mẫu, Phiếu giao việc.
- Chuẩn bị của Học sinh: SGK, vở ghi, đọc trước bài.

3. TIẾN TRÌNH DẠY HỌC (ĐẦY ĐỦ 4 HOẠT ĐỘNG):
Mỗi hoạt động phải trình bày chi tiết đủ 4 mục:
  a) Mục tiêu
  b) Nội dung (Nhiệm vụ cụ thể giao cho HS)
  c) Sản phẩm (Kết quả học sinh phải hoàn thành, code mẫu...)
  d) Tổ chức thực hiện (Đủ 4 bước: Chuyển giao nhiệm vụ -> Thực hiện nhiệm vụ -> Báo cáo/Thảo luận -> Kết luận/Nhận định)

- HOẠT ĐỘNG 1: KHỞI ĐỘNG (5-7 phút) - Đặt tình huống thực tế dẫn dắt vào bài học.
- HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (18-20 phút) - Phân tích cú pháp, quy tắc hoạt động, ví dụ minh họa từng bước.
- HOẠT ĐỘNG 3: LUYỆN TẬP / THỰC HÀNH PHÒNG MÁY (12-15 phút) - Bài tập code trên máy tính, chạy thử chương trình, sửa lỗi.
- HOẠT ĐỘNG 4: VẬN DỤNG & MỞ RỘNG (3-5 phút) - Bài toán thực tiễn nhỏ để học sinh suy nghĩ sau giờ học.

YÊU CẦU ĐẦU RA:
- Trình bày chi tiết, ngôn từ sư phạm chuẩn mực, có sẵn các đoạn mã nguồn và câu hỏi gợi mở của giáo viên.`;
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
      title: `KHBD 5512: ${lessonName.slice(0, 35)} (Tin ${grade})`,
      content: promptText,
      description: `Khung giáo án 5512 chuẩn 4 hoạt động bài: ${lessonName}`,
      category: 'Giáo án',
      tags: `tin-hoc-${grade}, khbd-5512, giao-an, gdpt-2018`,
      favorite: true,
    });
    setSaved(true);
    showAlert('Đã lưu Giáo án', 'Đã lưu cấu trúc KHBD 5512 vào Thư viện Prompt AI.');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpenCheck className="text-emerald-500" size={22} /> Khung Kế hoạch bài dạy 5512
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Xây dựng Kế hoạch bài dạy (Giáo án) môn Tin học chuẩn cấu trúc 4 hoạt động theo Công văn 5512.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`${glassClass} p-5 space-y-4`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Thông tin bài dạy
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
                  <option value="1 tiết (45 phút)">1 tiết (45 phút)</option>
                  <option value="2 tiết (90 phút)">2 tiết (90 phút)</option>
                  <option value="3 tiết (135 phút)">3 tiết (135 phút)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Tên bài học *
              </label>
              <input
                type="text"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                placeholder="VD: Bài 16: Cấu trúc lặp trong Python"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Bộ sách giáo khoa
              </label>
              <input
                type="text"
                value={textbook}
                onChange={(e) => setTextbook(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Phần mềm & Môi trường thực hành
              </label>
              <input
                type="text"
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Phương pháp dạy học chủ đạo
              </label>
              <select
                value={teachingMethod}
                onChange={(e) => setTeachingMethod(e.target.value)}
                className={inputClass}
              >
                <option value="Dạy học giải quyết vấn đề + Thực hành trên máy tính">
                  Giải quyết vấn đề + Thực hành phòng máy
                </option>
                <option value="Dạy học theo dự án (Project-based Learning)">
                  Dạy học theo dự án (Project-based)
                </option>
                <option value="Dạy học hợp tác nhóm + Kỹ thuật Khăn trải bàn / Mảnh ghép">
                  Dạy học hợp tác nhóm (Kỹ thuật khăn trải bàn)
                </option>
                <option value="Phương pháp thuyết trình tương tác + Vấn đáp gợi mở">
                  Thuyết trình tương tác + Gợi mở vấn đáp
                </option>
              </select>
            </div>
          </div>

          <div className={`${glassClass} p-5 space-y-3`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              2. Trọng tâm Năng lực Tin học
            </h3>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={focusNLc}
                onChange={(e) => setFocusNLc(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium">
                <strong>NLc:</strong> Giải quyết vấn đề với CNTT (Tư duy thuật toán, Code)
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={focusNLa}
                onChange={(e) => setFocusNLa(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium">
                <strong>NLa:</strong> Sử dụng và quản lý các phương tiện CNTT-TT
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer p-1">
              <input
                type="checkbox"
                checked={focusNLe}
                onChange={(e) => setFocusNLe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium">
                <strong>NLe:</strong> Hợp tác trong môi trường số
              </span>
            </label>
          </div>
        </div>

        {/* Prompt Output */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className={`${glassClass} p-5 flex-1 flex flex-col`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={18} />
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                  Prompt Soạn Giáo án 5512 sẵn sàng
                </h3>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
                Chuẩn 4 hoạt động 5512
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
