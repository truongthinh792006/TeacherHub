import { saveAs } from 'file-saver';
import {
  DepartmentMeetingRecord,
  LessonEvaluationRecord,
  TeacherAssignmentRecord,
  PPCTPlan,
} from '../../types';

/**
 * Downloads formatted HTML document as a Word-compatible file (.doc / .docx)
 * with strict Vietnamese administrative formatting (A4 margins, Times New Roman, 13pt).
 */
export function downloadWordDocument(
  filename: string,
  htmlContent: string,
  docTitle: string = 'VĂN BẢN CHUYÊN MÔN',
) {
  const fileString = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${docTitle}</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page Section1 {
  size: 21.0cm 29.7cm;
  margin: 2.0cm 2.0cm 2.0cm 2.5cm;
  mso-header-margin: 35.4pt;
  mso-footer-margin: 35.4pt;
  mso-paper-source: 0;
}
div.Section1 { page: Section1; }
body {
  font-family: 'Times New Roman', Times, serif;
  font-size: 13pt;
  line-height: 1.35;
  color: #000000;
}
h1, h2, h3, h4 {
  font-family: 'Times New Roman', Times, serif;
  margin-top: 6pt;
  margin-bottom: 4pt;
}
h1 { font-size: 14pt; text-align: center; text-transform: uppercase; font-weight: bold; }
h2 { font-size: 13pt; font-weight: bold; margin-top: 10pt; }
h3 { font-size: 13pt; font-style: italic; font-weight: bold; }
p { margin-top: 0pt; margin-bottom: 4pt; text-align: justify; }
table {
  border-collapse: collapse;
  width: 100%;
  margin-top: 6pt;
  margin-bottom: 6pt;
}
th, td {
  border: 1pt solid #000000;
  padding: 5pt 6pt;
  font-size: 12pt;
  vertical-align: top;
}
th {
  background-color: #f2f2f2;
  font-weight: bold;
  text-align: center;
}
.header-table td {
  border: none;
  padding: 0pt 4pt;
}
.signature-table td {
  border: none;
  text-align: center;
  padding: 8pt 4pt;
  vertical-align: top;
}
.center { text-align: center; }
.bold { font-weight: bold; }
.italic { font-style: italic; }
.uppercase { text-transform: uppercase; }
.line-divider {
  width: 40%;
  border-top: 1pt solid #000;
  margin: 3pt auto 8pt auto;
}
</style>
</head>
<body>
<div class="Section1">
${htmlContent}
</div>
</body>
</html>`;

  const blob = new Blob(['\ufeff' + fileString], {
    type: 'application/msword;charset=utf-8',
  });
  const cleanName = filename.endsWith('.doc') || filename.endsWith('.docx') ? filename : `${filename}.doc`;
  saveAs(blob, cleanName);
}

/**
 * Copies rich text HTML to clipboard so teachers can paste directly into Word or Google Docs.
 */
export async function copyRichText(htmlContent: string): Promise<boolean> {
  try {
    const blobHtml = new Blob([htmlContent], { type: 'text/html' });
    const textPlain = htmlContent.replace(/<[^>]+>/g, '');
    const blobText = new Blob([textPlain], { type: 'text/plain' });

    const clipboardItem = new ClipboardItem({
      'text/html': blobHtml,
      'text/plain': blobText,
    });
    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (err) {
    console.warn('ClipboardItem not supported, falling back to text copy', err);
    await navigator.clipboard.writeText(htmlContent.replace(/<[^>]+>/g, ''));
    return false;
  }
}

// =================================================================
// 1. BIÊN BẢN HỌP TỔ CHUYÊN MÔN
// =================================================================
export function exportMeetingMinutesWord(
  meeting: DepartmentMeetingRecord,
  schoolName: string = 'TRƯỜNG THPT',
  deptName: string = 'TỔ TIN HỌC - CÔNG NGHỆ',
) {
  const topicLabel =
    meeting.topic === 'LESSON_STUDY'
      ? 'Sinh hoạt chuyên môn theo Nghiên cứu bài học'
      : meeting.topic === 'EXAM_MATRIX'
      ? 'Xây dựng ma trận & đặc tả đề kiểm tra định kỳ'
      : meeting.topic === 'SPECIALIZED_TOPIC'
      ? 'Chuyên đề chuyên môn & Đổi mới phương pháp'
      : 'Họp tổ định kỳ';

  const html = `
<table class="header-table" style="width: 100%;">
  <tr>
    <td style="width: 45%; text-align: center;">
      <p class="uppercase">${schoolName}</p>
      <p class="bold uppercase">${deptName}</p>
      <div class="line-divider"></div>
    </td>
    <td style="width: 55%; text-align: center;">
      <p class="bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
      <p class="bold italic">Độc lập - Tự do - Hạnh phúc</p>
      <div class="line-divider"></div>
    </td>
  </tr>
</table>

<h1 style="margin-top: 18pt;">BIÊN BẢN SINH HOẠT TỔ CHUYÊN MÔN</h1>
<p class="center italic">Nội dung: ${meeting.title}</p>
<p class="center italic">(Chủ đề: ${topicLabel})</p>

<p style="margin-top: 14pt;"><strong>I. THỜI GIAN VÀ ĐỊA ĐIỂM:</strong></p>
<p>- Thời gian: ${meeting.time || '14 giờ 00 phút'}, ngày ${meeting.date}</p>
<p>- Địa điểm: ${meeting.location || 'Phòng hội đồng / Phòng máy tính tổ'}</p>

<p style="margin-top: 8pt;"><strong>II. THÀNH PHẦN THAM DỰ:</strong></p>
<p>- Chủ trì: <strong>${meeting.chair}</strong> (Tổ trưởng chuyên môn)</p>
<p>- Thư ký: <strong>${meeting.secretary}</strong></p>
<p>- Thành viên tham dự: ${meeting.attendees || 'Đầy đủ các thành viên trong tổ'}</p>
<p>- Vắng mặt: ${meeting.absent || 'Không'}</p>

<p style="margin-top: 8pt;"><strong>III. NỘI DUNG SINH HOẠT CHUYÊN MÔN:</strong></p>
<div style="text-align: justify; margin-left: 10pt; line-height: 1.4;">
${meeting.content
  .split('\n')
  .map((p) => `<p>${p}</p>`)
  .join('')}
</div>

<p style="margin-top: 8pt;"><strong>IV. KẾT LUẬN VÀ NGHỊ QUYẾT CỦA TỔ:</strong></p>
<div style="text-align: justify; margin-left: 10pt; line-height: 1.4;">
${meeting.resolutions
  .split('\n')
  .map((p) => `<p>• ${p}</p>`)
  .join('')}
</div>

${
  meeting.assignments
    ? `<p style="margin-top: 8pt;"><strong>V. PHÂN CÔNG NHIỆM VỤ:</strong></p>
<div style="text-align: justify; margin-left: 10pt;">
${meeting.assignments
  .split('\n')
  .map((p) => `<p>- ${p}</p>`)
  .join('')}
</div>`
    : ''
}

<p style="margin-top: 8pt;">${
    meeting.nextMeetingDate ? `Kế hoạch cuộc họp tiếp theo: Ngày ${meeting.nextMeetingDate}` : ''
  }</p>
<p>Cuộc họp kết thúc vào lúc 16 giờ 30 phút cùng ngày. Biên bản đã được thông qua toàn thể tổ viên nhất trí 100%.</p>

<table class="signature-table" style="width: 100%; margin-top: 25pt;">
  <tr>
    <td style="width: 50%;">
      <p class="bold uppercase">THƯ KÝ CUỘC HỌP</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 60pt;"></div>
      <p class="bold">${meeting.secretary}</p>
    </td>
    <td style="width: 50%;">
      <p class="bold uppercase">TỔ TRƯỞNG CHUYÊN MÔN</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 60pt;"></div>
      <p class="bold">${meeting.chair}</p>
    </td>
  </tr>
</table>
`;

  const cleanDate = meeting.date.replace(/[^0-9]/g, '');
  downloadWordDocument(`BienBanHopTo_${cleanDate || 'TinHoc'}.doc`, html, meeting.title);
}

// =================================================================
// 2. PHIẾU ĐÁNH GIÁ TIẾT DẠY (DỰ GIỜ THEO CV 5555 / 10221)
// =================================================================
export function exportLessonEvaluationWord(
  evalRec: LessonEvaluationRecord,
  schoolName: string = 'TRƯỜNG THPT',
  deptName: string = 'TỔ TIN HỌC - CÔNG NGHỆ',
) {
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

  const html = `
<table class="header-table" style="width: 100%;">
  <tr>
    <td style="width: 45%; text-align: center;">
      <p class="uppercase">${schoolName}</p>
      <p class="bold uppercase">${deptName}</p>
      <div class="line-divider"></div>
    </td>
    <td style="width: 55%; text-align: center;">
      <p class="bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
      <p class="bold italic">Độc lập - Tự do - Hạnh phúc</p>
      <div class="line-divider"></div>
    </td>
  </tr>
</table>

<h1 style="margin-top: 15pt;">PHIẾU ĐÁNH GIÁ TIẾT DẠY</h1>
<p class="center italic">(Kèm theo Công văn số 5555/BGDĐT-GDTrH của Bộ GD&ĐT)</p>

<p style="margin-top: 14pt;"><strong>1. THÔNG TIN TIẾT DẠY:</strong></p>
<table style="border: none; width: 100%;">
  <tr style="border: none;">
    <td style="border: none; width: 50%;">Họ và tên người dạy: <strong>${evalRec.teacherName}</strong></td>
    <td style="border: none; width: 50%;">Họ và tên người dự: <strong>${evalRec.observerName}</strong></td>
  </tr>
  <tr style="border: none;">
    <td style="border: none;">Lớp dạy: <strong>${evalRec.className}</strong> (Tiết: ${evalRec.period})</td>
    <td style="border: none;">Ngày dạy: <strong>${evalRec.date}</strong></td>
  </tr>
  <tr style="border: none;">
    <td style="border: none;" colspan="2">Tên bài học / Tiết dạy: <strong>${evalRec.lessonName}</strong></td>
  </tr>
</table>

<p style="margin-top: 10pt;"><strong>2. KẾT QUẢ ĐÁNH GIÁ CÁC TIÊU CHÍ (Thang điểm 20.0):</strong></p>
<table>
  <thead>
    <tr>
      <th style="width: 10%;">TT</th>
      <th style="width: 65%;">Nội dung tiêu chí đánh giá</th>
      <th style="width: 25%;">Điểm đạt</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="center">1</td>
      <td><strong>Kế hoạch và tài liệu dạy học</strong><br>
      <span class="italic">- Mức độ phù hợp của chuỗi hoạt động dạy học với mục tiêu, nội dung, PPDH.<br>
      - Mức độ rõ ràng của mục tiêu, nội dung, sản phẩm, kỹ thuật tổ chức từng hoạt động.</span></td>
      <td class="center bold">${evalRec.scorePlanning.toFixed(1)} / 5.0</td>
    </tr>
    <tr>
      <td class="center">2</td>
      <td><strong>Tổ chức hoạt động dạy học của giáo viên</strong><br>
      <span class="italic">- Mức độ sinh động, hấp dẫn của phương pháp và hình thức chuyển giao nhiệm vụ.<br>
      - Khả năng theo dõi, quan sát, phát hiện kịp thời những khó khăn của học sinh.<br>
      - Mức độ hiệu quả của việc hỗ trợ học sinh giải quyết vấn đề và đánh giá nhận xét.</span></td>
      <td class="center bold">${evalRec.scoreTeacherActivity.toFixed(1)} / 5.0</td>
    </tr>
    <tr>
      <td class="center">3</td>
      <td><strong>Hoạt động học của học sinh</strong><br>
      <span class="italic">- Mức độ tích cực, chủ động, sáng tạo và hợp tác trong thực hiện nhiệm vụ học tập.<br>
      - Mức độ tham gia tích cực của học sinh trong trình bày, trao đổi, thảo luận.<br>
      - Mức độ chính xác, phù hợp của các kết quả thực hiện nhiệm vụ học tập.</span></td>
      <td class="center bold">${evalRec.scoreStudentActivity.toFixed(1)} / 5.0</td>
    </tr>
    <tr>
      <td class="center">4</td>
      <td><strong>Hiệu quả của tiết dạy</strong><br>
      <span class="italic">- Mức độ đạt được mục tiêu bài học về phẩm chất, năng lực của học sinh.<br>
      - Mức độ học sinh nắm vững kiến thức và kỹ năng thực hành thao tác trên máy tính.</span></td>
      <td class="center bold">${evalRec.scoreEffectiveness.toFixed(1)} / 5.0</td>
    </tr>
    <tr style="background-color: #f8f9fa;">
      <td class="center bold" colspan="2" style="text-align: right;">TỔNG CỘNG ĐIỂM & XẾP LOẠI TIẾT DẠY:</td>
      <td class="center bold" style="font-size: 13pt;">
        ${evalRec.totalScore.toFixed(1)} / 20.0<br>
        (${getRatingText(evalRec.rating)})
      </td>
    </tr>
  </tbody>
</table>

<p style="margin-top: 10pt;"><strong>3. NHẬN XÉT, ĐÁNH GIÁ CHUNG:</strong></p>
<p><strong>a) Ưu điểm nổi bật:</strong></p>
<p style="margin-left: 10pt;">${evalRec.strengths || 'Nắm vững kiến thức chuyên môn, học sinh tích cực tương tác và thực hành nghiêm túc.'}</p>

