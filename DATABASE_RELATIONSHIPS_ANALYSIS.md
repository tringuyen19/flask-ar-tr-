# Phân Tích Mối Quan Hệ Cơ Sở Dữ Liệu - Hệ Thống AURA

## 📊 Tổng Quan

Hệ thống AURA (AI Understanding Retinal Analysis) có **18 bảng** với **29 mối quan hệ Foreign Key**. Dưới đây là phân tích chi tiết từng mối quan hệ và lý do thiết kế.

---

## 🗂️ Danh Sách 18 Thực Thể

### **Nhóm 1: Authentication & Authorization (3 thực thể)**
1. **ROLE** (roles)
2. **CLINIC** (clinics)
3. **ACCOUNT** (accounts)

### **Nhóm 2: User Profiles (2 thực thể)**
4. **PATIENT_PROFILE** (patient_profiles)
5. **DOCTOR_PROFILE** (doctor_profiles)

### **Nhóm 3: Imaging (1 thực thể)**
6. **RETINAL_IMAGE** (retinal_images)

### **Nhóm 4: AI Processing (4 thực thể)**
7. **AI_MODEL_VERSION** (ai_model_versions)
8. **AI_ANALYSIS** (ai_analysis)
9. **AI_RESULT** (ai_results)
10. **AI_ANNOTATION** (ai_annotations)

### **Nhóm 5: Medical Workflow (2 thực thể)**
11. **DOCTOR_REVIEW** (doctor_reviews)
12. **MEDICAL_REPORT** (medical_reports)

### **Nhóm 6: Messaging (2 thực thể)**
13. **CONVERSATION** (conversations)
14. **MESSAGE** (messages)

### **Nhóm 7: Billing (3 thực thể)**
15. **SERVICE_PACKAGE** (service_packages)
16. **SUBSCRIPTION** (subscriptions)
17. **PAYMENT** (payments)

### **Nhóm 8: Notification (1 thực thể)**
18. **NOTIFICATION** (notifications)

---

## 🔗 Phân Tích Chi Tiết Các Mối Quan Hệ

### **1. Mối Quan Hệ 1-N (One-to-Many)**

#### **1.1. ROLE → ACCOUNT (1:N)**
- **Khóa ngoại:** `accounts.role_id` → `roles.role_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một vai trò (Role) có thể được gán cho nhiều tài khoản (Account)
  - Mỗi tài khoản phải có một vai trò (Patient, Doctor, Admin, v.v.)
  - Đảm bảo phân quyền rõ ràng trong hệ thống
- **Ví dụ:** Role "Doctor" có thể có nhiều tài khoản bác sĩ

#### **1.2. CLINIC → ACCOUNT (1:N)**
- **Khóa ngoại:** `accounts.clinic_id` → `clinics.clinic_id`
- **Ràng buộc:** `NULLABLE` (có thể null)
- **Lý do:**
  - Một phòng khám có thể có nhiều tài khoản (bác sĩ, nhân viên)
  - Tài khoản có thể không thuộc phòng khám nào (ví dụ: admin hệ thống)
  - Cho phép linh hoạt trong việc quản lý tài khoản
- **Ví dụ:** Clinic "Bệnh viện Mắt Hà Nội" có nhiều bác sĩ và nhân viên

#### **1.3. ACCOUNT → PATIENT_PROFILE (1:1)**
- **Khóa ngoại:** `patient_profiles.account_id` → `accounts.account_id`
- **Ràng buộc:** `NOT NULL, UNIQUE`
- **Lý do:**
  - Mỗi tài khoản chỉ có thể có một hồ sơ bệnh nhân
  - Mỗi hồ sơ bệnh nhân phải gắn với một tài khoản
  - Đảm bảo tính nhất quán dữ liệu (1 tài khoản = 1 profile)
- **Ví dụ:** Account ID 1001 chỉ có thể có 1 Patient Profile

#### **1.4. ACCOUNT → DOCTOR_PROFILE (1:1)**
- **Khóa ngoại:** `doctor_profiles.account_id` → `accounts.account_id`
- **Ràng buộc:** `NOT NULL, UNIQUE`
- **Lý do:**
  - Mỗi tài khoản chỉ có thể có một hồ sơ bác sĩ
  - Mỗi hồ sơ bác sĩ phải gắn với một tài khoản
  - Tương tự Patient Profile, đảm bảo tính nhất quán
- **Ví dụ:** Account ID 2001 chỉ có thể có 1 Doctor Profile

#### **1.5. ACCOUNT → RETINAL_IMAGE (1:N) - uploaded_by**
- **Khóa ngoại:** `retinal_images.uploaded_by` → `accounts.account_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một tài khoản có thể upload nhiều hình ảnh võng mạc
  - Cần theo dõi ai đã upload hình ảnh (bác sĩ, nhân viên, bệnh nhân)
  - Hỗ trợ audit trail và quản lý quyền truy cập
