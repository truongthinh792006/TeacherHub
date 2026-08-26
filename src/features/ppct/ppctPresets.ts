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
// 35 Tuần • 70 Tiết • Phân rã đầy đủ Năng lực [NLa-NLe] & Mục tiêu YCCĐ [Biết, Hiểu, Vận dụng]
export const presetGrade12: Omit<PPCTPlan, 'id' | 'createdAt' | 'updatedAt'> = {
  title: 'PPCT Tin học 12 (Định hướng Tin học Ứng dụng - ICT)',
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
    // CHỦ ĐỀ A: MÁY TÍNH VÀ XÃ HỘI TRI THỨC (TRÍ TUỆ NHÂN TẠO)
    {
      week: 1,
      semester: 1,
      topic: 'Chủ đề A: Máy tính và xã hội tri thức (Trí tuệ nhân tạo)',
      lessonName: 'Bài 1: Giới thiệu về Trí tuệ nhân tạo và Lịch sử phát triển',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLa', 'NLb', 'NLc'],
      objectives: {
        know: [
          'Nêu được định nghĩa cơ bản về Trí tuệ nhân tạo (AI).',
          'Kể tên được một số mốc thời gian lịch sử phát triển tiêu biểu của AI (Alan Turing, Hội nghị Dartmouth 1956, kỷ nguyên Deep Learning).',
        ],
        understand: [
          'Phân biệt được Trí tuệ nhân tạo hẹp (Narrow AI) và Trí tuệ nhân tạo tổng quát (AGI).',
          'Hiểu và giải thích được các đặc trưng cốt lõi của hệ thống AI: khả năng học hỏi, suy luận, tự thích nghi.',
        ],
        apply: [
          'Nhận diện và chỉ ra được các ứng dụng AI đang hoạt động xung quanh đời sống thực tế (nhận diện khuôn mặt, gợi ý video, trợ lý giọng nói).',
        ],
      },
    },
    {
      week: 2,
      semester: 1,
      topic: 'Chủ đề A: Máy tính và xã hội tri thức (Trí tuệ nhân tạo)',
      lessonName: 'Bài 2: Các ứng dụng điển hình của Trí tuệ nhân tạo',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLa', 'NLb', 'NLe'],
      objectives: {
        know: [
          'Liệt kê được các phân nhánh ứng dụng chính của AI: Thị giác máy tính (Computer Vision), Xử lý ngôn ngữ tự nhiên (NLP), Điều khiển tự động (Robotics).',
        ],
        understand: [
          'Hiểu nguyên lý cơ bản cách máy tính phân tích hình ảnh và dịch ngôn ngữ tự động qua mô hình học máy.',
        ],
        apply: [
          'Trải nghiệm và so sánh hiệu quả giữa một công cụ AI tạo sinh văn bản/hình ảnh và phương pháp thủ công truyền thống.',
        ],
      },
    },
    {
      week: 3,
      semester: 1,
      topic: 'Chủ đề A: Máy tính và xã hội tri thức (Trí tuệ nhân tạo)',
      lessonName: 'Bài 3: Đạo đức và Pháp luật trong kỷ nguyên Trí tuệ nhân tạo',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLb', 'NLe'],
      objectives: {
        know: [
          'Biết các nguy cơ tiềm ẩn về quyền riêng tư, an toàn dữ liệu và sai lệch thông tin do AI tạo ra (Deepfake, AI Hallucination).',
        ],
        understand: [
          'Hiểu được vấn đề bản quyền tác giả đối với tác phẩm do AI tạo sinh và trách nhiệm đạo đức của người dùng.',
        ],
        apply: [
          'Xây dựng bộ quy tắc ứng xử có trách nhiệm, văn minh và trung thực khi sử dụng các công cụ AI trong học tập và đời sống.',
        ],
      },
    },

    // CHỦ ĐỀ B: MẠNG MÁY TÍNH VÀ INTERNET
    {
      week: 4,
      semester: 1,
      topic: 'Chủ đề B: Mạng máy tính và Internet',
      lessonName: 'Bài 4: Giao thức mạng và Thiết bị kết nối mạng (TCP/IP & OSI)',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLa', 'NLc', 'NLd'],
      objectives: {
        know: [
          'Nêu được vai trò của bộ giao thức TCP/IP và mô hình tham chiếu OSI 7 tầng.',
          'Kể tên và nêu chức năng của các thiết bị mạng: Switch, Router, Modem, Access Point.',
        ],
        understand: [
          'Giải thích được sự khác biệt giữa truyền gói tin theo giao thức TCP (tin cậy) và UDP (tốc độ cao).',
        ],
        apply: [
          'Vẽ sơ đồ kết nối mạng máy tính cơ bản cho phòng học hoặc gia đình gồm modem, router Wi-Fi và các thiết bị đầu cuối.',
        ],
      },
    },
    {
      week: 5,
      semester: 1,
      topic: 'Chủ đề B: Mạng máy tính và Internet',
      lessonName: 'Bài 5: Địa chỉ IP, Subnet Mask và Phân chia mạng con',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLa', 'NLc'],
      objectives: {
        know: [
          'Nêu được cấu trúc của địa chỉ IPv4 (32-bit gồm 4 octet) và IPv6 (128-bit).',
          'Biết các dải địa chỉ IP riêng (Private IP) dùng trong mạng nội bộ.',
        ],
        understand: [
          'Hiểu ý nghĩa của mặt nạ mạng con (Subnet Mask) và cổng kết nối mặc định (Default Gateway).',
        ],
        apply: [
          'Sử dụng lệnh `ipconfig` / `ping` trong Command Prompt để kiểm tra thông số mạng và tính thông suốt của đường truyền.',
        ],
      },
    },
    {
      week: 6,
      semester: 1,
      topic: 'Chủ đề B: Mạng máy tính và Internet',
      lessonName: 'Bài 6: Thực hành Thiết kế và Cấu hình mạng cục bộ (LAN & Wi-Fi)',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính kết nối mạng',
      competencies: ['NLc', 'NLd', 'NLe'],
      objectives: {
        know: [
          'Biết địa chỉ IP mặc định và tài khoản quản trị của bộ định tuyến Wi-Fi gia đình.',
        ],
        understand: [
          'Hiểu các chuẩn mã hóa bảo mật Wi-Fi (WPA2-Personal, WPA3) và cách cấp phát địa chỉ IP tự động qua DHCP.',
        ],
        apply: [
          'Thực hành đổi tên mạng SSID, thiết lập mật khẩu Wi-Fi an toàn và chia sẻ tệp/máy in trong mạng LAN.',
        ],
      },
    },
    {
      week: 7,
      semester: 1,
      topic: 'Chủ đề B: Mạng máy tính và Internet',
      lessonName: 'Bài 7: An toàn dữ liệu, Tường lửa và Phòng chống tấn công mạng',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLb', 'NLc', 'NLe'],
      objectives: {
        know: [
          'Nêu được các mối đe dọa an ninh mạng phổ biến: virus, phần mềm tống tiền (ransomware), tấn công lừa đảo (phishing), DDoS.',
        ],
        understand: [
          'Giải thích được vai trò của Tường lửa (Firewall) và giao thức bảo mật HTTPS/SSL trong bảo vệ truyền thông tin.',
        ],
        apply: [
          'Bật tường lửa hệ điều hành, cài đặt cấu hình cập nhật phần mềm diệt virus và thiết lập sao lưu dữ liệu đám mây định kỳ.',
        ],
      },
    },
    {
      week: 8,
      semester: 1,
      topic: 'Ôn tập & Đánh giá',
      lessonName: 'Ôn tập Kiểm tra Đánh giá Giữa học kỳ 1',
      periods: 2,
      type: 'REVIEW',
      competencies: ['NLa', 'NLb', 'NLc'],
      objectives: {
        know: ['Tái hiện toàn bộ kiến thức về Trí tuệ nhân tạo (Chủ đề A) và Mạng máy tính (Chủ đề B).'],
        understand: ['Phân tích câu hỏi trắc nghiệm Đúng/Sai đa ý và bài tập tình huống mạng.'],
        apply: ['Giải quyết bài kiểm tra mẫu theo cấu trúc ma trận chuẩn CV 7991.'],
      },
    },
    {
      week: 9,
      semester: 1,
      topic: 'Kiểm tra Đánh giá',
      lessonName: 'KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ 1 (45 phút)',
      periods: 2,
      type: 'MIDTERM',
      competencies: ['NLa', 'NLb', 'NLc', 'NLe'],
    },

    // CHỦ ĐỀ F (ICT): THIẾT KẾ VÀ PHÁT TRIỂN TRANG WEB VỚI HTML5 & CSS3
    {
      week: 10,
      semester: 1,
      topic: 'Chủ đề F: Thiết kế Web với HTML5',
      lessonName: 'Bài 8: Khái niệm Trang web, Website và Cấu trúc cơ bản tài liệu HTML5',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLa', 'NLc', 'NLd'],
      objectives: {
        know: [
          'Nêu được khái niệm trang web tĩnh, trang web động, tên miền (domain) và dịch vụ lưu trữ (hosting).',
          'Nhớ cấu trúc thẻ cơ bản của tài liệu HTML5: `<!DOCTYPE html>`, `<html>`, `<head>`, `<title>`, `<body>`.',
        ],
        understand: [
          'Hiểu nguyên lý hoạt động của trình duyệt web khi thông dịch tài liệu HTML thành giao diện trực quan.',
        ],
        apply: [
          'Sử dụng trình biên tập mã nguồn (VS Code) tạo và mở tệp `index.html` đầu tiên trên trình duyệt.',
        ],
      },
    },
    {
      week: 11,
      semester: 1,
      topic: 'Chủ đề F: Thiết kế Web với HTML5',
      lessonName: 'Bài 9: Các thẻ định dạng văn bản, Danh sách và Hình ảnh trong HTML',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Ghi nhớ các thẻ tiêu đề `<h1>` - `<h6>`, đoạn văn `<p>`, xuống dòng `<br>`, in đậm `<b>/<strong>`, in nghiêng `<i>/<em>`.',
          'Biết cú pháp thẻ chèn ảnh `<img>` với các thuộc tính bắt buộc `src`, `alt`, `width`, `height`.',
        ],
        understand: [
          'Phân biệt danh sách có thứ tự `<ol>` và danh sách không có thứ tự `<ul>`, cách dùng thẻ con `<li>`.',
        ],
        apply: [
          'Tạo một bài viết tin tức hoặc bài giới thiệu bản thân đầy đủ tiêu đề, nội dung phân đoạn và hình ảnh minh họa.',
        ],
      },
    },
    {
      week: 12,
      semester: 1,
      topic: 'Chủ đề F: Thiết kế Web với HTML5',
      lessonName: 'Bài 10: Siêu liên kết (Hyperlink) và Đa phương tiện trong HTML',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Cú pháp thẻ siêu liên kết `<a>` với thuộc tính `href` và `target="_blank"`.',
          'Các thẻ nhúng đa phương tiện `<audio>`, `<video>`, `<iframe>` để nhúng video YouTube.',
        ],
        understand: [
          'Phân biệt liên kết tương đối (relative path) trong cùng thư mục và liên kết tuyệt đối (absolute URL).',
        ],
        apply: [
          'Xây dựng hệ thống menu điều hướng liên kết qua lại giữa các trang HTML con trong một website.',
        ],
      },
    },
    {
      week: 13,
      semester: 1,
      topic: 'Chủ đề F: Thiết kế Web với HTML5',
      lessonName: 'Bài 11: Tạo Bảng dữ liệu (Table) trong HTML',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Nhớ các thẻ cấu thành bảng: `<table>`, hàng `<tr>`, ô tiêu đề `<th>`, ô dữ liệu `<td>`.',
        ],
        understand: [
          'Hiểu cách gộp cột bằng thuộc tính `colspan` và gộp hàng bằng `rowspan`.',
        ],
        apply: [
          'Thiết kế bảng Thời khóa biểu hoặc Bảng điểm học tập lớp học có định dạng viền và màu nền tiêu đề.',
        ],
      },
    },
    {
      week: 14,
      semester: 1,
      topic: 'Chủ đề F: Thiết kế Web với HTML5',
      lessonName: 'Bài 12: Biểu mẫu thu thập dữ liệu (Form) trong HTML',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLd', 'NLe'],
      objectives: {
        know: [
          'Liệt kê được các loại trường nhập liệu của thẻ `<input>`: text, password, email, number, date, radio, checkbox.',
          'Biết các thẻ nhập văn bản nhiều dòng `<textarea>`, danh sách chọn `<select>`, nút bấm `<button type="submit">`.',
        ],
        understand: [
          'Hiểu phương thức gửi dữ liệu form `action`, `method="GET/POST"` và các thuộc tính hỗ trợ `required`, `placeholder`.',
        ],
        apply: [
          'Xây dựng một Biểu mẫu Đăng ký thành viên Câu lạc bộ Tin học có đầy đủ các trường nhập liệu chuẩn.',
        ],
      },
    },
    {
      week: 15,
      semester: 1,
      topic: 'Chủ đề F: Định dạng trang web với CSS3',
      lessonName: 'Bài 13: Giới thiệu CSS3, Cú pháp và Các Bộ chọn (Selectors)',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLa', 'NLc', 'NLd'],
      objectives: {
        know: [
          'Nêu được khái niệm CSS (Cascading Style Sheets) và 3 cách nhúng CSS: Inline, Internal, External (thẻ `<link>`).',
          'Biết cú pháp khai báo CSS: `selector { property: value; }`.',
        ],
        understand: [
          'Phân biệt và hiểu độ ưu tiên giữa bộ chọn thẻ (element), bộ chọn lớp (`.class`) và bộ chọn định danh (`#id`).',
        ],
        apply: [
          'Tạo tệp `style.css` riêng biệt, liên kết vào tệp HTML để thay đổi màu sắc văn bản, phông chữ và màu nền trang web.',
        ],
      },
    },
    {
      week: 16,
      semester: 1,
      topic: 'Chủ đề F: Định dạng trang web với CSS3',
      lessonName: 'Bài 14: Mô hình Hộp (CSS Box Model) và Định dạng Khung hiển thị',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Chỉ ra và gọi tên được 4 thành phần cấu thành Box Model: Content, Padding, Border, Margin.',
        ],
        understand: [
          'Phân biệt rõ ràng giữa Margin (khoảng cách ngoài giữa các phần tử) và Padding (khoảng cách trong từ viền đến nội dung).',
          'Hiểu thuộc tính `box-sizing: border-box` giúp tính toán kích thước chiều rộng/cao chính xác.',
        ],
        apply: [
          'Căn chỉnh lề, tạo khung viền bo tròn (`border-radius`) và đổ bóng nhẹ (`box-shadow`) cho các khối thẻ tin tức trên trang.',
        ],
      },
    },
    {
      week: 17,
      semester: 1,
      topic: 'Ôn tập & Đánh giá',
      lessonName: 'Ôn tập tổng kết môn Tin học 12 - Học kỳ 1',
      periods: 2,
      type: 'REVIEW',
      competencies: ['NLa', 'NLb', 'NLc', 'NLd'],
      objectives: {
        know: ['Tổng hợp hệ thống kiến thức AI, Mạng LAN và Ngôn ngữ HTML5/CSS3.'],
        understand: ['Phân tích mã nguồn phát hiện lỗi cú pháp và lỗi giao diện hiển thị web.'],
        apply: ['Giải đề thi ôn tập tổng hợp chuẩn bị cho kiểm tra cuối học kỳ 1.'],
      },
    },
    {
      week: 18,
      semester: 1,
      topic: 'Kiểm tra Đánh giá',
      lessonName: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ 1 (45 phút)',
      periods: 2,
      type: 'FINAL',
      competencies: ['NLa', 'NLb', 'NLc', 'NLd', 'NLe'],
    },

    // ==========================================
    // HỌC KỲ 2 (Tuần 19 -> Tuần 35: 34 tiết)
    // ==========================================
    // CHỦ ĐỀ F (ICT): BỐ CỤC WEB HIỆN ĐẠI, RESPONSIVE VÀ TƯƠNG TÁC JAVASCRIPT
    {
      week: 19,
      semester: 2,
      topic: 'Chủ đề F: Bố cục Web hiện đại với CSS',
      lessonName: 'Bài 15: Thiết kế Bố cục giao diện với CSS Flexbox',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Nêu được khái niệm Flex Container (`display: flex`) và Flex Items.',
        ],
        understand: [
          'Hiểu nguyên lý căn chỉnh trên trục chính (Main Axis) với `justify-content` và trục vuông góc (Cross Axis) với `align-items`.',
          'Hiểu cách đổi hướng sắp xếp các phần tử bằng `flex-direction` (row / column).',
        ],
        apply: [
          'Thực hành tạo thanh điều hướng Navbar nằm ngang và căn giữa hoàn hảo một khối phần tử vào chính giữa trang.',
        ],
      },
    },
    {
      week: 20,
      semester: 2,
      topic: 'Chủ đề F: Bố cục Web hiện đại với CSS',
      lessonName: 'Bài 16: Bố cục lưới hai chiều với CSS Grid Layout',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Khái niệm Grid Container (`display: grid`), Grid Track (hàng và cột) và khoảng cách giữa các ô `gap`.',
        ],
        understand: [
          'Hiểu đơn vị phân số linh hoạt `fr`, hàm lặp `repeat()` và hàm tự động điều chỉnh `minmax()`.',
        ],
        apply: [
          'Thiết kế giao diện bộ sưu tập ảnh (Photo Gallery) hoặc danh sách sản phẩm dạng thẻ Card 3 cột chuyên nghiệp.',
        ],
      },
    },
    {
      week: 21,
      semester: 2,
      topic: 'Chủ đề F: Bố cục Web hiện đại với CSS',
      lessonName: 'Bài 17: Thiết kế Web đáp ứng (Responsive Web Design với Media Queries)',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Nêu được định nghĩa Responsive Web Design và vai trò của thẻ `<meta name="viewport">`.',
        ],
        understand: [
          'Hiểu cú pháp câu truy vấn đa phương tiện `@media screen and (max-width: ...px)` và khái niệm điểm ngắt (Breakpoints).',
        ],
        apply: [
          'Viết CSS Media Query để bố cục tự động chuyển đổi từ 3 cột trên máy tính sang 1 cột duy nhất khi xem trên điện thoại di động.',
        ],
      },
    },
    {
      week: 22,
      semester: 2,
      topic: 'Chủ đề F: Bố cục Web hiện đại với CSS',
      lessonName: 'Bài 18: Thực hành Tạo trang Landing Page hoàn chỉnh chuẩn Mobile & Desktop',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLd', 'NLe'],
      objectives: {
        know: [
          'Nắm được các khối tiêu chuẩn của một Landing Page: Header/Nav, Hero Banner, Giới thiệu tính năng, Bảng giá/Đăng ký, Footer.',
        ],
        understand: [
          'Vận dụng phối hợp nhịp nhàng giữa HTML5 ngữ nghĩa, CSS Flexbox, Grid và Responsive Media Queries.',
        ],
        apply: [
          'Hoàn thiện một trang Landing Page giới thiệu sự kiện trường học hiển thị sắc nét trên cả màn hình máy tính và smartphone.',
        ],
      },
    },
    {
      week: 23,
      semester: 2,
      topic: 'Chủ đề F: Tương tác Web với JavaScript',
      lessonName: 'Bài 19: Nhập môn JavaScript và Tương tác mô hình đối tượng tài liệu (DOM)',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Nêu được vai trò của JavaScript trong việc tạo chuyển động và tính tương tác sống động cho trang web.',
          'Biết cách nhúng mã JavaScript bằng thẻ `<script>` và kiểm tra lệnh qua cửa sổ Console của trình duyệt.',
        ],
        understand: [
          'Hiểu khái niệm cây phân cấp DOM và phương thức truy xuất phần tử: `document.getElementById()`, `document.querySelector()`.',
        ],
        apply: [
          'Viết đoạn mã JavaScript đơn giản để thay đổi nội dung văn bản (`innerHTML`) và màu sắc khi tải trang.',
        ],
      },
    },
    {
      week: 24,
      semester: 2,
      topic: 'Chủ đề F: Tương tác Web với JavaScript',
      lessonName: 'Bài 20: Xử lý sự kiện người dùng (Event Handling) trong JavaScript',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: [
          'Liệt kê các sự kiện thông dụng: `click`, `change`, `input`, `submit`, `mouseover`.',
        ],
        understand: [
          'Hiểu cách gắn hàm lắng nghe sự kiện bằng thuộc tính HTML (`onclick`) và phương thức chuẩn `addEventListener()`.',
        ],
        apply: [
          'Tạo nút bấm chuyển đổi qua lại giữa chế độ Sáng và Tối (Light/Dark Mode toggle) cho trang web.',
        ],
      },
    },
    {
      week: 25,
      semester: 2,
      topic: 'Chủ đề F: Tương tác Web với JavaScript',
      lessonName: 'Bài 21: Thực hành Kiểm tra tính hợp lệ dữ liệu Form (Form Validation)',
      periods: 2,
      type: 'PRACTICE',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLd', 'NLe'],
      objectives: {
        know: [
          'Biết các điều kiện kiểm tra dữ liệu: trường không được để trống, mật khẩu tối thiểu 8 ký tự, định dạng email chuẩn.',
        ],
        understand: [
          'Hiểu cách ngăn chặn hành vi gửi dữ liệu mặc định của form bằng `event.preventDefault()` khi phát hiện lỗi.',
        ],
        apply: [
          'Viết mã JavaScript kiểm tra toàn bộ dữ liệu form đăng ký, hiển thị thông báo lỗi màu đỏ ngay dưới ô nhập bị sai.',
        ],
      },
    },
    {
      week: 26,
      semester: 2,
      topic: 'Ôn tập & Đánh giá',
      lessonName: 'Ôn tập Kiểm tra Đánh giá Giữa học kỳ 2',
      periods: 2,
      type: 'REVIEW',
      competencies: ['NLc', 'NLd'],
      objectives: {
        know: ['Ôn tập các kỹ thuật bố cục Flexbox, Grid, Responsive và cú pháp tương tác DOM/Sự kiện JavaScript.'],
        understand: ['Phân tích câu hỏi trắc nghiệm Đúng/Sai đa ý và các bài tập đọc hiểu luồng xử lý mã nguồn JS.'],
        apply: ['Thực hành giải bộ đề kiểm tra giữa kỳ 2 chuẩn ma trận CV 7991.'],
      },
    },
    {
      week: 27,
      semester: 2,
      topic: 'Kiểm tra Đánh giá',
      lessonName: 'KIỂM TRA ĐÁNH GIÁ GIỮA HỌC KỲ 2 (45 phút)',
      periods: 2,
      type: 'MIDTERM',
      competencies: ['NLa', 'NLb', 'NLc', 'NLd', 'NLe'],
    },

    // CHỦ ĐỀ DỰ ÁN HỌC TẬP: PHÁT TRIỂN VÀ XUẤT BẢN WEBSITE THỰC TẾ
    {
      week: 28,
      semester: 2,
      topic: 'Dự án Website thực tế',
      lessonName: 'Bài 22: Dự án Website: Lập kế hoạch, Phân tích yêu cầu và Thiết kế Wireframe',
      periods: 2,
      type: 'PROJECT',
      competencies: ['NLb', 'NLc', 'NLd', 'NLe'],
      objectives: {
        know: [
          'Nắm được các giai đoạn vòng đời phát triển một website từ lên ý tưởng, phác thảo đến triển khai và vận hành.',
        ],
        understand: [
          'Hiểu cách vẽ sơ đồ phân cấp trang (Sitemap) và bản vẽ bố cục khung xương thô (Wireframe) trước khi viết mã.',
        ],
        apply: [
          'Hoạt động nhóm 3-4 học sinh, chọn đề tài dự án (Website Trường học, CLB Thể thao, Giới thiệu Ẩm thực quê hương) và phân công nhiệm vụ.',
        ],
      },
    },
    {
      week: 29,
      semester: 2,
      topic: 'Dự án Website thực tế',
      lessonName: 'Dự án Website: Thực hành Lập trình và Tích hợp mã nguồn (HTML, CSS, JS)',
      periods: 2,
      type: 'PROJECT',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLd', 'NLe'],
      objectives: {
        know: [
          'Quy chuẩn tổ chức thư mục dự án chuyên nghiệp: `index.html`, `css/`, `js/`, `assets/images/`.',
        ],
        understand: [
          'Hiểu cách phối hợp mã nguồn giữa các thành viên và ghép nối giao diện các trang con vào hệ thống chung.',
        ],
        apply: [
          'Lập trình hoàn chỉnh từ 3 đến 5 trang web con có tính liên kết chặt chẽ, hiển thị responsive và có tương tác form.',
        ],
      },
    },
    {
      week: 30,
      semester: 2,
      topic: 'Dự án Website thực tế',
      lessonName: 'Dự án Website: Kiểm thử, Tối ưu SEO và Xuất bản website lên hosting miễn phí',
      periods: 2,
      type: 'PROJECT',
      notes: 'Phòng máy tính',
      competencies: ['NLc', 'NLd', 'NLe'],
      objectives: {
        know: [
          'Biết nền tảng lưu trữ web tĩnh miễn phí GitHub Pages / Vercel.',
          'Các thẻ tối ưu máy tìm kiếm (SEO) cơ bản: `description`, `keywords`, `og:image`.',
        ],
        understand: [
          'Hiểu quy trình đẩy mã nguồn lên kho lưu trữ GitHub và bật tính năng GitHub Pages để phát hành trang web công khai.',
        ],
        apply: [
          'Đưa thành công website dự án của nhóm lên mạng Internet với đường dẫn URL công khai có thể truy cập bằng điện thoại/máy tính.',
        ],
      },
    },
    {
      week: 31,
      semester: 2,
      topic: 'Dự án Website thực tế',
      lessonName: 'Dự án Website: Báo cáo, Thuyết trình sản phẩm và Đánh giá đồng đẳng',
      periods: 2,
      type: 'PROJECT',
      competencies: ['NLb', 'NLd', 'NLe'],
      objectives: {
        know: ['Chuẩn bị kịch bản thuyết trình và slide giới thiệu điểm nổi bật của website.'],
        understand: ['Hiểu các tiêu chí đánh giá sản phẩm: Tính thẩm mỹ, Tính đúng đắn kỹ thuật, Tính sáng tạo và Kỹ năng làm việc nhóm.'],
        apply: ['Đại diện nhóm tự tin thuyết trình demo sản phẩm, tiếp thu phản biện từ thầy cô và bạn bè trong lớp.'],
      },
    },

    // CHỦ ĐỀ G: HƯỚNG NGHIỆP TRONG KỶ NGUYÊN SỐ & ÔN THI TỐT NGHIỆP THPT
    {
      week: 32,
      semester: 2,
      topic: 'Chủ đề G: Hướng nghiệp với Tin học',
      lessonName: 'Bài 23: Các ngành nghề trong lĩnh vực Phát triển Phần mềm và Công nghệ Web',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLa', 'NLb', 'NLe'],
      objectives: {
        know: [
          'Kể tên và phân biệt các vị trí chuyên môn: Lập trình viên Front-End, Back-End, Thiết kế giao diện UI/UX, Kiểm thử phần mềm (Tester), Quản trị hệ thống (DevOps).',
        ],
        understand: [
          'Hiểu lộ trình đào tạo, kỹ năng công nghệ cần tích lũy và cơ hội phát triển nghề nghiệp của từng vị trí.',
        ],
        apply: [
          'Lập hồ sơ năng lực cá nhân đối chiếu với tiêu chuẩn tuyển dụng cơ bản của các doanh nghiệp công nghệ.',
        ],
      },
    },
    {
      week: 33,
      semester: 2,
      topic: 'Chủ đề G: Hướng nghiệp với Tin học',
      lessonName: 'Bài 24: Định hướng nghề nghiệp tương lai trong kỷ nguyên Trí tuệ nhân tạo',
      periods: 2,
      type: 'LESSON',
      competencies: ['NLb', 'NLe'],
      objectives: {
        know: [
          'Nêu được những biến đổi sâu sắc của thị trường lao động dưới sự tác động của AI tự động hóa.',
        ],
        understand: [
          'Hiểu tầm quan trọng của tinh thần học tập suốt đời (Lifelong Learning) và việc rèn luyện tư duy phản biện, kỹ năng mềm không thể thay thế bởi AI.',
        ],
        apply: [
          'Xây dựng kế hoạch học tập và phát triển bản thân định hướng ngành nghề cho giai đoạn Đại học / Cao đẳng sau THPT.',
        ],
      },
    },
    {
      week: 34,
      semester: 2,
      topic: 'Ôn tập & Đánh giá',
      lessonName: 'Ôn tập tổng kết môn Tin học THPT & Luyện đề chuẩn định dạng Tốt nghiệp',
      periods: 2,
      type: 'REVIEW',
      competencies: ['NLa', 'NLb', 'NLc', 'NLd', 'NLe'],
      objectives: {
        know: ['Khái quát hóa toàn diện hệ thống kiến thức Tin học THPT theo chuẩn chương trình GDPT 2018.'],
        understand: ['Nắm chắc chiến thuật làm bài trắc nghiệm 3 dạng thức mới: Nhiều lựa chọn, Đúng/Sai đa ý và Trả lời ngắn.'],
        apply: ['Giải đề thi minh họa Tốt nghiệp THPT môn Tin học với tốc độ và độ chính xác cao.'],
      },
    },
    {
      week: 35,
      semester: 2,
      topic: 'Kiểm tra Đánh giá',
      lessonName: 'KIỂM TRA ĐÁNH GIÁ CUỐI HỌC KỲ 2 (45 phút)',
      periods: 2,
      type: 'FINAL',
      competencies: ['NLa', 'NLb', 'NLc', 'NLd', 'NLe'],
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