<p><strong>b) Tồn tại, hạn chế cần khắc phục:</strong></p>
<p style="margin-left: 10pt;">${evalRec.weaknesses || 'Cần phân bổ thời gian hợp lý hơn giữa phần lý thuyết và luyện tập thực hành trên máy.'}</p>

<p><strong>c) Đề xuất, tư vấn chuyên môn:</strong></p>
<p style="margin-left: 10pt;">${evalRec.recommendations || 'Tăng cường ứng dụng các câu hỏi trắc nghiệm tương tác và phiếu học tập số hóa.'}</p>

<table class="signature-table" style="width: 100%; margin-top: 20pt;">
  <tr>
    <td style="width: 50%;">
      <p class="bold uppercase">NGƯỜI DẠY</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 60pt;"></div>
      <p class="bold">${evalRec.teacherName}</p>
    </td>
    <td style="width: 50%;">
      <p class="bold uppercase">NGƯỜI DỰ GIỜ</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 60pt;"></div>
      <p class="bold">${evalRec.observerName}</p>
    </td>
  </tr>
</table>
`;

  downloadWordDocument(
    `PhieuDuGio_${evalRec.teacherName.replace(/\s+/g, '')}_${evalRec.date.replace(/[^0-9]/g, '')}.doc`,
    html,
    'PHIẾU ĐÁNH GIÁ TIẾT DẠY',
  );
}

// =================================================================
// 3. KẾ HOẠCH DẠY HỌC TỔ CHUYÊN MÔN (PHỤ LỤC 1 - CV 5512)
// =================================================================
export function exportAppendix1Word(
  plans: PPCTPlan[],
  schoolName: string = 'TRƯỜNG THPT',
  deptName: string = 'TỔ TIN HỌC - CÔNG NGHỆ',
  year: string = '2024 - 2025',
) {
  const plan10 = plans.find((p) => p.grade === '10');
  const plan11 = plans.find((p) => p.grade === '11');
  const plan12 = plans.find((p) => p.grade === '12');

  const html = `
