# Tổng hợp tính năng theo 4 Role & Checklist kiểm tra

Tài liệu này liệt kê **tất cả tính năng** theo từng role (Patient, Doctor, ClinicManager, Admin), **trang FE tương ứng**, **API backend** dùng, và **checklist** để kiểm tra từng tính năng (OK / Lỗi / Chưa kiểm tra). Mục tiêu: phát hiện và sửa lỗi logic khi kết hợp FE + BE.

**Luồng chạy hệ thống (end-to-end):** Xem **[SYSTEM_FLOW_BY_ROLE.md](./SYSTEM_FLOW_BY_ROLE.md)** để hiểu:
- Bệnh nhân upload ảnh như thế nào, sau đó ai tạo phân tích AI.
- Bác sĩ cần làm gì sau khi có kết quả AI (duyệt, tạo báo cáo).
- Phòng khám và Admin làm gì trong luồng.
- Ma trận tính năng ↔ role và kịch bản kiểm tra end-to-end.

---

## 1. Mapping Role (Backend ↔ Frontend)

| Backend `role_id` | Role name   | Thư mục FE   | Ghi chú              |
|-------------------|------------|--------------|------------------------|
| 1                 | Admin      | `admin/`     | Quản trị hệ thống      |
| 2                 | Doctor     | `doctor/`     | Bác sĩ                 |
| 3                 | Patient    | `patient/`   | Bệnh nhân              |
| 4                 | ClinicManager | `clinic/` | Quản lý phòng khám     |

- **Auth**: Login/Register trả về `role_id`; FE dùng `getRoleNameByRoleId(role_id)` trong `auth.js` để lưu `aura_role` và redirect đúng dashboard.
- **Bảo vệ trang**: Trang theo role nên gọi `requireRole('RoleName')` (Doctor/Admin/Clinic) hoặc `requireRole('Patient')` cho patient; chỉ dùng `requireLogin()` cho trang dùng chung (nếu có).

---

## 2. Tính năng chung (chưa đăng nhập / đăng nhập bất kỳ)

| # | Tính năng        | Trang FE        | API / Hành vi                    | Trạng thái |
|---|------------------|-----------------|-----------------------------------|------------|
| 1 | Trang chủ        | `index.html`    | Không gọi API                     | Chưa kiểm tra |
| 2 | Đăng nhập        | `login.html`    | `POST /api/auth/login` → token, redirect theo role | Chưa kiểm tra |
| 3 | Đăng ký          | `register.html` | `POST /api/auth/register` (email, password, role_id, clinic_id?) | Chưa kiểm tra |
| 4 | Quên mật khẩu    | `forgot-password.html` | `POST /api/auth/forgot-password` (backend trả 501 stub) | Chưa kiểm tra |
| 5 | Đặt lại mật khẩu | `reset-password.html`  | `POST /api/auth/reset-password` (token, new_password) | Chưa kiểm tra |

---

## 3. Role: Patient (Bệnh nhân)

**Menu sidebar (patient/):** Dashboard, Upload ảnh, Ảnh của tôi, Kết quả phân tích, Báo cáo, Tin nhắn, Hồ sơ, Cài đặt.

| # | Tính năng           | Trang FE              | API chính / Logic FE                    | Trạng thái |
|---|----------------------|------------------------|------------------------------------------|------------|
| 1 | Dashboard            | `patient/dashboard.html` | `getPatientByAccount(accountId)` → patient_id; `getImagesByPatient`, `getReportsByPatient`; hiển thị thống kê + hoạt động gần đây | Chưa kiểm tra |
| 2 | Upload ảnh           | `patient/upload-image.html` | `getPatientByAccount` → patient_id; `uploadImage({ patient_id, clinic_id, uploaded_by, image_type, eye_side, image_url })`; cần clinic_id (bệnh nhân có thể gán 1 phòng khám?) | Chưa kiểm tra |
| 3 | Ảnh của tôi          | `patient/my-images.html`   | `getPatientByAccount` → `getImagesByPatient(patientId)`; danh sách ảnh | Chưa kiểm tra |
| 4 | Kết quả phân tích    | `patient/analysis-results.html` | `getPatientByAccount` → `getPatientAnalyses(patientId)`; danh sách kết quả AI | Chưa kiểm tra |
| 5 | Báo cáo              | `patient/reports.html`    | `getPatientByAccount` → `getReportsByPatient(patientId)`; danh sách báo cáo y tế | Chưa kiểm tra |
| 6 | Tin nhắn            | `patient/messages.html`   | Hội thoại/tin nhắn (conversation, messages API) | Chưa kiểm tra |
| 7 | Hồ sơ               | `patient/profile.html`    | `getPatientByAccount`, `updatePatient(patientId, payload)` | Chưa kiểm tra |
| 8 | Cài đặt              | `patient/settings.html`   | Đổi mật khẩu / cài đặt cá nhân (API account nếu có) | Chưa kiểm tra |

