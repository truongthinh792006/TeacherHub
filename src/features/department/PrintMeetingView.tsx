import React, { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  FileText,
  FileDown,
} from 'lucide-react';
import { DepartmentMeetingRecord } from '../../types';
import { exportMeetingMinutesWord } from './departmentDocxExporter';

interface PrintMeetingViewProps {
  meeting: DepartmentMeetingRecord | null;
  onClose: () => void;
  btnPrimary: string;
  btnSecondary: string;
}

export function PrintMeetingView({
  meeting,
  onClose,
  btnPrimary,
  btnSecondary,
}: PrintMeetingViewProps) {
  const [copied, setCopied] = useState(false);

  if (!meeting) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    exportMeetingMinutesWord(meeting);
  };

  const topicLabel =
    meeting.topic === 'LESSON_STUDY'
      ? 'Sinh hoạt chuyên môn theo Nghiên cứu bài học'
      : meeting.topic === 'EXAM_MATRIX'
      ? 'Xây dựng ma trận & đặc tả đề kiểm tra định kỳ'
      : meeting.topic === 'SPECIALIZED_TOPIC'
      ? 'Chuyên đề chuyên môn & Đổi mới phương pháp'
      : 'Họp tổ định kỳ';

  const plainText = `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-------------------------

BIÊN BẢN SINH HOẠT TỔ CHUYÊN MÔN
Tiêu đề: ${meeting.title}
Chủ đề: ${topicLabel}

1. THỜI GIAN VÀ ĐỊA ĐIỂM:
- Thời gian: ${meeting.time || '14:00'}, ngày ${meeting.date}
- Địa điểm: ${meeting.location || 'Phòng hội đồng / Phòng máy tính'}

2. THÀNH PHẦN THAM DỰ:
- Chủ trì: ${meeting.chair} (Tổ trưởng)
- Thư ký: ${meeting.secretary}
- Thành viên tham dự: ${meeting.attendees}
- Vắng mặt: ${meeting.absent || 'Không'}

3. NỘI DUNG SINH HOẠT:
${meeting.content}

4. KẾT LUẬN VÀ NGHỊ QUYẾT:
${meeting.resolutions}
${meeting.assignments ? `\n5. PHÂN CÔNG NHIỆM VỤ:\n${meeting.assignments}` : ''}

THƯ KÝ (Ký tên)                     TỔ TRƯỞNG (Ký tên)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
            Xem trước & In Biên bản Sinh hoạt tổ
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Paper Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 font-serif text-slate-900 dark:text-slate-100 text-sm leading-relaxed" id="print-area">
          <div className="grid grid-cols-2 text-center pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <p className="uppercase">TRƯỜNG THPT</p>
              <p className="font-bold uppercase">TỔ TIN HỌC - CÔNG NGHỆ</p>
              <p className="text-[10px] text-slate-400">***</p>
            </div>
            <div>
              <p className="font-bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="font-semibold italic">Độc lập - Tự do - Hạnh phúc</p>
              <p className="text-[10px] text-slate-400">***</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
              BIÊN BẢN SINH HOẠT TỔ CHUYÊN MÔN
            </h2>
            <p className="text-xs italic text-slate-600 dark:text-slate-400">
              Nội dung: {meeting.title}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              {topicLabel}
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs sm:text-sm">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl space-y-1">
              <p><strong>1. Thời gian:</strong> {meeting.time || '14:00'}, ngày {meeting.date}</p>
              <p><strong>2. Địa điểm:</strong> {meeting.location || 'Phòng hội đồng / Phòng máy tính'}</p>
              <p><strong>3. Chủ trì:</strong> {meeting.chair} (Tổ trưởng)</p>
              <p><strong>4. Thư ký:</strong> {meeting.secretary}</p>
              <p><strong>5. Thành phần:</strong> {meeting.attendees}</p>
              {meeting.absent && <p><strong>6. Vắng mặt:</strong> {meeting.absent}</p>}
            </div>

            <div>
              <h4 className="font-bold uppercase text-xs text-indigo-600 dark:text-indigo-400 mb-1">
                I. Nội dung sinh hoạt chuyên môn:
              </h4>
              <div className="whitespace-pre-wrap pl-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-l-2 border-indigo-200 dark:border-indigo-800">
                {meeting.content}
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                II. Kết luận & Nghị quyết cuộc họp:
              </h4>
              <div className="whitespace-pre-wrap pl-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-l-2 border-emerald-200 dark:border-emerald-800">
                {meeting.resolutions}
              </div>
            </div>

            {meeting.assignments && (
              <div>
                <h4 className="font-bold uppercase text-xs text-amber-600 dark:text-amber-400 mb-1">
                  III. Phân công nhiệm vụ cụ thể:
                </h4>
                <div className="whitespace-pre-wrap pl-3 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-l-2 border-amber-200 dark:border-amber-800">
                  {meeting.assignments}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 text-center pt-8 text-xs">
            <div>
              <p className="font-bold uppercase">THƯ KÝ</p>
              <p className="italic text-[10px] text-slate-500">(Ký và ghi rõ họ tên)</p>
              <div className="h-16" />
              <p className="font-bold">{meeting.secretary}</p>
            </div>
            <div>
              <p className="font-bold uppercase">TỔ TRƯỞNG CHUYÊN MÔN</p>
              <p className="italic text-[10px] text-slate-500">(Ký và ghi rõ họ tên)</p>
              <div className="h-16" />
              <p className="font-bold">{meeting.chair}</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={onClose} className={btnSecondary}>
            Đóng
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className={btnSecondary}
              title="Sao chép văn bản"
            >
              {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
              <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportWord}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 transition-colors"
              title="Xuất file Word .doc chuẩn mẫu hành chính"
            >
              <FileDown size={15} />
              <span>Xuất Word (.doc)</span>
            </button>
            <button type="button" onClick={handlePrint} className={btnPrimary}>
              <Printer size={15} />
              <span>In / Lưu PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
