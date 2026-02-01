# Luồng chạy hệ thống AURA theo vai trò

Tài liệu mô tả **luồng end-to-end**: Bệnh nhân upload ảnh → Phân tích AI → Bác sĩ duyệt → Báo cáo → Phòng khám/Admin theo dõi. Dùng để kiểm tra logic khi chạy từng tính năng và đảm bảo các role liên quan hoạt động đúng.

---

## 1. Tổng quan luồng (theo thứ tự thời gian)

```
[Patient] Upload ảnh võng mạc
    → Ảnh lưu (retinal_images), status: uploaded
    → (Bước trung gian) Tạo yêu cầu phân tích AI [Doctor/Admin hoặc tự động]
    → Phân tích AI chạy: pending → processing → completed (hoặc failed)
    → Kết quả AI lưu (ai_results: risk_level, disease_type, confidence_score)
[Doctor] Xem "chờ duyệt" → Duyệt kết quả AI (approve/reject/needs_revision)
    → (Tùy chọn) Tạo báo cáo y tế (medical_reports) gắn với analysis
[Patient] Xem "Kết quả phân tích" và "Báo cáo"
[Clinic] Xem tổng hợp: bệnh nhân, ảnh, cảnh báo rủi ro cao, báo cáo, thống kê
[Admin] Quản lý tài khoản, phòng khám, AI models; có thể đánh dấu analysis processing/complete (mô phỏng)
```

---

## 2. Chi tiết theo từng bước

### Bước 1: Bệnh nhân (Patient) – Upload ảnh

| Thứ tự | Hành động | API / Logic | Ghi chú |
|--------|-----------|-------------|---------|
| 1.1 | Đăng nhập (role Patient) | `POST /api/auth/login` → redirect `patient/dashboard.html` | |
| 1.2 | Có hồ sơ bệnh nhân | `GET /api/patients/account/:accountId` trả về `patient_id` | Nếu chưa có → báo "Cập nhật Hồ sơ"; tạo qua `POST /api/patients` (Admin/Clinic hoặc form Hồ sơ) |
| 1.3 | Vào "Upload ảnh" | Trang `patient/upload-image.html` | |
| 1.4 | Chọn ảnh, loại ảnh, mắt (trái/phải) | FE: image_type (fundus/oct/...), eye_side (left/right) | |
| 1.5 | Gửi upload | `POST /api/retinal-images` body: `patient_id`, `clinic_id`, `uploaded_by` (account_id), `image_type`, `eye_side`, `image_url` | FE hiện dùng `clinic_id: user.clinic_id \|\| 1` (bệnh nhân có thể không có clinic_id) |
| 1.6 | Sau khi upload thành công | FE redirect `patient/my-images.html` | Ảnh lưu trong DB, status thường là `uploaded` |

**Kiểm tra logic:**  
- Patient chỉ upload được khi đã có `patient_id`.  
- `clinic_id`: nếu account không có clinic_id, FE mặc định 1 → cần thống nhất (chọn phòng khám hoặc backend gán).

---

### Bước 2: Tạo phân tích AI (AI Analysis) – Ai làm?

| Thứ tự | Hành động | API / Logic | Role thực hiện |
|--------|-----------|-------------|----------------|
| 2.1 | Tạo yêu cầu phân tích cho ảnh | `POST /api/ai-analysis` body: `image_id`, `ai_model_version_id` (optional: status, processing_time) | **Doctor** hoặc **Admin** |
| 2.2 | Bản ghi `ai_analysis` | status: `pending` | Backend tạo |
| 2.3 | (Mô phỏng / job thật) Chạy AI | Có thể: job ngoài gọi `PUT /api/ai-analysis/:id/processing` rồi `PUT /api/ai-analysis/:id/complete` (hoặc `/fail`) | **Admin** (mark processing/complete) hoặc worker |
| 2.4 | Kết quả AI | Lưu vào `ai_results` (risk_level, disease_type, confidence_score, ...) gắn `analysis_id` | Backend / service AI |

**Kiểm tra logic:**  
- Upload ảnh **không** tự tạo analysis. Phải có bước riêng: Doctor/Admin tạo analysis cho `image_id`, hoặc có cơ chế tự động (chưa thấy trong code).  
- Để bác sĩ "duyệt" được, analysis đó phải tồn tại và tốt nhất là status `completed`.