<table class="header-table" style="width: 100%;">
  <tr>
    <td style="width: 45%; text-align: center;">
      <p class="uppercase">${schoolName}</p>
      <p class="bold uppercase">${deptName}</p>
      <div class="line-divider"></div>
    </td>
    <td style="width: 55%; text-align: center;">
      <p class="bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
      <p class="bold italic">Độc lập - Tự do - Hạnh phúc</p>
      <div class="line-divider"></div>
    </td>
  </tr>
</table>

<h1 style="margin-top: 18pt;">KẾ HOẠCH DẠY HỌC CỦA TỔ CHUYÊN MÔN</h1>
<p class="center bold uppercase">MÔN TIN HỌC - NĂM HỌC ${year}</p>
<p class="center italic">(Ban hành kèm theo Phụ lục 1, Công văn số 5512/BGDĐT-GDTrH)</p>

<h2>I. KHUNG KẾ HOẠCH DẠY HỌC CÁC KHỐI LỚP (GDPT 2018):</h2>

<h3>1. Khối lớp 10 (Chương trình chuẩn):</h3>
<p>- Thời lượng: 70 tiết / 35 tuần (Học kỳ I: 18 tuần x 2 tiết = 36 tiết; Học kỳ II: 17 tuần x 2 tiết = 34 tiết).</p>
<p>- Số lượng bài học dự kiến: ${plan10?.lessons.length || 35} bài học và hoạt động giáo dục.</p>

