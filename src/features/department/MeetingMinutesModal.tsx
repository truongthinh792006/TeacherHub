import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Sparkles,
  Calendar,
  Users,
} from 'lucide-react';
import { DepartmentMeetingRecord, MeetingTopic } from '../../types';
import { localDateString } from '../../lib/date';

interface MeetingMinutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<DepartmentMeetingRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: DepartmentMeetingRecord | null;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}

export function MeetingMinutesModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  inputClass,
  btnPrimary,
  btnSecondary,
}: MeetingMinutesModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(localDateString());
  const [time, setTime] = useState('14:00 - 16:30');
  const [location, setLocation] = useState('Phòng Hội đồng / Phòng máy 1');
  const [chair, setChair] = useState('Tổ trưởng Chuyên môn');
  const [secretary, setSecretary] = useState('Thư ký Tổ');
  const [attendees, setAttendees] = useState('Toàn thể Giáo viên trong Tổ Tin học');
  const [absent, setAbsent] = useState('Không');
  const [topic, setTopic] = useState<MeetingTopic>('LESSON_STUDY');
  const [content, setContent] = useState('');
  const [resolutions, setResolutions] = useState('');
  const [assignments, setAssignments] = useState('');
  const [nextMeetingDate, setNextMeetingDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(initialData.date);
      setTime(initialData.time || '14:00 - 16:30');
      setLocation(initialData.location || 'Phòng Hội đồng');
      setChair(initialData.chair);
      setSecretary(initialData.secretary);
      setAttendees(initialData.attendees);
      setAbsent(initialData.absent || 'Không');
      setTopic(initialData.topic);
      setContent(initialData.content);
      setResolutions(initialData.resolutions);
      setAssignments(initialData.assignments || '');
      setNextMeetingDate(initialData.nextMeetingDate || '');
    } else {
      setTitle('Biên bản Sinh hoạt chuyên môn theo Nghiên cứu bài học');
      setDate(localDateString());
      setTime('14:00 - 16:30');
      setLocation('Phòng máy tính 1');
      setChair('Tổ trưởng Chuyên môn');
      setSecretary('Thư ký Tổ');
      setAttendees('Toàn thể Giáo viên trong Tổ Tin học');
      setAbsent('Không');
      setTopic('LESSON_STUDY');
      setContent(
        '1. Đánh giá tiết dạy thực nghiệm của Giáo viên dạy minh họa.\n2. Phân tích hoạt động học của học sinh (mức độ tiếp thu, khó khăn khi thực hành code Python, lỗi cú pháp thường gặp).\n3. Trao đổi, thảo luận giải pháp cải tiến tiến trình dạy học và thiết kế phiếu học tập.',
      );
      setResolutions(
        '1. Thống nhất áp dụng kế hoạch bài dạy đã điều chỉnh vào các lớp còn lại trong khối.\n2. Tăng cường hướng dẫn học sinh kỹ năng debug lỗi trực tiếp trên phòng máy.',
      );
      setAssignments('Thầy A nộp giáo án đã chỉnh sửa lên Google Drive của Tổ trước Thứ Sáu.');
      setNextMeetingDate('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleApplyPreset = (presetType: 'LESSON_STUDY' | 'EXAM_MATRIX' | 'GENERAL') => {
    if (presetType === 'LESSON_STUDY') {
      setTitle('Biên bản Sinh hoạt chuyên môn theo Nghiên cứu bài học');
      setTopic('LESSON_STUDY');
      setContent(
        '1. Đánh giá tiết dạy thực nghiệm bài học minh họa môn Tin học theo Công văn 5555.\n2. Phân tích chi tiết hành vi học tập của học sinh: sự hứng thú, khả năng hợp tác nhóm, sản phẩm lập trình đạt được.\n3. Các giáo viên trong tổ đóng góp ý kiến về việc phân bổ thời gian và câu hỏi gợi mở.',
      );
      setResolutions(
        '1. Nhất trí nghiệm thu kế hoạch bài dạy minh họa sau khi bổ sung các góp ý.\n2. Nhân rộng phương pháp dạy học giải quyết vấn đề trên phòng máy tính.',
      );
      setAssignments('Giáo viên dạy hoàn thiện hồ sơ và biên bản lưu vào hồ sơ chuyên môn tổ.');
    } else if (presetType === 'EXAM_MATRIX') {
      setTitle('Biên bản Thống nhất Ma trận & Bản đặc tả Đề kiểm tra định kỳ');
      setTopic('EXAM_MATRIX');
      setContent(
        '1. Rà soát tiến độ giảng dạy các khối 10, 11, 12 chuẩn bị cho kỳ kiểm tra định kỳ.\n2. Thống nhất tỷ lệ ma trận nhận thức: 40% Nhận biết, 30% Thông hiểu, 20% Vận dụng, 10% Vận dụng cao.\n3. Phân công giáo viên xây dựng ngân hàng câu hỏi theo 3 dạng thức mới (Nhiều lựa chọn, Đúng/Sai, Trả lời ngắn).',
      );
      setResolutions(
        '1. Thông qua Ma trận và Bản đặc tả đề kiểm tra môn Tin học các khối.\n2. Thời hạn nộp đề nguồn và duyệt đề: trước 01 tuần so với lịch thi của nhà trường.',
      );
      setAssignments('Thầy A (Tin 10), Cô B (Tin 11), Thầy C (Tin 12) phụ trách ra đề và barem chấm.');
    } else {
      setTitle('Biên bản Họp Tổ chuyên môn định kỳ');
      setTopic('GENERAL');
      setContent(
        '1. Đánh giá công tác chuyên môn trong tháng vừa qua (tiến độ PPCT, nộp giáo án, quản lý phòng máy).\n2. Triển khai kế hoạch công tác tháng tới từ Ban Giám hiệu.\n3. Phổ biến quy chế thi đua, kế hoạch thao giảng dự giờ và bồi dưỡng học sinh giỏi.',
      );
      setResolutions(
        '1. 100% giáo viên hoàn thành việc vào điểm và kiểm tra hồ sơ đúng hạn.\n2. Duy trì nề nếp trực và bảo quản thiết bị phòng máy tính.',
      );
      setAssignments('Toàn thể giáo viên nghiêm túc thực hiện lịch báo giảng.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      recordType: 'MEETING',
      title: title.trim(),
      date,
      time: time.trim(),
      location: location.trim(),
      chair: chair.trim(),
      secretary: secretary.trim(),
      attendees: attendees.trim(),
      absent: absent.trim(),
      topic,
      content: content.trim(),
      resolutions: resolutions.trim(),
      assignments: assignments.trim(),
      nextMeetingDate: nextMeetingDate.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/60 text-purple-600 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                {initialData ? 'Chỉnh sửa Biên bản Họp tổ' : 'Tạo Biên bản Sinh hoạt Tổ Chuyên môn'}
              </h3>
              <p className="text-[11px] text-slate-500">Lưu trữ hồ sơ quản lý tổ chuyên môn Tin học</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-3 pb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Sparkles size={12} className="text-amber-500" /> Mẫu nhanh:
          </span>
          <button
            type="button"
            onClick={() => handleApplyPreset('LESSON_STUDY')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
          >
            Nghiên cứu bài học
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('EXAM_MATRIX')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100"
          >
            Thống nhất Ma trận Đề
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('GENERAL')}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
          >
            Họp tổ định kỳ
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Tiêu đề cuộc họp *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Ngày họp
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Thời gian
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="VD: 14:00 - 16:30"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Địa điểm
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="VD: Phòng máy 1"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Chủ trì (Tổ trưởng / Tổ phó)
              </label>
              <input
                type="text"
                value={chair}
                onChange={(e) => setChair(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Thư ký cuộc họp
              </label>
              <input
                type="text"
                value={secretary}
                onChange={(e) => setSecretary(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Thành phần tham dự
              </label>
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Vắng mặt (Lý do)
              </label>
              <input
                type="text"
                value={absent}
                onChange={(e) => setAbsent(e.target.value)}
                placeholder="VD: Không hoặc Thầy C (có phép)"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Nội dung cuộc họp & Ý kiến thảo luận *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ghi rõ tiến trình trao đổi, các ý kiến phát biểu của giáo viên trong tổ..."
              className={`${inputClass} min-h-[90px] text-xs resize-y`}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Kết luận & Nghị quyết cuộc họp
            </label>
            <textarea
              value={resolutions}
              onChange={(e) => setResolutions(e.target.value)}
              placeholder="Các quyết nghị đã được tập thể tổ chuyên môn nhất trí thông qua..."
              className={`${inputClass} min-h-[65px] text-xs resize-y`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Phân công nhiệm vụ cụ thể
              </label>
              <input
                type="text"
                value={assignments}
                onChange={(e) => setAssignments(e.target.value)}
                placeholder="VD: Thầy A phụ trách nộp kế hoạch, Cô B chuẩn bị bài thao giảng..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Lịch sinh hoạt tiếp theo
              </label>
              <input
                type="date"
                value={nextMeetingDate}
                onChange={(e) => setNextMeetingDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className={`flex-1 ${btnSecondary}`}>
              Hủy
            </button>
            <button type="submit" className={`flex-1 ${btnPrimary}`}>
              {initialData ? 'Cập nhật Biên bản' : 'Lưu Biên bản Họp tổ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
