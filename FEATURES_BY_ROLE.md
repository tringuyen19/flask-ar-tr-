# Danh sách tính năng theo từng role (AURA)

Tài liệu map **HTML → JS → API** và trạng thái fix để toàn bộ tính năng chạy thành công.

---

## 1. PATIENT (Bệnh nhân)

| Trang | HTML | JS | API chính | Trạng thái |
|-------|------|-----|-----------|------------|
| Dashboard | `patient/dashboard.html` | `patient-dashboard.js` | GET patients/account/:id, GET retinal-images/patient/:id, GET medical-reports/patient/:id | ✅ Fix: dùng `upload_time` cho ảnh, response format đúng |
| Upload ảnh | `patient/upload-image.html` | `upload-image.js` | GET patients/account/:id, POST retinal-images | ✅ Hoạt động (patient_id, clinic_id, uploaded_by từ user) |
| Ảnh của tôi | `patient/my-images.html` | `my-images.js` | GET patients/account/:id, GET retinal-images/patient/:id | ✅ Hoạt động |
| Kết quả phân tích | `patient/analysis-results.html` | `analysis-results.js` | GET patients/account/:id, GET ai-analysis/patient/:id, GET retinal-images/patient/:id, GET ai-results/analysis/:id | ✅ Hoạt động |
| Báo cáo | `patient/reports.html` | `reports.js` | GET patients/account/:id, GET medical-reports/patient/:id?limit=50 | ✅ Hoạt động, response data.reports |
| Tin nhắn | `patient/messages.html` | (không JS) | - | Placeholder (chưa implement) |
| Hồ sơ | `patient/profile.html` | `patient-profile.js` | GET patients/account/:id, POST/PUT patients | ✅ Hoạt động, backend check Patient chỉ sửa chính mình |
| Cài đặt | `patient/settings.html` | (không JS) | - | Placeholder |

**Backend đã fix:**
- Patient chỉ xem/sửa báo cáo, ảnh, phân tích của chính mình (medical_report, retinal_image, ai_analysis).
- Patient chỉ update được profile của chính mình (patient_controller update_patient).

---

## 2. DOCTOR (Bác sĩ)

| Trang | HTML | JS | API chính | Trạng thái |
|-------|------|-----|-----------|------------|
| Dashboard | `doctor/dashboard.html` | `doctor-dashboard.js` | GET doctors/account/:id, GET doctors/:id/performance, GET doctor-reviews/pending, GET medical-reports/doctor/:id | ✅ Hoạt động |
| Bệnh nhân | `doctor/patients.html` | `doctor-patients.js` | GET patients/search?clinic_id=&name=&risk_level=, GET patients/:id | ✅ Fix: gửi clinic_id từ user để chỉ xem BN cùng clinic; guard linkCreateReport |
| Tạo báo cáo | `doctor/create-report.html` | `doctor-create-report.js` | GET doctors/account/:id, GET patients/search?clinic_id=, GET ai-analysis/patient/:id, POST medical-reports | ✅ Fix: searchPatients(params) với clinic_id |
| Duyệt kết quả AI | `doctor/reviews.html` | `doctor-reviews.js` | GET doctor-reviews/pending, POST doctor-reviews, GET doctor-reviews/analysis/:id | ✅ Hoạt động |
| Tin nhắn | `doctor/messages.html` | `doctor-messages.js` | GET doctors/account/:id, GET conversations/doctor/:id, GET messages/conversation/:id, POST messages | ✅ Hoạt động (format conversations) |
| Hồ sơ | `doctor/profile.html` | `doctor-profile.js` | GET doctors/account/:id, POST/PUT doctors | ✅ Hoạt động |
| Cài đặt | `doctor/settings.html` | `doctor-settings.js` | - | Placeholder |

---

## 3. CLINICMANAGER (Quản lý phòng khám)

| Trang | HTML | JS | API chính | Trạng thái |
|-------|------|-----|-----------|------------|
| Dashboard | `clinic/dashboard.html` | `clinic-dashboard.js` | GET clinics/:id/usage, GET clinics/:id/reports-summary, GET clinics/:id/high-risk-alerts | Cần kiểm tra response format |
| Thành viên | `clinic/members.html` | `clinic-members.js` | GET clinics/:id/members | Cần kiểm tra |
| Bệnh nhân | `clinic/patients.html` | `clinic-patients.js` | GET patients/assigned/clinic/:id | Cần kiểm tra |
| Ảnh | `clinic/images.html` | `clinic-images.js` | GET retinal-images/clinic/:id | ✅ Backend có, role ClinicManager |
| Báo cáo | `clinic/reports.html` | `clinic-reports.js` | GET clinics/:id/reports-summary, GET clinics/:id/screening-report | ✅ Backend trả total_reports, unique_patients, unique_doctors; screening có campaign_name, clinic_id, period |
| Sử dụng | `clinic/usage.html` | `clinic-usage.js` | GET clinics/:id/usage | Cần kiểm tra |
| Gói dịch vụ | `clinic/subscriptions.html` | `clinic-subscriptions.js` | GET subscriptions/account/:id | Cần kiểm tra |
| Xuất thống kê | `clinic/export.html` | `clinic-export.js` | GET clinics/:id/export-statistics | Cần kiểm tra |
| Cảnh báo | `clinic/alerts.html` | `clinic-alerts.js` | GET clinics/:id/high-risk-alerts | Cần kiểm tra |
| Phân tích | `clinic/analytics.html` | `clinic-analytics.js` | GET clinics/:id/risk-aggregation, GET clinics/:id/abnormal-trends | Cần kiểm tra |
| Hồ sơ | `clinic/profile.html` | `clinic-profile.js` | GET/PUT clinics/:id | Cần kiểm tra |
| Cài đặt | `clinic/settings.html` | `clinic-settings.js` | - | Placeholder |

