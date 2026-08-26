import React, { useState, useMemo, useEffect } from 'react';
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
  Clock,
  Laptop,
  Monitor,
  CheckSquare,
  Wand2,
  CheckCircle2,
  Sliders,
  RotateCcw,
  SlidersHorizontal,
  FileCode2,
} from 'lucide-react';
import { PPCTLesson, PPCTPlan } from '../../types';
import { useAppContext } from '../../app/AppContext';

export type AIGeneratorTab = 'matrix' | 'spec' | 'quiz' | 'khbd';

interface LessonAIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: PPCTLesson | null;
  plan: PPCTPlan;
  initialTab?: AIGeneratorTab;
}

const competencyLabels: Record<string, string> = {
  NLa: 'NLa: Sử dụng và quản lý các phương tiện CNTT và truyền thông',
  NLb: 'NLb: Ứng xử phù hợp trong môi trường số',
  NLc: 'NLc: Giải quyết vấn đề với sự trợ giúp của CNTT và truyền thông',
  NLd: 'NLd: Ứng dụng CNTT và truyền thông trong học và tự học',
  NLe: 'NLe: Hợp tác trong môi trường số',
};

export function LessonAIGeneratorModal({
  isOpen,
  onClose,
  lesson,
  plan,
  initialTab = 'matrix',
}: LessonAIGeneratorModalProps) {
  const { promptsCtrl, showAlert, setActiveTab, setGlobalFocus } = useAppContext();

  // Normalize active tab: 'spec' maps to 'matrix' with spec sub-output
  const [activeTabState, setActiveTabState] = useState<'matrix' | 'quiz' | 'khbd'>('matrix');
  const [matrixSubMode, setMatrixSubMode] = useState<'matrix' | 'spec'>('matrix');

  // Sync initial tab when opening modal
  useEffect(() => {
    if (isOpen) {
      if (initialTab === 'spec') {
        setActiveTabState('matrix');
        setMatrixSubMode('spec');
      } else if (initialTab === 'matrix') {
        setActiveTabState('matrix');
        setMatrixSubMode('matrix');
      } else if (initialTab === 'quiz') {
        setActiveTabState('quiz');
      } else if (initialTab === 'khbd') {
        setActiveTabState('khbd');
      }
    }
  }, [isOpen, initialTab]);

  // -------------------------------------------------------------
  // CONTROLS FOR TAB 1: MA TRẬN & BẢN ĐẶC TẢ
  // -------------------------------------------------------------
  const [examDuration, setExamDuration] = useState<'15' | '45' | '60' | '90'>('45');
  const [examTypeTitle, setExamTypeTitle] = useState('Kiểm tra Giữa học kỳ');
  const [mcqCount, setMcqCount] = useState(16);
  const [tfCount, setTfCount] = useState(4);
  const [shortCount, setShortCount] = useState(4);

  // Cognitive distribution (%)
  const [cognitivePreset, setCognitivePreset] = useState<'cv7991' | 'basic' | 'advanced' | 'custom'>('cv7991');
  const [nbPercent, setNbPercent] = useState(40);
  const [thPercent, setThPercent] = useState(30);
  const [vdPercent, setVdPercent] = useState(20);
  const [vdcPercent, setVdcPercent] = useState(10);

  const handleCognitivePresetChange = (preset: 'cv7991' | 'basic' | 'advanced' | 'custom') => {
    setCognitivePreset(preset);
    if (preset === 'cv7991') {
      setNbPercent(40);
      setThPercent(30);
      setVdPercent(20);
      setVdcPercent(10);
    } else if (preset === 'basic') {
      setNbPercent(50);
      setThPercent(30);
      setVdPercent(15);
      setVdcPercent(5);
    } else if (preset === 'advanced') {
      setNbPercent(30);
      setThPercent(30);
      setVdPercent(25);
      setVdcPercent(15);
    }
  };

  const handleExamDurationChange = (dur: '15' | '45' | '60' | '90') => {
    setExamDuration(dur);
    if (dur === '15') {
      setExamTypeTitle('Kiểm tra thường xuyên (15p)');
      setMcqCount(8);
      setTfCount(2);
      setShortCount(2);
    } else if (dur === '45') {
      setExamTypeTitle('Kiểm tra Giữa học kỳ (45p)');
      setMcqCount(16);
      setTfCount(4);
      setShortCount(4);
    } else if (dur === '90') {
      setExamTypeTitle('Kiểm tra Cuối học kỳ / Khảo sát (90p)');
      setMcqCount(24);
      setTfCount(6);
      setShortCount(6);
    }
  };

  // -------------------------------------------------------------
  // CONTROLS FOR TAB 2: ĐỀ TRẮC NGHIỆM TIN HỌC
  // -------------------------------------------------------------
  const [includePart1, setIncludePart1] = useState(true); // 4 lựa chọn
  const [includePart2, setIncludePart2] = useState(true); // Đúng/Sai 4 ý
  const [includePart3, setIncludePart3] = useState(true); // Trả lời ngắn
  const [includeExplanations, setIncludeExplanations] = useState(true);
  const [createVariants, setCreateVariants] = useState(false); // 2 mã đề hoán vị
  const [targetCompetency, setTargetCompetency] = useState<string>('ALL');

  // -------------------------------------------------------------
  // CONTROLS FOR TAB 3: KẾ HOẠCH BÀI DẠY KHBD 5512
  // -------------------------------------------------------------
  const [lessonPeriods, setLessonPeriods] = useState<number>(lesson?.periods || 2);
  const [environment, setEnvironment] = useState<'COMPUTER_LAB' | 'CLASSROOM'>('COMPUTER_LAB');
  const [softwareTools, setSoftwareTools] = useState<string[]>([
    'VS Code & Trình duyệt Web',
    'Phần mềm mô phỏng / Thực hành',
    'Slide bài giảng số & Phiếu học tập',
  ]);
  const [pedagogyDetailLevel, setPedagogyDetailLevel] = useState<'STANDARD' | 'DETAILED'>('DETAILED');

  // Reset lesson periods when lesson changes
  useEffect(() => {
    if (lesson) {
      setLessonPeriods(lesson.periods || 2);
      setEnvironment(lesson.type === 'PRACTICE' ? 'COMPUTER_LAB' : 'CLASSROOM');
    }
  }, [lesson]);

  const toggleSoftwareTool = (tool: string) => {
    setSoftwareTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    );
  };

  // Feedback states
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const totalPercent = nbPercent + thPercent + vdPercent + vdcPercent;

  // -------------------------------------------------------------
  // PROMPT BUILDERS WITH LIVE PARAMS
  // -------------------------------------------------------------

  // 1. GENERATOR: MA TRẬN CV 7991 HOẶC BẢN ĐẶC TẢ
  const generateMatrixOrSpecPrompt = () => {
    if (!lesson) return '';

    if (matrixSubMode === 'matrix') {
      return `Đóng vai là Trưởng bộ môn Tin học THPT & Chuyên gia khảo thí bám sát Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GD&ĐT. Hãy xây dựng KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ cho chủ đề chứa bài học sau:

THÔNG TIN ĐỀ KIỂM TRA:
- Môn học: Tin học Lớp ${plan.grade} (${trackTitle})
- Hình thức: ${examTypeTitle}
- Thời gian làm bài: ${examDuration} phút
- Đơn vị bài học trọng tâm: ${lesson.lessonName} (Tuần ${lesson.week} • Tiết ${lesson.order})
- Chủ đề lớn: ${lesson.topic}

CẤU TRÚC ĐỀ THEO TÙY CHỈNH:
- Số câu trắc nghiệm Nhiều lựa chọn (Phần I): ${mcqCount} câu (mỗi câu 0.25đ = ${(mcqCount * 0.25).toFixed(2)}đ)
- Số câu trắc nghiệm Đúng/Sai (Phần II): ${tfCount} câu (mỗi câu 4 ý a,b,c,d, tối đa 1.0đ/câu = ${(tfCount * 1.0).toFixed(2)}đ)
- Số câu trắc nghiệm Trả lời ngắn (Phần III): ${shortCount} câu (mỗi câu 0.25đ hoặc 0.5đ)

TỶ LỆ PHÂN BỐ MỨC ĐỘ NHẬN THỨC THEO CHUẨN:
- Nhận biết (Biết): ${nbPercent}%
- Thông hiểu (Hiểu): ${thPercent}%
- Vận dụng (VD): ${vdPercent}%
- Vận dụng cao (VDC): ${vdcPercent}%
(Tổng tỷ lệ nhận thức: ${totalPercent}%)

YÊU CẦU ĐẦU RA:
1. Xuất Khung Bảng Ma trận Markdown chuẩn theo đúng biểu mẫu Phụ lục Công văn 7991/BGDĐT-GDTrH.
2. Bảng phân bố rõ ràng: Cột Mức độ nhận thức (Biết, Hiểu, Vận dụng, Vận dụng cao) cho từng phần thi (Phần I, II, III).
3. Đảm bảo tổng số điểm thang 10.0 và thời gian làm bài ${examDuration} phút hợp lý.`;
    } else {
      return `Đóng vai là Chuyên gia Khảo thí và Đánh giá chất lượng giáo dục môn Tin học THPT. Hãy xây dựng BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐÁNH GIÁ theo định dạng chuẩn Bộ GD&ĐT cho bài học sau:

THÔNG TIN BÀI HỌC & ĐỀ KIỂM TRA:
- Môn học: Tin học Lớp ${plan.grade} (${trackTitle})
- Đơn vị bài học: ${lesson.lessonName} (Tuần ${lesson.week})
- Thuộc chủ đề: ${lesson.topic}
- Thời lượng bài kiểm tra: ${examDuration} phút (${examTypeTitle})

THÔNG SỐ PHÂN BỐ CÂU HỎI:
- Phần I (Nhiều lựa chọn): ${mcqCount} câu
- Phần II (Đúng/Sai 4 ý): ${tfCount} câu
- Phần III (Trả lời ngắn): ${shortCount} câu
- Tỷ lệ nhận thức: ${nbPercent}% Biết - ${thPercent}% Hiểu - ${vdPercent}% Vận dụng - ${vdcPercent}% Vận dụng cao.

NỘI DUNG ÁNH XẠ YÊU CẦU CẦN ĐẠT (YCCĐ):
- Mức độ Nhận biết:
${knowList.map((k) => `  * ${k}`).join('\n')}
- Mức độ Thông hiểu:
${understandList.map((u) => `  * ${u}`).join('\n')}
- Mức độ Vận dụng & VDC:
${applyList.map((a) => `  * ${a}`).join('\n')}

YÊU CẦU ĐẦU RA:
Xuất BẢNG ĐẶC TẢ MARKDOWN đầy đủ các cột chuẩn của Bộ GD&ĐT:
| TT | Đơn vị kiến thức | Mức độ đánh giá | Yêu cầu cần đạt | Mã năng lực (NLa-NLe) | Số câu hỏi Phần I | Số câu hỏi Phần II | Số câu hỏi Phần III |`;
    }
  };

  // 2. GENERATOR: ĐỀ TRẮC NGHIỆM TIN HỌC (QUIZ)
  const generateQuizPrompt = () => {
    if (!lesson) return '';

    const partsText: string[] = [];
    if (includePart1) {
      partsText.push(`- PHẦN I (Trắc nghiệm Nhiều lựa chọn): Tạo ${mcqCount > 0 ? mcqCount : 4} câu hỏi 4 phương án A, B, C, D (chỉ 1 phương án đúng), tập trung vào mức độ Nhận biết và Thông hiểu.`);
    }
    if (includePart2) {
      partsText.push(`- PHẦN II (Trắc nghiệm Đúng/Sai): Tạo ${tfCount > 0 ? tfCount : 2} câu hỏi. Mỗi câu đưa ra một ngữ cảnh thực tiễn hoặc đoạn mã nguồn/cấu hình, kèm 4 ý a), b), c), d) yêu cầu thí sinh xác định Đúng hay Sai theo chuẩn định dạng Tốt nghiệp THPT.`);
    }
    if (includePart3) {
      partsText.push(`- PHẦN III (Trắc nghiệm Trả lời ngắn): Tạo ${shortCount > 0 ? shortCount : 2} câu hỏi yêu cầu học sinh phân tích, suy luận và điền kết quả (output lệnh, giá trị số hoặc từ khóa kỹ thuật ngắn gọn).`);
    }

    const compTarget =
      targetCompetency !== 'ALL'
        ? `TẬP TRUNG ĐẶC BIỆT VÀO MÃ NĂNG LỰC: ${competencyLabels[targetCompetency] || targetCompetency}`
        : `BAO QUÁT CÁC MÃ NĂNG LỰC BÀI HỌC: ${lesson.competencies?.join(', ') || 'NLa, NLc, NLd'}`;

    return `Đóng vai là Chuyên gia ra đề thi môn Tin học THPT theo định dạng kỳ thi Tốt nghiệp THPT mới từ năm 2025 của Bộ Giáo dục & Đào tạo. Hãy biên soạn một BỘ ĐỀ TRẮC NGHIỆM ĐÁNH GIÁ NĂNG LỰC cho bài học sau:

THÔNG TIN BÀI HỌC:
- Môn: Tin học Lớp ${plan.grade} (${trackTitle})
- Tên bài học: ${lesson.lessonName}
- Chủ đề: ${lesson.topic}
- ${compTarget}

YÊU CẦU CẦN ĐẠT CỦA BÀI HỌC:
* Nhận biết: ${knowList.join('; ')}
* Thông hiểu: ${understandList.join('; ')}
* Vận dụng: ${applyList.join('; ')}

CẤU TRÚC ĐỀ THEO LỰA CHỌN CỦA GIÁO VIÊN:
${partsText.join('\n')}

${createVariants ? '- YÊU CẦU TẠO 2 PHIÊN BẢN HOÁN VỊ: Tạo 2 mã đề thi tương đương (Mã đề 101 và Mã đề 102) để tổ chức kiểm tra công bằng trong phòng máy.' : ''}

${includeExplanations ? `ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM:
- Cung cấp Bảng đáp án Phần I.
- Cung cấp Bảng đáp án Phần II (Ghi rõ từng ý a, b, c, d là Đúng hay Sai kèm phần giải thích ngắn gọn).
- Cung cấp Đáp án và lời giải chi tiết cho Phần III.` : 'Không cần kèm lời giải chi tiết (chỉ cung cấp bảng đáp án nhanh).'}
`;
  };

  // 3. GENERATOR: KẾ HOẠCH BÀI DẠY KHBD 5512
  const generateKHBDPrompt = () => {
    if (!lesson) return '';

    const envText =
      environment === 'COMPUTER_LAB'
        ? 'Phòng thực hành máy tính có kết nối mạng Internet (học sinh thao tác trực tiếp trên máy tính cá nhân)'
        : 'Phòng học lý thuyết trang bị Máy chiếu / Tivi thông minh và bảng tương tác';

    return `Đóng vai là Chuyên gia Sư phạm Tin học THPT & Giảng viên bồi dưỡng giáo viên theo chương trình GDPT 2018. Hãy soạn thảo một KẾ HOẠCH BÀI DẠY (GIÁO ÁN) hoàn chỉnh, chuẩn mực tuyệt đối theo đúng phụ lục Công văn 5512/BGDĐT-GDTrH cho bài học sau:

THÔNG TIN BÀI DẠY:
- Môn học: Tin học Lớp ${plan.grade} (${trackTitle})
- Tên bài dạy: ${lesson.lessonName}
- Thuộc chủ đề: ${lesson.topic}
- Thời lượng giảng dạy: ${lessonPeriods} tiết (${lessonPeriods * 45} phút)
- Môi trường & Cơ sở vật chất: ${envText}
- Phần mềm & Học liệu số sử dụng: ${softwareTools.join(', ')}

I. MỤC TIÊU DẠY HỌC:
1. Năng lực Tin học đặc thù:
${competenciesList.map((c) => `  - ${c}`).join('\n')}

2. Yêu cầu cần đạt chi tiết theo 3 mức độ:
  * Nhận biết: ${knowList.join('; ')}
  * Thông hiểu: ${understandList.join('; ')}
  * Vận dụng & VDC: ${applyList.join('; ')}

3. Phẩm chất: Chăm chỉ, Trung thực, Trách nhiệm trong môi trường số.

II. TIẾN TRÌNH DẠY HỌC (Chuỗi 4 hoạt động sư phạm theo CV 5512):
Xây dựng chi tiết chuỗi 4 hoạt động theo cấp độ: ${pedagogyDetailLevel === 'DETAILED' ? 'Chi tiết nâng cao có phương án phân hóa học sinh nhanh/chậm và hướng dẫn khắc phục lỗi thường gặp' : 'Chuẩn 4 bước chuẩn mực theo CV 5512'}.
Mỗi hoạt động phải có đủ 4 mục: a) Mục tiêu, b) Nội dung, c) Sản phẩm dự kiến, d) Tổ chức thực hiện (Chuyển giao nhiệm vụ -> Thực hiện nhiệm vụ -> Báo cáo, thảo luận -> Kết luận, nhận định).

- HOẠT ĐỘNG 1: KHỞI ĐỘNG (Xác định vấn đề / Tình huống có vấn đề khơi gợi hứng thú)
- HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (Khám phá nội dung trọng tâm bài học)
- HOẠT ĐỘNG 3: LUYỆN TẬP (Củng cố, thực hành trên máy hoặc bài tập phân hóa)
- HOẠT ĐỘNG 4: VẬN DỤNG (Mở rộng thực tiễn, định hướng phát triển năng lực tự học)

III. HỒ SƠ DẠY HỌC ĐÍNH KÈM:
- Thiết kế nội dung chi tiết Phiếu học tập số 1 và số 2.
- Bảng tiêu chí đánh giá sản phẩm (Rubric) dành cho giáo viên và học sinh tự đánh giá.`;
  };

  const currentPrompt = useMemo(() => {
    switch (activeTabState) {
      case 'matrix':
        return generateMatrixOrSpecPrompt();
      case 'quiz':
        return generateQuizPrompt();
      case 'khbd':
        return generateKHBDPrompt();
      default:
        return '';
    }
  }, [
    activeTabState,
    matrixSubMode,
    examDuration,
    examTypeTitle,
    mcqCount,
    tfCount,
    shortCount,
    nbPercent,
    thPercent,
    vdPercent,
    vdcPercent,
    includePart1,
    includePart2,
    includePart3,
    includeExplanations,
    createVariants,
    targetCompetency,
    lessonPeriods,
    environment,
    softwareTools,
    pedagogyDetailLevel,
    lesson,
    plan,
  ]);

  if (!isOpen || !lesson) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSaveToPromptLibrary = () => {
    const tabTitles = {
      matrix: matrixSubMode === 'matrix' ? 'Ma trận đề CV 7991' : 'Bản đặc tả đề kiểm tra',
      quiz: 'Đề trắc nghiệm 3 dạng thức',
      khbd: 'Kế hoạch bài dạy 5512',
    };

    const tabCategories = {
      matrix: matrixSubMode === 'matrix' ? 'Ma trận đề' : 'Đặc tả đề',
      quiz: 'Đề kiểm tra',
      khbd: 'Giáo án 5512',
    };

    promptsCtrl.addItem({
      title: `${tabTitles[activeTabState]} - ${lesson.lessonName}`,
      content: currentPrompt,
      description: `Prompt AI cho bài Tin học ${plan.grade} (Tuần ${lesson.week}): ${lesson.lessonName}`,
      category: tabCategories[activeTabState],
      tags: `tin-hoc-${plan.grade}, ppct, tuan-${lesson.week}, gdpt-2018`,
      favorite: true,
    });

    setSaved(true);
    showAlert(
      'Đã lưu vào Thư viện',
      `Đã lưu cấu trúc Prompt "${tabTitles[activeTabState]}" vào Thư viện Prompt AI!`,
    );
    setTimeout(() => setSaved(false), 3000);
  };

  // Open in Full AI Studio
  const handleOpenInFullAIStudio = () => {
    let targetSubTool = 'exam-matrix';
    if (activeTabState === 'khbd') targetSubTool = 'lesson-plan';
    else if (activeTabState === 'quiz') targetSubTool = 'quiz-builder';
    else if (activeTabState === 'matrix') targetSubTool = 'exam-matrix';

    setGlobalFocus({ id: targetSubTool, action: 'view' });
    setActiveTab('ai-tools');
    onClose();
  };

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

        {/* 3 Main Tool Tabs */}
        <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTabState('matrix')}
            className={`p-2.5 sm:p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              activeTabState === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table size={16} />
            <span>Ma trận & Bản đặc tả</span>
          </button>

          <button
            onClick={() => setActiveTabState('quiz')}
            className={`p-2.5 sm:p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              activeTabState === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <HelpCircle size={16} />
            <span>Đề trắc nghiệm Tin học</span>
          </button>

          <button
            onClick={() => setActiveTabState('khbd')}
            className={`p-2.5 sm:p-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              activeTabState === 'khbd'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpenCheck size={16} />
            <span>Kế hoạch bài dạy 5512</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* ========================================================= */}
          {/* TAB 1: MA TRẬN & BẢN ĐẶC TẢ CONTROLS */}
          {/* ========================================================= */}
          {activeTabState === 'matrix' && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tùy chỉnh Cấu trúc Đề & Mức độ nhận thức
                  </span>
                </div>

                {/* Sub-mode switch: Ma trận vs Đặc tả */}
                <div className="flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-700/60 rounded-lg text-xs">
                  <button
                    onClick={() => setMatrixSubMode('matrix')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      matrixSubMode === 'matrix'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Ma trận (CV 7991)
                  </button>
                  <button
                    onClick={() => setMatrixSubMode('spec')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      matrixSubMode === 'spec'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Bản đặc tả chi tiết
                  </button>
                </div>
              </div>

              {/* Duration and Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Thời lượng & Loại đề:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleExamDurationChange('15')}
                      className={`p-1.5 rounded-lg border text-center font-medium transition-colors ${
                        examDuration === '15'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      15 phút (TX)
                    </button>
                    <button
                      onClick={() => handleExamDurationChange('45')}
                      className={`p-1.5 rounded-lg border text-center font-medium transition-colors ${
                        examDuration === '45'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      45 phút (GK)
                    </button>
                    <button
                      onClick={() => handleExamDurationChange('90')}
                      className={`p-1.5 rounded-lg border text-center font-medium transition-colors ${
                        examDuration === '90'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      90 phút (CK)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tỷ lệ nhận thức:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleCognitivePresetChange('cv7991')}
                      className={`p-1.5 rounded-lg border text-center font-medium transition-colors ${
                        cognitivePreset === 'cv7991'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Chuẩn 4:3:2:1
                    </button>
                    <button
                      onClick={() => handleCognitivePresetChange('basic')}
                      className={`p-1.5 rounded-lg border text-center font-medium transition-colors ${
                        cognitivePreset === 'basic'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Cơ bản 5:3:1.5
                    </button>
                    <button
                      onClick={() => handleCognitivePresetChange('advanced')}
                      className={`p-1.5 rounded-lg border text-center font-medium transition-colors ${
                        cognitivePreset === 'advanced'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Nâng cao 3:3:2.5
                    </button>
                  </div>
                </div>
              </div>

              {/* Sliders / Numbers for Question counts */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Phần I: 4 Lựa chọn
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={mcqCount}
                    onChange={(e) => setMcqCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Phần II: Đúng/Sai 4 ý
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={tfCount}
                    onChange={(e) => setTfCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Phần III: Trả lời ngắn
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={shortCount}
                    onChange={(e) => setShortCount(parseInt(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ĐỀ TRẮC NGHIỆM TIN HỌC CONTROLS */}
          {/* ========================================================= */}
          {activeTabState === 'quiz' && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <SlidersHorizontal size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Định dạng câu hỏi & Tùy chọn đề thi
                </span>
              </div>

              {/* 3 Question format checkboxes */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                  Thành phần đề thi:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePart1}
                      onChange={(e) => setIncludePart1(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">Phần I: 4 Lựa chọn</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePart2}
                      onChange={(e) => setIncludePart2(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">Phần II: Đúng/Sai 4 ý</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includePart3}
                      onChange={(e) => setIncludePart3(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">Phần III: Trả lời ngắn</span>
                  </label>
                </div>
              </div>

              {/* Toggles & Competency filter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeExplanations}
                      onChange={(e) => setIncludeExplanations(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Kèm bảng đáp án & Lời giải chi tiết</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={createVariants}
                      onChange={(e) => setCreateVariants(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Tạo 2 Mã đề thi hoán vị (Đề 101 & 102)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Trọng tâm Năng lực:
                  </label>
                  <select
                    value={targetCompetency}
                    onChange={(e) => setTargetCompetency(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs outline-none"
                  >
                    <option value="ALL">Tất cả năng lực của bài</option>
                    <option value="NLa">NLa: Sử dụng và quản lý CNTT</option>
                    <option value="NLb">NLb: Ứng xử phù hợp môi trường số</option>
                    <option value="NLc">NLc: Giải quyết vấn đề với CNTT</option>
                    <option value="NLd">NLd: Ứng dụng CNTT tự học</option>
                    <option value="NLe">NLe: Hợp tác trong môi trường số</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: KẾ HOẠCH BÀI DẠY KHBD 5512 CONTROLS */}
          {/* ========================================================= */}
          {activeTabState === 'khbd' && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                <SlidersHorizontal size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tùy chọn Sư phạm & Học liệu dạy học
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Thời lượng giảng dạy:
                  </label>
                  <select
                    value={lessonPeriods}
                    onChange={(e) => setLessonPeriods(parseInt(e.target.value) || 2)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none font-semibold"
                  >
                    <option value={1}>1 tiết (45 phút)</option>
                    <option value={2}>2 tiết (90 phút)</option>
                    <option value={3}>3 tiết (135 phút)</option>
                    <option value={4}>4 tiết (180 phút)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Môi trường dạy học:
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as 'COMPUTER_LAB' | 'CLASSROOM')}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none"
                  >
                    <option value="COMPUTER_LAB">Phòng máy tính & Mạng Internet</option>
                    <option value="CLASSROOM">Phòng lý thuyết / Máy chiếu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Độ chi tiết chuỗi hoạt động:
                  </label>
                  <select
                    value={pedagogyDetailLevel}
                    onChange={(e) => setPedagogyDetailLevel(e.target.value as 'STANDARD' | 'DETAILED')}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 outline-none font-semibold"
                  >
                    <option value="DETAILED">Chi tiết nâng cao (Kèm Rubric & Phiếu)</option>
                    <option value="STANDARD">Chuẩn 4 bước CV 5512 cơ bản</option>
                  </select>
                </div>
              </div>

              {/* Digital Tools Checkboxes */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                  Phần mềm & Học liệu số:
                </label>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {[
                    'VS Code & Trình duyệt Web',
                    'Python (IDLE / Thonny)',
                    'Dịch vụ đám mây / GitHub Pages',
                    'Canva / Phần mềm đồ họa',
                    'Slide bài giảng số & Phiếu học tập',
                  ].map((tool) => {
                    const isSelected = softwareTools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleSoftwareTool(tool)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tool}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Real-time Generated Prompt Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileCode2 size={15} className="text-indigo-600 dark:text-indigo-400" />
                Prompt được cấu hình trực tiếp sẵn sàng gửi AI:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {currentPrompt.length} ký tự
              </span>
            </div>

            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-y-auto max-h-[38vh] border border-slate-800 leading-relaxed shadow-inner">
              <pre className="whitespace-pre-wrap font-sans">{currentPrompt}</pre>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Button to open in Full AI Studio */}
          <button
            onClick={handleOpenInFullAIStudio}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
            title="Chuyển sang module Công cụ AI đầy đủ với bài học này"
          >
            <Wand2 size={15} />
            <span>Mở trong Xưởng AI đầy đủ</span>
          </button>

          {/* Copy and Save buttons */}
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