- **Ví dụ:** Bác sĩ có thể upload nhiều hình ảnh cho nhiều bệnh nhân

#### **1.6. ACCOUNT → SUBSCRIPTION (1:N)**
- **Khóa ngoại:** `subscriptions.account_id` → `accounts.account_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một tài khoản có thể có nhiều gói đăng ký (theo thời gian)
  - Lịch sử đăng ký: tài khoản có thể đăng ký gói mới sau khi gói cũ hết hạn
  - Hỗ trợ quản lý lịch sử thanh toán và subscription
- **Ví dụ:** Bệnh nhân đăng ký gói Basic tháng 1, sau đó nâng cấp lên Premium tháng 2

#### **1.7. ACCOUNT → NOTIFICATION (1:N)**
- **Khóa ngoại:** `notifications.account_id` → `accounts.account_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một tài khoản có thể nhận nhiều thông báo
  - Cần lưu lịch sử thông báo cho từng người dùng
  - Hỗ trợ tính năng đọc/chưa đọc thông báo
- **Ví dụ:** Bệnh nhân nhận thông báo: "Kết quả phân tích đã sẵn sàng", "Bác sĩ đã trả lời tin nhắn"

#### **1.8. PATIENT_PROFILE → RETINAL_IMAGE (1:N)**
- **Khóa ngoại:** `retinal_images.patient_id` → `patient_profiles.patient_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một bệnh nhân có thể có nhiều hình ảnh võng mạc (theo thời gian, mắt trái/phải)
  - Theo dõi lịch sử hình ảnh của bệnh nhân để so sánh tiến triển
  - Hỗ trợ chẩn đoán và theo dõi bệnh lý
- **⚠️ Lưu ý quan trọng:** Mối quan hệ này **KHÔNG dư thừa** với mối quan hệ qua ACCOUNT vì:
  - `patient_id`: Xác định **bệnh nhân được chụp/chẩn đoán** (chủ thể của hình ảnh)
  - `uploaded_by` (ACCOUNT): Xác định **ai đã upload** hình ảnh (có thể là bác sĩ, nhân viên, hoặc chính bệnh nhân)
  - **Khác biệt nghiệp vụ:** Bác sĩ có thể upload hình ảnh của bệnh nhân khác → `uploaded_by = doctor_account`, `patient_id = patient_profile`
- **Ví dụ:** 
  - Bệnh nhân có hình ảnh mắt trái tháng 1, mắt phải tháng 1, mắt trái tháng 6
  - Bác sĩ upload hình ảnh của bệnh nhân → `uploaded_by = doctor_account_id`, `patient_id = patient_profile_id` (khác nhau!)

#### **1.9. CLINIC → RETINAL_IMAGE (1:N)**
- **Khóa ngoại:** `retinal_images.clinic_id` → `clinics.clinic_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một phòng khám có thể có nhiều hình ảnh từ nhiều bệnh nhân
  - Quản lý hình ảnh theo phòng khám (phân quyền, báo cáo)
  - Hỗ trợ thống kê và báo cáo theo phòng khám
- **Ví dụ:** Phòng khám A có 1000 hình ảnh từ 500 bệnh nhân

#### **1.10. AI_MODEL_VERSION → AI_ANALYSIS (1:N)**
- **Khóa ngoại:** `ai_analysis.ai_model_version_id` → `ai_model_versions.ai_model_version_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một phiên bản AI model có thể được sử dụng cho nhiều phân tích
  - Theo dõi phiên bản model nào đã phân tích hình ảnh nào
  - Quan trọng cho việc audit, so sánh kết quả giữa các phiên bản model
- **Ví dụ:** Model v2.0 phân tích 5000 hình ảnh, Model v2.1 phân tích 3000 hình ảnh

#### **1.11. AI_ANALYSIS → AI_RESULT (1:N)**
- **Khóa ngoại:** `ai_results.analysis_id` → `ai_analysis.analysis_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một phân tích AI có thể phát hiện nhiều loại bệnh (nhiều kết quả)
  - Ví dụ: một hình ảnh có thể có cả bệnh tiểu đường và tăng huyết áp
  - Cho phép phân tích đa bệnh lý từ một hình ảnh
