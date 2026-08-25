import { PPCTLesson, PPCTPlan } from '../../types';

// Helper to build 35-week lessons
function buildLessons(
  rawList: Array<{
    week: number;
    semester: 1 | 2;
    topic: string;
    lessonName: string;
    periods: number;
    type: 'LESSON' | 'PRACTICE' | 'MIDTERM' | 'FINAL' | 'REVIEW' | 'PROJECT';
  }>,
): PPCTLesson[] {
  let currentOrder = 1;
  return rawList.map((item, idx) => {
    const lesson: PPCTLesson = {
      id: `lesson-${idx + 1}`,
      order: currentOrder,
      week: item.week,
      semester: item.semester,
      topic: item.topic,
      lessonName: item.lessonName,
      periods: item.periods,
      type: item.type,
      status: 'PENDING',
      notes: item.type === 'PRACTICE' ? 'Phòng máy tính' : undefined,
    };
    currentOrder += item.periods;
    return lesson;
  });
}

// 1. PPCT Preset: Tin học 10 (GDPT 2018 - 70 tiết / 35 tuần)
export const presetGrade10: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'PPCT Tin học 10 (Chuẩn GDPT 2018)',
  grade: '10',
  track: 'GENERAL',
  academicYear: '2024 - 2025',
  assignedClasses: '10A1, 10A2, 10A3',
  totalPeriods: 70,
  totalWeeks: 35,
  isDefault: true,
  lessons: buildLessons([
    // HỌC KỲ 1 (Tuần 1 -> 18: 36 tiết)
    { week: 1, semester: 1, topic: 'Chủ đề A: Máy tính và xã hội tri thức', lessonName: 'Bài 1: Thông tin và xử lý thông tin', periods: 2, type: 'LESSON' },
    { week: 2, semester: 1, topic: 'Chủ đề A: Máy tính và xã hội tri thức', lessonName: 'Bài 2: Vai trò của thiết bị thông minh và tin học', periods: 2, type: 'LESSON' },
    { week: 3, semester: 1, topic: 'Chủ đề A: Máy tính và xã hội tri thức', lessonName: 'Bài 3: Thực hành sử dụng thiết bị số cá nhân', periods: 2, type: 'PRACTICE' },
    { week: 4, semester: 1, topic: 'Chủ đề B: Mạng máy tính và Internet', lessonName: 'Bài 4: Mạng máy tính và các dịch vụ Internet', periods: 2, type: 'LESSON' },
    { week: 5, semester: 1, topic: 'Chủ đề B: Mạng máy tính và Internet', lessonName: 'Bài 5: Thực hành kết nối mạng và sử dụng dịch vụ đám mây', periods: 2, type: 'PRACTICE' },
    { week: 6, semester: 1, topic: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số', lessonName: 'Bài 6: An toàn trên không gian mạng và Bản quyền số', periods: 2, type: 'LESSON' },
    { week: 7, semester: 1, topic: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số', lessonName: 'Bài 7: Thực hành phòng chống rủi ro trên mạng', periods: 2, type: 'PRACTICE' },
    { week: 8, semester: 1, topic: 'Ôn tập & Đánh giá', lessonName: 'Ôn tập Kiểm tra Đánh giá Giữa học kỳ 1', periods: 2, type: 'REVIEW' },
    { week: 9, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ 1 (45p)', periods: 2, type: 'MIDTERM' },
    { week: 10, semester: 1, topic: 'Chủ đề F: Giải quyết vấn đề với sự trợ giúp của máy tính', lessonName: 'Bài 8: Làm quen với môi trường lập trình Python (IDLE/Thonny)', periods: 2, type: 'LESSON' },
    { week: 11, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 9: Biến, kiểu dữ liệu và toán tử trong Python', periods: 2, type: 'LESSON' },
    { week: 12, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 10: Thực hành nhập xuất dữ liệu và tính toán cơ bản', periods: 2, type: 'PRACTICE' },
    { week: 13, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 11: Cấu trúc rẽ nhánh (if - elif - else)', periods: 2, type: 'LESSON' },
    { week: 14, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 12: Thực hành rẽ nhánh và kiểm tra điều kiện', periods: 2, type: 'PRACTICE' },
    { week: 15, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 13: Cấu trúc lặp for (Vòng lặp với số lần biết trước)', periods: 2, type: 'LESSON' },
    { week: 16, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 14: Thực hành vòng lặp for và hàm range()', periods: 2, type: 'PRACTICE' },
    { week: 17, semester: 1, topic: 'Ôn tập Cuối kỳ 1', lessonName: 'Ôn tập tổng hợp kiến thức Học kỳ 1', periods: 2, type: 'REVIEW' },
    { week: 18, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ 1 (45p)', periods: 2, type: 'FINAL' },

    // HỌC KỲ 2 (Tuần 19 -> 35: 34 tiết)
    { week: 19, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 15: Cấu trúc lặp while (Vòng lặp với số lần chưa biết trước)', periods: 2, type: 'LESSON' },
    { week: 20, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 16: Thực hành vòng lặp while', periods: 2, type: 'PRACTICE' },
    { week: 21, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 17: Kiểu dữ liệu danh sách (List) trong Python', periods: 2, type: 'LESSON' },
    { week: 22, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 18: Các thao tác trên danh sách (append, pop, len, duyệt list)', periods: 2, type: 'LESSON' },
    { week: 23, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 19: Thực hành xử lý mảng danh sách', periods: 2, type: 'PRACTICE' },
    { week: 24, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 20: Kiểu dữ liệu xâu ký tự (String) và các phương thức xử lý xâu', periods: 2, type: 'LESSON' },
    { week: 25, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 21: Thực hành xử lý xâu ký tự', periods: 2, type: 'PRACTICE' },
    { week: 26, semester: 2, topic: 'Ôn tập Giữa kỳ 2', lessonName: 'Ôn tập Kiểm tra Đánh giá Giữa học kỳ 2', periods: 2, type: 'REVIEW' },
    { week: 27, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ 2 (45p)', periods: 2, type: 'MIDTERM' },
    { week: 28, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 22: Chương trình con và Khai báo hàm (def)', periods: 2, type: 'LESSON' },
    { week: 29, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 23: Tham số, giá trị trả về và phạm vi biến trong hàm', periods: 2, type: 'LESSON' },
    { week: 30, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 24: Thực hành viết và gọi hàm trong Python', periods: 2, type: 'PRACTICE' },
    { week: 31, semester: 2, topic: 'Chủ đề G: Hướng nghiệp với Tin học', lessonName: 'Bài 25: Các ngành nghề trong lĩnh vực CNTT và Kỹ thuật số', periods: 2, type: 'LESSON' },
    { week: 32, semester: 2, topic: 'Dự án học tập', lessonName: 'Bài 26: Dự án mini: Ứng dụng giải quyết bài toán thực tế bằng Python', periods: 2, type: 'PROJECT' },
    { week: 33, semester: 2, topic: 'Dự án học tập', lessonName: 'Thực hành hoàn thiện và báo cáo sản phẩm dự án', periods: 2, type: 'PROJECT' },
    { week: 34, semester: 2, topic: 'Ôn tập Cuối năm', lessonName: 'Ôn tập tổng kết môn Tin học Lớp 10', periods: 2, type: 'REVIEW' },
    { week: 35, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ 2 (45p)', periods: 2, type: 'FINAL' },
  ]),
};

// 2. PPCT Preset: Tin học 11 - Định hướng Tin học ứng dụng (ICT)
export const presetGrade11ICT: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'PPCT Tin học 11 - Ứng dụng (ICT)',
  grade: '11',
  track: 'ICT',
  academicYear: '2024 - 2025',
  assignedClasses: '11A1, 11A2',
  totalPeriods: 70,
  totalWeeks: 35,
  isDefault: false,
  lessons: buildLessons([
    // HỌC KỲ 1
    { week: 1, semester: 1, topic: 'Chủ đề A: Máy tính và Hệ điều hành', lessonName: 'Bài 1: Hệ điều hành và Phần mềm ứng dụng', periods: 2, type: 'LESSON' },
    { week: 2, semester: 1, topic: 'Chủ đề A: Máy tính và Hệ điều hành', lessonName: 'Bài 2: Thực hành cấu hình hệ điều hành và quản lý tài nguyên', periods: 2, type: 'PRACTICE' },
    { week: 3, semester: 1, topic: 'Chủ đề B: Mạng máy tính', lessonName: 'Bài 3: Giao thức mạng và Thiết bị kết nối mạng nâng cao', periods: 2, type: 'LESSON' },
    { week: 4, semester: 1, topic: 'Chủ đề B: Mạng máy tính', lessonName: 'Bài 4: Thực hành chia sẻ tài nguyên mạng an toàn', periods: 2, type: 'PRACTICE' },
    { week: 5, semester: 1, topic: 'Chủ đề E (ICT): Phần mềm đồ họa số', lessonName: 'Bài 5: Khái niệm xử lý ảnh số và đồ họa vector/raster', periods: 2, type: 'LESSON' },
    { week: 6, semester: 1, topic: 'Chủ đề E (ICT): Phần mềm đồ họa số', lessonName: 'Bài 6: Thực hành thiết kế ấn phẩm truyền thông bằng GIMP/Canva', periods: 2, type: 'PRACTICE' },
    { week: 7, semester: 1, topic: 'Chủ đề E (ICT): Phần mềm đồ họa số', lessonName: 'Bài 7: Xử lý màu sắc, cắt ghép và hiệu ứng đồ họa', periods: 2, type: 'PRACTICE' },
    { week: 8, semester: 1, topic: 'Ôn tập Giữa kỳ 1', lessonName: 'Ôn tập Kiểm tra Đánh giá Giữa kỳ 1', periods: 2, type: 'REVIEW' },
    { week: 9, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 1', periods: 2, type: 'MIDTERM' },
    { week: 10, semester: 1, topic: 'Chủ đề E (ICT): Xử lý video số', lessonName: 'Bài 8: Biên tập và xuất bản video số', periods: 2, type: 'LESSON' },
    { week: 11, semester: 1, topic: 'Chủ đề E (ICT): Xử lý video số', lessonName: 'Bài 9: Thực hành cắt ghép video, lồng tiếng và chèn phụ đề', periods: 2, type: 'PRACTICE' },
    { week: 12, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 10: Khái niệm CSDL và Hệ quản trị CSDL quan hệ', periods: 2, type: 'LESSON' },
    { week: 13, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 11: Mô hình dữ liệu quan hệ, Bảng và Khóa (Khóa chính/ngoại)', periods: 2, type: 'LESSON' },
    { week: 14, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 12: Thực hành thiết kế lược đồ CSDL quản lý bán hàng/trường học', periods: 2, type: 'PRACTICE' },
    { week: 15, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 13: Tạo lập bảng và ràng buộc toàn vẹn', periods: 2, type: 'PRACTICE' },
    { week: 16, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 14: Nhập dữ liệu và liên kết giữa các bảng', periods: 2, type: 'PRACTICE' },
    { week: 17, semester: 1, topic: 'Ôn tập Cuối kỳ 1', lessonName: 'Ôn tập tổng kết Học kỳ 1', periods: 2, type: 'REVIEW' },
    { week: 18, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 1', periods: 2, type: 'FINAL' },

    // HỌC KỲ 2
    { week: 19, semester: 2, topic: 'Chủ đề F (ICT): Truy vấn SQL', lessonName: 'Bài 15: Ngôn ngữ truy vấn SQL - Lệnh SELECT cơ bản', periods: 2, type: 'LESSON' },
    { week: 20, semester: 2, topic: 'Chủ đề F (ICT): Truy vấn SQL', lessonName: 'Bài 16: Mệnh đề WHERE, ORDER BY, GROUP BY trong SQL', periods: 2, type: 'LESSON' },
    { week: 21, semester: 2, topic: 'Chủ đề F (ICT): Truy vấn SQL', lessonName: 'Bài 17: Thực hành truy vấn dữ liệu từ một bảng', periods: 2, type: 'PRACTICE' },
    { week: 22, semester: 2, topic: 'Chủ đề F (ICT): Truy vấn SQL', lessonName: 'Bài 18: Truy vấn kết nối nhiều bảng (INNER JOIN, LEFT JOIN)', periods: 2, type: 'LESSON' },
    { week: 23, semester: 2, topic: 'Chủ đề F (ICT): Truy vấn SQL', lessonName: 'Bài 19: Thực hành truy vấn liên kết bảng', periods: 2, type: 'PRACTICE' },
    { week: 24, semester: 2, topic: 'Chủ đề F (ICT): Truy vấn SQL', lessonName: 'Bài 20: Các lệnh cập nhật: INSERT, UPDATE, DELETE', periods: 2, type: 'LESSON' },
    { week: 25, semester: 2, topic: 'Chủ đề F (ICT): Truy vấn SQL', lessonName: 'Bài 21: Thực hành cập nhật dữ liệu CSDL', periods: 2, type: 'PRACTICE' },
    { week: 26, semester: 2, topic: 'Ôn tập Giữa kỳ 2', lessonName: 'Ôn tập Kiểm tra Giữa kỳ 2', periods: 2, type: 'REVIEW' },
    { week: 27, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 2', periods: 2, type: 'MIDTERM' },
    { week: 28, semester: 2, topic: 'Chủ đề F (ICT): Quản trị CSDL', lessonName: 'Bài 22: Bảo mật và sao lưu dữ liệu CSDL', periods: 2, type: 'LESSON' },
    { week: 29, semester: 2, topic: 'Dự án CSDL', lessonName: 'Bài 23: Dự án xây dựng CSDL hoàn chỉnh cho bài toán thực tế', periods: 2, type: 'PROJECT' },
    { week: 30, semester: 2, topic: 'Dự án CSDL', lessonName: 'Thực hành tạo lập CSDL và các truy vấn thống kê báo cáo', periods: 2, type: 'PROJECT' },
    { week: 31, semester: 2, topic: 'Dự án CSDL', lessonName: 'Báo cáo và nghiệm thu sản phẩm dự án CSDL', periods: 2, type: 'PROJECT' },
    { week: 32, semester: 2, topic: 'Chủ đề G: Hướng nghiệp ICT', lessonName: 'Bài 24: Nghề quản trị CSDL và Quản trị hệ thống mạng', periods: 2, type: 'LESSON' },
    { week: 33, semester: 2, topic: 'Chủ đề G: Hướng nghiệp ICT', lessonName: 'Bài 25: Xu hướng phát triển công nghệ đám mây và dữ liệu lớn', periods: 2, type: 'LESSON' },
    { week: 34, semester: 2, topic: 'Ôn tập Cuối năm', lessonName: 'Ôn tập tổng kết Tin học 11 ICT', periods: 2, type: 'REVIEW' },
    { week: 35, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 2', periods: 2, type: 'FINAL' },
  ]),
};

// 3. PPCT Preset: Tin học 11 - Định hướng Khoa học máy tính (CS)
export const presetGrade11CS: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'PPCT Tin học 11 - Khoa học máy tính (CS)',
  grade: '11',
  track: 'CS',
  academicYear: '2024 - 2025',
  assignedClasses: '11Tin, 11A0',
  totalPeriods: 70,
  totalWeeks: 35,
  isDefault: false,
  lessons: buildLessons([
    // HỌC KỲ 1
    { week: 1, semester: 1, topic: 'Chủ đề A (CS): Kiến trúc máy tính', lessonName: 'Bài 1: Kiến trúc Von Neumann và Nguyên lý hoạt động của CPU', periods: 2, type: 'LESSON' },
    { week: 2, semester: 1, topic: 'Chủ đề A (CS): Biểu diễn dữ liệu', lessonName: 'Bài 2: Hệ đếm nhị phân, Thập lục phân và Biểu diễn số nguyên/thực', periods: 2, type: 'LESSON' },
    { week: 3, semester: 1, topic: 'Chủ đề F (CS): Thuật toán & Độ phức tạp', lessonName: 'Bài 3: Khái niệm thuật toán và Đánh giá độ phức tạp thời gian O(n)', periods: 2, type: 'LESSON' },
    { week: 4, semester: 1, topic: 'Chủ đề F (CS): Kỹ thuật lập trình', lessonName: 'Bài 4: Kỹ thuật xử lý chuỗi và Danh sách mảng nâng cao', periods: 2, type: 'LESSON' },
    { week: 5, semester: 1, topic: 'Chủ đề F (CS): Thuật toán tìm kiếm', lessonName: 'Bài 5: Thuật toán tìm kiếm tuần tự và Tìm kiếm nhị phân (Binary Search)', periods: 2, type: 'LESSON' },
    { week: 6, semester: 1, topic: 'Chủ đề F (CS): Thuật toán tìm kiếm', lessonName: 'Bài 6: Thực hành cài đặt tìm kiếm nhị phân', periods: 2, type: 'PRACTICE' },
    { week: 7, semester: 1, topic: 'Chủ đề F (CS): Thuật toán sắp xếp', lessonName: 'Bài 7: Thuật toán sắp xếp chọn (Selection Sort) & Sắp xếp chèn (Insertion Sort)', periods: 2, type: 'LESSON' },
    { week: 8, semester: 1, topic: 'Ôn tập Giữa kỳ 1', lessonName: 'Ôn tập Kiểm tra Giữa học kỳ 1', periods: 2, type: 'REVIEW' },
    { week: 9, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 1', periods: 2, type: 'MIDTERM' },
    { week: 10, semester: 1, topic: 'Chủ đề F (CS): Thuật toán sắp xếp', lessonName: 'Bài 8: Thuật toán sắp xếp nổi bọt (Bubble Sort)', periods: 2, type: 'LESSON' },
    { week: 11, semester: 1, topic: 'Chủ đề F (CS): Thuật toán sắp xếp', lessonName: 'Bài 9: Thực hành so sánh hiệu năng các thuật toán sắp xếp cơ bản', periods: 2, type: 'PRACTICE' },
    { week: 12, semester: 1, topic: 'Chủ đề F (CS): Đệ quy (Recursion)', lessonName: 'Bài 10: Khái niệm hàm đệ quy và Điều kiện dừng', periods: 2, type: 'LESSON' },
    { week: 13, semester: 1, topic: 'Chủ đề F (CS): Đệ quy (Recursion)', lessonName: 'Bài 11: Các bài toán đệ quy kinh điển (Giai thừa, Fibonacci, Tháp Hà Nội)', periods: 2, type: 'LESSON' },
    { week: 14, semester: 1, topic: 'Chủ đề F (CS): Đệ quy (Recursion)', lessonName: 'Bài 12: Thực hành lập trình đệ quy trong Python', periods: 2, type: 'PRACTICE' },
    { week: 15, semester: 1, topic: 'Chủ đề F (CS): Thuật toán chia để trị', lessonName: 'Bài 13: Sắp xếp trộn (Merge Sort) và Sắp xếp nhanh (Quick Sort)', periods: 2, type: 'LESSON' },
    { week: 16, semester: 1, topic: 'Chủ đề F (CS): Thuật toán chia để trị', lessonName: 'Bài 14: Thực hành cài đặt Merge Sort / Quick Sort', periods: 2, type: 'PRACTICE' },
    { week: 17, semester: 1, topic: 'Ôn tập Cuối kỳ 1', lessonName: 'Ôn tập tổng hợp Học kỳ 1', periods: 2, type: 'REVIEW' },
    { week: 18, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 1', periods: 2, type: 'FINAL' },

    // HỌC KỲ 2
    { week: 19, semester: 2, topic: 'Chủ đề F (CS): Cấu trúc dữ liệu', lessonName: 'Bài 15: Cấu trúc dữ liệu Ngăn xếp (Stack) và Hàng đợi (Queue)', periods: 2, type: 'LESSON' },
    { week: 20, semester: 2, topic: 'Chủ đề F (CS): Cấu trúc dữ liệu', lessonName: 'Bài 16: Thực hành cài đặt Stack & Queue trong Python', periods: 2, type: 'PRACTICE' },
    { week: 21, semester: 2, topic: 'Chủ đề F (CS): Cấu trúc dữ liệu', lessonName: 'Bài 17: Cấu trúc dữ liệu Từ điển (Dictionary) và Bảng băm (Hash Table)', periods: 2, type: 'LESSON' },
    { week: 22, semester: 2, topic: 'Chủ đề F (CS): Cấu trúc dữ liệu', lessonName: 'Bài 18: Thực hành ứng dụng Hash Table trong đếm tần suất và tra cứu', periods: 2, type: 'PRACTICE' },
    { week: 23, semester: 2, topic: 'Chủ đề F (CS): Kỹ thuật lập trình', lessonName: 'Bài 19: Xử lý Tệp (File I/O) và ngoại lệ (try - except)', periods: 2, type: 'LESSON' },
    { week: 24, semester: 2, topic: 'Chủ đề F (CS): Kỹ thuật lập trình', lessonName: 'Bài 20: Thực hành đọc ghi tệp dữ liệu bài thi lập trình', periods: 2, type: 'PRACTICE' },
    { week: 25, semester: 2, topic: 'Chủ đề F (CS): Thuật toán đồ thị', lessonName: 'Bài 21: Khái niệm Đồ thị (Graph), Đỉnh, Cạnh và Biểu diễn ma trận kề', periods: 2, type: 'LESSON' },
    { week: 26, semester: 2, topic: 'Ôn tập Giữa kỳ 2', lessonName: 'Ôn tập Kiểm tra Giữa kỳ 2', periods: 2, type: 'REVIEW' },
    { week: 27, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 2', periods: 2, type: 'MIDTERM' },
    { week: 28, semester: 2, topic: 'Chủ đề F (CS): Thuật toán đồ thị', lessonName: 'Bài 22: Thuật toán Duyệt đồ thị theo chiều sâu (DFS) & Chiều rộng (BFS)', periods: 2, type: 'LESSON' },
    { week: 29, semester: 2, topic: 'Chủ đề F (CS): Thuật toán đồ thị', lessonName: 'Bài 23: Thực hành cài đặt DFS & BFS', periods: 2, type: 'PRACTICE' },
    { week: 30, semester: 2, topic: 'Dự án Lập trình', lessonName: 'Bài 24: Dự án xây dựng phần mềm thuật toán ứng dụng', periods: 2, type: 'PROJECT' },
    { week: 31, semester: 2, topic: 'Dự án Lập trình', lessonName: 'Thực hành phát triển và kiểm thử sản phẩm', periods: 2, type: 'PROJECT' },
    { week: 32, semester: 2, topic: 'Chủ đề G: Hướng nghiệp CS', lessonName: 'Bài 25: Nghề kỹ sư phần mềm, Chuyên gia thuật toán và AI', periods: 2, type: 'LESSON' },
    { week: 33, semester: 2, topic: 'Chủ đề G: Hướng nghiệp CS', lessonName: 'Bài 26: Đạo đức trong phát triển phần mềm và Mã nguồn mở', periods: 2, type: 'LESSON' },
    { week: 34, semester: 2, topic: 'Ôn tập Cuối năm', lessonName: 'Ôn tập tổng kết môn Tin học 11 CS', periods: 2, type: 'REVIEW' },
    { week: 35, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 2', periods: 2, type: 'FINAL' },
  ]),
};

// 4. PPCT Preset: Tin học 12 (GDPT 2018 - 70 tiết / 35 tuần)
export const presetGrade12: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'PPCT Tin học 12 (Mạng, Web & Trí tuệ nhân tạo)',
  grade: '12',
  track: 'ICT',
  academicYear: '2024 - 2025',
  assignedClasses: '12A1, 12A2, 12A3',
  totalPeriods: 70,
  totalWeeks: 35,
  isDefault: false,
  lessons: buildLessons([
    // HỌC KỲ 1
    { week: 1, semester: 1, topic: 'Chủ đề A: Trí tuệ nhân tạo (AI)', lessonName: 'Bài 1: Giới thiệu về Trí tuệ nhân tạo và Lịch sử phát triển', periods: 2, type: 'LESSON' },
    { week: 2, semester: 1, topic: 'Chủ đề A: Trí tuệ nhân tạo (AI)', lessonName: 'Bài 2: Các ứng dụng của AI (Thị giác máy tính, Xử lý ngôn ngữ tự nhiên)', periods: 2, type: 'LESSON' },
    { week: 3, semester: 1, topic: 'Chủ đề A: Trí tuệ nhân tạo (AI)', lessonName: 'Bài 3: Đạo đức và Pháp luật trong việc sử dụng AI', periods: 2, type: 'LESSON' },
    { week: 4, semester: 1, topic: 'Chủ đề B: Mạng máy tính & Bảo mật', lessonName: 'Bài 4: Giao thức mạng TCP/IP và Mô hình OSI', periods: 2, type: 'LESSON' },
    { week: 5, semester: 1, topic: 'Chủ đề B: Mạng máy tính & Bảo mật', lessonName: 'Bài 5: Địa chỉ IP, Subnet Mask và Phân chia mạng con', periods: 2, type: 'LESSON' },
    { week: 6, semester: 1, topic: 'Chủ đề B: Mạng máy tính & Bảo mật', lessonName: 'Bài 6: Thực hành bấm cáp mạng và Cấu hình Router/Wi-Fi', periods: 2, type: 'PRACTICE' },
    { week: 7, semester: 1, topic: 'Chủ đề B: Mạng máy tính & Bảo mật', lessonName: 'Bài 7: An toàn dữ liệu, Tường lửa (Firewall) và Mã hóa thông tin', periods: 2, type: 'LESSON' },
    { week: 8, semester: 1, topic: 'Ôn tập Giữa kỳ 1', lessonName: 'Ôn tập Kiểm tra Giữa kỳ 1', periods: 2, type: 'REVIEW' },
    { week: 9, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 1', periods: 2, type: 'MIDTERM' },
    { week: 10, semester: 1, topic: 'Chủ đề F: Thiết kế Web', lessonName: 'Bài 8: Khái niệm Trang web, Website và Cấu trúc cơ bản HTML5', periods: 2, type: 'LESSON' },
    { week: 11, semester: 1, topic: 'Chủ đề F: Thiết kế Web', lessonName: 'Bài 9: Các thẻ định dạng văn bản, Danh sách và Hình ảnh trong HTML', periods: 2, type: 'LESSON' },
    { week: 12, semester: 1, topic: 'Chủ đề F: Thiết kế Web', lessonName: 'Bài 10: Thực hành tạo trang web cá nhân bằng HTML', periods: 2, type: 'PRACTICE' },
    { week: 13, semester: 1, topic: 'Chủ đề F: Thiết kế Web', lessonName: 'Bài 11: Tạo Bảng (Table) và Biểu mẫu thu thập dữ liệu (Form)', periods: 2, type: 'LESSON' },
    { week: 14, semester: 1, topic: 'Chủ đề F: Thiết kế Web', lessonName: 'Bài 12: Thực hành thiết kế Form đăng ký/đăng nhập', periods: 2, type: 'PRACTICE' },
    { week: 15, semester: 1, topic: 'Chủ đề F: Thiết kế Web (CSS)', lessonName: 'Bài 13: Giới thiệu CSS3, Bộ chọn (Selector) và Màu sắc, Font chữ', periods: 2, type: 'LESSON' },
    { week: 16, semester: 1, topic: 'Chủ đề F: Thiết kế Web (CSS)', lessonName: 'Bài 14: Mô hình hộp (Box Model): Margin, Padding, Border', periods: 2, type: 'LESSON' },
    { week: 17, semester: 1, topic: 'Ôn tập Cuối kỳ 1', lessonName: 'Ôn tập tổng kết Học kỳ 1', periods: 2, type: 'REVIEW' },
    { week: 18, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 1', periods: 2, type: 'FINAL' },

    // HỌC KỲ 2
    { week: 19, semester: 2, topic: 'Chủ đề F: Bố cục Web hiện đại', lessonName: 'Bài 15: Bố cục giao diện web với CSS Flexbox', periods: 2, type: 'LESSON' },
    { week: 20, semester: 2, topic: 'Chủ đề F: Bố cục Web hiện đại', lessonName: 'Bài 16: Bố cục lưới với CSS Grid Layout', periods: 2, type: 'LESSON' },
    { week: 21, semester: 2, topic: 'Chủ đề F: Bố cục Web hiện đại', lessonName: 'Bài 17: Thiết kế Web đáp ứng (Responsive Web Design với Media Query)', periods: 2, type: 'LESSON' },
    { week: 22, semester: 2, topic: 'Chủ đề F: Bố cục Web hiện đại', lessonName: 'Bài 18: Thực hành tạo trang Landing Page hoàn chỉnh chuẩn Mobile/Desktop', periods: 2, type: 'PRACTICE' },
    { week: 23, semester: 2, topic: 'Chủ đề F: Tương tác Web', lessonName: 'Bài 19: Nhập môn JavaScript cơ bản - Tương tác DOM', periods: 2, type: 'LESSON' },
    { week: 24, semester: 2, topic: 'Chủ đề F: Tương tác Web', lessonName: 'Bài 20: Xử lý sự kiện (Click, Hover, Submit) bằng JavaScript', periods: 2, type: 'LESSON' },
    { week: 25, semester: 2, topic: 'Chủ đề F: Tương tác Web', lessonName: 'Bài 21: Thực hành kiểm tra tính hợp lệ dữ liệu Form bằng JS', periods: 2, type: 'PRACTICE' },
    { week: 26, semester: 2, topic: 'Ôn tập Giữa kỳ 2', lessonName: 'Ôn tập Kiểm tra Giữa học kỳ 2', periods: 2, type: 'REVIEW' },
    { week: 27, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 2', periods: 2, type: 'MIDTERM' },
    { week: 28, semester: 2, topic: 'Dự án Website', lessonName: 'Bài 22: Dự án xây dựng Website giới thiệu Trường học / CLB Tin học', periods: 2, type: 'PROJECT' },
    { week: 29, semester: 2, topic: 'Dự án Website', lessonName: 'Thực hành thiết kế và lập trình hoàn thiện website', periods: 2, type: 'PROJECT' },
    { week: 30, semester: 2, topic: 'Dự án Website', lessonName: 'Xuất bản và Đưa website lên hosting miễn phí (GitHub Pages / Vercel)', periods: 2, type: 'PROJECT' },
    { week: 31, semester: 2, topic: 'Dự án Website', lessonName: 'Báo cáo, thuyết trình và đánh giá sản phẩm Website', periods: 2, type: 'PROJECT' },
    { week: 32, semester: 2, topic: 'Chủ đề G: Hướng nghiệp Kỹ thuật số', lessonName: 'Bài 23: Lập trình viên Front-End, Back-End và Full-Stack', periods: 2, type: 'LESSON' },
    { week: 33, semester: 2, topic: 'Chủ đề G: Hướng nghiệp Kỹ thuật số', lessonName: 'Bài 24: Định hướng nghề nghiệp tương lai trong kỷ nguyên AI', periods: 2, type: 'LESSON' },
    { week: 34, semester: 2, topic: 'Ôn tập Tốt nghiệp & Cuối năm', lessonName: 'Ôn tập tổng kết chương trình Tin học THPT', periods: 2, type: 'REVIEW' },
    { week: 35, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 2', periods: 2, type: 'FINAL' },
  ]),
};

export const allPPCTPresets = [
  presetGrade10,
  presetGrade11ICT,
  presetGrade11CS,
  presetGrade12,
];
