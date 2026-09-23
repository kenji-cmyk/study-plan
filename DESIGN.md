---
name: "StudyPlanner"
description: "A bright, encouraging study-planning system for turning subject priorities into an actionable monthly rhythm."
colors:
  skyward-blue: "#0393F4"
  skyward-deep: "#1668C4"
  skywash: "#EAF4FF"
  study-ink: "#17304F"
  quiet-slate: "#698DA5"
  cloud-border: "#D8E5F2"
  white-surface: "#FFFFFF"
  cloud-paper: "#F4F8FC"
  error-red: "#D94B4B"
  error-wash: "#FDF2F2"
  success-green: "#10B981"
  success-wash: "#ECFDF5"
  warning-amber: "#F59E0B"
  warning-wash: "#FFFBEB"
typography:
  title:
    fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.45
  caption:
    fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.skyward-blue}"
    textColor: "{colors.white-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.skyward-deep}"
    textColor: "{colors.white-surface}"
  button-secondary:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.study-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  button-danger:
    backgroundColor: "{colors.error-red}"
    textColor: "{colors.white-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "52px"
  card:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.study-ink}"
    rounded: "{rounded.lg}"
    padding: "32px"
  input:
    backgroundColor: "{colors.white-surface}"
    textColor: "{colors.study-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  badge-active:
    backgroundColor: "{colors.success-wash}"
    textColor: "{colors.success-green}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: StudyPlanner

## Overview

**Creative North Star: "Bầu trời học tập"**

StudyPlanner dùng cảm giác của một bầu trời sáng và rộng để biến việc lập lịch thành một khởi đầu tích cực. Các nền xanh rất nhạt tạo khoảng thở, xanh lam rõ ràng đánh dấu hành động và tiến độ, còn lớp chữ xanh navy giữ cho dữ liệu học tập luôn chắc chắn, dễ đọc.

Hệ thống mang tính cách năng động, trẻ trung và giàu động lực nhưng không ồn ào. Mật độ thông tin ở mức thoải mái; bề mặt trắng, góc bo mềm và bóng đổ nhẹ giúp các tác vụ quản lý môn học có cảm giác thân thiện hơn công cụ quản trị truyền thống.

**Key Characteristics:**

- Một accent xanh lam nhất quán cho hành động, focus và trạng thái được chọn.
- Bề mặt trắng nổi nhẹ trên nền xanh mây, kết hợp viền xanh xám mảnh.
- Poppins có trọng lượng vừa đến đậm, tạo cảm giác hiện đại và dễ gần.
- Bo góc rộng và control dạng pill làm mềm các luồng thao tác có cấu trúc.
- Chuyển động ngắn, nâng nhẹ để phản hồi mà không làm gián đoạn công việc.

## Colors

Bảng màu là sự kết hợp giữa xanh trời giàu năng lượng và các neutral xanh lạnh, tạo không khí sáng, tập trung và đáng tin cậy.

### Primary

- **Skyward Blue** (`skyward-blue`): hành động chính, icon thương hiệu, focus và tín hiệu thông tin.
- **Skyward Deep** (`skyward-deep`): trạng thái hover và chữ nhấn cần độ tương phản cao hơn.
- **Skywash** (`skywash`): nền hover, badge và alert thông tin nhẹ.

### Secondary

- **Success Green** (`success-green`) và **Success Wash** (`success-wash`): xác nhận trạng thái hoạt động hoặc hoàn tất.
- **Warning Amber** (`warning-amber`) và **Warning Wash** (`warning-wash`): điều kiện cần chú ý trước khi tạo lịch.
- **Error Red** (`error-red`) và **Error Wash** (`error-wash`): lỗi xác thực, lỗi hệ thống và hành động phá hủy.

### Neutral

- **Study Ink** (`study-ink`): chữ chính, tiêu đề và dữ liệu quan trọng.
- **Quiet Slate** (`quiet-slate`): mô tả, metadata và thông tin thứ cấp.
- **Cloud Border** (`cloud-border`): viền, divider và cấu trúc bảng.
- **White Surface** (`white-surface`): thẻ, dialog, control và phần tử nổi.
- **Cloud Paper** (`cloud-paper`): canvas toàn trang và lớp nền phụ.

