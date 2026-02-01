# Hướng dẫn test đầy đủ tính năng AURA theo từng role

Tài liệu này hướng dẫn test frontend + backend theo **từng role** (Patient, Doctor, ClinicManager, Admin) khi chạy hệ thống.

---

## 1. Chuẩn bị

### 1.1 Chạy Backend
```bash
cd backend
python app.py
# Backend chạy tại http://localhost:9999
```

### 1.2 Chạy Frontend
- Mở frontend bằng HTTP server (vd: Live Server, hoặc `python -m http.server 8080` trong thư mục `frontend`).
- Hoặc mở trực tiếp file HTML (khi đó API sẽ gọi `http://localhost:9999` theo `config.js`).

### 1.3 Seed data (SQL Server)
- Chạy script `seed_data_full.sql` trên database `RetinalHealthDB` để có dữ liệu mẫu.
- **Mật khẩu tất cả tài khoản:** `password123`

### 1.4 Tài khoản test (sau khi seed)

| Role          | Email              | Mật khẩu   | Ghi chú                    |
|---------------|--------------------|------------|----------------------------|
| Admin         | admin@aura.com     | password123| Toàn quyền                 |
| Doctor        | doctor1@aura.com   | password123| Thuộc clinic 1             |
| Doctor        | doctor4@aura.com   | password123| Thuộc clinic 2             |
| Patient       | patient1@aura.com  | password123| Thuộc clinic 1, có allocation 100 lượt |
| Patient       | patient4@aura.com  | password123| Thuộc clinic 2             |
| ClinicManager | clinic1@aura.com   | password123| Clinic 1 (verified)        |
| ClinicManager | clinic2@aura.com   | password123| Clinic 2 (verified)        |
| ClinicManager | clinic3@aura.com   | password123| Clinic 3 (pending)         |

---

## 2. Test theo role Patient

### 2.1 Đăng nhập
1. Mở **Login** (`login.html`).
2. Email: `patient1@aura.com`, Password: `password123`.
3. **Kỳ vọng:** Đăng nhập thành công, redirect sang trang Patient (vd dashboard).

### 2.2 Các trang cần test (Patient)

| Trang | Đường dẫn | Nội dung test |
|-------|-----------|----------------|
| Dashboard | `patient/dashboard.html` | Hiển thị thống kê cá nhân, quick links. |
| Upload ảnh | `patient/upload-image.html` | Chọn patient_id, clinic_id, image_type, eye_side, image_url → Submit. **Lưu ý:** Mỗi lần upload trừ 1 credit từ allocation (clinic cấp) + pool clinic; nếu hết allocation hoặc clinic hết pool sẽ báo lỗi. |
| My Images | `patient/my-images.html` | Danh sách ảnh đã upload của patient. |
| Analysis Results | `patient/analysis-results.html` | Kết quả phân tích AI theo ảnh. |
| Reports | `patient/reports.html` | Báo cáo y tế của patient. |
| Messages | `patient/messages.html` | Tin nhắn với bác sĩ. |
| Profile | `patient/profile.html` | Xem/sửa thông tin cá nhân. |
| Settings | `patient/settings.html` | Cài đặt tài khoản. |

### 2.3 Test nghiệp vụ quan trọng (Patient)
- **Upload ảnh:** Gửi `POST /api/retinal-images` với `patient_id`, `clinic_id`, `uploaded_by` (account_id của patient), `image_type`, `eye_side`, `image_url`. Kiểm tra:
  - Thành công khi patient có allocation từ clinic đó và clinic còn pool.
  - Lỗi 400 khi: "Patient has no upload allocation from this clinic" hoặc "Clinic has no remaining upload credits".
- **Subscription (gói patient):** Nếu có API xem subscription/credits của patient → kiểm tra `GET /api/subscriptions/account/<account_id>` (role Patient được phép).

---

## 3. Test theo role Doctor

### 3.1 Đăng nhập
1. Login với `doctor1@aura.com` / `password123`.
2. **Kỳ vọng:** Redirect sang khu vực Doctor.

### 3.2 Các trang cần test (Doctor)

| Trang | Đường dẫn | Nội dung test |
|-------|-----------|----------------|
| Dashboard | `doctor/dashboard.html` | Thống kê bác sĩ, bệnh nhân, ảnh. |
| Patients | `doctor/patients.html` | Danh sách bệnh nhân (cùng clinic). |
| Reviews | `doctor/reviews.html` | Xem/review kết quả AI. |
| Create Report | `doctor/create-report.html` | Tạo báo cáo y tế cho bệnh nhân. |
| Messages | `doctor/messages.html` | Tin nhắn với bệnh nhân. |
| Profile | `doctor/profile.html` | Thông tin bác sĩ. |
| Settings | `doctor/settings.html` | Cài đặt. |

