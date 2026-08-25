import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Award,
} from 'lucide-react';
import { LessonEvaluationRecord } from '../../types';

interface PrintEvaluationViewProps {
  evaluation: LessonEvaluationRecord | null;
  onClose: () => void;
  btnPrimary: string;
  btnSecondary: string;
}

export function PrintEvaluationView({
  evaluation,
  onClose,
  btnPrimary,
  btnSecondary,
}: PrintEvaluationViewProps) {
  const [copied, setCopied] = useState(false);

  if (!evaluation) return null;

  const handlePrint = () => {
    window.print();
  };

  const getRatingText = (rating: string) => {
    switch (rating) {
      case 'GIOI':
        return 'LOẠI GIỎI';
      case 'KHA':
        return 'LOẠI KHÁ';
      case 'DAT':
        return 'LOẠI ĐẠT';
      default:
        return 'CHƯA ĐẠT';
    }
  };

  const formattedText = `SỞ GD&ĐT / TRƯỜNG THPT
TỔ CHUYÊN MÔN: TIN HỌC

PHIẾU ĐÁNH GIÁ TIẾT DẠY
(Ban hành kèm theo Công văn 5555/BGDĐT-GDTrH)

1. THÔNG TIN TIẾT DẠY:
- Người dạy: ${evaluation.teacherName}
- Người dự: ${evaluation.observerName}
- Lớp: ${evaluation.className} | Tiết: ${evaluation.period} | Ngày dạy: ${evaluation.date}
- Tên bài học / Tiết dạy: ${evaluation.lessonName}

2. ĐÁNH GIÁ THEO CÁC TIÊU CHÍ (Thang điểm 20):
- Tiêu chí 1 (Kế hoạch & Tài liệu dạy học): ${evaluation.scorePlanning.toFixed(1)} / 5.0 điểm
- Tiêu chí 2 (Tổ chức hoạt động dạy học của GV): ${evaluation.scoreTeacherActivity.toFixed(1)} / 5.0 điểm
- Tiêu chí 3 (Hoạt động học của Học sinh): ${evaluation.scoreStudentActivity.toFixed(1)} / 5.0 điểm
- Tiêu chí 4 (Hiệu quả bài dạy): ${evaluation.scoreEffectiveness.toFixed(1)} / 5.0 điểm

TỔNG ĐIỂM: ${evaluation.totalScore.toFixed(1)} / 20.0 ĐIỂM
XẾP LOẠI: ${getRatingText(evaluation.rating)}

3. NHẬN XÉT ĐÁNH GIÁ:
- Ưu điểm:
${evaluation.strengths || 'Không ghi nhận'}

- Tồn tại / Hạn chế:
${evaluation.weaknesses || 'Không ghi nhận'}

- Đề xuất & Tư vấn:
${evaluation.recommendations || 'Không ghi nhận'}

NGƯỜI DẠY (Ký tên)                  NGƯỜI DỰ GIỜ (Ký tên)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Award className="text-blue-500" size={20} /> Phiếu Đánh giá Tiết dạy (CV 5555)
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Printable Content Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200" id="print-area">
          <div className="text-center space-y-1 pb-3 border-b border-slate-200 dark:border-slate-800">
            <p className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">
              TRƯỜNG THPT • TỔ CHUYÊN MÔN TIN HỌC
            </p>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase">
              PHIẾU ĐÁNH GIÁ TIẾT DẠY
            </h2>
            <p className="text-[10px] text-slate-400 italic">(Theo chuẩn Công văn 5555/BGDĐT-GDTrH)</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
            <p><strong>Người dạy:</strong> {evaluation.teacherName}</p>
            <p><strong>Người dự:</strong> {evaluation.observerName}</p>
            <p><strong>Lớp:</strong> {evaluation.className} (Tiết {evaluation.period})</p>
            <p><strong>Ngày dạy:</strong> {evaluation.date}</p>
            <p className="col-span-2"><strong>Bài dạy:</strong> {evaluation.lessonName}</p>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                <tr>
                  <th className="p-2.5">Tiêu chí đánh giá</th>
                  <th className="p-2.5 text-right">Điểm đạt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-2.5">1. Kế hoạch và tài liệu dạy học</td>
                  <td className="p-2.5 text-right font-bold text-blue-600">{evaluation.scorePlanning.toFixed(1)} / 5.0</td>
                </tr>
                <tr>
                  <td className="p-2.5">2. Tổ chức hoạt động dạy học của Giáo viên</td>
                  <td className="p-2.5 text-right font-bold text-blue-600">{evaluation.scoreTeacherActivity.toFixed(1)} / 5.0</td>
                </tr>
                <tr>
                  <td className="p-2.5">3. Hoạt động học của Học sinh</td>
                  <td className="p-2.5 text-right font-bold text-blue-600">{evaluation.scoreStudentActivity.toFixed(1)} / 5.0</td>
                </tr>
                <tr>
                  <td className="p-2.5">4. Hiệu quả bài dạy</td>
                  <td className="p-2.5 text-right font-bold text-blue-600">{evaluation.scoreEffectiveness.toFixed(1)} / 5.0</td>
                </tr>
                <tr className="bg-blue-50/50 dark:bg-blue-950/40 font-bold">
                  <td className="p-2.5">TỔNG ĐIỂM & XẾP LOẠI:</td>
                  <td className="p-2.5 text-right text-blue-700 dark:text-blue-300">
                    {evaluation.totalScore.toFixed(1)}/20.0 • {getRatingText(evaluation.rating)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <strong>Ưu điểm nổi bật:</strong>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap mt-0.5">{evaluation.strengths || 'Không có ghi chú'}</p>
            </div>
            <div>
              <strong>Tồn tại / Hạn chế:</strong>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap mt-0.5">{evaluation.weaknesses || 'Không có ghi chú'}</p>
            </div>
            <div>
              <strong>Đề xuất tư vấn:</strong>
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap mt-0.5">{evaluation.recommendations || 'Không có ghi chú'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 text-center pt-6 text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-800 dark:text-white">NGƯỜI DẠY</p>
              <p className="italic text-[10px]">(Ký và ghi rõ họ tên)</p>
              <div className="h-14" />
              <p>{evaluation.teacherName}</p>
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">NGƯỜI DỰ GIỜ</p>
              <p className="italic text-[10px]">(Ký và ghi rõ họ tên)</p>
              <div className="h-14" />
              <p>{evaluation.observerName}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Đóng
          </button>
          <button type="button" onClick={handleCopy} className={btnSecondary}>
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            <span>Sao chép</span>
          </button>
          <button type="button" onClick={handlePrint} className={btnPrimary}>
            <Printer size={16} /> In Phiếu
          </button>
        </div>
      </div>
    </div>
  );
}