### Named Rules

**The Open-Sky Rule.** Dùng Skyward Blue như một tín hiệu có chủ đích cho hành động hoặc trạng thái tương tác; không phủ accent lên các vùng nội dung lớn.

**The Semantic Wash Rule.** Trạng thái thành công, cảnh báo và lỗi luôn ghép màu đậm với nền wash tương ứng, không dùng màu đơn lẻ làm tín hiệu duy nhất.

## Typography

**Display Font:** Poppins (với system sans-serif fallback)  
**Body Font:** Poppins (với system sans-serif fallback)

**Character:** Một sans-serif hình học, tròn vừa đủ để thân thiện nhưng vẫn rõ ràng trong bảng dữ liệu và biểu mẫu. Hệ thống tạo cấp bậc chủ yếu bằng weight và kích thước thay vì đổi font.

### Hierarchy

- **Title** (700, `1.25rem`, line-height `1.2`): tên sản phẩm, tiêu đề màn hình và tiêu đề kết quả kế hoạch.
- **Section heading** (600, `1.25rem`): tiêu đề thẻ và dialog.
- **Body** (500, `1rem`, line-height `1.5`): nội dung chính và câu giải thích.
- **Control** (600, `0.875–0.9375rem`): nút, nhãn form, tab và dữ liệu cần quét nhanh.
- **Caption** (500–600, `0.6875–0.8125rem`): metadata, helper text, badge và chú thích lịch.

### Named Rules

**The Friendly Weight Rule.** Body dùng medium để giữ cảm giác chắc chắn; semibold và bold chỉ dành cho cấu trúc, hành động và dữ liệu cần ưu tiên.

## Layout

Ứng dụng dùng một cột nội dung trung tâm rộng tối đa `1140px`, với khoảng đệm ngang `24px`. Header sticky chia thành thương hiệu, tab điều hướng và thiết lập. Nội dung chính dùng nhịp dọc rộng (`40px` phía trên, `64px` phía dưới), còn các thẻ dùng padding `32px`.

Biểu mẫu chuyển thành grid responsive với cột tối thiểu `220px`; lịch tháng dùng grid tự lấp với thẻ ngày tối thiểu `320px`. Ở `640px` trở xuống, header và thanh hành động xếp dọc, nút trong thanh hành động mở rộng toàn chiều ngang. Bảng dữ liệu được giữ nguyên cấu trúc và cuộn ngang khi cần.

**The Comfortable Rhythm Rule.** Khoảng cách mặc định đi theo nhịp 8px; dùng 24–32px để tách vùng chức năng và 4–12px cho quan hệ gần bên trong component.

## Elevation & Depth

Hệ thống dùng chiều sâu mềm mại, nổi nhẹ: viền mảnh luôn xác định bề mặt, còn bóng navy có độ mờ thấp tạo lớp không khí. Bóng đậm chỉ xuất hiện ở dialog, toast và hành động chính; card lịch nâng khoảng 2–3px khi hover để cho thấy khả năng tương tác.

### Shadow Vocabulary

- **Ambient low** (`0 2px 8px rgba(23, 48, 79, 0.04)`): header, control và thẻ phụ.
- **Ambient medium** (`0 4px 20px rgba(23, 48, 79, 0.06)`): card nội dung chính và trạng thái hover.
- **Floating layer** (`0 10px 30px rgba(23, 48, 79, 0.1)`): modal và toast.
- **Primary glow** (`0 6px 20px rgba(3, 147, 244, 0.25)`): nút hành động chính.

### Named Rules

**The Soft-Lift Rule.** Bề mặt luôn có viền trước khi có bóng; elevation tăng nhẹ theo mức độ tương tác, không tạo bóng tối hoặc sắc cạnh.

## Shapes

