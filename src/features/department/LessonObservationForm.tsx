import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Check,
  Calculator,
  FileCheck2,
} from 'lucide-react';
import { EvaluationRating, LessonEvaluationRecord } from '../../types';
import { localDateString } from '../../lib/date';

interface LessonObservationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<LessonEvaluationRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: LessonEvaluationRecord | null;
  inputClass: string;
  btnPrimary: string;
  btnSecondary: string;
}

export function LessonObservationForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  inputClass,
  btnPrimary,
  btnSecondary,
}: LessonObservationFormProps) {
  const [teacherName, setTeacherName] = useState('');
  const [observerName, setObserverName] = useState('');
  const [className, setClassName] = useState('10A1');
  const [lessonName, setLessonName] = useState('');
  const [date, setDate] = useState(localDateString());
  const [period, setPeriod] = useState(1);

  // Scores (0.0 - 5.0)
  const [scorePlanning, setScorePlanning] = useState(4.0);
  const [scoreTeacherActivity, setScoreTeacherActivity] = useState(4.0);
  const [scoreStudentActivity, setScoreStudentActivity] = useState(4.0);
  const [scoreEffectiveness, setScoreEffectiveness] = useState(4.0);

  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [recommendations, setRecommendations] = useState('');

  useEffect(() => {
    if (initialData) {
      setTeacherName(initialData.teacherName);
      setObserverName(initialData.observerName);
      setClassName(initialData.className);
      setLessonName(initialData.lessonName);
      setDate(initialData.date);
      setPeriod(initialData.period);
      setScorePlanning(initialData.scorePlanning);
      setScoreTeacherActivity(initialData.scoreTeacherActivity);
      setScoreStudentActivity(initialData.scoreStudentActivity);
      setScoreEffectiveness(initialData.scoreEffectiveness);
      setStrengths(initialData.strengths);
      setWeaknesses(initialData.weaknesses);
      setRecommendations(initialData.recommendations);
    } else {
      setTeacherName('');
      setObserverName('');
      setClassName('10A1');
      setLessonName('');
      setDate(localDateString());
      setPeriod(1);
      setScorePlanning(4.0);
      setScoreTeacherActivity(4.0);
      setScoreStudentActivity(4.0);
      setScoreEffectiveness(4.0);
      setStrengths('');
      setWeaknesses('');
      setRecommendations('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const totalScore = Number(
    (scorePlanning + scoreTeacherActivity + scoreStudentActivity + scoreEffectiveness).toFixed(1),
  );

  // Determine Rating based on CV 5555
  let rating: EvaluationRating = 'CHUA_DAT';
  const minScore = Math.min(
    scorePlanning,
    scoreTeacherActivity,
    scoreStudentActivity,
    scoreEffectiveness,
  );

  if (totalScore >= 16.0 && minScore >= 3.5) {
    rating = 'GIOI';
  } else if (totalScore >= 13.0 && minScore >= 3.0) {
    rating = 'KHA';
  } else if (totalScore >= 10.0) {
    rating = 'DAT';
  } else {
    rating = 'CHUA_DAT';
  }

  const getRatingLabel = (r: EvaluationRating) => {
    switch (r) {
      case 'GIOI':
        return { text: 'Loại Giỏi', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' };
      case 'KHA':
        return { text: 'Loại Khá', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' };
      case 'DAT':
        return { text: 'Loại Đạt', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' };
      case 'CHUA_DAT':
        return { text: 'Chưa Đạt', color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' };
    }
  };

  const currentRatingBadge = getRatingLabel(rating);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim() || !lessonName.trim()) return;

    onSave({
      recordType: 'EVALUATION',
      teacherName: teacherName.trim(),
      observerName: observerName.trim() || 'Người dự',
      className: className.trim(),
      lessonName: lessonName.trim(),
      date,
      period,
      scorePlanning,
      scoreTeacherActivity,
      scoreStudentActivity,
      scoreEffectiveness,
      totalScore,
      rating,
      strengths: strengths.trim(),
      weaknesses: weaknesses.trim(),
      recommendations: recommendations.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/60 text-blue-600 rounded-xl">
              <FileCheck2 size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                {initialData ? 'Chỉnh sửa Phiếu dự giờ' : 'Tạo Phiếu Dự giờ & Đánh giá Tiết dạy'}
              </h3>
              <p className="text-[11px] text-slate-500">Chuẩn đánh giá tiết dạy Công văn 5555 / BGDĐT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* Thông tin chung */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Giáo viên dạy *
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="VD: Thầy Nguyễn Văn A"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Người dự giờ
              </label>
              <input
                type="text"
                value={observerName}
                onChange={(e) => setObserverName(e.target.value)}
                placeholder="VD: Cô Trần Thị B (Tổ trưởng)"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Lớp dạy
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="VD: 10A1"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Tên bài học / Tiết dạy *
              </label>
              <input
                type="text"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
                placeholder="VD: Bài 15: Cấu trúc rẽ nhánh trong Python"
                className={inputClass}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Ngày dự
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
                  Tiết
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(parseInt(e.target.value))}
                  className={inputClass}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                    <option key={p} value={p}>
                      Tiết {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bảng chấm điểm 4 tiêu chí chuẩn CV 5555 */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-3.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Đánh giá theo 4 Tiêu chí CV 5555 (Thang điểm 20)
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tổng: <strong className="text-blue-600 text-sm">{totalScore}/20</strong>
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${currentRatingBadge.color}`}>
                  {currentRatingBadge.text}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Tiêu chí 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                <div className="flex-1">
                  <span className="font-bold text-slate-800 dark:text-white">1. Kế hoạch & Tài liệu dạy học:</span>
                  <p className="text-[11px] text-slate-500">Chuỗi hoạt động học phù hợp mục tiêu, phương pháp và kỹ thuật dạy học.</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.25"
                    value={scorePlanning}
                    onChange={(e) => setScorePlanning(parseFloat(e.target.value))}
                    className="w-28 accent-blue-600"
                  />
                  <span className="font-bold text-blue-600 w-8 text-right">{scorePlanning.toFixed(1)}đ</span>
                </div>
              </div>

              {/* Tiêu chí 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                <div className="flex-1">
                  <span className="font-bold text-slate-800 dark:text-white">2. Hoạt động dạy của Giáo viên:</span>
                  <p className="text-[11px] text-slate-500">Chuyển giao nhiệm vụ rõ ràng, quan sát, hướng dẫn và xử lý tình huống sư phạm.</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.25"
                    value={scoreTeacherActivity}
                    onChange={(e) => setScoreTeacherActivity(parseFloat(e.target.value))}
                    className="w-28 accent-blue-600"
                  />
                  <span className="font-bold text-blue-600 w-8 text-right">{scoreTeacherActivity.toFixed(1)}đ</span>
                </div>
              </div>

              {/* Tiêu chí 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                <div className="flex-1">
                  <span className="font-bold text-slate-800 dark:text-white">3. Hoạt động học của Học sinh:</span>
                  <p className="text-[11px] text-slate-500">Mức độ tích cực, chủ động, hợp tác thảo luận và hoàn thành nhiệm vụ.</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.25"
                    value={scoreStudentActivity}
                    onChange={(e) => setScoreStudentActivity(parseFloat(e.target.value))}
                    className="w-28 accent-blue-600"
                  />
                  <span className="font-bold text-blue-600 w-8 text-right">{scoreStudentActivity.toFixed(1)}đ</span>
                </div>
              </div>

              {/* Tiêu chí 4 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                <div className="flex-1">
                  <span className="font-bold text-slate-800 dark:text-white">4. Hiệu quả bài dạy:</span>
                  <p className="text-[11px] text-slate-500">Mức độ đúng đắn, chính xác và vận dụng kiến thức/kỹ năng của học sinh.</p>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.25"
                    value={scoreEffectiveness}
                    onChange={(e) => setScoreEffectiveness(parseFloat(e.target.value))}
                    className="w-28 accent-blue-600"
                  />
                  <span className="font-bold text-blue-600 w-8 text-right">{scoreEffectiveness.toFixed(1)}đ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nhận xét & Đề xuất */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Ưu điểm nổi bật
              </label>
              <textarea
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="VD: Giáo viên chuẩn bị giáo án chu đáo, ứng dụng CNTT tốt, học sinh thực hành code sôi nổi..."
                className={`${inputClass} min-h-[60px] text-xs resize-y`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Hạn chế / Tồn tại cần khắc phục
              </label>
              <textarea
                value={weaknesses}
                onChange={(e) => setWeaknesses(e.target.value)}
                placeholder="VD: Cần phân bố thời gian phần Luyện tập hợp lý hơn, bao quát các máy tính ở cuối phòng..."
                className={`${inputClass} min-h-[60px] text-xs resize-y`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Đề xuất & Tư vấn thúc đẩy
              </label>
              <textarea
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                placeholder="VD: Tăng cường giao bài tập rẽ nhánh có bối cảnh thực tế cho học sinh khá giỏi..."
                className={`${inputClass} min-h-[60px] text-xs resize-y`}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className={`flex-1 ${btnSecondary}`}>
              Hủy
            </button>
            <button type="submit" className={`flex-1 ${btnPrimary}`}>
              {initialData ? 'Cập nhật Phiếu' : 'Lưu Phiếu dự giờ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