**Lưu ý logic:**
- Patient **phải có hồ sơ** (bản ghi `patients` link với `account_id`). Nếu chưa có → thông báo "Vui lòng cập nhật Hồ sơ". Tạo patient: `POST /api/patients` (thường do Admin/Clinic hoặc luồng đăng ký).
- Upload ảnh: FE cần `patient_id`, `clinic_id`, `uploaded_by` (account_id). Bệnh nhân có thể không có `clinic_id` trong account → cần xử lý (chọn phòng khám hoặc backend gán mặc định).

---

## 4. Role: Doctor (Bác sĩ)

**Menu sidebar (doctor/):** Dashboard, Bệnh nhân, Duyệt kết quả AI, Tạo báo cáo, Tin nhắn, Hồ sơ, Cài đặt.

| # | Tính năng           | Trang FE                | API chính / Logic FE                         | Trạng thái |
|---|----------------------|--------------------------|-----------------------------------------------|------------|
| 1 | Dashboard            | `doctor/dashboard.html`  | `getDoctorByAccount(accountId)` → doctor_id; `getDoctorPerformance`, `getPendingReviews`, `getReportsByDoctor`; thống kê + danh sách chờ duyệt | Chưa kiểm tra |
| 2 | Danh sách bệnh nhân  | `doctor/patients.html`  | `getDoctorByAccount` → doctor_id; `searchPatients` hoặc danh sách bệnh nhân theo clinic/doctor | Chưa kiểm tra |
| 3 | Duyệt kết quả AI     | `doctor/reviews.html`    | `getPendingReviews`, `getReviewByAnalysis`, `approveReview`, `rejectReview` | Chưa kiểm tra |
| 4 | Tạo báo cáo          | `doctor/create-report.html` | `createMedicalReport(payload)`; chọn patient/analysis, nội dung báo cáo | Chưa kiểm tra |
| 5 | Tin nhắn             | `doctor/messages.html`  | `getConversationsByDoctor`, `getMessagesByConversation`, `sendMessage` | Chưa kiểm tra |
| 6 | Hồ sơ                | `doctor/profile.html`   | `getDoctorByAccount`, `updateDoctor(doctorId, payload)` | Chưa kiểm tra |
| 7 | Cài đặt              | `doctor/settings.html`  | Cài đặt cá nhân / đổi mật khẩu               | Chưa kiểm tra |

**Lưu ý logic:**
- Doctor phải có hồ sơ (`doctors` link với `account_id`). Nếu chưa → thông báo cập nhật Hồ sơ.
- Duyệt kết quả: Backend `GET /api/doctor-reviews/pending` trả về danh sách phân tích chờ duyệt; FE hiển thị và gọi approve/reject.

---

## 5. Role: ClinicManager (Phòng khám)

**Menu sidebar (clinic/):** Dashboard, Hồ sơ, Thành viên, Bệnh nhân, Ảnh võng mạc, Phân tích, Cảnh báo, Báo cáo, Sử dụng, Xuất thống kê, Gói đăng ký, Cài đặt.

