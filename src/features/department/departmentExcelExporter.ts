import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  DepartmentEquipmentRecord,
  PPCTPlan,
  TeacherAssignmentRecord,
} from '../../types';

export function exportDepartmentAppendix1Excel(
  plans: PPCTPlan[],
  equipments: DepartmentEquipmentRecord[] = [],
  schoolName: string = 'SỞ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG THPT',
  deptName: string = 'TỔ CHUYÊN MÔN TIN HỌC',
  year: string = '2024 - 2025',
) {
  const wb = XLSX.utils.book_new();

  // =========================================================
  // SHEET 1: KHUNG KẾ HOẠCH DẠY HỌC (PPCT CÁC KHỐI)
  // =========================================================
  const s1Rows: (string | number)[][] = [
    [schoolName.toUpperCase(), '', '', '', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'],
    [deptName.toUpperCase(), '', '', '', 'Độc lập - Tự do - Hạnh phúc'],
    [],
    ['', '', 'KẾ HOẠCH DẠY HỌC MÔN TIN HỌC CỦA TỔ CHUYÊN MÔN'],
    ['', '', `Năm học: ${year} (Theo Phụ lục 1, Công văn số 5512/BGDĐT-GDTrH)`],
    [],
    ['STT', 'Khối lớp', 'Tên kế hoạch / Định hướng', 'Số tiết / tuần', 'Tổng số tiết / năm', 'Số tuần thực dạy', 'Lớp phụ trách / Ghi chú'],
  ];

  if (plans.length > 0) {
    plans.forEach((plan, idx) => {
      s1Rows.push([
        idx + 1,
        `Khối ${plan.grade}`,
        `${plan.title} (${plan.track})`,
        2,
        plan.totalPeriods || 70,
        plan.totalWeeks || 35,
        plan.assignedClasses || 'Toàn khối',
      ]);
    });
  } else {
    s1Rows.push([1, 'Khối 10', 'Tin học 10 - Chương trình chuẩn GDPT 2018', 2, 70, 35, 'Toàn khối 10']);
    s1Rows.push([2, 'Khối 11', 'Tin học 11 - Định hướng Tin học ứng dụng & KHMT', 2, 70, 35, '11A1, 11A2, 11Tin']);
    s1Rows.push([3, 'Khối 12', 'Tin học 12 - Định hướng Tin học ứng dụng (KNTT)', 2, 70, 35, 'Toàn khối 12']);
  }

  const ws1 = XLSX.utils.aoa_to_sheet(s1Rows);
  ws1['!cols'] = [{ wch: 6 }, { wch: 12 }, { wch: 45 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 32 }];
  ws1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } },
    { s: { r: 4, c: 1 }, e: { r: 4, c: 5 } },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Khung_PPCT_CacKhoi');

  // =========================================================
  // SHEET 2: KẾ HOẠCH THIẾT BỊ DẠY HỌC & PHÒNG MÁY TÍNH
  // =========================================================
  const s2Rows: (string | number)[][] = [
    [schoolName.toUpperCase(), '', '', '', 'KẾ HOẠCH PHÒNG MÁY & THIẾT BỊ'],
    [deptName.toUpperCase(), '', '', '', `Năm học: ${year}`],
    [],
    ['STT', 'Tên thiết bị / Phòng thực hành', 'Số lượng', 'Tình trạng kỹ thuật', 'Lớp / Khối sử dụng', 'Ghi chú sử dụng'],
  ];

  if (equipments.length > 0) {
    equipments.forEach((eq, idx) => {
      s2Rows.push([
        idx + 1,
        eq.name,
        eq.quantity,
        eq.condition,
        eq.assignedGrades,
        eq.notes || '',
      ]);
    });
  } else {
    s2Rows.push([1, 'Phòng máy tính số 1 (Phòng A)', '46 máy trạm + 1 máy chủ', 'Hoạt động tốt, mạng LAN/Internet 150Mbps', 'Khối 10, Khối 12', 'Thực hành lập trình, thiết kế web']);
    s2Rows.push([2, 'Phòng máy tính số 2 (Phòng B)', '41 máy trạm + 1 máy chủ', 'Hoạt động ổn định, cài đặt VS Code & Python', 'Khối 11, Khối 12', 'Thực hành mạng máy tính, đồ họa']);
    s2Rows.push([3, 'Bộ thiết bị mạng thực hành', '04 bộ Switch & Router Wi-Fi', 'Đảm bảo chuẩn kỹ thuật thực hành', 'Khối 12 (Bài 3, 4, 5, 22)', 'Thực hành kết nối và bấm cáp mạng']);
    s2Rows.push([4, 'Máy chiếu / Tivi tương tác thông minh', '02 chiếc', 'Độ phân giải Full HD, kết nối không dây', 'Tất cả các khối', 'Phục vụ bài giảng điện tử số hóa']);
  }

  const ws2 = XLSX.utils.aoa_to_sheet(s2Rows);
  ws2['!cols'] = [{ wch: 6 }, { wch: 35 }, { wch: 25 }, { wch: 35 }, { wch: 20 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'PhongMay_ThietBi');

  // =========================================================
  // SHEET 3: KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ (CV 7991)
  // =========================================================
  const s3Rows: (string | number)[][] = [
    [schoolName.toUpperCase(), '', '', '', 'KẾ HOẠCH KIỂM TRA ĐỊNH KỲ'],
    [deptName.toUpperCase(), '', '', '', `Năm học: ${year} (Chuẩn CV 7991)`],
    [],
    ['STT', 'Bài kiểm tra', 'Khối lớp', 'Thời điểm (Tuần)', 'Thời lượng', 'Hình thức kiểm tra', 'Địa điểm'],
    [1, 'Kiểm tra Giữa kỳ I', 'Khối 10, 11, 12', 'Tuần 9 - 10', '45 phút', 'Trắc nghiệm 3 dạng thức (CV 7991)', 'Phòng máy tính / Lớp học'],
    [2, 'Kiểm tra Cuối kỳ I', 'Khối 10, 11, 12', 'Tuần 18', '45 phút', 'Trắc nghiệm kết hợp thực hành sản phẩm', 'Phòng máy tính'],
    [3, 'Kiểm tra Giữa kỳ II', 'Khối 10, 11, 12', 'Tuần 26 - 28', '45 phút', 'Trắc nghiệm 3 dạng thức chuẩn đề 2025', 'Phòng máy tính'],
    [4, 'Kiểm tra Cuối kỳ II', 'Khối 10, 11, 12', 'Tuần 33 - 35', '45 phút', 'Đánh giá năng lực tổng hợp cả năm', 'Phòng máy tính'],
  ];

  const ws3 = XLSX.utils.aoa_to_sheet(s3Rows);
  ws3['!cols'] = [{ wch: 6 }, { wch: 24 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 35 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'KiemTra_DinhKy');

  // Write and Save
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `PhuLuc1_KeHoachDayHoc_ToChuyenMon_${year.replace(/[^0-9]/g, '')}.xlsx`);
}