**Backend đã thêm ClinicManager vào:**
- GET medical-reports (theo report_id, analysis_id, patient_id), export PDF/CSV.
- GET retinal-images/patient/:id.
- GET ai-analysis/patient/:id, GET ai-analysis/patient/:id/trend.
- GET patients/search.

---

## 4. ADMIN

| Trang | HTML | JS | API chính | Trạng thái |
|-------|------|-----|-----------|------------|
| Dashboard | `admin/dashboard.html` | `admin-dashboard.js` | GET accounts, GET clinics, thống kê | Cần kiểm tra |
| Tài khoản | `admin/accounts.html` | `admin-accounts.js` | GET/POST/PUT accounts, PUT accounts/:id/status | Cần kiểm tra |
| Phòng khám | `admin/clinics.html` | `admin-clinics.js` | GET clinics, PUT clinics/:id/verify, reject, approve, suspend | Cần kiểm tra |
| AI Models | `admin/ai-models.html` | `admin-ai-models.js` | GET/PUT ai-model-versions | Cần kiểm tra |
| Thống kê | `admin/statistics.html` | `admin-statistics.js` | Các endpoint thống kê | Cần kiểm tra |
| Cài đặt | `admin/settings.html` | `admin-settings.js` | Cấu hình AI, threshold | Cần kiểm tra |

---

## 5. Các fix đã thực hiện (tóm tắt)

### Frontend
- **header.js:** Link Hồ sơ / Cài đặt dùng relative `profile.html`, `settings.html` khi đang ở trong thư mục role (patient/, doctor/, clinic/, admin/).
- **patient-dashboard.js:** Hiển thị “Hoạt động gần đây” dùng `upload_time` (hoặc `created_at`) cho ảnh.
- **doctor-patients.js:** Gửi `clinic_id` từ user khi search để Doctor chỉ thấy bệnh nhân cùng clinic; guard `linkCreateReport` khi null.
- **doctor-create-report.js:** Gọi `searchPatients({ clinic_id: user.clinic_id })` để load danh sách bệnh nhân theo clinic.

### Backend
- **Medical report:** ClinicManager được phép GET report, by analysis, by patient, export; Patient chỉ được xem/export báo cáo của chính mình.
- **Retinal image:** ClinicManager được GET images by patient; Patient chỉ được xem ảnh của chính mình.
- **AI analysis:** ClinicManager được GET patient analyses và trend; Patient chỉ được xem phân tích của chính mình.
- **Patient:** Patient chỉ được update profile của chính mình (update_patient kiểm tra account → patient_id).

---

## 6. Cách test nhanh

1. **Backend:** `cd backend && python app.py` (port 9999).
2. **Frontend:** Mở bằng HTTP server (Live Server hoặc `python -m http.server 8080` trong thư mục frontend).
3. **Login:** Dùng tài khoản trong `seed_data_full.sql` (ví dụ patient1@aura.com, doctor1@aura.com, clinic1@aura.com, admin@aura.com / password123).
4. **Patient:** Dashboard → Upload ảnh → My Images → Analysis Results → Reports → Profile (tạo/sửa hồ sơ).
5. **Doctor:** Dashboard → Bệnh nhân (có clinic_id) → Tạo báo cáo (chọn bệnh nhân + phân tích) → Duyệt kết quả AI → Tin nhắn → Hồ sơ.
6. **Clinic:** Dashboard → Báo cáo (reports-summary, screening-report) → Ảnh theo clinic.
7. **Admin:** Accounts, Clinics, AI Models (tùy endpoint đã implement).

---

## 7. Lưu ý

- **Upload ảnh:** Chưa kiểm tra allocation/pool (clinic cấp credits cho patient, trừ pool). Nếu cần đúng FR thì bổ sung logic trong `RetinalImageService.upload_image`.
- **Tin nhắn Patient:** Trang messages.html hiện là placeholder, chưa có JS gọi API conversation/messages cho patient.
- **Settings:** Hầu hết trang Settings các role là placeholder (đổi mật khẩu, thông báo chưa implement).
