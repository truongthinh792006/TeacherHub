import { LessonObjectives, PPCTLesson, PPCTPlan } from '../../types';

// Helper to build 35-week lessons
function buildLessons(
  rawList: Array<{
    week: number;
    semester: 1 | 2;
    topic: string;
    lessonName: string;
    periods: number;
    type: 'LESSON' | 'PRACTICE' | 'MIDTERM' | 'FINAL' | 'REVIEW' | 'PROJECT';
    notes?: string;
    competencies?: string[];
    objectives?: LessonObjectives;
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
      notes: item.notes || (item.type === 'PRACTICE' ? 'Phòng máy tính' : undefined),
      competencies: item.competencies,
      objectives: item.objectives,
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
    { week: 1, semester: 1, topic: 'Chủ đề A: Máy tính và xã hội tri thức', lessonName: 'Bài 1: Thông tin và xử lý thông tin', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'], objectives: { know: ['Nêu được khái niệm thông tin và dữ liệu.', 'Trình bày được các bước cơ bản trong quá trình xử lý thông tin.'], understand: ['Phân biệt được thông tin và dữ liệu qua ví dụ thực tế.', 'Giải thích được tầm quan trọng của việc số hóa dữ liệu.'], apply: ['Chuyển đổi được một số dạng thông tin thông dụng thành dạng số.'] } },
    { week: 2, semester: 1, topic: 'Chủ đề A: Máy tính và xã hội tri thức', lessonName: 'Bài 2: Vai trò của thiết bị thông minh và tin học', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLb'], objectives: { know: ['Nêu được các đặc trưng cơ bản của thiết bị thông minh.'], understand: ['Giải thích được vai trò của tin học trong cuộc cách mạng công nghiệp 4.0.'], apply: ['Nhận diện được các thiết bị số thông minh đang sử dụng trong gia đình.'] } },
    { week: 3, semester: 1, topic: 'Chủ đề A: Máy tính và xã hội tri thức', lessonName: 'Bài 3: Thực hành sử dụng thiết bị số cá nhân', periods: 2, type: 'PRACTICE', competencies: ['NLa', 'NLd'], objectives: { know: ['Biết các cổng kết nối và thông số cấu hình cơ bản.'], understand: ['Hiểu cách quản lý tập tin và tối ưu bộ nhớ thiết bị.'], apply: ['Kết nối thành thạo thiết bị cá nhân với máy tính để truyền nhận dữ liệu.'] } },
    { week: 4, semester: 1, topic: 'Chủ đề B: Mạng máy tính và Internet', lessonName: 'Bài 4: Mạng máy tính và các dịch vụ Internet', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'], objectives: { know: ['Nêu được khái niệm mạng máy tính, phân loại LAN và WAN.'], understand: ['Giải thích được cách thức hoạt động của dịch vụ WWW và Email.'], apply: ['Sử dụng thành thạo các công cụ tìm kiếm nâng cao trên Internet.'] } },
    { week: 5, semester: 1, topic: 'Chủ đề B: Mạng máy tính và Internet', lessonName: 'Bài 5: Thực hành kết nối mạng và sử dụng dịch vụ đám mây', periods: 2, type: 'PRACTICE', competencies: ['NLc', 'NLd', 'NLe'], objectives: { know: ['Biết các dịch vụ lưu trữ đám mây phổ biến (Google Drive, OneDrive).'], understand: ['Hiểu cơ chế chia sẻ quyền xem/chỉnh sửa tài liệu trực tuyến.'], apply: ['Tạo thư mục chia sẻ bài tập nhóm trên Google Drive an toàn.'] } },
    { week: 6, semester: 1, topic: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số', lessonName: 'Bài 6: An toàn trên không gian mạng và Bản quyền số', periods: 2, type: 'LESSON', competencies: ['NLb', 'NLe'], objectives: { know: ['Nêu được một số hành vi vi phạm pháp luật và bản quyền số.'], understand: ['Giải thích được các rủi ro lừa đảo, lộ lọt thông tin cá nhân trên mạng.'], apply: ['Tuân thủ quy tắc ứng xử văn minh và bảo vệ dữ liệu cá nhân khi online.'] } },
    { week: 7, semester: 1, topic: 'Chủ đề D: Đạo đức, pháp luật và văn hóa trong môi trường số', lessonName: 'Bài 7: Thực hành phòng chống rủi ro trên mạng', periods: 2, type: 'PRACTICE', competencies: ['NLb', 'NLc'], objectives: { know: ['Nhận biết được dấu hiệu của trang web và thư điện tử lừa đảo.'], understand: ['Hiểu nguyên lý tạo và quản lý mật khẩu mạnh.'], apply: ['Thiết lập xác thực 2 yếu tố (2FA) cho tài khoản mạng xã hội/học tập.'] } },
    { week: 8, semester: 1, topic: 'Ôn tập & Đánh giá', lessonName: 'Ôn tập Kiểm tra Đánh giá Giữa học kỳ 1', periods: 2, type: 'REVIEW', competencies: ['NLa', 'NLb', 'NLc'], objectives: { know: ['Hệ thống hóa các khái niệm thông tin, mạng và an toàn số.'], understand: ['Phân tích câu hỏi trắc nghiệm khách quan 3 dạng thức.'], apply: ['Vận dụng kiến thức giải quyết bài kiểm tra mẫu.'] } },
    { week: 9, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ 1 (45p)', periods: 2, type: 'MIDTERM', competencies: ['NLa', 'NLb', 'NLc'] },
    { week: 10, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 8: Làm quen với môi trường lập trình Python (IDLE/Thonny)', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'], objectives: { know: ['Biết giao diện IDE Python và 2 chế độ tương tác (Interactive & Script).'], understand: ['Hiểu quy trình dịch và thực thi chương trình Python.'], apply: ['Viết và chạy thành công chương trình hiển thị câu chào đầu tiên.'] } },
    { week: 11, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 9: Biến, kiểu dữ liệu và toán tử trong Python', periods: 2, type: 'LESSON', competencies: ['NLc', 'NLd'], objectives: { know: ['Nêu được quy tắc đặt tên biến và các kiểu int, float, str, bool.'], understand: ['Hiểu các toán tử số học, so sánh và logic trong Python.'], apply: ['Khai báo biến và biểu diễn đúng các biểu thức toán học sang Python.'] } },
    { week: 12, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 10: Thực hành nhập xuất dữ liệu và tính toán cơ bản', periods: 2, type: 'PRACTICE', competencies: ['NLc'], objectives: { know: ['Nhớ cú pháp hàm input() và hàm print().'], understand: ['Hiểu sự cần thiết phải ép kiểu dữ liệu int() / float() khi nhập.'], apply: ['Viết chương trình tính diện tích, chu vi hình chữ nhật và tam giác.'] } },
    { week: 13, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 11: Cấu trúc rẽ nhánh (if - elif - else)', periods: 2, type: 'LESSON', competencies: ['NLc'], objectives: { know: ['Nêu cú pháp câu lệnh điều kiện if đơn và if-else đầy đủ.'], understand: ['Hiểu ý nghĩa của việc thụt đầu dòng (indentation) trong Python.'], apply: ['Viết điều kiện kiểm tra số chẵn/lẻ hoặc tìm số lớn nhất trong 2 số.'] } },
    { week: 14, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 12: Thực hành rẽ nhánh và kiểm tra điều kiện', periods: 2, type: 'PRACTICE', competencies: ['NLc'], objectives: { know: ['Cú pháp cấu trúc if-elif-else nhiều nhánh.'], understand: ['Xây dựng bảng giá trị chân lý cho các điều kiện kết hợp and, or.'], apply: ['Giải bài toán giải phương trình bậc nhất ax + b = 0 và xếp loại học lực.'] } },
    { week: 15, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 13: Cấu trúc lặp for (Vòng lặp với số lần biết trước)', periods: 2, type: 'LESSON', competencies: ['NLc'], objectives: { know: ['Nhớ cú pháp vòng lặp for và các dạng của hàm range().'], understand: ['Mô tả được thứ tự duyệt biến lặp trong phạm vi range(start, stop, step).'], apply: ['Viết chương trình in dãy số từ 1 đến n và bảng cửu chương.'] } },
    { week: 16, semester: 1, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 14: Thực hành vòng lặp for và hàm range()', periods: 2, type: 'PRACTICE', competencies: ['NLc'], objectives: { know: ['Thuật toán tính tổng dồn và đếm số lượng phần tử thỏa điều kiện.'], understand: ['Phân tích vòng lặp for lồng nhau ở mức độ đơn giản.'], apply: ['Viết chương trình tính tổng S = 1 + 2 + ... + n và kiểm tra số nguyên tố.'] } },
    { week: 17, semester: 1, topic: 'Ôn tập Cuối kỳ 1', lessonName: 'Ôn tập tổng hợp kiến thức Học kỳ 1', periods: 2, type: 'REVIEW', competencies: ['NLa', 'NLb', 'NLc'] },
    { week: 18, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ 1 (45p)', periods: 2, type: 'FINAL', competencies: ['NLa', 'NLb', 'NLc'] },

    // HỌC KỲ 2 (Tuần 19 -> 35: 34 tiết)
    { week: 19, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 15: Cấu trúc lặp while (Vòng lặp với số lần chưa biết trước)', periods: 2, type: 'LESSON', competencies: ['NLc'], objectives: { know: ['Nêu được cú pháp câu lệnh lặp while và điều kiện dừng.'], understand: ['Phân biệt vòng lặp for và while, tránh lỗi lặp vô hạn.'], apply: ['Viết chương trình tìm ước chung lớn nhất (UCLN) bằng thuật toán Euclid.'] } },
    { week: 20, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 16: Thực hành vòng lặp while', periods: 2, type: 'PRACTICE', competencies: ['NLc'], objectives: { know: ['Sử dụng lệnh break và continue trong vòng lặp.'], understand: ['Kiểm soát dữ liệu nhập vào từ bàn phím bằng while True.'], apply: ['Viết trò chơi đoán số bí mật giữa máy tính và người chơi.'] } },
    { week: 21, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 17: Kiểu dữ liệu danh sách (List) trong Python', periods: 2, type: 'LESSON', competencies: ['NLc'], objectives: { know: ['Nêu định nghĩa danh sách và chỉ số phần tử bắt đầu từ 0.'], understand: ['Hiểu cách truy cập phần tử qua chỉ số âm và chỉ số dương.'], apply: ['Khai báo và duyệt in từng phần tử của danh sách số.'] } },
    { week: 22, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 18: Các thao tác trên danh sách (append, pop, len, duyệt list)', periods: 2, type: 'LESSON', competencies: ['NLc'], objectives: { know: ['Biết các phương thức append(), insert(), remove(), pop(), sort().'], understand: ['Hiểu cách tìm giá trị lớn nhất max() và nhỏ nhất min() trong list.'], apply: ['Viết chương trình quản lý điểm số của học sinh trong một tổ.'] } },
    { week: 23, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 19: Thực hành xử lý mảng danh sách', periods: 2, type: 'PRACTICE', competencies: ['NLc'], objectives: { know: ['Thuật toán tìm kiếm phần tử và đếm số lần xuất hiện.'], understand: ['Kỹ thuật tách các số chẵn, số lẻ sang hai danh sách riêng biệt.'], apply: ['Giải bài toán thống kê số lượng điểm giỏi, khá, trung bình của lớp.'] } },
    { week: 24, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 20: Kiểu dữ liệu xâu ký tự (String) và các phương thức xử lý xâu', periods: 2, type: 'LESSON', competencies: ['NLc'], objectives: { know: ['Nêu tính chất bất biến của xâu ký tự trong Python.'], understand: ['Hiểu các phương thức split(), join(), upper(), lower(), replace().'], apply: ['Tách họ và tên học sinh từ một xâu ký tự đầy đủ.'] } },
    { week: 25, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 21: Thực hành xử lý xâu ký tự', periods: 2, type: 'PRACTICE', competencies: ['NLc'], objectives: { know: ['Nhận biết xâu đối xứng (Palindrome).'], understand: ['Kỹ thuật chuẩn hóa xâu (xóa khoảng trắng thừa).'], apply: ['Viết chương trình đếm số từ và kiểm tra xâu đối xứng.'] } },
    { week: 26, semester: 2, topic: 'Ôn tập Giữa kỳ 2', lessonName: 'Ôn tập Kiểm tra Đánh giá Giữa học kỳ 2', periods: 2, type: 'REVIEW', competencies: ['NLc'] },
    { week: 27, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ 2 (45p)', periods: 2, type: 'MIDTERM', competencies: ['NLc'] },
    { week: 28, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 22: Chương trình con và Khai báo hàm (def)', periods: 2, type: 'LESSON', competencies: ['NLc', 'NLd'], objectives: { know: ['Nêu khái niệm hàm và từ khóa def trong Python.'], understand: ['Hiểu lợi ích của việc module hóa chương trình thành các hàm nhỏ.'], apply: ['Viết hàm tính giai thừa của một số nguyên dương n.'] } },
    { week: 29, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 23: Tham số, giá trị trả về và phạm vi biến trong hàm', periods: 2, type: 'LESSON', competencies: ['NLc'], objectives: { know: ['Phân biệt tham số hình thức và đối số thực sự.'], understand: ['Hiểu câu lệnh return và phân biệt biến cục bộ với biến toàn cục.'], apply: ['Viết hàm kiểm tra số nguyên tố và gọi hàm trong chương trình chính.'] } },
    { week: 30, semester: 2, topic: 'Chủ đề F: Lập trình Python', lessonName: 'Bài 24: Thực hành viết và gọi hàm trong Python', periods: 2, type: 'PRACTICE', competencies: ['NLc'], objectives: { know: ['Khai báo thư viện toán học math và sử dụng hàm có sẵn.'], understand: ['Xây dựng hàm tái sử dụng trong các bài toán lặp lại.'], apply: ['Giải bài toán hình học tổng hợp bằng cách tách thành các hàm riêng biệt.'] } },
    { week: 31, semester: 2, topic: 'Chủ đề G: Hướng nghiệp với Tin học', lessonName: 'Bài 25: Các ngành nghề trong lĩnh vực CNTT và Kỹ thuật số', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLe'], objectives: { know: ['Liệt kê các ngành nghề chính: Kỹ sư phần mềm, An ninh mạng, AI, Dữ liệu.'], understand: ['Hiểu yêu cầu về năng lực, phẩm chất của người làm việc trong ngành CNTT.'], apply: ['Lập bảng tự đánh giá sở thích nghề nghiệp công nghệ của bản thân.'] } },
    { week: 32, semester: 2, topic: 'Dự án học tập', lessonName: 'Bài 26: Dự án mini: Ứng dụng giải quyết bài toán thực tế bằng Python', periods: 2, type: 'PROJECT', competencies: ['NLc', 'NLd', 'NLe'], objectives: { know: ['Nắm các bước thực hiện dự án: Lập đề cương, Phân công, Code, Báo cáo.'], understand: ['Vận dụng kết hợp biến, rẽ nhánh, vòng lặp, list và hàm.'], apply: ['Xây dựng chương trình Quản lý chi tiêu cá nhân hoặc Trắc nghiệm ôn tập.'] } },
    { week: 33, semester: 2, topic: 'Dự án học tập', lessonName: 'Thực hành hoàn thiện và báo cáo sản phẩm dự án', periods: 2, type: 'PROJECT', competencies: ['NLd', 'NLe'] },
    { week: 34, semester: 2, topic: 'Ôn tập Cuối năm', lessonName: 'Ôn tập tổng kết môn Tin học Lớp 10', periods: 2, type: 'REVIEW', competencies: ['NLa', 'NLb', 'NLc', 'NLe'] },
    { week: 35, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ 2 (45p)', periods: 2, type: 'FINAL', competencies: ['NLa', 'NLb', 'NLc'] },
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
    // HỌC KỲ 1 (Tuần 1 -> 18: 36 tiết)
    { week: 1, semester: 1, topic: 'Chủ đề A: Máy tính và Hệ điều hành', lessonName: 'Bài 1: Hệ điều hành và Phần mềm ứng dụng', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'] },
    { week: 2, semester: 1, topic: 'Chủ đề A: Máy tính và Hệ điều hành', lessonName: 'Bài 2: Thực hành cấu hình hệ điều hành và quản lý tài nguyên', periods: 2, type: 'PRACTICE', competencies: ['NLa', 'NLd'] },
    { week: 3, semester: 1, topic: 'Chủ đề B: Mạng máy tính', lessonName: 'Bài 3: Giao thức mạng và Thiết bị kết nối mạng nâng cao', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'] },
    { week: 4, semester: 1, topic: 'Chủ đề B: Mạng máy tính', lessonName: 'Bài 4: Thực hành chia sẻ tài nguyên mạng an toàn', periods: 2, type: 'PRACTICE', competencies: ['NLb', 'NLd'] },
    { week: 5, semester: 1, topic: 'Chủ đề D: Đạo đức số', lessonName: 'Bài 5: Pháp luật và Văn hóa trong môi trường mạng', periods: 2, type: 'LESSON', competencies: ['NLb', 'NLe'] },
    { week: 6, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 6: Khái niệm Cơ sở dữ liệu và Hệ quản trị CSDL', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'] },
    { week: 7, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 7: Mô hình quan hệ và Khóa trong CSDL (Khóa chính, Khóa ngoại)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 8, semester: 1, topic: 'Ôn tập Giữa kỳ 1', lessonName: 'Ôn tập Kiểm tra Giữa kỳ 1', periods: 2, type: 'REVIEW', competencies: ['NLa', 'NLb', 'NLc'] },
    { week: 9, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 1', periods: 2, type: 'MIDTERM', competencies: ['NLa', 'NLb', 'NLc'] },
    { week: 10, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu Access/MySQL', lessonName: 'Bài 8: Làm quen với hệ quản trị CSDL (Tạo bảng và Thiết lập trường)', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'] },
    { week: 11, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 9: Thực hành tạo lập Bảng và Thiết lập Khóa chính', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 12, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 10: Thiết lập mối quan hệ giữa các bảng (Relationships)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 13, semester: 1, topic: 'Chủ đề F (ICT): Cơ sở dữ liệu', lessonName: 'Bài 11: Thực hành liên kết bảng và kiểm tra toàn vẹn dữ liệu', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 14, semester: 1, topic: 'Chủ đề F (ICT): Truy vấn dữ liệu', lessonName: 'Bài 12: Giới thiệu ngôn ngữ truy vấn SQL (SELECT, FROM, WHERE)', periods: 2, type: 'LESSON', competencies: ['NLc', 'NLd'] },
    { week: 15, semester: 1, topic: 'Chủ đề F (ICT): Truy vấn dữ liệu', lessonName: 'Bài 13: Thực hành viết câu lệnh truy vấn dữ liệu có điều kiện', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 16, semester: 1, topic: 'Chủ đề F (ICT): Biểu mẫu & Báo cáo', lessonName: 'Bài 14: Thiết kế Biểu mẫu nhập liệu (Form) và Báo cáo (Report)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 17, semester: 1, topic: 'Ôn tập Cuối kỳ 1', lessonName: 'Ôn tập tổng kết Học kỳ 1', periods: 2, type: 'REVIEW', competencies: ['NLa', 'NLc'] },
    { week: 18, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 1', periods: 2, type: 'FINAL', competencies: ['NLa', 'NLc'] },

    // HỌC KỲ 2 (Tuần 19 -> 35: 34 tiết)
    { week: 19, semester: 2, topic: 'Chủ đề F (ICT): Biên tập Đồ họa', lessonName: 'Bài 15: Giới thiệu phần mềm chỉnh sửa ảnh số (GIMP/Photoshop)', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLd'] },
    { week: 20, semester: 2, topic: 'Chủ đề F (ICT): Biên tập Đồ họa', lessonName: 'Bài 16: Làm việc với Lớp ảnh (Layers) và Vùng chọn (Selection)', periods: 2, type: 'LESSON', competencies: ['NLc', 'NLd'] },
    { week: 21, semester: 2, topic: 'Chủ đề F (ICT): Biên tập Đồ họa', lessonName: 'Bài 17: Thực hành cắt ghép, tách nền và chỉnh màu sắc ảnh', periods: 2, type: 'PRACTICE', competencies: ['NLc', 'NLd'] },
    { week: 22, semester: 2, topic: 'Chủ đề F (ICT): Biên tập Đồ họa', lessonName: 'Bài 18: Thêm văn bản và Hiệu ứng nghệ thuật lên poster/banner', periods: 2, type: 'LESSON', competencies: ['NLc', 'NLd'] },
    { week: 23, semester: 2, topic: 'Chủ đề F (ICT): Biên tập Đồ họa', lessonName: 'Bài 19: Thực hành thiết kế ấn phẩm truyền thông học đường', periods: 2, type: 'PRACTICE', competencies: ['NLc', 'NLe'] },
    { week: 24, semester: 2, topic: 'Chủ đề F (ICT): Làm phim & Video', lessonName: 'Bài 20: Giới thiệu phần mềm dựng video và Cấu trúc kịch bản', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLd'] },
    { week: 25, semester: 2, topic: 'Chủ đề F (ICT): Làm phim & Video', lessonName: 'Bài 21: Cắt ghép video, chèn âm thanh nền và lồng tiếng', periods: 2, type: 'LESSON', competencies: ['NLc', 'NLd'] },
    { week: 26, semester: 2, topic: 'Ôn tập Giữa kỳ 2', lessonName: 'Ôn tập Kiểm tra Giữa kỳ 2', periods: 2, type: 'REVIEW', competencies: ['NLc', 'NLd'] },
    { week: 27, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 2', periods: 2, type: 'MIDTERM', competencies: ['NLc', 'NLd'] },
    { week: 28, semester: 2, topic: 'Chủ đề F (ICT): Làm phim & Video', lessonName: 'Bài 22: Hiệu ứng chuyển cảnh (Transitions) và Xuất video HD', periods: 2, type: 'PRACTICE', competencies: ['NLc', 'NLd'] },
    { week: 29, semester: 2, topic: 'Dự án Đa phương tiện', lessonName: 'Bài 23: Dự án sản xuất Video Clip giới thiệu Trường học / Lớp học', periods: 2, type: 'PROJECT', competencies: ['NLc', 'NLd', 'NLe'] },
    { week: 30, semester: 2, topic: 'Dự án Đa phương tiện', lessonName: 'Thực hành quay, dựng và hậu kỳ sản phẩm truyền thông', periods: 2, type: 'PROJECT', competencies: ['NLc', 'NLe'] },
    { week: 31, semester: 2, topic: 'Dự án Đa phương tiện', lessonName: 'Công chiếu, báo cáo và đánh giá sản phẩm video nhóm', periods: 2, type: 'PROJECT', competencies: ['NLe'] },
    { week: 32, semester: 2, topic: 'Chủ đề G: Hướng nghiệp ICT', lessonName: 'Bài 24: Nghề quản trị CSDL và Chuyên viên thiết kế đồ họa', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLe'] },
    { week: 33, semester: 2, topic: 'Chủ đề G: Hướng nghiệp ICT', lessonName: 'Bài 25: Nhu cầu nhân lực và Thị trường lao động nội dung số', periods: 2, type: 'LESSON', competencies: ['NLb', 'NLe'] },
    { week: 34, semester: 2, topic: 'Ôn tập Cuối năm', lessonName: 'Ôn tập tổng kết môn Tin học 11 ICT', periods: 2, type: 'REVIEW', competencies: ['NLa', 'NLc', 'NLd'] },
    { week: 35, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 2', periods: 2, type: 'FINAL', competencies: ['NLa', 'NLc', 'NLd'] },
  ]),
};

// 3. PPCT Preset: Tin học 11 - Định hướng Khoa học máy tính (CS)
export const presetGrade11CS: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'PPCT Tin học 11 - Khoa học máy tính (CS)',
  grade: '11',
  track: 'CS',
  academicYear: '2024 - 2025',
  assignedClasses: '11Tin, 11Toan',
  totalPeriods: 70,
  totalWeeks: 35,
  isDefault: false,
  lessons: buildLessons([
    // HỌC KỲ 1
    { week: 1, semester: 1, topic: 'Chủ đề A: Máy tính & Kiến trúc', lessonName: 'Bài 1: Kiến trúc máy tính von Neumann và Vi xử lý (CPU)', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'] },
    { week: 2, semester: 1, topic: 'Chủ đề A: Máy tính & Kiến trúc', lessonName: 'Bài 2: Bộ nhớ trong, Bộ nhớ ngoài và Biểu diễn dữ liệu nhị phân', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'] },
    { week: 3, semester: 1, topic: 'Chủ đề B: Mạng máy tính', lessonName: 'Bài 3: Giao thức mạng và Địa chỉ IP trong mô hình Internet', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLc'] },
    { week: 4, semester: 1, topic: 'Chủ đề B: Mạng máy tính', lessonName: 'Bài 4: Thực hành phân tích gói tin mạng và Bảo mật mạng', periods: 2, type: 'PRACTICE', competencies: ['NLc', 'NLd'] },
    { week: 5, semester: 1, topic: 'Chủ đề D: Đạo đức số', lessonName: 'Bài 5: An toàn thông tin và Luật An ninh mạng', periods: 2, type: 'LESSON', competencies: ['NLb', 'NLe'] },
    { week: 6, semester: 1, topic: 'Chủ đề F (CS): Thuật toán nâng cao', lessonName: 'Bài 6: Đánh giá độ phức tạp thuật toán (Ký hiệu Big-O)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 7, semester: 1, topic: 'Chủ đề F (CS): Thuật toán tìm kiếm', lessonName: 'Bài 7: Thuật toán Tìm kiếm tuần tự và Tìm kiếm nhị phân', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 8, semester: 1, topic: 'Ôn tập Giữa kỳ 1', lessonName: 'Ôn tập Kiểm tra Giữa kỳ 1', periods: 2, type: 'REVIEW', competencies: ['NLc'] },
    { week: 9, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 1', periods: 2, type: 'MIDTERM', competencies: ['NLc'] },
    { week: 10, semester: 1, topic: 'Chủ đề F (CS): Thuật toán tìm kiếm', lessonName: 'Bài 8: Thực hành cài đặt thuật toán Tìm kiếm nhị phân bằng Python', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 11, semester: 1, topic: 'Chủ đề F (CS): Thuật toán sắp xếp', lessonName: 'Bài 9: Thuật toán Sắp xếp nổi bọt (Bubble Sort) và Chèn (Insertion Sort)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 12, semester: 1, topic: 'Chủ đề F (CS): Thuật toán sắp xếp', lessonName: 'Bài 10: Thuật toán Sắp xếp chọn (Selection Sort)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 13, semester: 1, topic: 'Chủ đề F (CS): Thuật toán sắp xếp', lessonName: 'Bài 11: Thực hành so sánh hiệu năng các thuật toán sắp xếp cơ bản', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 14, semester: 1, topic: 'Chủ đề F (CS): Đệ quy', lessonName: 'Bài 12: Khái niệm Đệ quy (Recursion) và Bài toán tháp Hà Nội', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 15, semester: 1, topic: 'Chủ đề F (CS): Đệ quy', lessonName: 'Bài 13: Thực hành cài đặt hàm đệ quy (Giai thừa, Fibonacci)', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 16, semester: 1, topic: 'Chủ đề F (CS): Thuật toán nhanh', lessonName: 'Bài 14: Thuật toán Sắp xếp trộn (Merge Sort) theo tư tưởng Chia để trị', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 17, semester: 1, topic: 'Ôn tập Cuối kỳ 1', lessonName: 'Ôn tập tổng kết Học kỳ 1', periods: 2, type: 'REVIEW', competencies: ['NLc'] },
    { week: 18, semester: 1, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 1', periods: 2, type: 'FINAL', competencies: ['NLc'] },

    // HỌC KỲ 2
    { week: 19, semester: 2, topic: 'Chủ đề F (CS): Cấu trúc dữ liệu', lessonName: 'Bài 15: Cấu trúc dữ liệu Ngăn xếp (Stack) và Hàng đợi (Queue)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 20, semester: 2, topic: 'Chủ đề F (CS): Cấu trúc dữ liệu', lessonName: 'Bài 16: Thực hành cài đặt Stack & Queue trong Python', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 21, semester: 2, topic: 'Chủ đề F (CS): Cấu trúc dữ liệu', lessonName: 'Bài 17: Cấu trúc dữ liệu Từ điển (Dictionary) và Bảng băm (Hash Table)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 22, semester: 2, topic: 'Chủ đề F (CS): Cấu trúc dữ liệu', lessonName: 'Bài 18: Thực hành ứng dụng Hash Table trong đếm tần suất và tra cứu', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 23, semester: 2, topic: 'Chủ đề F (CS): Kỹ thuật lập trình', lessonName: 'Bài 19: Xử lý Tệp (File I/O) và ngoại lệ (try - except)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 24, semester: 2, topic: 'Chủ đề F (CS): Kỹ thuật lập trình', lessonName: 'Bài 20: Thực hành đọc ghi tệp dữ liệu bài thi lập trình', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 25, semester: 2, topic: 'Chủ đề F (CS): Thuật toán đồ thị', lessonName: 'Bài 21: Khái niệm Đồ thị (Graph), Đỉnh, Cạnh và Biểu diễn ma trận kề', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 26, semester: 2, topic: 'Ôn tập Giữa kỳ 2', lessonName: 'Ôn tập Kiểm tra Giữa kỳ 2', periods: 2, type: 'REVIEW', competencies: ['NLc'] },
    { week: 27, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA GIỮA HỌC KỲ 2', periods: 2, type: 'MIDTERM', competencies: ['NLc'] },
    { week: 28, semester: 2, topic: 'Chủ đề F (CS): Thuật toán đồ thị', lessonName: 'Bài 22: Thuật toán Duyệt đồ thị theo chiều sâu (DFS) & Chiều rộng (BFS)', periods: 2, type: 'LESSON', competencies: ['NLc'] },
    { week: 29, semester: 2, topic: 'Chủ đề F (CS): Thuật toán đồ thị', lessonName: 'Bài 23: Thực hành cài đặt DFS & BFS', periods: 2, type: 'PRACTICE', competencies: ['NLc'] },
    { week: 30, semester: 2, topic: 'Dự án Lập trình', lessonName: 'Bài 24: Dự án xây dựng phần mềm thuật toán ứng dụng', periods: 2, type: 'PROJECT', competencies: ['NLc', 'NLd', 'NLe'] },
    { week: 31, semester: 2, topic: 'Dự án Lập trình', lessonName: 'Thực hành phát triển và kiểm thử sản phẩm', periods: 2, type: 'PROJECT', competencies: ['NLc', 'NLe'] },
    { week: 32, semester: 2, topic: 'Chủ đề G: Hướng nghiệp CS', lessonName: 'Bài 25: Nghề kỹ sư phần mềm, Chuyên gia thuật toán và AI', periods: 2, type: 'LESSON', competencies: ['NLa', 'NLe'] },
    { week: 33, semester: 2, topic: 'Chủ đề G: Hướng nghiệp CS', lessonName: 'Bài 26: Đạo đức trong phát triển phần mềm và Mã nguồn mở', periods: 2, type: 'LESSON', competencies: ['NLb', 'NLe'] },
    { week: 34, semester: 2, topic: 'Ôn tập Cuối năm', lessonName: 'Ôn tập tổng kết môn Tin học 11 CS', periods: 2, type: 'REVIEW', competencies: ['NLc'] },
    { week: 35, semester: 2, topic: 'Kiểm tra Đánh giá', lessonName: 'KIỂM TRA CUỐI HỌC KỲ 2', periods: 2, type: 'FINAL', competencies: ['NLc'] },
  ]),
};

// 4. PPCT Preset: Tin học 12 - Định hướng Tin học ứng dụng (ICT)
// Bộ sách Kết nối tri thức với cuộc sống (SGK 28 bài học chuẩn • 35 tuần • GDPT 2018)
export const presetGrade12: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'PPCT Tin học 12 (Định hướng Tin học Ứng dụng - KNTT)',
  grade: '12',
  track: 'ICT',
  academicYear: '2024 - 2025',
  assignedClasses: '12A1, 12A2, 12A3',
  totalPeriods: 70,
  totalWeeks: 35,
  isDefault: false,
  lessons: buildLessons([
    // ==========================================
    // HỌC KỲ 1 (Tuần 1 -> Tuần 18: 36 tiết)
    // ==========================================
    {
      week: 1,
      semester: 1,
      topic: 'Chủ đề 1: Máy tính và xã hội tri thức',
      lessonName: 'Bài 1: Làm quen với Trí tuệ nhân tạo',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLa'],
      objectives: {
        know: [
          'Nêu được định nghĩa cơ bản và mục tiêu của Trí tuệ nhân tạo (AI).',
          'Biết một số mốc lịch sử phát triển tiêu biểu của AI (Alan Turing, Hội nghị Dartmouth, kỷ nguyên Deep Learning).',
        ],
        understand: [
          'Phân biệt được Trí tuệ nhân tạo hẹp (Narrow AI) và Trí tuệ nhân tạo tổng quát (AGI).',
          'Hiểu nguyên lý máy tính học hỏi từ dữ liệu để đưa ra dự đoán hoặc quyết định.',
        ],
        apply: [
          'Chỉ ra và nhận diện được các ứng dụng AI thường gặp trong cuộc sống hàng ngày (nhận diện khuôn mặt, trợ lý giọng nói, dịch máy).',
        ],
      },
    },
    {
      week: 2,
      semester: 1,
      topic: 'Chủ đề 1: Máy tính và xã hội tri thức',
      lessonName: 'Bài 2: Trí tuệ nhân tạo trong khoa học và đời sống',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLa'],
      objectives: {
        know: [
          'Liệt kê được các lĩnh vực ứng dụng điển hình của AI: y tế, giáo dục, giao thông thông minh, tài chính, sản xuất tự động.',
          'Nêu được các yếu tố thúc đẩy sự phát triển bùng nổ của AI: dữ liệu lớn (Big Data), thuật toán học sâu, năng lực tính toán phần cứng.',
        ],
        understand: [
          'Hiểu được tác động tích cực và thách thức của AI đối với thị trường lao động và xã hội.',
          'Nhận thức được các vấn đề đạo đức, quyền riêng tư và trách nhiệm pháp lý khi sử dụng AI.',
        ],
        apply: [
          'Đề xuất được phương án ứng dụng công cụ AI một cách có trách nhiệm, hiệu quả trong học tập và đời sống.',
        ],
      },
    },
    {
      week: 3,
      semester: 1,
      topic: 'Chủ đề 2: Mạng máy tính và Internet',
      lessonName: 'Bài 3: Một số thiết bị mạng thông dụng',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLa'],
      objectives: {
        know: [
          'Kể tên và nhận diện được các thiết bị mạng thông dụng: Switch, Router, Modem, Điểm truy cập không dây (Access Point).',
          'Nêu được chức năng cơ bản của từng loại thiết bị trong hệ thống mạng máy tính.',
        ],
        understand: [
          'Phân biệt được vai trò kết nối nội bộ của Switch trong mạng LAN và vai trò định tuyến của Router khi kết nối Internet.',
          'Hiểu được nguyên lý truyền dẫn dữ liệu qua cáp mạng (xoắn đôi, cáp quang) và sóng vô tuyến (Wi-Fi).',
        ],
        apply: [
          'Phác thảo được sơ đồ kết nối mạng LAN cơ bản cho gia đình hoặc phòng máy tính trường học.',
        ],
      },
    },
    {
      week: 4,
      semester: 1,
      topic: 'Chủ đề 2: Mạng máy tính và Internet',
      lessonName: 'Bài 4: Giao thức mạng',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLa'],
      objectives: {
        know: [
          'Nêu được khái niệm giao thức mạng (Network Protocol).',
          'Kể tên được bộ giao thức nền tảng TCP/IP và các giao thức ứng dụng phổ biến: HTTP, HTTPS, FTP, DNS, DHCP.',
        ],
        understand: [
          'Giải thích được vai trò và cấu trúc của địa chỉ IP (IPv4, IPv6) và mặt nạ mạng con (Subnet Mask).',
          'Hiểu được cơ chế phân giải tên miền thành địa chỉ IP của hệ thống máy chủ DNS.',
        ],
        apply: [
          'Kiểm tra và đọc hiểu được các thông số cấu hình mạng (IP Address, Subnet Mask, Default Gateway, DNS Server) trên máy tính cá nhân.',
        ],
      },
    },
    {
      week: 5,
      semester: 1,
      topic: 'Chủ đề 2: Mạng máy tính và Internet',
      lessonName: 'Bài 5: Thực hành chia sẻ tài nguyên trên mạng',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Kiểm tra thường xuyên 1 (KTTX 1) - Phòng máy tính',
      competencies: ['NLa', 'NLe'],
      objectives: {
        know: [
          'Nêu được các cách chia sẻ tệp tin, thư mục và máy in trong mạng cục bộ (LAN).',
          'Biết các mức phân quyền truy cập tài nguyên (Read, Write, Modify, Full Control).',
        ],
        understand: [
          'Hiểu được nguyên tắc phân quyền và bảo mật khi chia sẻ dữ liệu trong mạng nội bộ.',
          'Nhận biết được các nguy cơ mất an toàn khi chia sẻ tài nguyên không kiểm soát.',
        ],
        apply: [
          'Thực hành thiết lập chia sẻ thư mục học tập và kết nối sử dụng máy in chia sẻ thành công trên hệ thống máy tính phòng máy.',
        ],
      },
    },
    {
      week: 6,
      semester: 1,
      topic: 'Chủ đề 3: Đạo đức, pháp luật và văn hóa trong môi trường số',
      lessonName: 'Bài 6: Giao tiếp và ứng xử trong không gian mạng',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLb'],
      objectives: {
        know: [
          'Nêu được các quy tắc chuẩn mực ứng xử trên mạng xã hội và diễn đàn trực tuyến (Netiquette).',
          'Nhận diện được các hành vi vi phạm pháp luật phổ biến trên không gian mạng theo Luật An ninh mạng.',
        ],
        understand: [
          'Hiểu được hậu quả nghiêm trọng của tin giả, thông tin sai sự thật và hành vi bắt nạt trên mạng (Cyberbullying).',
          'Phân tích được tầm quan trọng của việc xây dựng danh tính số tích cực và bảo vệ dữ liệu cá nhân.',
        ],
        apply: [
          'Ứng xử có văn hóa, tôn trọng quyền tác giả và biết cách phòng tránh, xử lý khi gặp các tình huống độc hại trên Internet.',
        ],
      },
    },
    {
      week: 7,
      semester: 1,
      topic: 'Chủ đề 5: Hướng nghiệp với Tin học',
      lessonName: 'Bài 19: Dịch vụ sửa chữa và bảo trì máy tính',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLd', 'NLe'],
      objectives: {
        know: [
          'Mô tả được các dịch vụ sửa chữa và bảo trì hệ thống máy tính (phần cứng, phần mềm, mạng).',
          'Kể tên được một số lỗi phần cứng và sự cố phần mềm máy tính thường gặp.',
        ],
        understand: [
          'Hiểu được quy trình chẩn đoán lỗi, xử lý sự cố và quy trình bảo dưỡng máy tính định kỳ.',
          'Nhận thức được yêu cầu về kiến thức, kỹ năng và phẩm chất cần thiết của kỹ thuật viên máy tính.',
        ],
        apply: [
          'Thực hiện được một số thao tác tự bảo trì máy tính cơ bản: dọn dẹp dung lượng ổ đĩa, kiểm tra virus, gỡ bỏ phần mềm không cần thiết.',
        ],
      },
    },
    {
      week: 8,
      semester: 1,
      topic: 'Chủ đề 5: Hướng nghiệp với Tin học',
      lessonName: 'Bài 20: Nhóm nghề quản trị thuộc ngành Công nghệ thông tin',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLd', 'NLe'],
      objectives: {
        know: [
          'Kể tên được các vị trí việc làm chính thuộc nhóm nghề quản trị CNTT: Quản trị hệ thống (System Admin), Quản trị mạng (Network Admin), Quản trị cơ sở dữ liệu (DBA).',
          'Nêu được nhiệm vụ cơ bản của từng vị trí quản trị.',
        ],
        understand: [
          'Phân tích được vai trò của quản trị viên đối với sự vận hành liên tục, an toàn của hạ tầng CNTT tại các cơ quan, doanh nghiệp.',
          'Biết các chứng chỉ nghề nghiệp quốc tế có giá trị trong ngành quản trị CNTT (CompTIA, Cisco CCNA, Microsoft Azure, Oracle).',
        ],
        apply: [
          'Tự đánh giá được mức độ phù hợp của bản thân đối với các công việc quản trị CNTT.',
        ],
      },
    },
    {
      week: 9,
      semester: 1,
      topic: 'Chủ đề 5: Hướng nghiệp với Tin học',
      lessonName: 'Bài 21: Hội thảo hướng nghiệp',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Báo cáo chuyên đề hướng nghiệp CNTT',
      competencies: ['NLd', 'NLe'],
      objectives: {
        know: [
          'Biết các kênh tìm kiếm thông tin đào tạo, xu hướng tuyển dụng và nhu cầu nhân lực ngành Công nghệ thông tin.',
          'Nắm được các cơ sở đào tạo đại học, cao đẳng uy tín và tổ chức nghề nghiệp CNTT trong nước.',
        ],
        understand: [
          'Hiểu được cơ hội việc làm và thách thức của lao động CNTT trong bối cảnh chuyển đổi số và phát triển AI.',
          'Xác định được lộ trình học tập, rèn luyện kỹ năng mềm và ngoại ngữ phù hợp với mục tiêu nghề nghiệp.',
        ],
        apply: [
          'Soạn thảo được báo cáo hoặc bài trình chiếu và tích cực tham gia thảo luận tại hội thảo hướng nghiệp của lớp.',
        ],
      },
    },
    {
      week: 10,
      semester: 1,
      topic: 'Chủ đề 6: Thực hành kết nối các thiết bị số',
      lessonName: 'Bài 22: Thực hành kết nối các thiết bị số',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLa'],
      objectives: {
        know: [
          'Nhận biết các chuẩn cổng giao tiếp vật lý (USB-A, Type-C, HDMI, LAN RJ45, Audio) và chuẩn kết nối không dây (Bluetooth, Wi-Fi Direct).',
          'Kể tên các thiết bị số cá nhân và thiết bị ngoại vi thông minh.',
        ],
        understand: [
          'Hiểu được quy trình ghép nối, đồng bộ dữ liệu và cài đặt trình điều khiển thiết bị (Driver).',
          'Giải thích được nguyên nhân gây ra sự cố mất kết nối hoặc thiết bị không nhận tín hiệu.',
        ],
        apply: [
          'Thực hành kết nối thành công máy tính với điện thoại thông minh, máy in, màn hình phụ hoặc máy chiếu.',
        ],
      },
    },
    {
      week: 11,
      semester: 1,
      topic: 'Chủ đề 7: Tin học ứng dụng (Xây dựng trang web)',
      lessonName: 'Bài 23: Chuẩn bị xây dựng trang web',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLa', 'NLe'],
      objectives: {
        know: [
          'Nêu được các bước chuẩn bị xây dựng website: xác định mục tiêu, đối tượng người xem, nội dung và cấu trúc trang.',
          'Nhận biết cấu trúc 3 phần cơ bản của trang web: Phần đầu (Header), Phần thân (Body) và Phần chân trang (Footer).',
        ],
        understand: [
          'Hiểu vai trò của thanh điều hướng (Menu) và sơ đồ cấu trúc trang web (Sitemap).',
          'Phân biệt được trang chủ (Homepage) và các trang chuyên mục con.',
        ],
        apply: [
          'Lập được sơ đồ cấu trúc website và phác thảo bố cục (Wireframe) cho một đề tài cụ thể.',
        ],
      },
    },
    {
      week: 12,
      semester: 1,
      topic: 'Chủ đề 7: Tin học ứng dụng (Xây dựng trang web)',
      lessonName: 'Bài 24: Xây dựng phần đầu trang web',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLa', 'NLe'],
      objectives: {
        know: [
          'Nêu được các thành phần chính trong phần đầu trang web (Header): Logo, Tên website, Slogan, Banner, Thanh điều hướng.',
          'Biết cách sử dụng công cụ tạo website trực quan (như Google Sites hoặc trình soạn thảo).',
        ],
        understand: [
          'Hiểu được nguyên tắc thiết kế phần đầu trang web ấn tượng, hài hòa và đồng bộ nhận diện.',
          'Giải thích được cách bố trí thanh menu sao cho người xem dễ dàng tìm kiếm thông tin.',
        ],
        apply: [
          'Thực hành tạo được phần Header hoàn chỉnh gồm Logo, Banner và thanh menu cho trang web dự án.',
        ],
      },
    },
    {
      week: 13,
      semester: 1,
      topic: 'Chủ đề 7: Tin học ứng dụng (Xây dựng trang web)',
      lessonName: 'Bài 25: Xây dựng phần thân và chân trang web',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLa', 'NLe'],
      objectives: {
        know: [
          'Mô tả được các thành phần trong phần thân (Body): các khối nội dung, văn bản, hình ảnh, video, danh mục.',
          'Mô tả được các thông tin trong phần chân trang (Footer): Bản quyền, Thông tin liên hệ, Mạng xã hội.',
        ],
        understand: [
          'Hiểu cách bố trí các khối nội dung dạng lưới, dạng thẻ (Card) hợp lý, khoa học.',
          'Nhận biết tầm quan trọng của tính đồng nhất giao diện và thông tin liên hệ minh bạch trên website.',
        ],
        apply: [
          'Thiết kế được phần Body với các khối bài viết đa phương tiện và hoàn thiện Footer chuẩn cho trang web.',
        ],
      },
    },
    {
      week: 14,
      semester: 1,
      topic: 'Chủ đề 7: Tin học ứng dụng (Xây dựng trang web)',
      lessonName: 'Bài 26: Liên kết và thanh điều hướng',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLa', 'NLe'],
      objectives: {
        know: [
          'Nêu được các loại liên kết: liên kết nội bộ giữa các trang trong website, liên kết neo trong trang (Anchor link), liên kết ra ngoài trang.',
          'Biết cách thiết lập thuộc tính liên kết mở trong thẻ mới.',
        ],
        understand: [
          'Hiểu cơ chế vận hành của thanh điều hướng đa cấp (Dropdown menu).',
          'Phân tích trải nghiệm điều hướng thuận tiện của người dùng khi duyệt web.',
        ],
        apply: [
          'Tạo được hệ thống liên kết thông suốt giữa trang chủ và các trang thành phần trong website.',
        ],
      },
    },
    {
      week: 15,
      semester: 1,
      topic: 'Đánh giá định kỳ',
      lessonName: 'Đánh giá giữa kì I',
      periods: 1,
      type: 'MIDTERM',
      notes: 'Kiểm tra đánh giá giữa kì I theo chuẩn CV 7991',
      competencies: ['NLa', 'NLb', 'NLc'],
      objectives: {
        know: ['Hệ thống hóa kiến thức cốt lõi về AI, Mạng máy tính, An toàn số, Hướng nghiệp và Cấu trúc website.'],
        understand: ['Thông hiểu nguyên lý hoạt động của thiết bị mạng, giao thức và quy trình xây dựng web.'],
        apply: ['Vận dụng giải quyết các tình huống và câu hỏi trắc nghiệm 3 dạng thức đạt chuẩn.'],
      },
    },
    {
      week: 15,
      semester: 1,
      topic: 'Chủ đề 7: Tin học ứng dụng (Xây dựng trang web)',
      lessonName: 'Bài 27: Biểu mẫu trên trang web',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Kiểm tra thường xuyên 2 (KTTX 2) - Phòng máy tính',
      competencies: ['NLc', 'NLa', 'NLe'],
      objectives: {
        know: [
          'Nêu được mục đích của biểu mẫu (Form): thu thập ý kiến, đăng ký thông tin, khảo sát trực tuyến, gửi phản hồi.',
          'Liệt kê các trường nhập liệu cơ bản: Hộp văn bản (Text), Email, Số (Number), Hộp chọn (Radio), Hộp kiểm (Checkbox), Vùng văn bản (Textarea).',
        ],
        understand: [
          'Hiểu cơ chế tiếp nhận, xử lý và lưu trữ dữ liệu người dùng từ biểu mẫu vào Google Forms hoặc bảng tính liên kết.',
          'Nhận thức yêu cầu bảo mật thông tin cá nhân thu thập qua biểu mẫu.',
        ],
        apply: [
          'Tích hợp được biểu mẫu khảo sát/liên hệ vào trang web và thử nghiệm gửi dữ liệu thành công.',
        ],
      },
    },
    {
      week: 16,
      semester: 1,
      topic: 'Chủ đề 7: Tin học ứng dụng (Xây dựng trang web)',
      lessonName: 'Bài 28: Thực hành tổng hợp',
      periods: 4,
      type: 'PRACTICE',
      notes: 'Dự án website hoàn chỉnh - Phòng máy tính',
      competencies: ['NLc', 'NLa', 'NLe'],
      objectives: {
        know: [
          'Hệ thống hóa toàn bộ quy trình xây dựng website từ lên ý tưởng đến hoàn thiện sản phẩm.',
          'Nắm vững các tiêu chí đánh giá website: tính thẩm mỹ, khả năng điều hướng, nội dung và tính hữu ích.',
        ],
        understand: [
          'Phân tích và tối ưu hóa trải nghiệm người dùng, tính tương thích trên máy tính và thiết bị di động.',
          'Hiểu quy trình xuất bản (Publish) website lên Internet với tên miền công khai.',
        ],
        apply: [
          'Hoàn thành dự án xây dựng website theo nhóm, xuất bản trang web lên Internet và báo cáo thuyết trình sản phẩm.',
        ],
      },
    },
    {
      week: 17,
      semester: 1,
      topic: 'Ôn tập học kỳ I',
      lessonName: 'Ôn tập Học kỳ I',
      periods: 2,
      type: 'REVIEW',
      notes: 'Hệ thống hóa kiến thức toàn bộ Học kỳ I',
      competencies: ['NLa', 'NLb', 'NLc', 'NLd', 'NLe'],
      objectives: {
        know: ['Hệ thống hóa toàn bộ các khái niệm cốt lõi: AI, Mạng máy tính, An toàn số, Hướng nghiệp, Xây dựng website.'],
        understand: ['Củng cố mối liên hệ giữa các chủ đề đã học trong học kỳ 1.'],
        apply: ['Luyện tập câu hỏi trắc nghiệm 3 dạng thức và bài tập tình huống thực tế.'],
      },
    },
    {
      week: 18,
      semester: 1,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 7: HTML và cấu trúc trang web',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc'],
      objectives: {
        know: [
          'Nêu được khái niệm HTML (HyperText Markup Language) và cấu trúc tệp HTML chuẩn: <!DOCTYPE html>, <html>, <head>, <title>, <body>.',
          'Phân biệt được thẻ mở, thẻ đóng và phần tử HTML.',
        ],
        understand: [
          'Hiểu được vai trò của thẻ đánh dấu trong việc trình duyệt render nội dung.',
          'Giải thích được cấu trúc phân cấp cây DOM đơn giản trong văn bản HTML.',
        ],
        apply: [
          'Soạn thảo và lưu được tệp HTML cơ bản đầu tiên bằng phần mềm soạn thảo (Notepad/VS Code) và mở hiển thị trên trình duyệt.',
        ],
      },
    },
    {
      week: 18,
      semester: 1,
      topic: 'Đánh giá định kỳ',
      lessonName: 'Đánh giá cuối kì I',
      periods: 1,
      type: 'FINAL',
      notes: 'Kiểm tra đánh giá cuối kì I theo chuẩn CV 7991',
      competencies: ['NLa', 'NLb', 'NLc', 'NLd'],
      objectives: {
        know: ['Đánh giá chuẩn kiến thức kỹ năng toàn bộ Học kỳ I.'],
        understand: ['Đánh giá năng lực thông hiểu các khái niệm, quy trình kỹ thuật.'],
        apply: ['Đánh giá năng lực vận dụng giải quyết bài toán thực tiễn theo 3 dạng thức câu hỏi.'],
      },
    },

    // ==========================================
    // HỌC KỲ 2 (Tuần 19 -> Tuần 35: 34 tiết)
    // ==========================================
    {
      week: 19,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 8: Định dạng văn bản',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc'],
      objectives: {
        know: [
          'Kể tên các thẻ tiêu đề (<h1> đến <h6>), thẻ đoạn văn (<p>), thẻ ngắt dòng (<br>), thẻ đường kẻ ngang (<hr>).',
          'Biết các thẻ định dạng ký tự: <b>, <strong>, <i>, <em>, <u>, <sup>, <sub>.',
        ],
        understand: [
          'Hiểu ý nghĩa ngữ nghĩa (Semantic) của các thẻ tiêu đề đối với bố cục trang web và tối ưu hóa SEO.',
          'Phân biệt được sự khác nhau giữa thẻ ngắt dòng và thẻ đoạn văn.',
        ],
        apply: [
          'Soạn thảo và định dạng được trang web văn bản có phân cấp tiêu đề, đoạn văn bản rõ ràng, chuẩn đẹp.',
        ],
      },
    },
    {
      week: 20,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 9: Tạo danh sách, bảng',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc'],
      objectives: {
        know: [
          'Nhận biết được thẻ danh sách có thứ tự (<ol>, <li>) và không thứ tự (<ul>, <li>).',
          'Kể tên các thẻ tạo bảng: <table>, <tr>, <th>, <td>.',
          'Biết các thuộc tính gộp ô: rowspan, colspan.',
        ],
        understand: [
          'Hiểu được cấu trúc phân cấp dòng - cột trong bảng HTML.',
          'Giải thích được các trường hợp sử dụng danh sách và bảng trong trình bày dữ liệu.',
        ],
        apply: [
          'Tạo được trang web hiển thị bảng thời khóa biểu hoặc bảng danh mục sản phẩm có gộp ô phức tạp.',
        ],
      },
    },
    {
      week: 21,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 10: Tạo liên kết',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc'],
      objectives: {
        know: [
          'Nêu được cấu trúc thẻ liên kết <a> và các thuộc tính href, target.',
          'Nhận biết các loại liên kết: liên kết tuyệt đối (URL đầy đủ) và liên kết tương đối (đường dẫn cục bộ).',
        ],
        understand: [
          'Hiểu được cách tạo điểm neo (Bookmark/Anchor link) với thuộc tính id để nhảy đến vị trí trong cùng trang.',
          'Phân biệt được liên kết tải tệp và liên kết chuyển trang.',
        ],
        apply: [
          'Xây dựng được hệ thống siêu liên kết nội bộ kết nối các trang web HTML với nhau và tạo mục lục trang dạng liên kết neo.',
        ],
      },
    },
    {
      week: 22,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 11: Chèn tệp tin, đa phương tiện và khung nội tuyến vào trang web',
      periods: 3,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc'],
      objectives: {
        know: [
          'Nêu được cú pháp chèn hình ảnh (<img>), âm thanh (<audio>), video (<video>) và khung nội tuyến (<iframe>).',
          'Kể tên các thuộc tính: src, alt, width, height, controls, autoplay, loop.',
        ],
        understand: [
          'Hiểu được tầm quan trọng của thuộc tính alt đối với khả năng tiếp cận và tối ưu hóa tìm kiếm (SEO).',
          'Giải thích được cơ chế nhúng bản đồ số (Google Maps) hoặc video YouTube thông qua thẻ <iframe>.',
        ],
        apply: [
          'Chèn thành thạo hình ảnh, tệp âm thanh, video cục bộ và nhúng tài nguyên trực tuyến vào trang web.',
        ],
      },
    },
    {
      week: 23,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 12: Tạo biểu mẫu',
      periods: 3,
      type: 'PRACTICE',
      notes: 'Kiểm tra thường xuyên 1 HK2 (KTTX 1) - Phòng máy tính',
      competencies: ['NLc'],
      objectives: {
        know: [
          'Nhận biết được thẻ <form> và các thẻ nhập liệu: <input>, <textarea>, <select>, <option>, <button>.',
          'Kể tên các loại input: text, password, email, date, number, radio, checkbox, submit, reset.',
        ],
        understand: [
          'Hiểu vai trò của thuộc tính name, value, placeholder, required trong biểu mẫu HTML.',
          'Giải thích được hai phương thức gửi dữ liệu form: GET và POST.',
        ],
        apply: [
          'Xây dựng được biểu mẫu đăng ký thành viên hoặc khảo sát ý kiến có đầy đủ các trường nhập liệu và nút gửi dữ liệu.',
        ],
      },
    },
    {
      week: 24,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 13: Khái niệm, vai trò của CSS',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLe'],
      objectives: {
        know: [
          'Nêu được định nghĩa CSS (Cascading Style Sheets) và vai trò tách biệt nội dung (HTML) với định dạng hiển thị (CSS).',
          'Kể tên 3 cách nhúng CSS: Inline CSS, Internal CSS (<style>), External CSS (<link>).',
          'Nhận biết cú pháp cơ bản của một quy tắc CSS (Selector, Property, Value).',
        ],
        understand: [
          'Hiểu ưu điểm vượt trội của External CSS trong việc quản lý và bảo trì giao diện website lớn.',
          'Giải thích được nguyên lý kế thừa kiểu dáng (Inheritance) trong CSS.',
        ],
        apply: [
          'Tạo được tệp style.css riêng biệt và liên kết thành công vào tài liệu HTML để thay đổi màu sắc, font chữ.',
        ],
      },
    },
    {
      week: 25,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 14: Định dạng văn bản bằng CSS',
      periods: 3,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLe'],
      objectives: {
        know: [
          'Kể tên các thuộc tính định dạng chữ trong CSS: font-family, font-size, font-weight, font-style.',
          'Kể tên các thuộc tính định dạng đoạn: text-align, line-height, text-decoration, text-transform, letter-spacing.',
        ],
        understand: [
          'Hiểu cách chọn font chữ an toàn cho web (Web-safe fonts) và nhúng Google Fonts trực tuyến.',
          'Giải thích được các đơn vị đo trong CSS: px, em, rem, %.',
        ],
        apply: [
          'Định dạng được bài viết trên trang web với kiểu chữ, kích thước, khoảng cách dòng chuyên nghiệp, dễ đọc.',
        ],
      },
    },
    {
      week: 26,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 15: Tạo màu cho chữ và nền',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLe'],
      objectives: {
        know: [
          'Nêu được các cách biểu diễn màu trong CSS: Tên màu tiếng Anh, mã Hex (#RRGGBB), mã RGB, RGBA.',
          'Kể tên các thuộc tính màu sắc: color, background-color, background-image, background-repeat, background-size.',
        ],
        understand: [
          'Hiểu ý nghĩa của kênh độ trong suốt Alpha trong hàm màu rgba().',
          'Phân tích được độ tương phản giữa màu chữ và màu nền để đảm bảo tính dễ đọc.',
        ],
        apply: [
          'Phối màu nền và màu chữ hài hòa, thiết lập hình ảnh nền co giãn chuẩn xác cho trang web.',
        ],
      },
    },
    {
      week: 27,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 16: Định dạng khung',
      periods: 3,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLe'],
      objectives: {
        know: [
          'Nêu được mô hình hộp trong CSS (CSS Box Model) gồm 4 thành phần: Content, Padding, Border, Margin.',
          'Kể tên các thuộc tính: width, height, padding, margin, border, border-radius.',
        ],
        understand: [
          'Hiểu sự khác biệt giữa Padding (khoảng cách bên trong) và Margin (khoảng cách bên ngoài).',
          'Giải thích được cách tính tổng kích thước hiển thị của một phần tử theo Box Model.',
        ],
        apply: [
          'Thiết lập được viền bo tròn (border-radius), tạo khoảng cách và hiệu ứng hộp thẻ (Card UI) cho các phần tử web.',
        ],
      },
    },
    {
      week: 28,
      semester: 2,
      topic: 'Đánh giá định kỳ',
      lessonName: 'Đánh giá giữa kì II',
      periods: 1,
      type: 'MIDTERM',
      notes: 'Kiểm tra đánh giá giữa kì II theo chuẩn CV 7991',
      competencies: ['NLc', 'NLe'],
      objectives: {
        know: ['Đánh giá kiến thức HTML cơ bản, thẻ đa phương tiện, biểu mẫu và CSS cơ bản.'],
        understand: ['Thông hiểu quy tắc kết hợp CSS và Box Model.'],
        apply: ['Vận dụng làm bài kiểm tra 3 dạng thức trắc nghiệm và câu hỏi code phân tích CSS.'],
      },
    },
    {
      week: 29,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 17: Các mức ưu tiên của bộ chọn',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLe'],
      objectives: {
        know: [
          'Kể tên các loại bộ chọn trong CSS: Element selector, Class selector (.), ID selector (#), Grouping selector.',
          'Biết từ khóa !important.',
        ],
        understand: [
          'Hiểu quy tắc phân cấp ưu tiên (CSS Specificity): Inline style > ID > Class > Element.',
          'Giải thích được nguyên tắc thác nước (Cascading) khi có nhiều quy tắc trùng lặp cùng áp dụng lên một phần tử.',
        ],
        apply: [
          'Vận dụng đúng các bộ chọn Class và ID để tùy biến giao diện mà không làm xung đột kiểu dáng.',
        ],
      },
    },
    {
      week: 30,
      semester: 2,
      topic: 'Chủ đề 4: Giải quyết vấn đề với sự trợ giúp của máy tính',
      lessonName: 'Bài 18: Thực hành tổng hợp, thiết kế trang web',
      periods: 4,
      type: 'PROJECT',
      notes: 'Kiểm tra thường xuyên 2 HK2 (KTTX 2) - Phòng máy tính',
      competencies: ['NLc', 'NLe'],
      objectives: {
        know: [
          'Hệ thống hóa toàn bộ kiến thức HTML5 và CSS3 đã học.',
          'Nắm vững quy trình thiết kế trang web tĩnh đa trang (Multi-page website).',
        ],
        understand: [
          'Hiểu cách kết nối mã nguồn HTML với tệp CSS đồng bộ toàn bộ website.',
          'Đánh giá được tính thẩm mỹ, khả năng tương thích và tối ưu hóa mã nguồn.',
        ],
        apply: [
          'Xây dựng được một website hoàn chỉnh (gồm 3-4 trang: Trang chủ, Giới thiệu, Tin tức/Sản phẩm, Liên hệ) bằng mã nguồn HTML và CSS sạch, chuẩn W3C.',
        ],
      },
    },
    {
      week: 32,
      semester: 2,
      topic: 'Ôn tập học kỳ II',
      lessonName: 'Ôn tập Học kỳ II',
      periods: 2,
      type: 'REVIEW',
      notes: 'Phòng máy tính - Hệ thống hóa kiến thức HK2',
      competencies: ['NLc', 'NLe'],
      objectives: {
        know: ['Hệ thống hóa toàn bộ các thẻ HTML và các thuộc tính CSS quan trọng.'],
        understand: ['Củng cố kỹ năng lập trình web, gỡ lỗi hiển thị (Debug với F12 DevTools).'],
        apply: ['Luyện đề khảo sát, đề thi thử tốt nghiệp THPT môn Tin học chuẩn 3 dạng thức mới.'],
      },
    },
    {
      week: 33,
      semester: 2,
      topic: 'Đánh giá định kỳ',
      lessonName: 'Đánh giá cuối kì II',
      periods: 1,
      type: 'FINAL',
      notes: 'Kiểm tra đánh giá cuối kì II theo chuẩn CV 7991',
      competencies: ['NLa', 'NLb', 'NLc', 'NLd', 'NLe'],
      objectives: {
        know: ['Đánh giá chuẩn năng lực Tin học toàn bộ năm học lớp 12.'],
        understand: ['Đánh giá mức độ thông hiểu lý thuyết và ứng dụng CNTT thực tiễn.'],
        apply: ['Đánh giá năng lực giải quyết vấn đề, phân tích mã nguồn và tư duy thuật toán theo đề chuẩn 7991.'],
      },
    },
  ]),
};

// Also export alias for compatibility
export const presetGrade12ICT = presetGrade12;

export const allPPCTPresets = [
  presetGrade10,
  presetGrade11ICT,
  presetGrade11CS,
  presetGrade12,
];
