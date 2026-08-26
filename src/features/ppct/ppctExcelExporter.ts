import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PPCTLesson, PPCTPlan } from '../../types';

export function exportPPCTToExcel(
  plan: PPCTPlan,
  schoolName: string = 'SỞ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG THPT',
  deptName: string = 'TỔ CHUYÊN MÔN TIN HỌC',
) {
  const rows: (string | number)[][] = [];

  // Row 1: Administrative Header
  rows.push([
    schoolName.toUpperCase(),
    '',
    '',
    '',
    '',
    '',
    '',
    'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
    '',
  ]);
  // Row 2: Department & National Motto
  rows.push([
    deptName.toUpperCase(),
    '',
    '',
    '',
    '',
    '',
    '',
    'Độc lập - Tự do - Hạnh phúc',
    '',
  ]);
  // Row 3: Blank
  rows.push([]);

  // Row 4: Main Document Title
  const trackName =
    plan.track === 'ICT'
      ? ' (ĐỊNH HƯỚNG TIN HỌC ỨNG DỤNG - ICT)'
      : plan.track === 'CS'
      ? ' (ĐỊNH HƯỚNG KHOA HỌC MÁY TÍNH - CS)'
      : ' (CHƯƠNG TRÌNH CHUẨN GDPT 2018)';

  rows.push([
    '',
    '',
    '',
    `KẾ HOẠCH DẠY HỌC MÔN TIN HỌC - KHỐI ${plan.grade}${trackName}`,
    '',
    '',
    '',
    '',
    '',
  ]);

  // Row 5: Metadata Info
  rows.push([
    '',
    '',
    '',
    `Năm học: ${plan.academicYear} | Lớp phụ trách: ${plan.assignedClasses || 'Toàn khối'} | Tổng số: ${plan.totalPeriods} tiết / ${plan.totalWeeks} tuần`,
    '',
    '',
    '',
    '',
    '',
  ]);

  // Row 6: Blank
  rows.push([]);

  // Row 7: Table Column Headers
  const headers = [
    'STT',
    'Tuần',
    'Tiết PPCT',
    'Tên bài học / Hoạt động dạy học',
    'Số tiết',
    'Yêu cầu cần đạt (YCCĐ)',
    'Mã năng lực',
    'Địa điểm dạy học',
    'Ghi chú',
  ];
  rows.push(headers);

  // Group lessons by semester
  const sem1Lessons = plan.lessons.filter((l) => l.semester === 1);
  const sem2Lessons = plan.lessons.filter((l) => l.semester === 2);

  const getFormatObjectives = (lesson: PPCTLesson): string => {
    if (lesson.objectives) {
      const parts: string[] = [];
      if (lesson.objectives.know && lesson.objectives.know.length > 0) {
        parts.push(`- Biết: ${lesson.objectives.know.join('; ')}`);
      }
      if (lesson.objectives.understand && lesson.objectives.understand.length > 0) {
        parts.push(`- Hiểu: ${lesson.objectives.understand.join('; ')}`);
      }
      if (lesson.objectives.apply && lesson.objectives.apply.length > 0) {
        parts.push(`- Vận dụng: ${lesson.objectives.apply.join('; ')}`);
      }
      if (parts.length > 0) return parts.join('\n');
    }
    return lesson.topic || '';
  };

  const getLessonLocation = (lesson: PPCTLesson): string => {
    if (lesson.type === 'PRACTICE') return 'Phòng máy tính';
    if (lesson.type === 'PROJECT') return 'Phòng máy tính / Lớp học';
    if (lesson.notes && lesson.notes.toLowerCase().includes('máy')) return 'Phòng máy tính';
    return 'Phòng học lý thuyết';
  };

  const pushLessonRow = (lesson: PPCTLesson, stt: number) => {
    const periodRange =
      lesson.periods > 1
        ? `${lesson.order} - ${lesson.order + lesson.periods - 1}`
        : `${lesson.order}`;

    const competenciesStr = lesson.competencies ? lesson.competencies.join(', ') : '';
    const location = getLessonLocation(lesson);

    rows.push([
      stt,
      lesson.week,
      periodRange,
      lesson.lessonName,
      lesson.periods,
      getFormatObjectives(lesson),
      competenciesStr,
      location,
      lesson.notes || (lesson.status === 'COMPLETED' ? 'Đã hoàn thành' : ''),
    ]);
  };

  // 1. Học kỳ I
  if (sem1Lessons.length > 0) {
    const sem1TotalPeriods = sem1Lessons.reduce((acc, l) => acc + l.periods, 0);
    rows.push([
      '',
      '',
      '',
      `--- HỌC KỲ I (Tuần 1 đến Tuần 18: ${sem1TotalPeriods} tiết) ---`,
      '',
      '',
      '',
      '',
      '',
    ]);
    sem1Lessons.forEach((lesson, idx) => {
      pushLessonRow(lesson, idx + 1);
    });
  }

  // 2. Học kỳ II
  if (sem2Lessons.length > 0) {
    const sem2TotalPeriods = sem2Lessons.reduce((acc, l) => acc + l.periods, 0);
    rows.push([
      '',
      '',
      '',
      `--- HỌC KỲ II (Tuần 19 đến Tuần 35: ${sem2TotalPeriods} tiết) ---`,
      '',
      '',
      '',
      '',
      '',
    ]);
    sem2Lessons.forEach((lesson, idx) => {
      pushLessonRow(lesson, sem1Lessons.length + idx + 1);
    });
  }

  // Create Worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Auto-fit & Set column widths
  ws['!cols'] = [
    { wch: 6 }, // STT
    { wch: 8 }, // Tuần
    { wch: 12 }, // Tiết PPCT
    { wch: 46 }, // Tên bài học
    { wch: 8 }, // Số tiết
    { wch: 60 }, // YCCĐ
    { wch: 18 }, // Mã năng lực
    { wch: 22 }, // Địa điểm
    { wch: 20 }, // Ghi chú
  ];

  // Merge cells for Header and Titles
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // School name
    { s: { r: 0, c: 7 }, e: { r: 0, c: 8 } }, // National Name
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Dept name
    { s: { r: 1, c: 7 }, e: { r: 1, c: 8 } }, // Motto
    { s: { r: 3, c: 2 }, e: { r: 3, c: 6 } }, // Title
    { s: { r: 4, c: 2 }, e: { r: 4, c: 6 } }, // Year & Classes
  ];

  // Create Workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `PPCT_Tin_${plan.grade}`);

  // Write and Save file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const cleanYear = plan.academicYear.replace(/[^a-zA-Z0-9]/g, '');
  const filename = `PPCT_TinHoc_Khoi${plan.grade}_${cleanYear || '20242025'}.xlsx`;
  saveAs(blob, filename);
}