- **Ví dụ:** Phân tích ID 1001 phát hiện: "Diabetic Retinopathy" (risk: High) và "Hypertension" (risk: Medium)

#### **1.12. AI_ANALYSIS → AI_ANNOTATION (1:N)**
- **Khóa ngoại:** `ai_annotations.analysis_id` → `ai_analysis.analysis_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một phân tích có thể có nhiều annotation (chú thích, đánh dấu vùng)
  - Mỗi annotation có thể đánh dấu một vùng khác nhau trên hình ảnh
  - Hỗ trợ visualization chi tiết các vùng bất thường
- **Ví dụ:** Phân tích có 3 annotation: vùng 1 (tọa độ x1,y1), vùng 2 (x2,y2), vùng 3 (x3,y3)

#### **1.13. DOCTOR_PROFILE → DOCTOR_REVIEW (1:N)**
- **Khóa ngoại:** `doctor_reviews.doctor_id` → `doctor_profiles.doctor_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một bác sĩ có thể review nhiều phân tích AI
  - Theo dõi công việc và hiệu suất của từng bác sĩ
  - Hỗ trợ đánh giá chất lượng review
- **Ví dụ:** Bác sĩ A đã review 150 phân tích trong tháng

#### **1.14. PATIENT_PROFILE → MEDICAL_REPORT (1:N)**
- **Khóa ngoại:** `medical_reports.patient_id` → `patient_profiles.patient_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một bệnh nhân có thể có nhiều báo cáo y tế (theo thời gian)
  - Lịch sử báo cáo giúp theo dõi tiến triển bệnh
  - Hỗ trợ quản lý hồ sơ bệnh án điện tử
- **Ví dụ:** Bệnh nhân có báo cáo tháng 1, tháng 3, tháng 6

#### **1.15. DOCTOR_PROFILE → MEDICAL_REPORT (1:N)**
- **Khóa ngoại:** `medical_reports.doctor_id` → `doctor_profiles.doctor_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một bác sĩ có thể tạo nhiều báo cáo y tế
  - Theo dõi bác sĩ nào đã tạo báo cáo nào
  - Hỗ trợ trách nhiệm và audit
- **Ví dụ:** Bác sĩ B đã tạo 80 báo cáo trong quý

#### **1.16. PATIENT_PROFILE → CONVERSATION (1:N)**
- **Khóa ngoại:** `conversations.patient_id` → `patient_profiles.patient_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một bệnh nhân có thể có nhiều cuộc hội thoại với các bác sĩ khác nhau
  - Hoặc nhiều cuộc hội thoại với cùng một bác sĩ (theo thời gian)
  - Hỗ trợ tính năng nhắn tin giữa bệnh nhân và bác sĩ
- **Ví dụ:** Bệnh nhân có 5 cuộc hội thoại: 3 với bác sĩ A, 2 với bác sĩ B

#### **1.17. DOCTOR_PROFILE → CONVERSATION (1:N)**
- **Khóa ngoại:** `conversations.doctor_id` → `doctor_profiles.doctor_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một bác sĩ có thể có nhiều cuộc hội thoại với nhiều bệnh nhân
  - Quản lý danh sách bệnh nhân đang tư vấn
  - Hỗ trợ tính năng nhắn tin
- **Ví dụ:** Bác sĩ C đang tư vấn 20 bệnh nhân (20 cuộc hội thoại)

#### **1.18. CONVERSATION → MESSAGE (1:N)**
- **Khóa ngoại:** `messages.conversation_id` → `conversations.conversation_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một cuộc hội thoại có nhiều tin nhắn
  - Lưu trữ lịch sử chat giữa bệnh nhân và bác sĩ
  - Hỗ trợ tính năng nhắn tin real-time
- **Ví dụ:** Cuộc hội thoại ID 100 có 45 tin nhắn

#### **1.19. SERVICE_PACKAGE → SUBSCRIPTION (1:N)**
- **Khóa ngoại:** `subscriptions.package_id` → `service_packages.package_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một gói dịch vụ có thể được đăng ký bởi nhiều tài khoản
  - Quản lý các gói dịch vụ (Basic, Premium, Enterprise)
  - Hỗ trợ marketing và báo cáo doanh thu theo gói