---

### Bước 3: Bác sĩ (Doctor) – Duyệt kết quả AI và tạo báo cáo

| Thứ tự | Hành động | API / Logic | Ghi chú |
|--------|-----------|-------------|---------|
| 3.1 | Đăng nhập (role Doctor) | Redirect `doctor/dashboard.html` | |
| 3.2 | Có hồ sơ bác sĩ | `GET /api/doctors/account/:accountId` → `doctor_id` | Nếu chưa có → báo cập nhật Hồ sơ |
| 3.3 | Xem "Duyệt kết quả AI" | `GET /api/doctor-reviews/pending` → danh sách chờ duyệt | **Lưu ý:** Backend hiện trả về reviews có `validation_status=pending` (là review đã tạo nhưng chưa approve/reject), không phải "analyses chưa có review". Nếu muốn "phân tích đã xong AI nhưng chưa có bác sĩ duyệt" cần API khác (analyses completed, chưa có bản ghi doctor_review). |
| 3.4 | Vào từng phân tích, xem kết quả AI | `GET /api/ai-analysis/:id`, `GET /api/ai-results` (theo analysis_id) | |
| 3.5a | Tạo review (duyệt lần đầu) | `POST /api/doctor-reviews` body: `analysis_id`, `doctor_id`, `validation_status`: approved / rejected / needs_revision, `comment` | Tạo bản ghi doctor_review |
| 3.5b | Hoặc approve/reject review có sẵn | `PUT /api/doctor-reviews/:id/approve`, `PUT /api/doctor-reviews/:id/reject` body: `comment` | Dùng khi đã có review (vd. status pending) |
| 3.6 | Tạo báo cáo y tế (sau khi duyệt) | `POST /api/medical-reports` body: `patient_id`, `analysis_id`, `doctor_id`, `report_url` | Backend có thể sinh khuyến nghị theo risk_level (FR-16) |

**Kiểm tra logic:**  
- Doctor chỉ duyệt được khi đã có `analysis` (và nên là analysis completed).  
- Báo cáo y tế gắn với một `analysis_id` và `patient_id`, `doctor_id` → Patient sau đó xem được qua `GET /api/medical-reports/patient/:patientId`.

---

### Bước 4: Bệnh nhân (Patient) – Xem kết quả và báo cáo

| Thứ tự | Hành động | API / Logic |
|--------|-----------|-------------|
| 4.1 | "Kết quả phân tích" | `GET /api/patients/account/:id` → patient_id → `GET /api/ai-analysis/patient/:patientId` |
| 4.2 | "Báo cáo" | `GET /api/medical-reports/patient/:patientId` |

**Kiểm tra logic:**  
- Chỉ thấy kết quả/báo cáo khi đã có analysis và (với báo cáo) doctor đã tạo report.

---

### Bước 5: Phòng khám (ClinicManager) – Theo dõi tổng hợp

| Thứ tự | Hành động | API / Logic |
|--------|-----------|-------------|
| 5.1 | Dashboard | `user.clinic_id` → `GET /api/clinics/:id`, members, usage, reports-summary, high-risk-alerts |
| 5.2 | Bệnh nhân thuộc phòng khám | `GET /api/patients/assigned/clinic/:clinicId` |
| 5.3 | Ảnh tại phòng khám | `GET /api/retinal-images/clinic/:clinicId` |
| 5.4 | Cảnh báo rủi ro cao | `GET /api/clinics/:id/high-risk-alerts?risk_level=high` |
| 5.5 | Báo cáo / xu hướng / xuất thống kê | reports-summary, abnormal-trends, screening-report, export-statistics |

**Kiểm tra logic:**  
- User phải có `clinic_id` (account gán phòng khám).  
- Dữ liệu theo `clinic_id`: bệnh nhân gán phòng khám, ảnh upload với clinic_id đó, cảnh báo theo clinic.

---

### Bước 6: Admin – Quản lý và (tùy chọn) mô phỏng AI

| Thứ tự | Hành động | API / Logic |
|--------|-----------|-------------|
| 6.1 | Dashboard tổng quan | `GET /api/admin/dashboard` |
| 6.2 | Tài khoản, Phòng khám (verify/reject/approve/suspend), AI Models | Các API accounts, clinics, ai-model-versions |
| 6.3 | (Mô phỏng) Đánh dấu phân tích đã chạy xong | `PUT /api/ai-analysis/:id/processing`, `PUT /api/ai-analysis/:id/complete` (Admin only) |