### 3.3 Test nghiệp vụ quan trọng (Doctor)
- **Upload ảnh (thay patient):** Doctor có thể gọi `POST /api/retinal-images` với `uploaded_by` = account_id của doctor; vẫn trừ credit từ **patient** (theo `patient_id`) và pool **clinic** (theo `clinic_id`). Kiểm tra upload thành công khi allocation + pool còn.
- **Bulk upload:** `POST /api/retinal-images/bulk` với mảng `images`; mỗi ảnh vẫn trừ credit tương ứng.
- **Danh sách bệnh nhân:** API theo clinic (doctor thuộc clinic_id) và quyền Doctor.

---

## 4. Test theo role ClinicManager

### 4.1 Đăng nhập
1. Login với `clinic1@aura.com` / `password123`.
2. **Kỳ vọng:** Vào khu vực Clinic (ClinicManager).

### 4.2 Các trang cần test (ClinicManager)

| Trang | Đường dẫn | Nội dung test |
|-------|-----------|----------------|
| Dashboard | `clinic/dashboard.html` | Tổng quan phòng khám, thống kê. |
| Profile | `clinic/profile.html` | Xem/sửa thông tin phòng khám. |
| Members | `clinic/members.html` | Danh sách bác sĩ + bệnh nhân thuộc clinic. |
| Patients | `clinic/patients.html` | Bệnh nhân thuộc phòng khám. |
| Images | `clinic/images.html` | Ảnh võng mạc tại phòng khám. |
| Analytics | `clinic/analytics.html` | Tổng hợp rủi ro, xu hướng (FR-25, FR-29). |
| Alerts | `clinic/alerts.html` | Cảnh báo bệnh nhân nguy cơ cao. |
| Reports | `clinic/reports.html` | Báo cáo tầm soát, tổng hợp. |
| Usage | `clinic/usage.html` | Sử dụng dịch vụ, gói (FR-27). |
| Subscriptions | `clinic/subscriptions.html` | Gói đăng ký của clinic (FR-28): xem subscription, remaining_credits. |
| Export | `clinic/export.html` | Xuất thống kê (FR-30). |
| Settings | `clinic/settings.html` | Cài đặt. |

### 4.3 Test nghiệp vụ quan trọng (ClinicManager)
- **Subscription (gói clinic):**
  - `GET /api/subscriptions/account/<clinic_account_id>` với clinic_account_id = account của ClinicManager (vd lấy từ login).
  - Kiểm tra hiển thị gói clinic (package_type=clinic), remaining_credits (pool).
- **Cấp lượt upload cho patient (allocation):**
  - `POST /api/clinics/<clinic_id>/patients/<patient_id>/allocate-credits`  
    Body: `{ "credits": 100 }`  
  - Kiểm tra: 201, allocation trả về (credits_allocated, credits_used, credits_remaining). Patient sau đó có thể upload tối đa 100 ảnh (trừ khi clinic hết pool).
- **Upload ảnh:** Patient thuộc clinic upload → trừ pool clinic + allocation patient. ClinicManager có thể xem Usage/Images để thấy lượng dùng.
- **Payment:** `GET /api/payments/account/<clinic_account_id>/history` (ClinicManager được phép).

---

## 5. Test theo role Admin

### 5.1 Đăng nhập
1. Login với `admin@aura.com` / `password123`.
2. **Kỳ vọng:** Vào khu vực Admin.

### 5.2 Các trang cần test (Admin)

| Trang | Đường dẫn | Nội dung test |
|-------|-----------|----------------|
| Dashboard | `admin/dashboard.html` | Tổng quan hệ thống. |
| Accounts | `admin/accounts.html` | Danh sách tài khoản, tạo/sửa/khóa. |
| Clinics | `admin/clinics.html` | Danh sách phòng khám, verify/reject/approve/suspend. |
| AI Models | `admin/ai-models.html` | Quản lý phiên bản AI. |
| Statistics | `admin/statistics.html` | Thống kê toàn hệ thống. |
| Settings | `admin/settings.html` | Cài đặt hệ thống. |