- **Ví dụ:** Gói "Premium" có 500 đăng ký

#### **1.20. SUBSCRIPTION → PAYMENT (1:N)**
- **Khóa ngoại:** `payments.subscription_id` → `subscriptions.subscription_id`
- **Ràng buộc:** `NOT NULL`
- **Lý do:**
  - Một đăng ký có thể có nhiều thanh toán (thanh toán định kỳ, gia hạn)
  - Hỗ trợ thanh toán theo tháng/quý/năm
  - Lịch sử thanh toán cho mỗi subscription
- **Ví dụ:** Subscription 1 năm có 12 lần thanh toán (mỗi tháng 1 lần)

---

### **2. Mối Quan Hệ 1-1 (One-to-One)**

#### **2.1. RETINAL_IMAGE → AI_ANALYSIS (1:1)**
- **Khóa ngoại:** `ai_analysis.image_id` → `retinal_images.image_id`
- **Ràng buộc:** `NOT NULL, UNIQUE`
- **Lý do:**
  - Mỗi hình ảnh chỉ được phân tích một lần bởi AI
  - Đảm bảo tính nhất quán: 1 hình ảnh = 1 kết quả phân tích
  - Tránh trùng lặp phân tích và nhầm lẫn kết quả
- **Lưu ý:** Nếu cần phân tích lại, có thể tạo bản ghi mới hoặc cập nhật bản ghi cũ
- **Ví dụ:** Hình ảnh ID 5001 chỉ có 1 phân tích AI (analysis_id: 3001)

#### **2.2. AI_ANALYSIS → DOCTOR_REVIEW (1:1)**
- **Khóa ngoại:** `doctor_reviews.analysis_id` → `ai_analysis.analysis_id`
- **Ràng buộc:** `NOT NULL, UNIQUE`
- **Lý do:**
  - Mỗi phân tích AI chỉ được review bởi một bác sĩ (tại một thời điểm)
  - Đảm bảo trách nhiệm rõ ràng: ai review phân tích nào
  - Tránh xung đột khi nhiều bác sĩ cùng review một phân tích
- **Lưu ý:** Nếu cần review lại, có thể cập nhật bản ghi hoặc tạo workflow mới
- **Ví dụ:** Phân tích ID 3001 chỉ có 1 review từ bác sĩ ID 2001

#### **2.3. AI_ANALYSIS → MEDICAL_REPORT (1:1)**
- **Khóa ngoại:** `medical_reports.analysis_id` → `ai_analysis.analysis_id`
- **Ràng buộc:** `NOT NULL, UNIQUE`
- **Lý do:**
  - Mỗi phân tích AI chỉ tạo ra một báo cáo y tế chính thức
  - Đảm bảo tính nhất quán: 1 phân tích = 1 báo cáo
  - Tránh trùng lặp báo cáo và nhầm lẫn trong hồ sơ bệnh án
- **Lưu ý:** Bệnh nhân có thể có nhiều báo cáo (từ nhiều phân tích khác nhau)
- **Ví dụ:** Phân tích ID 3001 chỉ tạo ra 1 báo cáo y tế (report_id: 4001)

---

### **3. Mối Quan Hệ N-N (Many-to-Many) - Thông qua bảng trung gian**

#### **3.1. PATIENT_PROFILE ↔ DOCTOR_PROFILE (N:N) - Qua CONVERSATION**
- **Bảng trung gian:** `conversations`
- **Khóa ngoại:**
  - `conversations.patient_id` → `patient_profiles.patient_id`
  - `conversations.doctor_id` → `doctor_profiles.doctor_id`
- **Lý do:**
  - Một bệnh nhân có thể tư vấn với nhiều bác sĩ
  - Một bác sĩ có thể tư vấn cho nhiều bệnh nhân
  - Bảng `conversations` đóng vai trò bảng trung gian để quản lý mối quan hệ N-N
- **Ví dụ:**
  - Bệnh nhân A tư vấn với Bác sĩ X, Y, Z (3 conversations)
  - Bác sĩ X tư vấn cho Bệnh nhân A, B, C (3 conversations)

#### **3.2. PATIENT_PROFILE ↔ DOCTOR_PROFILE (N:N) - Qua MEDICAL_REPORT**
- **Bảng trung gian:** `medical_reports`
- **Khóa ngoại:**
  - `medical_reports.patient_id` → `patient_profiles.patient_id`
  - `medical_reports.doctor_id` → `doctor_profiles.doctor_id`
