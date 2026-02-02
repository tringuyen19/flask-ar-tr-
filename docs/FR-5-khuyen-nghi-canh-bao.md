# FR-5: Nhận khuyến nghị hoặc cảnh báo sức khỏe tự động

## Trạng thái tính năng

### Đã hoạt động (trước khi bổ sung)

| Thành phần | Điều kiện hoạt động | Ai nhận |
|------------|---------------------|---------|
| **Khuyến nghị trong báo cáo y tế** | Bác sĩ tạo báo cáo y tế (medical report) và patient **xem/tải** báo cáo (PDF/CSV). Phần recommendations được tạo bởi `RecommendationService.generate_recommendations(risk_level, disease_type)`. | Patient (khi mở/tải báo cáo) |
| **Cảnh báo nguy cơ cao (high-risk alert)** | Có **kết quả AI** với `risk_level` = `high` hoặc `critical`. Hệ thống tự động gửi notification cho **tài khoản Doctor và Clinic Manager** của clinic gắn với ảnh. | Doctor, Clinic Manager (không gửi cho patient) |
| **RecommendationService** | Dùng khi export báo cáo; tạo nội dung khuyến nghị theo `risk_level` (high/medium/low) và `disease_type`. | Chỉ hiển thị trong báo cáo, không push cho patient |

### Chưa hoạt động cho patient (trước khi bổ sung)

- Patient **không** nhận thông báo tự động khi có kết quả AI (không có notification "kết quả phân tích đã sẵn sàng" gửi vào tài khoản patient).
- Patient **không** nhận cảnh báo/khuyến nghị sức khỏe dạng push/notification khi risk high/critical.

## Điều kiện để khuyến nghị/cảnh báo chạy

1. **Khuyến nghị trong báo cáo**  
   - Có medical report được tạo (bác sĩ tạo từ kết quả AI).  
   - Khi export (xem/tải) báo cáo, hệ thống gọi `RecommendationService.generate_recommendations(risk_level, disease_type)` và đưa vào nội dung báo cáo.  
   - **Risk level** dùng: từ báo cáo (hoặc mặc định `low` nếu không có).  
   - **Disease type** dùng: từ kết quả AI (hoặc `None`).

2. **Cảnh báo high-risk cho clinic (FR-29)**  
   - Có **AI result** được tạo với `risk_level` ∈ `['high', 'critical']`.  
   - Luồng: `AiResultService.create_result()` → sau khi lưu result, gọi `_send_high_risk_alert(result)`.  
   - Lấy analysis → image → `image.patient_id`, `image.clinic_id`; lấy danh sách account thuộc clinic (Doctor, ClinicManager); gửi `send_high_risk_alert(account_id, patient_id, risk_level, disease_type, confidence_score)` cho từng account đó.  
   - Patient **không** nhận notification này.

## FR-5 đã bổ sung: patient nhận khuyến nghị tự động

**Đã implement:** Khi có **kết quả AI** (bất kỳ risk_level), hệ thống gửi **notification khuyến nghị sức khỏe** vào **tài khoản patient**:

- **Điều kiện:** AI result được tạo thành công (có `analysis_id` → `image_id` → `patient_id`).
- **Luồng:** `AiResultService.create_result()` → `_send_patient_recommendation(result)`:
  - Lấy patient từ `patient_id` → `account_id` (PatientProfileRepository).
  - Tạo nội dung: `RecommendationService.generate_recommendations(risk_level, disease_type)` (map `critical` → `high`).
  - Gửi notification: `notification_type='health_recommendation'`, `content=recommendation`.
- Patient xem tại: **Thông báo** (GET /api/notifications/account/:id) hoặc trang notifications trên frontend.