| # | Tính năng        | Trang FE                 | API chính / Logic FE                              | Trạng thái |
|---|-------------------|---------------------------|----------------------------------------------------|------------|
| 1 | Dashboard         | `clinic/dashboard.html`   | `user.clinic_id` → `getClinic`, `getClinicMembers`, `getClinicUsage`, `getClinicReportsSummary`, `getHighRiskAlerts`; thống kê | Chưa kiểm tra |
| 2 | Hồ sơ phòng khám  | `clinic/profile.html`     | `getClinic(clinicId)`, `updateClinic(clinicId, payload)` | Chưa kiểm tra |
| 3 | Thành viên        | `clinic/members.html`     | `getClinicMembers(clinicId)`                       | Chưa kiểm tra |
| 4 | Bệnh nhân         | `clinic/patients.html`   | `getAssignedPatients(clinicId)`                    | Chưa kiểm tra |
| 5 | Ảnh võng mạc      | `clinic/images.html`     | `getImagesByClinic(clinicId)`                      | Chưa kiểm tra |
| 6 | Phân tích         | `clinic/analytics.html`  | `getClinicRiskAggregation`, `getClinicAbnormalTrends` hoặc tương đương | Chưa kiểm tra |
| 7 | Cảnh báo          | `clinic/alerts.html`     | `getHighRiskAlerts(clinicId, riskLevel)`           | Chưa kiểm tra |
| 8 | Báo cáo           | `clinic/reports.html`    | `getClinicReportsSummary`, `getClinicScreeningReport` | Chưa kiểm tra |
| 9 | Sử dụng           | `clinic/usage.html`      | `getClinicUsage(clinicId)`                         | Chưa kiểm tra |
|10 | Xuất thống kê     | `clinic/export.html`     | `exportClinicStatistics(clinicId, format)`         | Chưa kiểm tra |
|11 | Gói đăng ký       | `clinic/subscriptions.html` | `getSubscriptionsByAccount(accountId)` hoặc theo clinic | Chưa kiểm tra |
|12 | Cài đặt           | `clinic/settings.html`   | Cài đặt phòng khám                                | Chưa kiểm tra |

**Lưu ý logic:**
- User **phải có `clinic_id`** (account gán với phòng khám). Nếu `clinic_id` null → thông báo "Liên hệ quản trị viên".
- Một số API dùng `account_id` (subscriptions), phần lớn dùng `clinic_id`.

---

## 6. Role: Admin (Quản trị)

**Menu sidebar (admin/):** Dashboard, Tài khoản, Phòng khám, AI Models, Thống kê, Cài đặt hệ thống.

| # | Tính năng          | Trang FE                 | API chính / Logic FE                               | Trạng thái |
|---|--------------------|---------------------------|-----------------------------------------------------|------------|
| 1 | Dashboard          | `admin/dashboard.html`    | `getAdminDashboard()` → users, usage, revenue, ai_performance | Chưa kiểm tra |
| 2 | Tài khoản          | `admin/accounts.html`     | `getAllAccounts`, `createAccount`, `getAccount`, `updateAccountById`, `updateAccountStatus`, `deleteAccount`, `getAccountStats` | Chưa kiểm tra |
| 3 | Phòng khám         | `admin/clinics.html`      | `listClinics`, `getPendingClinics`, `verifyClinic`, `rejectClinic`, `approveClinic`, `suspendClinic`, `deleteClinic`, `getClinicStats` | Chưa kiểm tra |
| 4 | AI Models          | `admin/ai-models.html`    | `getAllAiModelVersions`, `getActiveAiModels`, `activateAiModel`, `deactivateAiModel`, `createAiModelVersion`, `updateAiModelThreshold`, `deleteAiModelVersion`, `getAiModelStats` | Chưa kiểm tra |
| 5 | Thống kê           | `admin/statistics.html`  | `getAdminImageAnalytics`, `getAdminRiskDistribution`, `getAdminRevenueAnalytics`, `getAdminErrorRateAnalytics` | Chưa kiểm tra |
| 6 | Cài đặt hệ thống   | `admin/settings.html`    | `getAdminAiConfig`, `updateAdminAiConfig`, `getAdminPrivacySettings`, `updateAdminPrivacySettings`, `getAdminCommunicationPolicies`, `updateAdminCommunicationPolicy` | Chưa kiểm tra |