### 5.3 Test nghiệp vụ quan trọng (Admin)
- **Quản lý clinic:** Verify/Reject/Approve/Suspend clinic (các API PUT dưới `/api/clinics/<id>/...`).
- **Quản lý tài khoản:** Tạo/sửa/xóa account, đổi role/clinic.
- **Service packages:** Tạo/sửa gói (package_type: clinic | patient), xem list với `?type=clinic` hoặc `?type=patient`.
- **Subscription:** Xem toàn bộ, deduct/add credit (nếu có API Admin).
- **Payment:** Xem tất cả payments, revenue, mark completed/refund (theo API hiện có).
- **Audit/Log:** Nếu có trang hoặc API audit log → kiểm tra Admin xem được.

---

## 6. Ma trận quyền (tham chiếu nhanh)

| Tính năng | Patient | Doctor | ClinicManager | Admin |
|-----------|---------|--------|---------------|-------|
| Login/Register | ✓ | ✓ | ✓ | ✓ |
| Upload ảnh (single) | ✓ | ✓ | ✓ | ✓ |
| Upload ảnh (bulk) | ✗ | ✓ | ✓ | ✓ |
| Xem ảnh (của mình / clinic) | ✓ | ✓ | ✓ | ✓ |
| Subscription (xem theo account) | ✓ | ✓ | ✓ (clinic) | ✓ |
| Payment history (theo account) | ✓ | - | ✓ (clinic) | ✓ |
| Cấp allocation (clinic → patient) | ✗ | ✗ | ✓ | ✓ |
| Gói dịch vụ (list/filter type) | ✓ | ✓ | ✓ | ✓ |
| Tạo/sửa gói (Admin) | ✗ | ✗ | ✗ | ✓ |
| Quản lý clinic (verify/approve/...) | ✗ | ✗ | ✗ | ✓ |
| Quản lý accounts | ✗ | ✗ | ✗ | ✓ |
| Thống kê toàn hệ thống | ✗ | ✗ | (clinic) | ✓ |

---

## 7. Checklist test E2E theo kịch bản

### Kịch bản 1: Patient upload ảnh (có allocation)
1. Login **ClinicManager** (clinic1) → **Cấp 100 credits** cho patient1 (POST allocate-credits).
2. Login **Patient** (patient1) → Vào **Upload ảnh**, gửi 1 ảnh (patient_id, clinic_id=1, uploaded_by=patient1 account_id).
3. **Kỳ vọng:** 201, ảnh tạo thành công; remaining_credits của clinic giảm 1; allocation patient1 (credits_used) tăng 1.
4. Lặp upload đến khi hết 100 allocation hoặc clinic hết pool → lần tiếp theo phải báo lỗi (400).

### Kịch bản 2: Clinic hết pool
1. Chỉnh subscription của clinic1 (remaining_credits = 0) hoặc dùng clinic chưa có subscription.
2. Patient có allocation vẫn gọi upload.
3. **Kỳ vọng:** 400, message kiểu "Clinic has no remaining upload credits (pool exhausted)".

### Kịch bản 3: Patient chưa được cấp allocation
1. Patient chưa có bản ghi trong `clinic_patient_allocations` cho clinic đó.
2. Gọi upload với patient_id + clinic_id tương ứng.
3. **Kỳ vọng:** 400, message kiểu "Patient has no upload allocation from this clinic".

### Kịch bản 4: Admin quản lý gói và clinic
1. Login **Admin** → Vào **Clinics**: approve/verify clinic3 (pending).
2. Vào **AI Models** (nếu có): xem/cập nhật model.
3. **Service packages:** Tạo gói mới (package_type = clinic hoặc patient), sau đó GET list với `?type=clinic` / `?type=patient`.

### Kịch bản 5: Doctor tạo báo cáo và xem bệnh nhân
1. Login **Doctor** (doctor1) → **Patients**: xem danh sách bệnh nhân clinic 1.
2. **Create Report:** Tạo báo cáo cho một bệnh nhân.
3. **Reviews:** Xem danh sách kết quả AI cần review.

---

## 8. Lưu ý khi test

- **CORS:** Backend phải cấu hình CORS cho origin của frontend (vd `http://127.0.0.1:5500` hoặc port bạn dùng).
- **Token:** Sau login, token lưu trong storage; mỗi request API cần gửi header `Authorization: Bearer <token>`.
- **account_id vs patient_id:** Upload ảnh dùng `patient_id` (bảng patient_profiles); `uploaded_by` là `account_id` (người thực hiện upload). Allocation dùng `patient_account_id` (từ patient_profiles.account_id).
- **clinic_id:** Luôn gửi đúng clinic_id mà patient được cấp allocation; subscription pool lấy theo account ClinicManager của clinic đó.

Nếu bạn thêm trang hoặc API mới, bổ sung vào bảng trang và ma trận quyền trong file này để giữ hướng dẫn test luôn đồng bộ.