- **Lý do:**
  - Một bệnh nhân có thể có báo cáo từ nhiều bác sĩ
  - Một bác sĩ có thể tạo báo cáo cho nhiều bệnh nhân
  - Bảng `medical_reports` đóng vai trò bảng trung gian
- **Ví dụ:**
  - Bệnh nhân A có báo cáo từ Bác sĩ X, Y (2 reports)
  - Bác sĩ X tạo báo cáo cho Bệnh nhân A, B, C (3 reports)

---

## 📈 Sơ Đồ Mối Quan Hệ Tổng Quan

```
ROLE (1) ──────┐
               │
               ├──→ (1:N) ACCOUNT (1) ──┬──→ (1:1) PATIENT_PROFILE (1) ──┬──→ (1:N) RETINAL_IMAGE (1) ──→ (1:1) AI_ANALYSIS
CLINIC (1) ────┘                        │                                 │                                    │
                                        │                                 │                                    ├──→ (1:N) AI_RESULT
                                        ├──→ (1:1) DOCTOR_PROFILE (1) ────┼──→ (1:N) CONVERSATION ──→ (1:N) MESSAGE
                                        │                                 │                                    ├──→ (1:N) AI_ANNOTATION
                                        ├──→ (1:N) SUBSCRIPTION ──→ (1:N) PAYMENT                            │
                                        │                                 │                                    ├──→ (1:1) DOCTOR_REVIEW
                                        └──→ (1:N) NOTIFICATION           └──→ (1:N) MEDICAL_REPORT            │
                                                                                                                 └──→ (1:1) MEDICAL_REPORT

SERVICE_PACKAGE (1) ──→ (1:N) SUBSCRIPTION
AI_MODEL_VERSION (1) ──→ (1:N) AI_ANALYSIS
```

---

## 🎯 Tóm Tắt Mối Quan Hệ Theo Loại

### **Mối Quan Hệ 1-N (One-to-Many): 20 mối quan hệ**

1. ROLE → ACCOUNT
2. CLINIC → ACCOUNT
3. ACCOUNT → RETINAL_IMAGE (uploaded_by)
4. ACCOUNT → SUBSCRIPTION
5. ACCOUNT → NOTIFICATION
6. PATIENT_PROFILE → RETINAL_IMAGE
7. PATIENT_PROFILE → MEDICAL_REPORT
8. PATIENT_PROFILE → CONVERSATION
9. DOCTOR_PROFILE → DOCTOR_REVIEW
10. DOCTOR_PROFILE → MEDICAL_REPORT
11. DOCTOR_PROFILE → CONVERSATION
12. CLINIC → RETINAL_IMAGE
13. AI_MODEL_VERSION → AI_ANALYSIS
14. AI_ANALYSIS → AI_RESULT
15. AI_ANALYSIS → AI_ANNOTATION
16. CONVERSATION → MESSAGE
17. SERVICE_PACKAGE → SUBSCRIPTION
18. SUBSCRIPTION → PAYMENT

### **Mối Quan Hệ 1-1 (One-to-One): 5 mối quan hệ**

1. ACCOUNT → PATIENT_PROFILE (unique)
2. ACCOUNT → DOCTOR_PROFILE (unique)
3. RETINAL_IMAGE → AI_ANALYSIS (unique)
4. AI_ANALYSIS → DOCTOR_REVIEW (unique)
5. AI_ANALYSIS → MEDICAL_REPORT (unique)

### **Mối Quan Hệ N-N (Many-to-Many): 2 mối quan hệ (qua bảng trung gian)**

1. PATIENT_PROFILE ↔ DOCTOR_PROFILE (qua CONVERSATION)
2. PATIENT_PROFILE ↔ DOCTOR_PROFILE (qua MEDICAL_REPORT)

---

## 💡 Lý Do Thiết Kế Các Mối Quan Hệ

### **1. Tại sao ACCOUNT tách riêng với PATIENT_PROFILE và DOCTOR_PROFILE?**

- **Tách biệt Authentication và Profile:**
  - `ACCOUNT`: Thông tin đăng nhập (email, password, role)
  - `PATIENT_PROFILE` / `DOCTOR_PROFILE`: Thông tin chi tiết người dùng