<h3>2. Khối lớp 11 (Định hướng Tin học Ứng dụng & Khoa học máy tính):</h3>
<p>- Thời lượng: 70 tiết / 35 tuần (Học kỳ I: 36 tiết; Học kỳ II: 34 tiết).</p>
<p>- Số lượng bài học dự kiến: ${plan11?.lessons.length || 35} bài học.</p>

<h3>3. Khối lớp 12 (Bộ sách Kết nối tri thức với cuộc sống - Định hướng ICT):</h3>
<p>- Thời lượng: 70 tiết / 35 tuần.</p>
<p>- Cấu trúc chương trình: 28 bài học SGK chuẩn GDPT 2018 (Chủ đề 1 đến Chủ đề 7).</p>

<h2>II. KẾ HOẠCH THIẾT BỊ DẠY HỌC VÀ PHÒNG MÁY TÍNH THỰC HÀNH:</h2>
<table>
  <thead>
    <tr>
      <th style="width: 8%;">STT</th>
      <th style="width: 32%;">Tên thiết bị / Phòng thực hành</th>
      <th style="width: 15%;">Số lượng</th>
      <th style="width: 25%;">Tình trạng kỹ thuật</th>
      <th style="width: 20%;">Phục vụ bài học / Khối</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="center">1</td>
      <td><strong>Phòng máy tính số 1</strong> (45 máy trạm + 1 máy chủ giáo viên)</td>
      <td class="center">46 máy</td>
      <td>Hoạt động tốt, kết nối mạng LAN/Internet cáp quang 150Mbps</td>
      <td>Thực hành Tin 10, 11, 12</td>
    </tr>
    <tr>
      <td class="center">2</td>
      <td><strong>Phòng máy tính số 2</strong> (40 máy trạm + 1 máy chủ giáo viên)</td>
      <td class="center">41 máy</td>
      <td>Hoạt động ổn định, cài đặt đầy đủ Python, VS Code, Office</td>
      <td>Thực hành Tin 10, 12 (ICT)</td>
    </tr>
    <tr>
      <td class="center">3</td>
      <td><strong>Thiết bị mạng thực hành</strong> (Switch, Router Wi-Fi, Cáp mạng)</td>
      <td class="center">04 bộ</td>
      <td>Đảm bảo chuẩn kết nối thực hành bấm cáp và cấu hình Wi-Fi</td>
      <td>Tin 12 (Bài 3, 4, 5, 22)</td>
    </tr>
    <tr>
      <td class="center">4</td>
      <td><strong>Máy chiếu / Màn hình tương tác thông minh</strong></td>
      <td class="center">02 bộ</td>
      <td>Độ nét cao, phục vụ trình chiếu bài giảng điện tử số hóa</td>
      <td>Các tiết lý thuyết tại phòng bộ môn</td>
    </tr>
  </tbody>