export function exportTeacherAssignmentsExcel(
  assignments: TeacherAssignmentRecord[],
  schoolName: string = 'SỞ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG THPT',
  deptName: string = 'TỔ CHUYÊN MÔN TIN HỌC',
  year: string = '2024 - 2025',
) {
  const rows: (string | number)[][] = [
    [schoolName.toUpperCase(), '', '', '', '', 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM'],
    [deptName.toUpperCase(), '', '', '', '', 'Độc lập - Tự do - Hạnh phúc'],
    [],
    ['', '', 'BẢNG PHÂN CÔNG CHUYÊN MÔN VÀ LỊCH PHÒNG MÁY'],
    ['', '', `Năm học: ${year} (Theo Phụ lục 2, Công văn số 5512/BGDĐT-GDTrH)`],
    [],
    ['STT', 'Họ và tên Giáo viên', 'Lớp phân công giảng dạy', 'Số tiết / tuần', 'Lịch phòng máy tính', 'Số điện thoại / Email', 'Nhiệm vụ kiêm nhiệm / Ghi chú'],
  ];

  assignments.forEach((a, idx) => {
    rows.push([
      idx + 1,
      a.teacherName,
      a.assignedClasses,
      a.periodsPerWeek,
      a.labSchedule || 'Thứ 2, 4 (Phòng máy 1)',
      a.phone ? `${a.phone}${a.email ? ` | ${a.email}` : ''}` : a.email || '',
      a.notes || 'Giảng dạy chính khóa',
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 25 },
    { wch: 25 },
    { wch: 14 },
    { wch: 30 },
    { wch: 28 },
    { wch: 35 },
  ];
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
    { s: { r: 3, c: 1 }, e: { r: 3, c: 5 } },
    { s: { r: 4, c: 1 }, e: { r: 4, c: 5 } },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'PhanCong_ChuyenMon');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `PhuLuc2_PhanCongChuyenMon_${year.replace(/[^0-9]/g, '')}.xlsx`);
}