- **Lợi ích:**
  - Bảo mật: Tách thông tin nhạy cảm (password) khỏi thông tin công khai
  - Linh hoạt: Một account có thể có profile bệnh nhân HOẶC bác sĩ (không thể có cả hai)
  - Mở rộng: Dễ dàng thêm các loại profile khác trong tương lai

### **2. Tại sao RETINAL_IMAGE → AI_ANALYSIS là 1:1?**

- **Đảm bảo tính nhất quán:**
  - Mỗi hình ảnh chỉ có một kết quả phân tích chính thức
  - Tránh nhầm lẫn khi có nhiều kết quả phân tích cho cùng một hình ảnh
- **Workflow rõ ràng:**
  - Upload hình ảnh → Phân tích AI → Kết quả
  - Nếu cần phân tích lại, có thể cập nhật bản ghi AI_ANALYSIS hoặc tạo workflow mới

### **3. Tại sao AI_ANALYSIS có nhiều AI_RESULT?**

- **Phân tích đa bệnh lý:**
  - Một hình ảnh có thể phát hiện nhiều bệnh cùng lúc
  - Ví dụ: Bệnh nhân có thể vừa bị tiểu đường vừa bị tăng huyết áp
- **Linh hoạt trong lưu trữ:**
  - Mỗi bệnh có risk_level và confidence_score riêng
  - Dễ dàng query và filter theo từng loại bệnh

### **4. Tại sao CONVERSATION là bảng trung gian cho PATIENT ↔ DOCTOR?**

- **Quản lý cuộc hội thoại:**
  - Mỗi cuộc hội thoại có trạng thái (status), thời gian tạo
  - Dễ dàng query danh sách cuộc hội thoại của một bệnh nhân hoặc bác sĩ
- **Mở rộng:**
  - Có thể thêm metadata cho cuộc hội thoại (chủ đề, mức độ ưu tiên, v.v.)

### **5. Tại sao SUBSCRIPTION → PAYMENT là 1:N?**

- **Thanh toán định kỳ:**
  - Một subscription có thể thanh toán nhiều lần (hàng tháng, hàng quý)
  - Lưu lịch sử thanh toán đầy đủ
- **Audit và báo cáo:**
  - Dễ dàng theo dõi lịch sử thanh toán của khách hàng
  - Hỗ trợ báo cáo tài chính và doanh thu

### **6. Tại sao NOTIFICATION gắn với ACCOUNT thay vì PROFILE?**

- **Tính linh hoạt:**
  - Thông báo có thể gửi cho bất kỳ loại tài khoản nào (admin, bác sĩ, bệnh nhân)
  - Không cần phân biệt loại profile
- **Đơn giản hóa:**
  - Một bảng notification cho tất cả loại tài khoản
  - Dễ dàng query thông báo của một account

---

## 🔒 Ràng Buộc và Constraints

### **NOT NULL Constraints:**
- Đảm bảo dữ liệu bắt buộc không được để trống
- Ví dụ: `account_id`, `role_id`, `patient_id` trong các bảng liên quan

### **UNIQUE Constraints:**
- Đảm bảo tính duy nhất cho các mối quan hệ 1:1
- Ví dụ: `account_id` trong `patient_profiles` và `doctor_profiles` là UNIQUE

### **Foreign Key Constraints:**
- Đảm bảo tính toàn vẹn dữ liệu (Referential Integrity)
- Không thể xóa bản ghi cha nếu còn bản ghi con tham chiếu
- Đảm bảo dữ liệu nhất quán trong toàn bộ hệ thống

---

## 📊 Thống Kê

- **Tổng số bảng:** 18
- **Tổng số Foreign Keys:** 29
- **Mối quan hệ 1-N:** 20
- **Mối quan hệ 1-1:** 5
- **Mối quan hệ N-N:** 2 (qua bảng trung gian)
- **Bảng không có Foreign Key:** 2 (ROLE, CLINIC, SERVICE_PACKAGE, AI_MODEL_VERSION)

---

## 🎓 Kết Luận

Thiết kế database của hệ thống AURA tuân theo các nguyên tắc:
1. **Normalization:** Tránh dư thừa dữ liệu, tách biệt các thực thể
2. **Referential Integrity:** Đảm bảo tính toàn vẹn dữ liệu qua Foreign Keys
3. **Scalability:** Dễ dàng mở rộng và thêm tính năng mới
4. **Maintainability:** Cấu trúc rõ ràng, dễ bảo trì và debug
5. **Business Logic:** Phản ánh đúng quy trình nghiệp vụ của hệ thống y tế