</table>

<h2>III. KẾ HOẠCH KIỂM TRA, ĐÁNH GIÁ ĐỊNH KỲ (CV 7991/BGDĐT-GDTrH):</h2>
<table>
  <thead>
    <tr>
      <th style="width: 20%;">Bài kiểm tra</th>
      <th style="width: 15%;">Thời gian (Tuần)</th>
      <th style="width: 15%;">Thời lượng</th>
      <th style="width: 25%;">Hình thức kiểm tra</th>
      <th style="width: 25%;">Địa điểm thực hiện</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Giữa Học kỳ I</strong></td>
      <td class="center">Tuần 9 - 10</td>
      <td class="center">45 phút</td>
      <td>Trắc nghiệm 3 dạng thức khách quan trên giấy hoặc máy tính</td>
      <td>Phòng máy tính / Lớp học</td>
    </tr>
    <tr>
      <td><strong>Cuối Học kỳ I</strong></td>
      <td class="center">Tuần 18</td>
      <td class="center">45 phút</td>
      <td>Trắc nghiệm 3 dạng thức kết hợp thực hành sản phẩm</td>
      <td>Phòng máy tính</td>
    </tr>
    <tr>
      <td><strong>Giữa Học kỳ II</strong></td>
      <td class="center">Tuần 26 - 28</td>
      <td class="center">45 phút</td>
      <td>Trắc nghiệm định dạng đề thi tốt nghiệp THPT 2025</td>
      <td>Phòng máy tính</td>
    </tr>
    <tr>
      <td><strong>Cuối Học kỳ II</strong></td>
      <td class="center">Tuần 33 - 35</td>
      <td class="center">45 phút</td>
      <td>Kiểm tra tổng hợp kiến thức cả năm</td>
      <td>Phòng máy tính</td>
    </tr>
  </tbody>
</table>

<table class="signature-table" style="width: 100%; margin-top: 25pt;">
  <tr>
    <td style="width: 50%;">
      <p class="bold uppercase">HIỆU TRƯỞNG DUYỆT</p>
      <p class="italic">(Ký, đóng dấu và ghi rõ họ tên)</p>
      <div style="height: 60pt;"></div>
    </td>
    <td style="width: 50%;">
      <p class="bold uppercase">TỔ TRƯỞNG CHUYÊN MÔN</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 60pt;"></div>
    </td>
  </tr>
</table>
`;

  downloadWordDocument(`KeHoachDayHoc_ToChuyenMon_PhuLuc1_${year.replace(/\s+/g, '')}.doc`, html, 'KẾ HOẠCH DẠY HỌC TỔ CHUYÊN MÔN');
}

// =================================================================
// 4. KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN (PHỤ LỤC 2 - CV 5512)
// =================================================================
export function exportAppendix2Word(
  teacher: TeacherAssignmentRecord,
  schoolName: string = 'TRƯỜNG THPT',
  deptName: string = 'TỔ TIN HỌC - CÔNG NGHỆ',
  year: string = '2024 - 2025',
) {
  const html = `
