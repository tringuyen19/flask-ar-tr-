# 📋 Danh Sách Các Chức Năng Có Thể Test Trên Swagger UI

## 🎯 Tổng Quan

**Swagger UI URL:** `http://localhost:9999/docs`

Tất cả các endpoints dưới đây đã có **Swagger docstrings đầy đủ** với:
- ✅ Parameters với examples
- ✅ Request body schemas
- ✅ Response schemas
- ✅ Error responses

---

## 🔐 1. AUTHENTICATION (FR-1)

### **POST `/api/auth/register`** ✅
- **Mô tả:** Đăng ký tài khoản mới
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role_id": 3,
    "clinic_id": 1
  }
  ```
- **Response:** Access token, account_id, email, role_id

### **POST `/api/auth/login`** ✅
- **Mô tả:** Đăng nhập với email và password
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** Access token, account_id, email, role_id

### **GET `/api/auth/me`** ✅
- **Mô tả:** Lấy thông tin user hiện tại
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Account information

---

## 👤 2. PATIENT PROFILE (FR-8)

### **POST `/api/patients`** ✅
- **Mô tả:** Tạo patient profile
- **Body:**
  ```json
  {
    "account_id": 1,
    "patient_name": "Nguyen Van A",
    "date_of_birth": "1990-01-15",
    "gender": "male",
    "medical_history": "No known allergies"
  }
  ```

### **GET `/api/patients/<patient_id>`** ✅
- **Mô tả:** Lấy thông tin patient theo ID

### **PUT `/api/patients/<patient_id>`** ✅
- **Mô tả:** Cập nhật patient profile

---

## 🖼️ 3. RETINAL IMAGES (FR-2)

### **POST `/api/retinal-images`** ✅
- **Mô tả:** Upload single retinal image
- **Body:**
  ```json
  {
    "patient_id": 1,
    "clinic_id": 1,
    "uploaded_by": 1,
    "image_type": "fundus",
    "eye_side": "left",
    "image_url": "https://example.com/image.jpg",
    "status": "uploaded"
  }
  ```

### **POST `/api/retinal-images/bulk`** ✅
- **Mô tả:** Upload multiple images in bulk
- **Body:**
  ```json
  {
    "images": [
      {
        "patient_id": 1,
        "clinic_id": 1,
        "uploaded_by": 1,
        "image_type": "fundus",
        "eye_side": "left",
        "image_url": "https://example.com/image1.jpg",
        "status": "uploaded"
      }
    ]
  }
  ```

### **GET `/api/retinal-images/<image_id>`** ✅
- **Mô tả:** Lấy thông tin image theo ID

---

## 🤖 4. AI ANALYSIS (FR-3, FR-6)

### **POST `/api/ai-analyses`** ✅
- **Mô tả:** Tạo AI analysis request
- **Body:**
  ```json
  {
    "image_id": 1,
    "ai_model_version_id": 1,
    "status": "pending"
  }
  ```

### **GET `/api/ai-analyses/<analysis_id>`** ✅
- **Mô tả:** Lấy thông tin analysis theo ID

### **GET `/api/ai-analyses/patient/<patient_id>`** ✅
- **Mô tả:** Lấy analysis history cho patient (FR-6)
- **Query params:** `limit`, `offset`, `start_date`, `end_date`

---

## 📊 5. AI RESULTS (FR-3)

### **POST `/api/ai-results`** ✅
- **Mô tả:** Tạo AI result
- **Body:**
  ```json
  {
    "analysis_id": 1,
    "disease_type": "diabetic_retinopathy",
    "risk_level": "high",
    "confidence_score": 85.5
  }
  ```

### **GET `/api/ai-results/<result_id>`** ✅
- **Mô tả:** Lấy AI result theo ID

### **GET `/api/ai-results/analysis/<analysis_id>`** ✅
- **Mô tả:** Lấy tất cả results cho một analysis

---

## 🎨 6. AI ANNOTATIONS (FR-4)

### **POST `/api/ai-annotations`** ✅
- **Mô tả:** Tạo AI annotation với heatmap
- **Body:**
  ```json
  {
    "analysis_id": 1,
    "heatmap_url": "https://example.com/heatmap.jpg",
    "description": "Vascular abnormalities detected"
  }
  ```

### **GET `/api/ai-annotations/analysis/<analysis_id>`** ✅
- **Mô tả:** Lấy annotations cho một analysis

---

## 📄 7. MEDICAL REPORTS (FR-5, FR-7)

### **POST `/api/medical-reports`** ✅
- **Mô tả:** Tạo medical report
- **Body:**
  ```json
  {
    "patient_id": 1,
    "analysis_id": 1,
    "doctor_id": 2,
    "report_url": "https://example.com/report.pdf"
  }
  ```

### **GET `/api/medical-reports/<report_id>/export`** ✅
- **Mô tả:** Export report (PDF/CSV) (FR-7)
- **Query params:** `format=pdf` hoặc `format=csv`

### **GET `/api/medical-reports/patient/<patient_id>`** ✅
- **Mô tả:** Lấy tất cả reports cho patient

---

## 💬 8. CONVERSATIONS & MESSAGES (FR-10)

### **POST `/api/conversations`** ✅
- **Mô tả:** Tạo hoặc lấy conversation giữa patient và doctor
- **Body:**
  ```json
  {
    "patient_id": 1,
    "doctor_id": 2,
    "status": "active"
  }
  ```

### **GET `/api/conversations/<conversation_id>`** ✅
- **Mô tả:** Lấy thông tin conversation

### **POST `/api/messages`** ✅
- **Mô tả:** Gửi message trong conversation
- **Body:**
  ```json
  {
    "conversation_id": 1,
    "sender_type": "patient",
    "sender_name": "Nguyen Van A",
    "content": "Hello doctor, I have a question about my test results",
    "message_type": "text"
  }
  ```

### **GET `/api/messages/conversation/<conversation_id>`** ✅
- **Mô tả:** Lấy tất cả messages trong conversation

---

## 🔔 9. NOTIFICATIONS (FR-9)

### **POST `/api/notifications`** ✅
- **Mô tả:** Gửi notification
- **Body:**
  ```json
  {
    "account_id": 1,
    "notification_type": "ai_result_ready",
    "content": "AI analysis completed for analysis ID 123"
  }
  ```

### **GET `/api/notifications/account/<account_id>`** ✅
- **Mô tả:** Lấy tất cả notifications cho account

### **GET `/api/notifications/account/<account_id>/unread`** ✅
- **Mô tả:** Lấy unread notifications

---

## 💳 10. SUBSCRIPTIONS & PAYMENTS (FR-11, FR-12)

### **POST `/api/subscriptions`** ✅
- **Mô tả:** Tạo subscription (mua package) (FR-11)
- **Body:**
  ```json
  {
    "account_id": 1,
    "package_id": 1,
    "start_date": "2024-01-01",
    "end_date": "2024-12-31",
    "remaining_credits": 100,
    "status": "active"
  }
  ```

### **GET `/api/subscriptions/account/<account_id>/active`** ✅
- **Mô tả:** Lấy active subscription cho account

### **GET `/api/subscriptions/account/<account_id>/credits`** ✅
- **Mô tả:** Lấy remaining credits (FR-12)

### **POST `/api/payments`** ✅
- **Mô tả:** Tạo payment record
- **Body:**
  ```json
  {
    "subscription_id": 1,
    "amount": 1000000,
    "payment_method": "credit_card",
    "status": "pending"
  }
  ```

### **GET `/api/payments/account/<account_id>/history`** ✅
- **Mô tả:** Lấy payment history (FR-12)
- **Query params:** `limit`, `offset`

---

## 📋 11. CÁC CHỨC NĂNG KHÁC

### **DOCTOR PROFILES**
- POST `/api/doctors` - Tạo doctor profile
- GET `/api/doctors/<doctor_id>` - Lấy doctor info

### **CLINICS**
- POST `/api/clinics` - Tạo clinic
- GET `/api/clinics/<clinic_id>` - Lấy clinic info

### **ACCOUNTS**
- POST `/api/accounts` - Tạo account
- GET `/api/accounts/<account_id>` - Lấy account info

### **ROLES**
- GET `/api/roles` - Lấy tất cả roles

### **SERVICE PACKAGES**
- POST `/api/packages` - Tạo service package
- GET `/api/packages` - Lấy tất cả packages

### **DOCTOR REVIEWS**
- POST `/api/doctor-reviews` - Tạo doctor review
- GET `/api/doctor-reviews/analysis/<analysis_id>` - Lấy reviews cho analysis

---

## 🎯 12 USER FUNCTIONAL REQUIREMENTS - Test Status

| FR | Requirement | Endpoint | Status |
|----|-------------|----------|--------|
| **FR-1** | Register and Log In | `/api/auth/register`, `/api/auth/login` | ✅ |
| **FR-2** | Upload Images | `/api/retinal-images`, `/api/retinal-images/bulk` | ✅ |
| **FR-3** | View AI Results | `/api/ai-results`, `/api/ai-results/analysis/<id>` | ✅ |
| **FR-4** | Visualize Annotations | `/api/ai-annotations/analysis/<id>` | ✅ |
| **FR-5** | Automated Recommendations | `/api/medical-reports` (auto-generated) | ✅ |
| **FR-6** | Access History | `/api/ai-analyses/patient/<id>` | ✅ |
| **FR-7** | Export Reports | `/api/medical-reports/<id>/export` | ✅ |
| **FR-8** | Manage Profile | `/api/patients`, `/api/patients/<id>` | ✅ |
| **FR-9** | Receive Notifications | `/api/notifications`, `/api/notifications/account/<id>` | ✅ |
| **FR-10** | Communicate with Doctor | `/api/conversations`, `/api/messages` | ✅ |
| **FR-11** | Purchase Packages | `/api/subscriptions` | ✅ |
| **FR-12** | View Payment History | `/api/payments/account/<id>/history` | ✅ |

---

## 🚀 Cách Test

1. **Khởi động server:**
   ```bash
   python src/app.py
   ```

2. **Mở Swagger UI:**
   - Truy cập: `http://localhost:9999/docs`

3. **Test flow mẫu:**
   - **Bước 1:** POST `/api/auth/register` - Tạo account
   - **Bước 2:** POST `/api/auth/login` - Lấy access_token
   - **Bước 3:** Click "Authorize" ở Swagger UI, nhập: `Bearer <access_token>`
   - **Bước 4:** POST `/api/patients` - Tạo patient profile
   - **Bước 5:** POST `/api/retinal-images` - Upload image
   - **Bước 6:** POST `/api/ai-analyses` - Tạo analysis
   - **Bước 7:** POST `/api/ai-results` - Tạo result
   - **Bước 8:** GET `/api/medical-reports/<id>/export?format=pdf` - Export report

---

## ✅ Tổng Kết

**Tổng số endpoints có thể test:** **100+ endpoints**

**Tất cả 12 User Functional Requirements đều có thể test được trên Swagger UI!**

🎉 **Ready for testing!**

