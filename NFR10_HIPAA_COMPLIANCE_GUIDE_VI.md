# NFR-10: Hướng dẫn tuân thủ HIPAA / bảo vệ dữ liệu y tế (tiếng Việt)

> Mục tiêu: Hệ thống tuân thủ thực hành tương đương **HIPAA** và quy định pháp luật y tế địa phương, tập trung vào **bảo vệ dữ liệu bệnh nhân**.

---

## 1. Tổng quan NFR-10

**Yêu cầu:**  
> Hệ thống phải tuân thủ các tiêu chuẩn bảo vệ dữ liệu y tế (thực hành tương đương HIPAA và quy định pháp luật y tế địa phương).

Trong phạm vi backend hiện tại, ta tập trung vào 6 mảng chính:

1. **Access control audit** → Đã có:
   - RBAC Middleware (NFR-12) dùng `@require_role`, `@require_roles`.
   - JWT + role-based access cho tất cả endpoints nhạy cảm.
2. **Data encryption at rest** → Hướng dẫn + cấu hình ở tầng DB/hạ tầng (TDE, Always Encrypted, disk encryption).
3. **Data encryption in transit** → Đã làm ở NFR-9 (TLS 1.2+, AES-256).
4. **Audit logging** → Đã có FR-37 (Audit Logs) + `audit_log_controller`, `audit_log_service`.
5. **Privacy policy documentation** → Thêm tài liệu mô tả rõ **dữ liệu gì được thu thập, lưu bao lâu, quyền của bệnh nhân**.
6. **Data retention policies & Breach notification procedures** → Thêm cấu hình + tài liệu quy trình khi có sự cố.

File này tập trung:
- Mô tả **các tính năng hiện có** đã đáp ứng một phần HIPAA.
- Đề xuất **các cấu hình/hướng dẫn hạ tầng** còn thiếu (encryption at rest, backup, logging).
- Đưa ra **Checklist test** để bạn sử dụng trong báo cáo/bảo vệ đồ án.

---

## 2. Access Control & RBAC (ĐÃ CÓ)

### 2.1 Hiện trạng

- Hệ thống dùng **JWT + RBAC middleware**:
  - `require_role('Admin')`
  - `require_roles(['Doctor', 'Admin'])`, v.v.
- Tất cả các endpoint nhạy cảm (AI results, medical reports, patient data, payments, audit logs, notification templates, v.v.) đã được gắn RBAC theo từng **role**:
  - `Admin`, `Doctor`, `Patient`, `ClinicManager`.

### 2.2 Liên quan HIPAA

HIPAA yêu cầu:

- **Role-based access**: chỉ người có quyền mới truy cập được dữ liệu bệnh nhân.
- **Least privilege**: mỗi role chỉ được làm những gì cần thiết.

Hệ thống hiện tại đã:

- Áp dụng RBAC chi tiết cho:
  - Tài khoản (`account_controller`)
  - Bệnh nhân (`patient_controller`)
  - Bác sĩ (`doctor_controller`)
  - Hình ảnh võng mạc (`retinal_image_controller`)
  - Kết quả AI (`ai_result_controller`)
  - Báo cáo y tế (`medical_report_controller`)
  - Subscriptions, payments, notifications, audit logs, notification templates, v.v.
- Có tài liệu chi tiết: `NFR12_RBAC_MIDDLEWARE_GUIDE.md`.

### 2.3 Cách test nhanh (Access Control)

- Tạo 3 tài khoản với 3 role khác nhau: `Patient`, `Doctor`, `Admin`.
- Lấy JWT cho từng tài khoản (đăng nhập).
- Gửi request tới:
  - Endpoint **Admin-only** bằng token `Patient` → phải 403/401.
  - Endpoint **Patient-only** bằng token `Doctor` → phải 403/401.
  - Endpoint **Doctor+Admin** bằng token `Doctor` → 200 (OK).

=> Kết luận: access control theo role hoạt động đúng, đáp ứng phần **HIPAA Access Control**.

---

## 3. Data Encryption In Transit (ĐÃ CÓ – NFR-9)

### 3.1 Hiện trạng

Đã implement NFR-9:

- **TLS 1.2+** với ưu tiên cipher **AES-256** (qua SSL context).
- Force **HTTP → HTTPS redirect**.
- Swagger sử dụng **HTTPS** khi SSL bật.

Tài liệu chi tiết:
- `NFR9_TLS_HTTPS_GUIDE.md`
- `NFR9_TLS_HTTPS_TESTING_GUIDE_VI.md`