---

## 7. Các lỗi logic thường gặp (cần kiểm tra / sửa)

1. **Phân quyền FE** ✅ (đã xử lý)
   - Trang `patient/*` đã chuyển sang `requireRole('Patient')` (patient-dashboard, upload-image, my-images, analysis-results, reports, patient-profile, settings, messages). User role Doctor/Admin/Clinic khi vào đường dẫn patient/* sẽ bị redirect về dashboard đúng role.
   - Redirect sau login: `redirectByRole()` build đúng đường dẫn khi FE ở root hoặc thư mục con.

2. **Đường dẫn redirect (auth.js)**
   - `redirectByRole()` dùng `pathname.replace(...)` để lấy thư mục gốc; cần đảm bảo từ `login.html` (ở root) redirect tới `patient/dashboard.html` chứ không phải `dashboard.html` trong root.

3. **Bệnh nhân chưa có hồ sơ**
   - Sau đăng ký role Patient, có thể chưa có bản ghi `patients`. FE cần xử lý: hiển thị rõ "Cập nhật hồ sơ" và gọi `POST /api/patients` khi user điền form (hoặc backend tự tạo patient khi đăng ký role Patient).

4. **Upload ảnh (Patient)**
   - Payload cần `patient_id`, `clinic_id`, `uploaded_by`. Bệnh nhân có thể không có `clinic_id` trong account → cần quy ước (chọn phòng khám, hoặc backend lấy từ patient-clinic assignment).

5. **Định dạng response API**
   - Mọi endpoint thành công trả về `{ message, data }`. FE luôn dùng `res.data`. Một số API trả về `data` là object có `reports`, `images`, `count` → FE đã xử lý đúng trong dashboard; cần nhất quán cho tất cả trang.

6. **Forgot/Reset password**
   - Backend trả 501 (stub). FE nên hiển thị thông báo "Chức năng đang cập nhật" thay vì lỗi chung.

7. **Admin đổi mật khẩu tài khoản**
   - API `updateAccountPassword(accountId, new_password_hash)`: backend có thể yêu cầu hash; FE thường gửi plain password → cần kiểm tra backend chấp nhận plain và hash ở server hay bắt buộc FE gửi hash.

---

## 8. Checklist kiểm tra nhanh (cập nhật khi test)

Sau khi test từng tính năng, cập nhật cột **Trạng thái** trong bảng trên thành:
- **OK**: Hoạt động đúng, không lỗi logic.
- **Lỗi**: Ghi rõ lỗi (ví dụ: "FE gửi thiếu clinic_id", "Redirect sai") và sửa trong code.
- **Chưa kiểm tra**: Chưa test.

File này nên được cập nhật sau mỗi đợt test để theo dõi tiến độ và lỗi còn tồn.

---

## 9. Đã sửa trong đợt kiểm tra (cập nhật khi chạy test)

| # | Mục | Mô tả sửa |
|---|-----|-----------|
| 1 | Backend GET /api/doctor-reviews/pending | Trả về **analyses completed chưa có doctor review** (lấy completed analyses, lọc bỏ những analysis đã có bản ghi doctor_review). Response đúng format: analysis_id, image_id, status, completed_at (từ analysis_time). Thêm @require_roles(['Doctor', 'Admin']). |
| 2 | FE Doctor create-report | Hiển thị ngày phân tích: dùng `analysis_time` khi không có `completed_at`. |
| 3 | FE Patient dashboard | Dùng `reportsData.count` cho thống kê báo cáo (nhất quán với backend). |
| 4 | FE Patient analysis-results | Chuyển sang dùng **getPatientAnalyses** (API phân tích AI theo patient) thay vì lọc ảnh theo status; hiển thị danh sách analyses với status, analysis_time. |
| 5 | FE Admin dashboard | Sửa hiển thị **success_rate**: backend trả 0–100, FE không nhân 100 lần nữa. |
