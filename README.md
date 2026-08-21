# Teacher Hub Pro

Ứng dụng web hỗ trợ giáo viên: quản lý công việc, thư viện prompt AI, hồ sơ học sinh, nhật ký và tài liệu. Toàn bộ dữ liệu lưu trong `localStorage` của trình duyệt, không cần server.

Bản chạy trực tiếp: https://truongthinh792006.github.io/TeacherHub/

## Chạy ở máy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # xuất ra dist/
npm run preview
```

## Triển khai

Mỗi lần push lên nhánh `main`, workflow `.github/workflows/deploy.yml` sẽ build và deploy lên GitHub Pages.

Lần đầu cần vào **Settings → Pages → Build and deployment → Source** và chọn **GitHub Actions**.

Đường dẫn Pages là `/TeacherHub/` nên `vite.config.ts` đặt `base: '/TeacherHub/'`. Nếu đổi tên repo hoặc dùng tên miền riêng, cần sửa lại giá trị này.