**Kiểm tra logic:**  
- Analysis chỉ chuyển sang completed (hoặc failed) qua API Admin hoặc worker; Doctor không gọi trực tiếp mark complete.

---

## 3. Ma trận: Tính năng ↔ Role liên quan

| Tính năng | Patient | Doctor | Clinic | Admin |
|-----------|---------|--------|--------|-------|
| Upload ảnh | Thực hiện (cần patient_id, clinic_id) | — | — | — |
| Tạo analysis (yêu cầu AI) | — | Có thể tạo | — | Có thể tạo |
| Mark analysis processing/complete | — | — | — | Có (mô phỏng) |
| Xem "chờ duyệt" | — | Xem danh sách | — | — |
| Duyệt (approve/reject/review) | — | Thực hiện | — | Có thể |
| Tạo báo cáo y tế | — | Thực hiện | — | Có thể |
| Xem kết quả phân tích | Xem (theo patient_id) | Xem (theo bệnh nhân/clinic) | — | Xem |
| Xem báo cáo | Xem (của mình) | Xem (của mình / bệnh nhân) | Xem (theo clinic) | Xem |
| Cảnh báo rủi ro cao | — | — | Xem theo clinic | — |
| Quản lý tài khoản / phòng khám / AI | — | — | — | Thực hiện |

---

## 4. Kịch bản kiểm tra nhanh (end-to-end)

1. **Chuẩn bị:**  
   - Có ít nhất 1 Patient (có patient_id), 1 Doctor (có doctor_id), 1 Clinic (verified), 1 Admin.  
   - Có ít nhất 1 AI model version (active).

2. **Patient:** Đăng nhập → Upload ảnh (chọn ảnh, type, eye) → Kiểm tra "Ảnh của tôi" thấy ảnh vừa upload.

3. **Admin hoặc Doctor:**  
   - Tạo analysis: `POST /api/ai-analysis` với `image_id` (ảnh vừa upload), `ai_model_version_id`.  
   - (Mô phỏng) Admin gọi `PUT /api/ai-analysis/:id/complete` để đánh dấu analysis hoàn thành (nếu có ai_results thì càng sát thực tế).

4. **Doctor:** Đăng nhập → "Duyệt kết quả AI" → Chọn phân tích → Duyệt (approve/reject) hoặc tạo review → (Tùy chọn) Tạo báo cáo y tế với analysis_id đó.

5. **Patient:** "Kết quả phân tích" thấy analysis; "Báo cáo" thấy báo cáo (nếu doctor đã tạo).

6. **Clinic:** Đăng nhập (user có clinic_id) → Dashboard / Bệnh nhân / Ảnh / Cảnh báo / Báo cáo: kiểm tra số liệu và danh sách đúng theo clinic.

Khi kiểm tra từng tính năng, đối chiếu với luồng trên để đảm bảo role đúng, API đúng thứ tự và dữ liệu nhất quán (patient_id, clinic_id, analysis_id, doctor_id).

---

## 5. Lỗi logic đã sửa / còn lại

**Đã sửa:**
- **GET /api/doctor-reviews/pending:** Đã đổi logic: trả về **analyses completed chưa có doctor review** (lấy completed analyses, lọc bỏ những analysis đã có bản ghi doctor_review). Response đúng format: `analysis_id`, `image_id`, `status`, `completed_at` (dùng `analysis_time`). Thêm `@require_roles(['Doctor', 'Admin'])`.

**Còn lưu ý khi test:**
- **Patient upload:** `clinic_id` mặc định 1 nếu account không có → cần quy ước rõ (gán phòng khám cho patient hoặc chọn khi upload).
- **Thiếu bước tự động:** Upload ảnh không tự tạo analysis → quy trình: Doctor/Admin tạo analysis sau khi có ảnh (POST /api/ai-analysis), hoặc Admin mark complete (PUT /api/ai-analysis/:id/complete).

Sau khi sửa từng phần, chạy lại kịch bản end-to-end ở mục 4 để xác nhận toàn bộ luồng hoạt động đúng.