<table class="header-table" style="width: 100%;">
  <tr>
    <td style="width: 45%; text-align: center;">
      <p class="uppercase">${schoolName}</p>
      <p class="bold uppercase">${deptName}</p>
      <div class="line-divider"></div>
    </td>
    <td style="width: 55%; text-align: center;">
      <p class="bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
      <p class="bold italic">Độc lập - Tự do - Hạnh phúc</p>
      <div class="line-divider"></div>
    </td>
  </tr>
</table>

<h1 style="margin-top: 18pt;">KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN</h1>
<p class="center bold uppercase">MÔN TIN HỌC - NĂM HỌC ${year}</p>
<p class="center italic">(Ban hành kèm theo Phụ lục 2, Công văn số 5512/BGDĐT-GDTrH)</p>

<p style="margin-top: 14pt;">Họ và tên giáo viên: <strong>${teacher.teacherName}</strong></p>
<p>Tổ chuyên môn: <strong>${deptName}</strong></p>
<p>Nhiệm vụ được phân công: <strong>Giảng dạy môn Tin học (${teacher.assignedClasses})</strong></p>

<h2>I. KẾ HOẠCH DẠY HỌC:</h2>
<p>- Phân công giảng dạy các lớp: <strong>${teacher.assignedClasses}</strong></p>
<p>- Định mức số tiết thực dạy: <strong>${teacher.periodsPerWeek} tiết / tuần</strong> (tổng cộng ${teacher.periodsPerWeek * 35} tiết / năm học).</p>
<p>- Lịch bố trí phòng máy thực hành: <strong>${teacher.labSchedule || 'Theo thời khóa biểu nhà trường'}</strong></p>

<h2>II. NHIỆM VỤ GIÁO DỤC KHÁC:</h2>
<p><strong>1. Công tác bồi dưỡng học sinh giỏi & phụ đạo học sinh:</strong></p>
<p>- Tham gia tuyển chọn, bồi dưỡng đội tuyển học sinh giỏi môn Tin học cấp trường và cấp tỉnh.</p>
<p>- Lập kế hoạch phụ đạo, củng cố kiến thức cho nhóm học sinh còn gặp khó khăn trong lập trình và thực hành máy tính.</p>

<p><strong>2. Công tác quản trị và ứng dụng công nghệ thông tin:</strong></p>
<p>- Tham gia quản lý, bảo dưỡng định kỳ hệ thống máy tính, mạng LAN phòng máy được phân công.</p>
<p>- ${teacher.notes || 'Thực hiện đầy đủ quy chế chuyên môn, tham gia đổi mới phương pháp dạy học số hóa.'}</p>

<p><strong>3. Hoạt động tự học và nâng cao trình độ chuyên môn:</strong></p>
<p>- Tham gia đầy đủ các đợt tập huấn chương trình GDPT 2018 và chuyển đổi số trong giáo dục.</p>
<p>- Tích cực dự giờ đồng nghiệp (tối thiểu 1 tiết/tuần) và tham gia sinh hoạt chuyên môn theo Nghiên cứu bài học.</p>

<table class="signature-table" style="width: 100%; margin-top: 25pt;">
  <tr>
    <td style="width: 50%;">
      <p class="bold uppercase">TỔ TRƯỞNG CHUYÊN MÔN DUYỆT</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 55pt;"></div>
    </td>
    <td style="width: 50%;">
      <p class="bold uppercase">GIÁO VIÊN LẬP KẾ HOẠCH</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 55pt;"></div>
      <p class="bold">${teacher.teacherName}</p>
    </td>
  </tr>
</table>
`;

  downloadWordDocument(
    `PhuLuc2_KeHoachGiaoVien_${teacher.teacherName.replace(/\s+/g, '')}_${year.replace(/\s+/g, '')}.doc`,
    html,
    'KẾ HOẠCH GIÁO DỤC CỦA GIÁO VIÊN',
  );
}

// =================================================================
// 5. KẾ HOẠCH BÀI DẠY (GIÁO ÁN CHUẨN 4 HOẠT ĐỘNG CV 5512)
// =================================================================
export function exportLessonPlan5512Word(
  lessonName: string,
  grade: string,
  duration: string = '2 tiết (90 phút)',
  objectives?: { know?: string[]; understand?: string[]; apply?: string[] },
  competencies?: string[],
  schoolName: string = 'TRƯỜNG THPT',
  deptName: string = 'TỔ TIN HỌC - CÔNG NGHỆ',
) {
  const knowList =
    objectives?.know && objectives.know.length > 0
      ? objectives.know.map((k) => `<li>${k}</li>`).join('')
      : '<li>Nêu được các khái niệm và nguyên lý cơ bản của bài học.</li>';

  const understandList =
    objectives?.understand && objectives.understand.length > 0
      ? objectives.understand.map((u) => `<li>${u}</li>`).join('')
      : '<li>Hiểu rõ quy trình, cú pháp và các thành phần cốt lõi.</li>';

  const applyList =
    objectives?.apply && objectives.apply.length > 0
      ? objectives.apply.map((a) => `<li>${a}</li>`).join('')
      : '<li>Vận dụng giải quyết các bài toán và tình huống thực hành trên máy tính.</li>';

  const compList =
    competencies && competencies.length > 0
      ? competencies.join(', ')
      : 'NLc, NLa, NLe';

  const html = `