### 3.2 Liên quan HIPAA

HIPAA yêu cầu bảo vệ dữ liệu **khi truyền tải (in transit)**.  
Việc bắt buộc dùng **HTTPS + TLS 1.2+ / AES-256** đảm bảo:

- Dữ liệu bệnh nhân trên đường truyền không bị đọc trộm (sniffing).
- Kết hợp với JWT & RBAC → bảo vệ cả **AI results**, **medical reports**, **image URLs**, v.v.

---

## 4. Data Encryption At Rest (Cần cấu hình hạ tầng)

> Phần này **không chỉ là code Python**, mà là cấu hình **database / hạ tầng**.

### 4.1 Các mức độ “encryption at rest”

1. **Disk/Volume encryption (Full Disk Encryption)**:
   - Ví dụ: BitLocker (Windows), LUKS (Linux), volume encryption của cloud (AWS EBS, Azure Disk Encryption, GCP PD).
   - Ưu điểm: dễ triển khai, mã hóa toàn bộ ổ đĩa.
   - Nhược: không chi tiết tới từng cột / từng field.

2. **Database-level encryption (TDE – Transparent Data Encryption)**:
   - Ví dụ: **SQL Server TDE**, Postgres TDE, MySQL TDE.
   - Mã hóa file data/log của DB ở mức engine.

3. **Column-level encryption (Application-layer / Always Encrypted)**:
   - Mã hóa các cột chứa thông tin cực kỳ nhạy cảm (CMND/CCCD, BHYT, địa chỉ chi tiết, v.v.).
   - Đôi khi cần **key management** riêng (KMS, HSM, Azure Key Vault, AWS KMS).

### 4.2 Gợi ý cho đồ án (mức “thực hành tương đương”)

**Tối thiểu nên có trong báo cáo / cấu hình:**  

1. **Bật Disk/Volume encryption** cho máy chủ DB (hoặc máy dev nếu demo):
   - Windows: BitLocker.
   - Linux: LUKS hoặc encryption level của VM (Azure/AWS/GCP).

2. **Mô tả TDE** cho SQL Server (nếu dùng MSSQL):
   - Ví dụ: dùng script T-SQL để bật TDE cho DB `RetinalHealthDB`.
   - Dù không chạy thật trong đồ án, nhưng có script + giải thích là “thực hành tương đương”.

3. **Chỉ rõ các bảng/cột nhạy cảm**:
   - Bệnh nhân: họ tên, ngày sinh, số điện thoại, địa chỉ, mã hồ sơ.
   - Thông tin thanh toán: mã giao dịch, card token (nếu có).
   - Đưa vào tài liệu rằng **các cột này sẽ được mã hóa ở tầng DB hoặc app**.

### 4.3 Gợi ý cấu trúc tài liệu/SQL cho at rest

Bạn có thể thêm vào **PHỤ LỤC**:

- `DB_ENCRYPTION_AT_REST_PLAN.md` hoặc 1 mục trong `NON_FUNCTIONAL_REQUIREMENTS_ANALYSIS.md`:
  - Mục tiêu: Bật **TDE** cho DB.
  - Script T-SQL demo (giả lập):
    - Tạo master key, certificate.
    - Bật encryption cho DB.
  - Ghi chú: “Trong môi trường production, script này sẽ được chạy bởi DBA”.

---

## 5. Audit Logging (ĐÃ CÓ – FR-37)

### 5.1 Hiện trạng

Đã implement FR-37:

- Bảng **AuditLogs** ánh xạ đầy đủ.
- `audit_log_service` + `audit_log_repository`.
- `audit_log_controller` với các endpoint:
  - Tạo log (`create_audit_log`)
  - Lấy log, filter, thống kê.

### 5.2 Liên quan HIPAA

HIPAA yêu cầu có **audit trail** khi có truy cập/chỉnh sửa dữ liệu bệnh nhân:

- Ai truy cập? (account_id)
- Lúc nào? (timestamp)
- Hành động gì? (create/update/delete/login/logout…)
- Đối tượng nào? (entity_type, entity_id)

Hệ thống hiện tại đã có đầy đủ trường này, có thể dùng để:

- Điều tra khi nghi ngờ rò rỉ dữ liệu.
- Làm bằng chứng trong audit compliance.

---

## 6. Privacy Policy Documentation (Tài liệu chính sách quyền riêng tư)

### 6.1 Cần bổ sung tài liệu gì?

