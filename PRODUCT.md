# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Sinh viên là người dùng chính. Họ sử dụng sản phẩm khi muốn biến danh sách môn học của mình thành một lịch học theo tháng mà không phải tự phân bổ từng ngày.

## Product Purpose

StudyPlanner giúp sinh viên thêm và quản lý các môn học, sau đó tạo một lịch học ngẫu nhiên có cấu trúc từ các môn đang hoạt động. Thành công nghĩa là người dùng có thể nhanh chóng tạo được một lịch khả thi, dễ hiểu và cảm thấy có hứng thú bắt đầu học thay vì bị áp lực bởi một công cụ khô khan, gò bó.

## Positioning

Sản phẩm không chỉ xếp các môn vào lịch một cách ngẫu nhiên thuần túy. Lịch được phân bổ theo trọng số ưu tiên của từng môn, đồng thời cố gắng đa dạng hóa tổ hợp môn giữa các ngày và hạn chế lặp lại gần nhau. Kết quả giữ được yếu tố bất ngờ nhưng vẫn phản ánh mức độ quan trọng mà sinh viên đã đặt ra.

## Operating Context

Luồng sử dụng cốt lõi:

1. Sinh viên thêm môn học với mã môn, tên, trọng số và trạng thái hoạt động.
2. Sinh viên chọn tháng, năm và số phiên học mỗi ngày.
3. Hệ thống tạo bản xem trước cho toàn bộ tháng.
4. Sinh viên xem lịch theo ngày và lưu kế hoạch khi hài lòng.

Ứng dụng là một web app responsive, có frontend React và API backend riêng. Người dùng có thể cấu hình địa chỉ API và thông tin xác thực trong ứng dụng.

## Capabilities and Constraints

- Chỉ các môn đang hoạt động được dùng để tạo lịch.
- Trọng số của môn phải là số dương và quyết định tỷ lệ xuất hiện của môn trong tháng.
- Mỗi ngày có từ 1 đến 10 phiên học; cần ít nhất số môn hoạt động bằng số phiên trong ngày.
- Một môn không xuất hiện hai lần trong cùng một ngày.
- Bộ tạo lịch ưu tiên tổ hợp chưa dùng, giảm trùng lặp với những ngày gần nhất và vẫn bảo đảm đủ hạn ngạch của từng môn trong cả tháng.
- Chỉ tạo kế hoạch cho tháng hiện tại hoặc tương lai; một tháng chỉ có một kế hoạch đã lưu.
- Việc phá hòa dùng ngẫu nhiên, vì vậy bản xem trước và kế hoạch được lưu hiện có thể không hoàn toàn giống nhau. Đây là hành vi sản phẩm cần được giải thích rõ cho người dùng cho đến khi cơ chế lưu thay đổi.
- Giao diện phải hoạt động tốt trên cả desktop và màn hình di động.
- Ngôn ngữ giao diện cuối cùng chưa được chốt; mã nguồn hiện dùng tiếng Anh trong khi người sở hữu sản phẩm giao tiếp bằng tiếng Việt.

## Brand Commitments

- Tên sản phẩm hiện tại là **StudyPlanner**; giữ tên này cho đến khi có yêu cầu đổi tên.
- Trải nghiệm phải đẹp, tạo cảm hứng học tập và có cảm giác linh hoạt, thân thiện; tránh cảm giác nhàm chán, cứng nhắc hoặc giống một công cụ quản trị hành chính.
- Giọng điệu nên khích lệ và rõ ràng, không gây áp lực hoặc phán xét tiến độ học tập của sinh viên.

## Evidence on Hand

- Frontend React/TypeScript tại `frontend/` đã có luồng quản lý môn học, tạo bản xem trước, lưu kế hoạch, thông báo và cấu hình API.
- Backend Spring Boot tại `backend/` chứa thuật toán phân bổ theo trọng số, kiểm tra tính hợp lệ và các bài kiểm thử cho môn học, phiên học và kế hoạch.
- `frontend/src/assets/hero.png` là tài sản hình ảnh hiện có nhưng chưa được xác nhận là tài sản thương hiệu bắt buộc.
- Chưa có nghiên cứu người dùng, testimonial, số liệu hiệu quả học tập hoặc tuyên bố marketing đã được xác thực; công việc sau này không được tự tạo các bằng chứng này.

## Product Principles

1. **Từ môn học đến hành động nhanh chóng:** giảm số bước cần thiết để có một lịch học khả dụng.
2. **Ngẫu nhiên nhưng có chủ đích:** tạo sự mới mẻ mà vẫn tôn trọng trọng số, tính khả thi và sự đa dạng giữa các ngày.
3. **Tạo động lực, không tạo áp lực:** mọi trạng thái và câu chữ phải giúp sinh viên cảm thấy muốn bắt đầu.
4. **Cho người dùng quyền kiểm soát:** luôn cho phép xem trước, hiểu các điều kiện và chủ động lưu kế hoạch.
5. **Trung thực về hành vi hệ thống:** giải thích rõ những giới hạn hoặc kết quả có thể thay đổi, đặc biệt với yếu tố ngẫu nhiên.

## Accessibility & Inclusion

Các giao diện mới phải hướng tới WCAG 2.2 AA, hỗ trợ bàn phím, trạng thái focus rõ ràng, độ tương phản phù hợp, thông báo không phụ thuộc riêng vào màu sắc và trải nghiệm responsive không làm mất chức năng.