<table class="header-table" style="width: 100%;">
  <tr>
    <td style="width: 45%; text-align: center;">
      <p class="uppercase">${schoolName}</p>
      <p class="bold uppercase">${deptName}</p>
      <div class="line-divider"></div>
    </td>
    <td style="width: 55%; text-align: center;">
      <p class="bold uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
      <p class="bold italic">Độc lập - Tự do - Hạnh phúc</p>
      <div class="line-divider"></div>
    </td>
  </tr>
</table>

<h1 style="margin-top: 15pt;">KẾ HOẠCH BÀI DẠY (GIÁO ÁN)</h1>
<p class="center bold uppercase" style="font-size: 13pt;">${lessonName}</p>
<p class="center italic">Môn học: Tin học - Lớp: ${grade} | Thời lượng: ${duration}</p>
<p class="center italic">(Theo cấu trúc chuẩn Công văn số 5512/BGDĐT-GDTrH của Bộ GD&ĐT)</p>

<h2>I. MỤC TIÊU BÀI HỌC:</h2>
<p><strong>1. Về kiến thức:</strong> Sau khi học xong bài này, học sinh:</p>
<ul>
  ${knowList}
  ${understandList}
</ul>

<p><strong>2. Về năng lực:</strong></p>
<p>- <em>Năng lực chung:</em> Tự chủ và tự học; Giao tiếp và hợp tác; Giải quyết vấn đề và sáng tạo.</p>
<p>- <em>Năng lực Tin học đặc thù (${compList}):</em></p>
<ul>
  ${applyList}
</ul>

<p><strong>3. Về phẩm chất:</strong> Chăm chỉ, trung thực và có tinh thần trách nhiệm, bảo vệ tài sản trong giờ thực hành phòng máy vi tính.</p>

<h2>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:</h2>
<p>- <strong>Giáo viên:</strong> Kế hoạch bài dạy, bài giảng điện tử số hóa (Slide), phòng máy vi tính kết nối mạng LAN/Internet, mã nguồn mẫu, máy chiếu hoặc màn hình tương tác, phiếu học tập.</p>
<p>- <strong>Học sinh:</strong> Sách giáo khoa Tin học ${grade}, vở ghi chép, đọc trước bài học ở nhà.</p>

<h2>III. TIẾN TRÌNH DẠY HỌC (CHUẨN 4 HOẠT ĐỘNG):</h2>

<h3>HOẠT ĐỘNG 1: KHỞI ĐỘNG (5 - 7 phút)</h3>
<p><strong>a) Mục tiêu:</strong> Tạo tâm thế học tập hứng khởi, kết nối trải nghiệm thực tiễn của học sinh vào bài học mới.</p>
<p><strong>b) Nội dung:</strong> Giáo viên đặt câu hỏi gợi mở hoặc nêu tình huống thực tế thường gặp; học sinh quan sát, suy nghĩ và trả lời.</p>
<p><strong>c) Sản phẩm:</strong> Câu trả lời miệng hoặc ý kiến phản hồi nhanh của học sinh.</p>
<p><strong>d) Tổ chức thực hiện:</strong></p>
<p>- <em>Bước 1 (Chuyển giao):</em> GV trình chiếu tình huống mở đầu và nêu câu hỏi định hướng.</p>
<p>- <em>Bước 2 (Thực hiện):</em> HS suy nghĩ độc lập trong 1-2 phút hoặc trao đổi theo cặp.</p>
<p>- <em>Bước 3 (Báo cáo):</em> Đại diện một số học sinh xung phong trả lời.</p>
<p>- <em>Bước 4 (Kết luận):</em> GV nhận xét, tổng hợp và khéo léo dẫn dắt vào bài học mới.</p>

