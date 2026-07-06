# Hướng Dẫn Quy Chuẩn Màu Sắc (Color Design System)
## AEON POP & VMD Standard

Tài liệu này hướng dẫn chi tiết về hệ màu sắc thương hiệu, mã màu HEX, tên biến CSS và cách áp dụng trên hệ thống **AEON POP & VMD**. Hệ màu sắc này được đồng bộ trực tiếp với nhận diện thương hiệu của AEON Việt Nam để đem lại trải nghiệm chuyên nghiệp, thống nhất và thân thiện.

---

## 1. Màu Sắc Thương Hiệu (Brand Colors)

Đây là dải màu cốt lõi định hình nhận diện của ứng dụng. Tông màu Magenta đặc trưng được sử dụng cho các nút hành động chính, tiêu đề quan trọng và các trạng thái active.

| Ý nghĩa | Tên biến CSS | Mã HEX | Màu trực quan | Ứng dụng |
| :--- | :--- | :--- | :---: | :--- |
| **Màu chủ đạo (Primary)** | `--color-primary` | `#B50081` | 🟥 | Nút chính, tiêu đề trang, icon hoạt động, viền active |
| **Màu di chuột (Hover)** | `--color-primary-hover` | `#930068` | 🟥 | Trạng thái hover của các nút chính, liên kết |
| **Nền sáng chủ đạo** | `--color-primary-light` | `#fdf2fa` | ⬜ | Nền badge trạng thái, nền banner tiêu điểm, dòng chọn |
| **Viền sáng chủ đạo** | `--color-primary-light-border` | `#f9d5ee` | ⬜ | Đường viền badge, viền khối chọn chi nhánh |

---

## 2. Màu Trạng Trạng Thái Hệ Thống (Feedback Colors)

Các màu này dùng để thông tin trực quan cho người dùng biết về các kết quả kiểm tra (Đạt/Không đạt), thông báo cảnh báo hoặc các hành động xóa dữ liệu nguy hiểm.

| Trạng thái | Tên biến CSS | Màu chính | Màu nền | Màu viền | Ứng dụng |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **Thành công / Đạt** | `--color-success` | `#10b981` | `#ecfdf5` | `#a7f3d0` | Kết quả đánh giá POP/VMD "Đạt", Badge "Đã trả" vật tư |
| **Cảnh báo / Nhắc nhở** | `--color-warning` | `#f59e0b` | `#fffbeb` | `#fde68a` | Banner cảnh báo admin, Trạng thái chờ bàn giao |
| **Thất bại / Lỗi** | `--color-error` | `#ef4444` | `#fef2f2` | `#fca5a5` | Kết quả đánh giá "Không đạt", Icon lỗi, Nút xóa dữ liệu |

---

## 3. Màu Trung Tính & Bố Cục (Neutrals & Layout)

Dải màu xám và trung tính giúp tối ưu hóa độ tương phản và tăng cường khả năng đọc dữ liệu trên các bảng biểu cấu hình dài.

| Ý nghĩa | Tên biến CSS | Mã HEX | Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Nền ứng dụng** | `--color-bg-app` | `#f4f5f8` | Toàn bộ nền nền chính của trang web |
| **Nền thẻ (Card)** | `--color-card-bg` | `#ffffff` | Nền của các bảng biểu, biểu đồ, hộp thoại |
| **Màu chữ chính** | `--color-text` | `#1e293b` | Tiêu đề lớn, nội dung bảng, nhãn trường nhập liệu |
| **Màu chữ phụ** | `--color-text-muted` | `#64748b` | Chữ gợi ý, ngày tháng, thông tin phụ, icon nhạt |
| **Đường viền** | `--color-border` | `#e2e8f0` | Viền bảng biểu, viền phân cách các dòng dữ liệu |

---

## 4. Định Nghĩa Trong CSS Hệ Thống

Để chỉnh sửa hoặc bảo trì hệ thống màu sắc này, bạn có thể thay đổi các giá trị biến trong file `:root` của [index.css](file:///Users/thuanvan/DataProject/project_work/aeon/src/index.css):

```css
:root {
  --font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Brand colors */
  --color-primary: #B50081;
  --color-primary-hover: #930068;
  --color-primary-light: #fdf2fa;
  --color-primary-light-border: #f9d5ee;
  
  /* Feedback states */
  --color-success: #10b981;
  --color-success-bg: #ecfdf5;
  --color-success-border: #a7f3d0;
  
  --color-error: #ef4444;
  --color-error-bg: #fef2f2;
  --color-error-border: #fca5a5;
  
  --color-warning: #f59e0b;
  --color-warning-bg: #fffbeb;
  --color-warning-border: #fde68a;
  
  /* Core neutrals */
  --color-bg-app: #f4f5f8;
  --color-card-bg: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-white: #ffffff;
}
```

---

## 5. Quy Chuẩn Font Chữ (Typography)
Hệ thống sử dụng font **Be Vietnam Pro** làm font chữ tiêu chuẩn, được tải trực tiếp từ Google Fonts để hỗ trợ tối đa các ký tự dấu Tiếng Việt:
- **Tiêu đề trang (Module Title):** Font weight `700`, size `1.5rem` - `1.75rem` (màu `--color-text`).
- **Nội dung chính:** Font weight `400` hoặc `500`, size `0.875rem` - `1rem` (màu `--color-text`).
- **Nhãn trường thông tin (Labels):** Font weight `700`, size `0.75rem` viết hoa (màu `--color-text`).
