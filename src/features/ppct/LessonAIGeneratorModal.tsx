import React, { useState, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  BookmarkPlus,
  BookOpenCheck,
  Table,
  HelpCircle,
  Sparkles,
  FileText,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { PPCTLesson, PPCTPlan } from '../../types';
import { useAppContext } from '../../app/AppContext';

export type AIGeneratorTab = 'khbd' | 'spec' | 'matrix' | 'quiz';

interface LessonAIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: PPCTLesson | null;
  plan: PPCTPlan;
  initialTab?: AIGeneratorTab;
}

const competencyLabels: Record<string, string> = {
  NLa: 'NLa: Sử dụng và quản lý các phương tiện công nghệ thông tin và truyền thông',
  NLb: 'NLb: Ứng xử phù hợp trong môi trường số',
  NLc: 'NLc: Giải quyết vấn đề với sự trợ giúp của công nghệ thông tin và truyền thông',
  NLd: 'NLd: Ứng dụng công nghệ thông tin và truyền thông trong học và tự học',
  NLe: 'NLe: Hợp tác trong môi trường số',
};

export function LessonAIGeneratorModal({
  isOpen,
  onClose,
  lesson,
  plan,
  initialTab = 'khbd',
}: LessonAIGeneratorModalProps) {
  const { promptsCtrl, showAlert } = useAppContext();
  const [activeTab, setActiveTab] = useState<AIGeneratorTab>(initialTab);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync initial tab when modal re-opens
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const trackTitle =
    plan.track === 'ICT'
      ? 'Định hướng Tin học ứng dụng (ICT)'
      : plan.track === 'CS'
      ? 'Định hướng Khoa học máy tính (CS)'
      : 'Chương trình cơ bản';

  const defaultKnow = [
    `Nêu được các khái niệm, định nghĩa và thành phần cốt lõi trong "${lesson?.lessonName || 'bài học'}".`,
    'Chỉ ra và nhận diện được các cú pháp/quy tắc chuẩn xác trong bài.',
  ];
  const defaultUnderstand = [
    'Giải thích và làm rõ được nguyên lý hoạt động, mối liên hệ giữa các khái niệm.',
    'Phân biệt được các trường hợp sử dụng phù hợp trong thực tiễn.',
  ];
  const defaultApply = [
    `Vận dụng kiến thức bài học để giải quyết bài toán/tình huống thực hành cụ thể.`,
    'Tạo ra được sản phẩm hoặc chương trình hoàn chỉnh theo yêu cầu.',
  ];

  const knowList =
    lesson?.objectives?.know && lesson.objectives.know.length > 0
      ? lesson.objectives.know
      : defaultKnow;
  const understandList =
    lesson?.objectives?.understand && lesson.objectives.understand.length > 0
      ? lesson.objectives.understand
      : defaultUnderstand;
  const applyList =
    lesson?.objectives?.apply && lesson.objectives.apply.length > 0
      ? lesson.objectives.apply
      : defaultApply;

  const competenciesList =
    lesson?.competencies && lesson.competencies.length > 0
      ? lesson.competencies.map((c) => competencyLabels[c] || c)
      : [competencyLabels.NLc, competencyLabels.NLd];

  // 1. GENERATOR: KHBD 5512
  const generateKHBD5512Prompt = () => {
    if (!lesson) return '';
    return `Đóng vai là Chuyên gia Sư phạm Tin học THPT & Giảng viên bồi dưỡng giáo viên môn Tin học theo chương trình GDPT 2018. Hãy soạn thảo một KẾ HOẠCH BÀI DẠY (GIÁO ÁN) hoàn chỉnh, chi tiết và chuẩn mực tuyệt đối theo đúng phụ lục Công văn 5512/BGDĐT-GDTrH cho bài học sau:

THÔNG TIN BÀI DẠY:
- Môn học: Tin học Lớp ${plan.grade} (${trackTitle})
- Bộ sách: Cánh Diều / Kết nối tri thức với cuộc sống
- Tên bài dạy: ${lesson.lessonName}
- Thuộc chủ đề: ${lesson.topic}
- Thời lượng: ${lesson.periods} tiết (${lesson.periods * 45} phút)
- Hình thức: ${lesson.type === 'PRACTICE' ? 'Thực hành phòng máy tính' : lesson.type === 'PROJECT' ? 'Dự án học tập' : 'Lý thuyết kết hợp thực hành'}
${lesson.notes ? `- Ghi chú đặc thù: ${lesson.notes}` : ''}

I. MỤC TIÊU DẠY HỌC:
1. Về năng lực:
a) Năng lực Tin học đặc thù:
${competenciesList.map((c) => `  - ${c}`).join('\n')}
b) Yêu cầu cần đạt chi tiết theo 3 mức độ nhận thức:
  * Nhận biết (Biết):
${knowList.map((k) => `    + ${k}`).join('\n')}
  * Thông hiểu (Hiểu):
${understandList.map((u) => `    + ${u}`).join('\n')}
  * Vận dụng (Vận dụng & Vận dụng cao):
${applyList.map((a) => `    + ${a}`).join('\n')}
c) Năng lực chung:
  - Năng lực tự chủ và tự học: Chủ động đọc SGK, tìm hiểu tài liệu và thực hiện các nhiệm vụ cá nhân.
  - Năng lực giao tiếp và hợp tác: Tương tác nhóm tích cực, phân công nhiệm vụ và phản biện xây dựng.
  - Năng lực giải quyết vấn đề và sáng tạo: Đề xuất giải pháp và xử lý tình huống phát sinh trong bài học.

2. Về phẩm chất:
  - Chăm chỉ: Tích cực hoàn thành các bài tập, nhiệm vụ được giao trên lớp và ở nhà.
  - Trung thực: Tôn trọng bản quyền tác giả, tính chính xác của dữ liệu và kết quả học tập.
  - Trách nhiệm: Giữ gìn thiết bị phòng máy, tuân thủ an toàn mạng và văn hóa ứng xử số.

II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:
1. Giáo viên:
  - Máy tính giáo viên kết nối máy chiếu / Tivi thông minh, phòng máy tính kết nối mạng Internet.
  - Bài giảng điện tử trình chiếu sinh động, phiếu học tập số 1, 2, hệ thống bài tập trắc nghiệm trực tuyến.
2. Học sinh:
  - Sách giáo khoa Tin học ${plan.grade}, vở ghi chép, máy tính thực hành.

III. TIẾN TRÌNH DẠY HỌC (Chuỗi 4 hoạt động sư phạm theo CV 5512):
Hãy xây dựng chi tiết đầy đủ 4 hoạt động sau. Mỗi hoạt động PHẢI có đủ 4 mục: a) Mục tiêu, b) Nội dung, c) Sản phẩm, d) Tổ chức thực hiện (gồm 4 bước chuẩn: Chuyển giao nhiệm vụ -> Thực hiện nhiệm vụ -> Báo cáo, thảo luận -> Kết luận, nhận định).

- HOẠT ĐỘNG 1: KHỞI ĐỘNG (Xác định vấn đề / nhiệm vụ học tập - 5 đến 7 phút)
  + Tạo tình huống có vấn đề kích thích tò mò, liên hệ từ bài cũ hoặc đời sống thực tế vào bài mới.
- HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (Khám phá nội dung - 20 đến 25 phút)
  + Chia thành các đơn vị kiến thức/nhiệm vụ rõ ràng.
  + Thiết kế hệ thống câu hỏi gợi mở, hoạt động cá nhân và hoạt động nhóm phù hợp.
- HOẠT ĐỘNG 3: LUYỆN TẬP (Củng cố và rèn luyện kỹ năng - 10 đến 12 phút)
  + Hệ thống câu hỏi trắc nghiệm nhanh và bài tập áp dụng trực tiếp kiến thức vừa học.
- HOẠT ĐỘNG 4: VẬN DỤNG (Mở rộng và ứng dụng vào thực tế - 3 đến 5 phút)
  + Giao nhiệm vụ thực tế mang tính mở rộng cho học sinh tìm hiểu thêm ở nhà.

IV. PHỤ LỤC HỒ SƠ DẠY HỌC:
- Cung cấp nội dung chi tiết Phiếu học tập số 1, Phiếu học tập số 2.
- Cung cấp Bảng tiêu chí đánh giá (Rubric) chi tiết cho sản phẩm học tập của học sinh.`;
  };

  // 2. GENERATOR: BẢN ĐẶC TẢ ĐỀ KIỂM TRA
  const generateSpecPrompt = () => {
    if (!lesson) return '';
    return `Đóng vai là Chuyên gia Khảo thí và Đánh giá chất lượng giáo dục môn Tin học THPT. Hãy xây dựng BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐÁNH GIÁ theo định dạng mới chuẩn Bộ Giáo dục & Đào tạo cho bài học sau:

THÔNG TIN BÀI HỌC:
- Môn học: Tin học Lớp ${plan.grade} (${trackTitle})
- Đơn vị bài học: ${lesson.lessonName}
- Chủ đề: ${lesson.topic}
- Thời lượng: ${lesson.periods} tiết

CẤU TRÚC ĐẶC TẢ YÊU CẦU:
1. Xuất BẢNG ĐẶC TẢ MARKDOWN chuẩn theo các cột:
   - TT
   - Đơn vị kiến thức / Kĩ năng
   - Mức độ đánh giá (Nhận biết / Thông hiểu / Vận dụng / Vận dụng cao)
   - Yêu cầu cần đạt chi tiết (YCCĐ)
   - Mã năng lực Tin học gắn kèm (NLa, NLb, NLc, NLd, NLe)
   - Số câu hỏi theo từng dạng thức:
     + Phần I (Trắc nghiệm nhiều lựa chọn - 4 chọn 1)
     + Phần II (Trắc nghiệm Đúng/Sai - 4 ý a, b, c, d)
     + Phần III (Trắc nghiệm Trả lời ngắn / Output mã nguồn)

2. NỘI DUNG ÁNH XẠ CỤ THỂ CHO BÀI HỌC:
- Mức độ Nhận biết:
${knowList.map((k) => `  * ${k}`).join('\n')}
- Mức độ Thông hiểu:
${understandList.map((u) => `  * ${u}`).join('\n')}
- Mức độ Vận dụng & Vận dụng cao:
${applyList.map((a) => `  * ${a}`).join('\n')}

3. BẢNG PHÂN BỐ CÂU HỎI VÀ ĐIỂM SỐ DỰ KIẾN:
- Cung cấp bảng tổng hợp số câu và tỷ lệ % điểm theo từng mức độ nhận thức cho bài học này.`;
  };

  // 3. GENERATOR: MA TRẬN CV 7991
  const generateMatrixPrompt = () => {
    if (!lesson) return '';
    return `Đóng vai là Trưởng bộ môn Tin học THPT. Hãy xây dựng MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ chuẩn theo Phụ lục Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GD&ĐT cho chủ đề có bài học sau:

THÔNG TIN CHỦ ĐỀ & BÀI HỌC:
- Môn học: Tin học Lớp ${plan.grade} (${trackTitle})
- Bài học trọng tâm: ${lesson.lessonName} (Tuần ${lesson.week} • Tiết ${lesson.order})
- Chủ đề lớn: ${lesson.topic}

QUY ĐỊNH MA TRẬN THEO CV 7991:
1. Tỷ lệ phân bố mức độ nhận thức:
   - Nhận biết: ~40% (4.0 điểm)
   - Thông hiểu: ~30% (3.0 điểm)
   - Vận dụng: ~20% (2.0 điểm)
   - Vận dụng cao: ~10% (1.0 điểm)

2. Cấu trúc 3 dạng thức trắc nghiệm mới:
   - Phần I: Câu hỏi trắc nghiệm nhiều lựa chọn (Mỗi câu đúng 0.25 điểm)
   - Phần II: Câu hỏi trắc nghiệm Đúng/Sai (Mỗi câu gồm 4 ý a, b, c, d; Đúng 1 ý: 0.1đ; 2 ý: 0.25đ; 3 ý: 0.5đ; 4 ý: 1.0đ)
   - Phần III: Câu hỏi trắc nghiệm Trả lời ngắn (Mỗi câu đúng 0.25đ hoặc 0.5đ)

3. YÊU CẦU ĐẦU RA:
- Xuất Khung Bảng Ma trận Markdown chuẩn theo đúng biểu mẫu phụ lục CV 7991/BGDĐT-GDTrH.
- Liệt kê rõ số câu cho từng dạng thức ở 4 mức độ: Biết, Hiểu, Vận dụng, Vận dụng cao.
- Tính toán tổng số câu, tổng số điểm (thang điểm 10.0) và tỷ lệ % hoàn toàn chính xác.
- Kèm bản hướng dẫn phân chia thời gian làm bài phù hợp (45 phút hoặc 90 phút).`;
  };

  // 4. GENERATOR: ĐỀ TRẮC NGHIỆM 3 DẠNG THỨC
  const generateQuizPrompt = () => {
    if (!lesson) return '';
    return `Đóng vai là Chuyên gia ra đề thi môn Tin học THPT theo định dạng kỳ thi Tốt nghiệp THPT mới từ năm 2025 của Bộ GD&ĐT. Hãy biên soạn một BỘ ĐỀ TRẮC NGHIỆM 3 DẠNG THỨC bám sát yêu cầu cần đạt của bài học sau:

THÔNG TIN BÀI HỌC:
- Môn: Tin học Lớp ${plan.grade} (${trackTitle})
- Tên bài học: ${lesson.lessonName}
- Chủ đề: ${lesson.topic}

YÊU CẦU CẦN ĐẠT CỦA BÀI HỌC CẦN PHỦ KÍN:
* Biết: ${knowList.join('; ')}
* Hiểu: ${understandList.join('; ')}
* Vận dụng: ${applyList.join('; ')}

CẤU TRÚC BỘ CÂU HỎI BẮT BUỘC:

PHẦN I: CÂU TRẮC NGHIỆM NHIỀU LỰA CHỌN (4 đến 6 câu)
- Thí sinh trả lời từ câu 1 đến câu n. Mỗi câu hỏi chỉ chọn MỘT phương án chính xác nhất trong 4 phương án A, B, C, D.
- Các câu hỏi bao quát mức độ Nhận biết và Thông hiểu lý thuyết cốt lõi của bài học.

PHẦN II: CÂU TRẮC NGHIỆM ĐÚNG/SAI (2 câu)
- Thí sinh trả lời câu 1 và câu 2. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn ĐÚNG hoặc SAI.
- Mỗi câu hỏi phải có một ngữ cảnh thực tiễn hoặc một đoạn mã nguồn/cấu hình liên quan trực tiếp đến bài học.
- 4 ý a, b, c, d phải phân hóa từ Nhận biết, Thông hiểu đến Vận dụng tình huống.

PHẦN III: CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2 đến 3 câu)
- Thí sinh trả lời bằng cách điền từ khóa, số liệu, giá trị output hoặc tên thẻ/lệnh ngắn gọn.
- Yêu cầu tư duy logic, tính toán hoặc phân tích kết quả đoạn mã.

ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM:
- Cung cấp Bảng đáp án Phần I (Ví dụ: 1-A, 2-C...).
- Cung cấp Bảng đáp án Phần II (Ví dụ: Câu 1: a-Đ, b-S, c-Đ, d-S kèm giải thích chi tiết vì sao đúng/sai).
- Cung cấp Đáp án Phần III kèm lời giải chi tiết từng bước.`;
  };

  const currentPrompt = useMemo(() => {
    switch (activeTab) {
      case 'khbd':
        return generateKHBD5512Prompt();
      case 'spec':
        return generateSpecPrompt();
      case 'matrix':
        return generateMatrixPrompt();
      case 'quiz':
        return generateQuizPrompt();
      default:
        return '';
    }
  }, [activeTab, lesson, plan]);

  if (!isOpen || !lesson) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveToPromptLibrary = () => {
    const tabTitles: Record<AIGeneratorTab, string> = {
      khbd: 'Kế hoạch bài dạy 5512',
      spec: 'Bản đặc tả đề kiểm tra',
      matrix: 'Ma trận đề CV 7991',
      quiz: 'Đề trắc nghiệm 3 dạng thức',
    };

    const tabCategories: Record<AIGeneratorTab, string> = {
      khbd: 'Giáo án 5512',
      spec: 'Đặc tả đề',
      matrix: 'Ma trận đề',
      quiz: 'Đề kiểm tra',
    };

    promptsCtrl.addItem({
      title: `${tabTitles[activeTab]} - ${lesson.lessonName}`,
      content: currentPrompt,
      description: `Prompt tự động sinh cho Tin học ${plan.grade} (Tuần ${lesson.week}): ${lesson.lessonName}`,
      category: tabCategories[activeTab],
      tags: `tin-hoc-${plan.grade}, ppct, tuan-${lesson.week}, gdpt-2018`,
      favorite: true,
    });

    setSaved(true);
    showAlert(
      'Đã lưu vào Thư viện',
      `Đã lưu cấu trúc Prompt "${tabTitles[activeTab]}" của bài học vào Thư viện Prompt AI!`,
    );
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    {
      id: 'khbd' as AIGeneratorTab,
      label: 'KHBD 5512',
      fullLabel: 'Kế hoạch Bài dạy 5512',
      icon: BookOpenCheck,
      desc: 'Giáo án 4 hoạt động chuẩn CV 5512',
    },
    {
      id: 'spec' as AIGeneratorTab,
      label: 'Bản đặc tả',
      fullLabel: 'Bản đặc tả đề kiểm tra',
      icon: FileText,
      desc: 'Đặc tả 3 dạng thức kèm mã năng lực',
    },
    {
      id: 'matrix' as AIGeneratorTab,
      label: 'Ma trận CV 7991',
      fullLabel: 'Ma trận đề chuẩn CV 7991',
      icon: Table,
      desc: 'Ma trận câu hỏi chuẩn ngày 17/12/2024',
    },
    {
      id: 'quiz' as AIGeneratorTab,
      label: 'Đề trắc nghiệm',
      fullLabel: 'Đề trắc nghiệm 3 dạng thức',
      icon: HelpCircle,
      desc: 'Bộ đề thi 3 dạng thức kèm đáp án',
    },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm mt-0.5">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider font-mono">
                  Tuần {lesson.week} • Tiết {lesson.order}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  Tin học {plan.grade} • {plan.track}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {lesson.lessonName}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-lg mt-0.5">
                {lesson.topic}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 4 Tool Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2.5 sm:p-3 rounded-xl flex flex-col items-center sm:items-start text-center sm:text-left transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={16} />
                  <span className="text-xs font-bold">{tab.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:block truncate w-full">
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Prompt preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Prompt đã tự động nạp Mục tiêu YCCĐ & Năng lực của bài học:
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <span>{currentPrompt.length} ký tự</span>
            </div>
          </div>

          <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-y-auto max-h-[46vh] border border-slate-800 leading-relaxed shadow-inner">
            <pre className="whitespace-pre-wrap font-sans">{currentPrompt}</pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            💡 Dán trực tiếp prompt này vào <strong>ChatGPT, Claude hoặc Gemini</strong> để nhận kết quả chuẩn xác 100%.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSaveToPromptLibrary}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
            >
              {saved ? <CheckCircle2 size={15} className="text-emerald-500" /> : <BookmarkPlus size={15} />}
              <span>{saved ? 'Đã lưu thư viện' : 'Lưu thư viện'}</span>
            </button>

            <button
              onClick={handleCopy}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px] shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Đã sao chép Prompt!' : 'Sao chép Prompt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