<h3>HOẠT ĐỘNG 2: HÌNH THÀNH KIẾN THỨC MỚI (18 - 20 phút)</h3>
<p><strong>a) Mục tiêu:</strong> Học sinh nắm vững các khái niệm, quy tắc, cú pháp và thao tác kỹ thuật cốt lõi của bài học.</p>
<p><strong>b) Nội dung:</strong> Nghiên cứu tài liệu SGK, theo dõi giáo viên thị phạm từng thao tác và phân tích các ví dụ minh họa.</p>
<p><strong>c) Sản phẩm:</strong> Vở ghi bài đầy đủ kiến thức trọng tâm và kết quả hoàn thành phiếu học tập.</p>
<p><strong>d) Tổ chức thực hiện:</strong></p>
<p>- <em>Bước 1 (Chuyển giao):</em> GV chia nhóm học tập, phát phiếu học tập và giao nhiệm vụ nghiên cứu từng mục nội dung.</p>
<p>- <em>Bước 2 (Thực hiện):</em> Các nhóm học sinh đọc SGK, thảo luận sôi nổi và ghi nhận kết quả vào phiếu.</p>
<p>- <em>Bước 3 (Báo cáo):</em> Đại diện các nhóm báo cáo, các nhóm còn lại lắng nghe, nhận xét và phản biện.</p>
<p>- <em>Bước 4 (Kết luận):</em> GV chuẩn hóa kiến thức, giải thích cặn kẽ và chốt các điểm then chốt lên màn hình.</p>

<h3>HOẠT ĐỘNG 3: LUYỆN TẬP VÀ THỰC HÀNH TRÊN MÁY (12 - 15 phút)</h3>
<p><strong>a) Mục tiêu:</strong> Củng cố kiến thức, hình thành kỹ năng thao tác thực tế và sửa các lỗi sai thường gặp.</p>
<p><strong>b) Nội dung:</strong> Học sinh thực hành trực tiếp trên máy tính theo yêu cầu bài tập được giao.</p>
<p><strong>c) Sản phẩm:</strong> Tệp bài làm, mã nguồn chương trình hoặc sản phẩm số hoàn thành chính xác trên máy.</p>
<p><strong>d) Tổ chức thực hiện:</strong></p>
<p>- <em>Bước 1 (Chuyển giao):</em> GV giao bài tập thực hành trên máy kèm theo yêu cầu và thời gian hoàn thành.</p>
<p>- <em>Bước 2 (Thực hiện):</em> HS bật máy tính, thực hiện các thao tác kỹ thuật; GV quan sát và hỗ trợ kịp thời các em gặp khó khăn.</p>
<p>- <em>Bước 3 (Báo cáo):</em> GV lựa chọn một số sản phẩm tiêu biểu chiếu lên màn hình để cả lớp cùng quan sát.</p>
<p>- <em>Bước 4 (Kết luận):</em> GV nhận xét, đánh giá kết quả và hướng dẫn khắc phục các lỗi kỹ thuật phổ biến.</p>

<h3>HOẠT ĐỘNG 4: VẬN DỤNG VÀ TÌM TÒI MỞ RỘNG (3 - 5 phút)</h3>
<p><strong>a) Mục tiêu:</strong> Giúp học sinh khắc sâu kiến thức và biết cách ứng dụng kiến thức vào đời sống thực tế.</p>
<p><strong>b) Nội dung:</strong> Nhiệm vụ giao về nhà hoặc câu hỏi gợi ý nghiên cứu thêm các tài nguyên trực tuyến.</p>
<p><strong>c) Sản phẩm:</strong> Bài thu hoạch nhỏ hoặc sản phẩm số lưu trữ trên đám mây nộp vào buổi học sau.</p>
<p><strong>d) Tổ chức thực hiện:</strong> GV nêu yêu cầu bài tập về nhà, nhắc nhở học sinh chuẩn bị bài học cho tiết tiếp theo.</p>

<table class="signature-table" style="width: 100%; margin-top: 25pt;">
  <tr>
    <td style="width: 50%;">
      <p class="bold uppercase">TỔ TRƯỞNG CHUYÊN MÔN DUYỆT</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 55pt;"></div>
    </td>
    <td style="width: 50%;">
      <p class="bold uppercase">GIÁO VIÊN SOẠN BÀI</p>
      <p class="italic">(Ký và ghi rõ họ tên)</p>
      <div style="height: 55pt;"></div>
    </td>
  </tr>
</table>
`;

  downloadWordDocument(
    `KHBD_5512_${lessonName.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_Lop${grade}.doc`,
    html,
    'KẾ HOẠCH BÀI DẠY CV 5512',
  );
}