Góc bo là ngôn ngữ hình học chính: `8px` cho chi tiết nhỏ, `12px` cho control và cụm thông tin, `16px` cho card và dialog. Nút, tab và badge dùng pill hoàn toàn; icon action dùng hình tròn. Viền xanh xám từ `1px` đến `1.5px` giữ cấu trúc rõ trên nền sáng.

**The Nested Radius Rule.** Component con luôn dùng bán kính nhỏ hơn bề mặt chứa nó, duy trì cảm giác nhiều lớp nhưng liền mạch.

## Components

### Buttons

- **Shape:** pill toàn phần, chiều cao mặc định `52px`; biến thể nhỏ cao `40px`.
- **Primary:** Skyward Blue, chữ trắng, padding ngang rộng và primary glow.
- **Hover / Focus:** chuyển sang Skyward Deep và nâng `2px`; trạng thái active trở về mặt phẳng.
- **Secondary:** nền trắng, chữ Study Ink, viền Cloud Border; hover chuyển sang Skywash.
- **Danger:** Error Red và chữ trắng, chỉ dùng cho hành động phá hủy đã được xác nhận.
- **Disabled:** opacity giảm, không nâng và không có bóng.

### Chips

- **Style:** pill nhỏ, semibold; nền wash nhạt kết hợp chữ semantic đậm.
- **State:** active dùng xanh lá, inactive dùng neutral xám, informational dùng Skywash và Skyward Blue.

### Cards / Containers

- **Corner Style:** bo lớn (`16px`).
- **Background:** White Surface trên Cloud Paper.
- **Shadow Strategy:** ambient medium cho card chính, ambient low cho thẻ ngày.
- **Border:** Cloud Border mảnh, luôn hiện diện.
- **Internal Padding:** `32px` cho card chính; `20px` cho thẻ lịch nhỏ.

### Inputs / Fields

- **Style:** cao `44px`, nền trắng, viền `1.5px`, bo `12px`.
- **Focus:** viền Skyward Blue với vòng focus xanh trong suốt rộng `4px`.
- **Error / Disabled:** lỗi dùng Error Red và Error Wash; helper text luôn giải thích bằng chữ.

### Navigation

Tab điều hướng nằm trong một rail pill màu Cloud Paper. Tab mặc định dùng Quiet Slate; tab active chuyển thành bề mặt trắng, chữ Skyward Blue và bóng ambient low. Trên mobile, header xếp dọc để giữ nhãn và vùng chạm đầy đủ.

### Alerts & Toasts

Alert dùng nền wash, viền semantic và icon tương ứng. Toast là bề mặt nổi ở góc dưới phải, có viền trái semantic dày để nhận diện nhanh nhưng vẫn giữ nội dung bằng chữ.

### Day Schedule Card

Thẻ ngày là pattern đặc trưng: date badge xanh nhạt neo bên trái, các phiên học xếp thành hàng bo tròn trên nền Cloud Paper, còn mã môn và trọng số dùng typography nhỏ nhưng đậm để quét nhanh.

## Do's and Don'ts

### Do:

- **Do** dùng White Surface trên Cloud Paper để giữ không gian sáng và có lớp.
- **Do** giữ Skyward Blue cho hành động, focus và trạng thái được chọn.
- **Do** kết hợp icon, màu và nội dung chữ cho mọi trạng thái hệ thống.
- **Do** dùng chuyển động nhanh `150–250ms` và biên độ nâng tối đa khoảng `3px`.
- **Do** giữ nhịp spacing 8px và bán kính giảm dần khi component được lồng nhau.

### Don't:

- **Don't** biến toàn bộ màn hình thành một mảng xanh bão hòa; khoảng trắng là một phần của bản sắc.
- **Don't** dùng bóng tối, cạnh sắc hoặc hiệu ứng nặng làm giao diện trở nên cứng và mang tính hành chính.
- **Don't** dùng màu trạng thái mà thiếu nhãn, icon hoặc thông điệp giải thích.
- **Don't** trộn thêm font trang trí; hierarchy hiện tại dựa trên một family Poppins nhất quán.
- **Don't** làm chuyển động chậm hoặc phô diễn đến mức cản trở thao tác lập lịch.
